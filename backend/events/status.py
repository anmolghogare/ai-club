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
    event_end_date: Optional[date] = None,
    end_time: Optional[time] = None,
    registration_start: Optional[datetime] = None,
    registration_end: Optional[datetime] = None,
    now: Optional[datetime] = None,
) -> EventStatus:
    """
    Compute the correct event status for the given UTC moment.
    Handles optional date and time bounds gracefully.
    """
    if now is None:
        now = datetime.now(timezone.utc)

    # Rule 1 — event is over
    if event_end_date and end_time:
        event_end_dt = datetime.combine(event_end_date, end_time).replace(tzinfo=timezone.utc)
        if now > event_end_dt:
            return "completed"

    # Rule 2 — registration is currently open
    if registration_start and registration_end:
        reg_start = _to_utc(registration_start)
        reg_end   = _to_utc(registration_end)
        if reg_start <= now <= reg_end:
            return "registration_open"
        if now > reg_end:
            return "registration_closed"

    # Rule 4 — fallback status
    return "upcoming"


def _to_utc(dt: datetime) -> datetime:
    """Ensure a datetime is UTC-aware. Naive datetimes are assumed UTC."""
    if dt.tzinfo is None:
        return dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(timezone.utc)
