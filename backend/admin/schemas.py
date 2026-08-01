"""
admin/schemas.py
----------------
Pydantic v2 response models for the Admin Dashboard.

Three response groups
─────────────────────
1. Dashboard metrics  — DashboardResponse (summary cards)
2. Registration list  — AdminRegistrationRow (paginated, searchable)
3. Registration detail— AdminRegistrationDetail (full record for modal/drawer)

Design decisions
────────────────
• All datetimes are returned as ISO 8601 strings (model serialization
  converts them automatically via Pydantic's datetime serializer).
• `user_display` merges user name + email into a single field so the
  frontend table doesn't need to issue extra user-lookup calls.
• `responses_flat` in AdminRegistrationDetail is a dict[label → value]
  so the frontend can display field answers without knowing field IDs.
• The CSV exporter uses the same AdminRegistrationRow shape but renders
  it as comma-separated text.
"""

from __future__ import annotations

from datetime import date, datetime
from typing import Any, Dict, List, Optional

from pydantic import BaseModel


# ─────────────────────────────────────────────────────────────────────────────
# Dashboard
# ─────────────────────────────────────────────────────────────────────────────

class StatusBreakdown(BaseModel):
    upcoming:             int
    registration_open:    int
    registration_closed:  int
    completed:            int


class DashboardResponse(BaseModel):
    """Top-level stats for all dashboard cards."""
    total_events:         int
    total_registrations:  int
    active_events:        int          # registration_open count
    upcoming_events:      int
    completed_events:     int
    status_breakdown:     StatusBreakdown
    recent_registrations: List["AdminRegistrationRow"]   # last 5, no pagination


# ─────────────────────────────────────────────────────────────────────────────
# Registration list (paginated)
# ─────────────────────────────────────────────────────────────────────────────

class AdminRegistrationRow(BaseModel):
    """Lightweight row for the admin registration table."""
    id:            int
    event_id:      int
    event_title:   str
    user_id:       int
    user_name:     str
    user_email:    str
    team_name:     Optional[str]
    registered_at: datetime

    model_config = {"from_attributes": True}


class PaginatedRegistrationsResponse(BaseModel):
    total:         int
    page:          int
    limit:         int
    total_pages:   int
    registrations: List[AdminRegistrationRow]


# ─────────────────────────────────────────────────────────────────────────────
# Registration detail
# ─────────────────────────────────────────────────────────────────────────────

class TeamMemberDetail(BaseModel):
    id:           int
    member_name:  str
    member_email: str


class TeamDetail(BaseModel):
    id:        int
    team_name: str
    leader_id: int
    members:   List[TeamMemberDetail]


class UploadedFileDetail(BaseModel):
    id:            int
    field_id:      int
    field_label:   str
    file_url:      str
    original_name: Optional[str]
    uploaded_at:   datetime


class AdminRegistrationDetail(BaseModel):
    """Full registration record with resolved field labels and user info."""
    id:             int
    event_id:       int
    event_title:    str
    user_id:        int
    user_name:      str
    user_email:     str
    team_name:      Optional[str]
    registered_at:  datetime
    responses_flat: Dict[str, Any]       # {field_label: value}
    team:           Optional[TeamDetail]
    uploaded_files: List[UploadedFileDetail]


class DeleteRegistrationResponse(BaseModel):
    status:  str = "success"
    message: str
