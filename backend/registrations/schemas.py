"""
registrations/schemas.py
------------------------
Pydantic v2 request and response models for the Event Registration system.

Request hierarchy
─────────────────
  TeamMemberInput          — one member inside a team
  TeamInput                — team name + list of members
  RegistrationSubmitRequest— top-level: form responses + optional team block

Response hierarchy
──────────────────
  TeamMemberResponse
  TeamResponse
  UploadedFileResponse
  RegistrationResponseItem — one field answer
  RegistrationDetail       — full registration with responses, team, files
  RegistrationListItem     — lightweight row for list endpoints
  RegistrationSubmitResponse

Validation rules encoded here
──────────────────────────────
  • Member email must be valid (EmailStr).
  • A team must have at least 1 member entry (leader counts separately).
  • `responses` is a dict {field_id: value}; value is str or list[str].
  • Team name cannot be blank.
"""

from __future__ import annotations

import json
from datetime import datetime
from typing import Any, Dict, List, Optional, Union

from pydantic import BaseModel, EmailStr, Field, field_validator


# ─────────────────────────────────────────────────────────────────────────────
# Request models
# ─────────────────────────────────────────────────────────────────────────────

class TeamMemberInput(BaseModel):
    """A single non-leader team member supplied during registration."""
    member_name:  str      = Field(..., min_length=1, max_length=255)
    member_email: EmailStr = Field(..., description="Member's email address.")


class TeamInput(BaseModel):
    """Team block embedded inside a registration request."""
    team_name: str                   = Field(..., min_length=1, max_length=255,
                                              description="Unique team name for this event.")
    members:   List[TeamMemberInput] = Field(
        ...,
        description="Additional team members (not including the registering leader).",
    )

    @field_validator("team_name")
    @classmethod
    def team_name_strip(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("team_name must not be blank.")
        return v


class RegistrationSubmitRequest(BaseModel):
    """
    Top-level registration payload.

    `responses` maps form field ids (as strings or ints) to their values.
    Values can be:
      - str         for text/email/phone/number/textarea/dropdown/radio/date/file
      - list[str]   for checkbox (multiple selections)

    `team` is required for team-type events and must be None for individual events
    (enforced at the service layer where we have access to the event record).
    """
    responses: Dict[Any, Any]     = Field(
        default_factory=dict,
        description="Map of field_id → submitted value.",
    )
    team: Optional[TeamInput]     = Field(
        None,
        description="Team information (required for team events, omit for individual).",
    )

    @field_validator("responses")
    @classmethod
    def stringify_keys(cls, v: Dict[str, Any]) -> Dict[str, Any]:
        """Normalise all keys to strings regardless of whether the client sent ints."""
        return {str(k): val for k, val in v.items()}


# ─────────────────────────────────────────────────────────────────────────────
# Response models
# ─────────────────────────────────────────────────────────────────────────────

class TeamMemberResponse(BaseModel):
    id:           int
    member_name:  str
    member_email: str

    model_config = {"from_attributes": True}


class TeamResponse(BaseModel):
    id:        int
    team_name: str
    leader_id: int
    members:   List[TeamMemberResponse]

    model_config = {"from_attributes": True}


class UploadedFileResponse(BaseModel):
    id:            int
    field_id:      int
    file_url:      str
    original_name: Optional[str]
    uploaded_at:   datetime

    model_config = {"from_attributes": True}


class RegistrationResponseItem(BaseModel):
    """One field → value pair in a completed registration."""
    field_id:    int
    value:       Optional[Any]   # str or list[str] for checkbox; None if unanswered

    @classmethod
    def from_orm(cls, resp) -> "RegistrationResponseItem":
        """Deserialize checkbox JSON arrays stored in TEXT column."""
        raw = resp.value
        parsed: Any = raw
        if raw and raw.startswith("["):
            try:
                parsed = json.loads(raw)
            except (json.JSONDecodeError, TypeError):
                pass
        return cls(field_id=resp.field_id, value=parsed)


class RegistrationDetail(BaseModel):
    """Full registration record with all related data."""
    id:             int
    event_id:       int
    user_id:        int
    team_name:      Optional[str]
    registered_at:  datetime
    responses:      List[RegistrationResponseItem]
    team:           Optional[TeamResponse]
    uploaded_files: List[UploadedFileResponse]

    model_config = {"from_attributes": True}


class RegistrationListItem(BaseModel):
    """Lightweight row for list endpoints (no responses/files)."""
    id:             int
    event_id:       int
    user_id:        int
    team_name:      Optional[str]
    registered_at:  datetime

    model_config = {"from_attributes": True}


class RegistrationSubmitResponse(BaseModel):
    status:       str = "success"
    message:      str
    registration: RegistrationDetail


class UserRegistrationsResponse(BaseModel):
    total:         int
    registrations: List[RegistrationDetail]


class AdminRegistrationsResponse(BaseModel):
    """Admin view — all registrations for a single event."""
    event_id: int
    total:    int
    registrations: List[RegistrationDetail]
