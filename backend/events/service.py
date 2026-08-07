"""
events/service.py
-----------------
Business logic layer for the Event Management module.

This layer is the only place that talks to the database. Routes call into
here; the service has no knowledge of HTTP (no Request/Response objects).

Responsibilities
────────────────
• create_event    — validate, compute initial status, persist.
• update_event    — partial-update with re-computed status.
• delete_event    — hard-delete by id.
• get_event_by_id — fetch single event, refresh status lazily.
• list_events     — filtered, paginated public listing.
• _refresh_status — compare stored vs computed status, write if stale.

Admin guard
───────────
The admin email check lives in the route layer (as a dependency), NOT here,
so the service remains testable without HTTP context.
"""

from __future__ import annotations

import logging
from datetime import date, datetime, time, timezone
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from events.models import ClubEvent
from events.schemas import EventCreateRequest, EventUpdateRequest
from events.status import compute_status

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────

def _compute_for_event(ev: ClubEvent) -> str:
    """Compute status from an ORM object's fields."""
    return compute_status(
        event_end_date=ev.event_end_date,
        end_time=ev.end_time,
        registration_start=ev.registration_start,
        registration_end=ev.registration_end,
    )


async def _refresh_status(session: AsyncSession, ev: ClubEvent) -> ClubEvent:
    """
    Lazily refresh the stored status if it has drifted from the computed value.
    Avoids a write on every read — only writes when status actually changes.
    """
    computed = _compute_for_event(ev)
    if ev.status != computed:
        logger.info(
            "Event id=%d status drift: %r → %r", ev.id, ev.status, computed
        )
        ev.status = computed
        await session.commit()
        await session.refresh(ev)
    return ev


# ─────────────────────────────────────────────────────────────────────────────
# Public service functions
# ─────────────────────────────────────────────────────────────────────────────

async def create_event(
    session: AsyncSession,
    data: EventCreateRequest,
) -> ClubEvent:
    """
    Persist a new event and return the created ORM object.

    Status is computed from the provided timestamps at creation time.
    """
    status = compute_status(
        event_end_date=data.event_end_date,
        end_time=data.end_time,
        registration_start=data.registration_start,
        registration_end=data.registration_end,
    )

    ev = ClubEvent(
        title              = data.title,
        description        = data.description,
        banner             = data.banner,
        category           = data.category,
        venue              = data.venue,
        contact_email      = str(data.contact_email) if data.contact_email else None,
        event_type         = data.event_type,
        min_team_size      = data.min_team_size if data.event_type == "team" else None,
        max_team_size      = data.max_team_size if data.event_type == "team" else None,
        event_date         = data.event_date,
        event_start_date   = data.event_start_date,
        event_end_date     = data.event_end_date,
        start_time         = data.start_time,
        end_time           = data.end_time,
        registration_start = data.registration_start,
        registration_end   = data.registration_end,
        status             = status,
        winners            = data.winners,
        winner_link        = data.winner_link,
        registration_link  = data.registration_link,
        created_at         = datetime.now(timezone.utc),
    )

    session.add(ev)
    await session.commit()
    await session.refresh(ev)
    logger.info("Created event id=%d title=%r status=%r", ev.id, ev.title, ev.status)
    return ev


async def update_event(
    session: AsyncSession,
    event_id: int,
    data: EventUpdateRequest,
) -> ClubEvent:
    """
    Partially update an event by id.

    Only fields explicitly provided in the request body are modified.
    Status is always recomputed after any field change.

    Raises:
        ValueError if the event is not found.
    """
    result = await session.execute(
        select(ClubEvent).where(ClubEvent.id == event_id)
    )
    ev = result.scalars().first()

    if ev is None:
        raise ValueError(f"Event with id={event_id} not found.")

    # Apply provided fields
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(ev, field, value)

    # Clear team fields if switching to individual
    if data.event_type == "individual":
        ev.min_team_size = None
        ev.max_team_size = None

    # Recompute status after any field change
    ev.status = _compute_for_event(ev)

    await session.commit()
    await session.refresh(ev)
    logger.info("Updated event id=%d status=%r", ev.id, ev.status)
    return ev


async def delete_event(session: AsyncSession, event_id: int) -> bool:
    """
    Hard-delete an event by id.

    Returns True if deleted, False if not found.
    """
    result = await session.execute(
        select(ClubEvent).where(ClubEvent.id == event_id)
    )
    ev = result.scalars().first()

    if ev is None:
        return False

    await session.delete(ev)
    await session.commit()
    logger.info("Deleted event id=%d", event_id)
    return True


async def get_event_by_id(
    session: AsyncSession,
    event_id: int,
) -> Optional[ClubEvent]:
    """
    Fetch a single event by primary key with lazy status refresh.

    Returns None if not found.
    """
    result = await session.execute(
        select(ClubEvent).where(ClubEvent.id == event_id)
    )
    ev = result.scalars().first()

    if ev is None:
        return None

    return await _refresh_status(session, ev)


async def list_events(
    session: AsyncSession,
    status_filter: Optional[str] = None,
    category_filter: Optional[str] = None,
    page: int = 1,
    limit: int = 20,
) -> tuple[list[ClubEvent], int]:
    """
    Return a paginated list of events with optional filters.

    All returned events have their status lazily refreshed.

    Args:
        session:         Active async DB session.
        status_filter:   Filter by status value (e.g. 'upcoming').
        category_filter: Filter by category (case-insensitive).
        page:            1-indexed page number.
        limit:           Records per page (max 100).

    Returns:
        Tuple of (list[ClubEvent], total_count).
    """
    limit = min(limit, 100)
    offset = (page - 1) * limit

    # Build base query
    query = select(ClubEvent).order_by(ClubEvent.event_date.asc(), ClubEvent.start_time.asc())
    count_query = select(func.count(ClubEvent.id))

    if status_filter:
        query = query.where(ClubEvent.status == status_filter)
        count_query = count_query.where(ClubEvent.status == status_filter)

    if category_filter:
        query = query.where(
            func.lower(ClubEvent.category) == category_filter.lower().strip()
        )
        count_query = count_query.where(
            func.lower(ClubEvent.category) == category_filter.lower().strip()
        )

    total_result = await session.execute(count_query)
    total = total_result.scalar_one()

    result = await session.execute(query.offset(offset).limit(limit))
    events = list(result.scalars().all())

    # Lazy status refresh for all returned events (batch-friendly: only writes on drift)
    has_drift = False
    for ev in events:
        computed = _compute_for_event(ev)
        if ev.status != computed:
            logger.info("Event id=%d status drift: %r → %r", ev.id, ev.status, computed)
            ev.status = computed
            has_drift = True

    if has_drift:
        await session.commit()
        for ev in events:
            await session.refresh(ev)

    return events, total
