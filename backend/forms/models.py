"""
forms/models.py
---------------
ORM models for the Dynamic Event Form Builder.

Two tables
──────────
form_templates  — One per event. Acts as the container / owner of fields.
form_fields     — Individual field definitions belonging to a template.

Design decisions
────────────────
• `options_json` stores dropdown/radio/checkbox options as a JSON array of
  strings, e.g. ["Option A", "Option B"]. NULL for all non-choice fields.
• `order_no` controls display order; gaps are allowed (0, 10, 20…) so
  admins can insert fields between existing ones without rewriting all rows.
• `file_max_size_kb` and `file_allowed_types` are metadata hints that the
  backend uses for validation when processing submitted forms. They have no
  effect on fields that are not of type 'file'.

Schema
──────
form_templates
  id           SERIAL PRIMARY KEY
  event_id     INTEGER UNIQUE NOT NULL  — FK → club_events.id

form_fields
  id                  SERIAL PRIMARY KEY
  template_id         INTEGER NOT NULL  — FK → form_templates.id
  label               VARCHAR(255) NOT NULL
  field_type          VARCHAR(30)  NOT NULL
  placeholder         VARCHAR(255)
  required            BOOLEAN NOT NULL DEFAULT FALSE
  options_json        TEXT             — JSON array, e.g. '["A","B","C"]'
  order_no            INTEGER NOT NULL DEFAULT 0
  file_max_size_kb    INTEGER          — NULL unless field_type='file'
  file_allowed_types  VARCHAR(255)     — comma-sep MIME types, NULL unless file
  created_at          TIMESTAMPTZ DEFAULT NOW()
"""

from datetime import datetime, timezone
from sqlalchemy import (
    Boolean, Column, Integer, String, Text,
    DateTime, UniqueConstraint, ForeignKey,
)
from db import Base


def _utcnow() -> datetime:
    return datetime.now(timezone.utc)


class FormTemplate(Base):
    """One form template per event (1-to-1 with club_events)."""

    __tablename__ = "form_templates"

    __table_args__ = (
        UniqueConstraint("event_id", name="uq_form_template_event"),
    )

    id         = Column(Integer, primary_key=True, index=True)
    event_id   = Column(Integer, nullable=False, unique=True, index=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover
        return f"<FormTemplate id={self.id} event_id={self.event_id}>"


class FormField(Base):
    """
    A single configurable field inside a FormTemplate.

    Field type vocabulary
    ─────────────────────
    text | email | phone | number | textarea |
    dropdown | radio | checkbox | date | file
    """

    __tablename__ = "form_fields"

    id                 = Column(Integer, primary_key=True, index=True)
    template_id        = Column(Integer, ForeignKey("form_templates.id", ondelete="CASCADE"), nullable=False, index=True)
    label              = Column(String(255), nullable=False)
    field_type         = Column(String(30),  nullable=False)
    placeholder        = Column(String(255), nullable=True)
    required           = Column(Boolean,     nullable=False, default=False)
    options_json       = Column(Text,        nullable=True)    # JSON array string
    order_no           = Column(Integer,     nullable=False, default=0, index=True)
    file_max_size_kb   = Column(Integer,     nullable=True)    # e.g. 2048 = 2 MB
    file_allowed_types = Column(String(255), nullable=True)    # e.g. "image/png,image/jpeg"
    created_at         = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:  # pragma: no cover
        return f"<FormField id={self.id} label={self.label!r} type={self.field_type!r}>"
