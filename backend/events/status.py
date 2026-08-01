"""
events/status.py
----------------
Auto-status computation engine for ClubEvent records.

Logic
─────
Given the current UTC time and an event's four time boundaries, the status
is determined by the following priority-ordered rules:

  1. completed          — current UTC datetime is AFTER the event date ends
                          (we treat midnight at the end of event_date as the cutoff)
  2. registration_open  — now is BETWEEN registration_start and registration_end (inclusive)
  3. registration_closed— registration_end has passed but the event hasn't started yet
  4. upcoming           — registration hasn't opened yet

This function is the single source of truth; it is called:
  • On every CREATE / UPDATE to store the initial status.
  • On every GET to re-compute and optionally refresh the stored status.
  • By the background refresh endpoint (future).

No database writes happen inside this module — that is the service layer's job.
"""

from __future__ import annotations

from datetime import date, datetime, time, timezone
from typing import Literal, Optional

EventStatus = Literal["upcoming", "registration_open", "registration_closed", "completed"]


def compute_status(
    event_end_date: date,
    end_time: time,
    registration_start: datetime,
    registration_end: datetime,
    now: Optional[datetime] = None,
) -> EventStatus:
    """
    Compute the correct event status for the given UTC moment.

    Args:
        event_end_date:     The calendar date when the event ends.
        end_time:           The wall-clock time when the event ends.
        registration_start: Timezone-aware datetime when registration opens.
        registration_end:   Timezone-aware datetime when registration closes.
        now:                Override the current time (useful for testing).
                            Defaults to datetime.now(UTC).

    Returns:
        One of: 'upcoming', 'registration_open', 'registration_closed', 'completed'.
    """
    if now is None:
        now = datetime.now(timezone.utc)

    # Build a timezone-aware datetime for when the event actually ends
    event_end_dt = datetime.combine(event_end_date, end_time).replace(tzinfo=timezone.utc)

    # Rule 1 — event is over
    if now > event_end_dt:
        return "completed"

    # Normalise registration datetimes to UTC for safe comparison
    reg_start = _to_utc(registration_start)
    reg_end   = _to_utc(registration_end)

    # Rule 2 — registration is currently open
    if reg_start <= now <= reg_end:
        return "registration_open"

    # Rule 3 — registration has closed but event hasn't started
    if now > reg_end:
        return "registration_closed"

    # Rule 4 — registration hasn't opened yet
    return "upcoming"


def _to_utc(dt: datetime) -> datetime:
    """Ensure a datetime is UTC-aware. Naive datetimes are assumed UTC."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
