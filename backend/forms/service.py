"""
forms/service.py
----------------
Business logic for the Dynamic Event Form Builder.

Responsibilities
────────────────
• get_or_create_template  — fetch or create the FormTemplate for an event.
• add_field               — add a single FormField to a template.
• add_fields_bulk         — add multiple fields atomically.
• get_form_for_event      — retrieve full template + ordered fields.
• update_field            — partial-update a single field by id.
• delete_field            — remove a field by id.
• get_field_by_id         — fetch one field (for update/delete guard).
• reorder_fields          — update order_no for a list of field ids.

All functions accept an AsyncSession and return ORM objects.
No HTTP knowledge lives here.
"""

from __future__ import annotations

import json
import logging
from typing import List, Optional, Tuple

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from forms.models import FormField, FormTemplate
from forms.schemas import (
    CHOICE_FIELD_TYPES,
    FormFieldCreateRequest,
    FormFieldUpdateRequest,
)

logger = logging.getLogger(__name__)


# ─────────────────────────────────────────────────────────────────────────────
# Internal helpers
# ─────────────────────────────────────────────────────────────────────────────

def _options_to_json(options: Optional[List[str]]) -> Optional[str]:
    """Serialize list of option strings to a JSON string for storage."""
    if not options:
        return None
    return json.dumps(options, ensure_ascii=False)


def _build_field_kwargs(data: FormFieldCreateRequest) -> dict:
    """Map a create-request to a dict suitable for FormField(**kwargs)."""
    return dict(
        label              = data.label,
        field_type         = data.field_type,
        placeholder        = data.placeholder,
        required           = data.required,
        options_json       = _options_to_json(data.options),
        order_no           = data.order_no,
        file_max_size_kb   = data.file_max_size_kb,
        file_allowed_types = data.file_allowed_types,
    )


# ─────────────────────────────────────────────────────────────────────────────
# Template management
# ─────────────────────────────────────────────────────────────────────────────

async def get_or_create_template(
    session: AsyncSession,
    event_id: int,
) -> Tuple[FormTemplate, bool]:
    """
    Fetch the FormTemplate for an event, creating one if it doesn't exist.

    Returns:
        (template, is_new) — `is_new` is True when a new row was created.

    Raises:
        ValueError if the event_id references a non-existent event (checked
        at the route layer, not here).
    """
    result = await session.execute(
        select(FormTemplate).where(FormTemplate.event_id == event_id)
    )
    template = result.scalars().first()

    if template:
        return template, False

    template = FormTemplate(event_id=event_id)
    session.add(template)
    await session.commit()
    await session.refresh(template)
    logger.info("Created FormTemplate id=%d for event_id=%d", template.id, event_id)
    return template, True


async def get_template_by_event(
    session: AsyncSession,
    event_id: int,
) -> Optional[FormTemplate]:
    """Return the FormTemplate for the given event, or None."""
    result = await session.execute(
        select(FormTemplate).where(FormTemplate.event_id == event_id)
    )
    return result.scalars().first()


# ─────────────────────────────────────────────────────────────────────────────
# Field CRUD
# ─────────────────────────────────────────────────────────────────────────────

async def add_field(
    session: AsyncSession,
    event_id: int,
    data: FormFieldCreateRequest,
) -> FormField:
    """
    Add a single FormField to the event's form template.
    Creates the template automatically if it doesn't exist.

    Raises:
        ValueError if event does not exist in club_events.
    """
    # Verify event exists
    from events.models import ClubEvent  # noqa: PLC0415
    ev_result = await session.execute(
        select(ClubEvent).where(ClubEvent.id == event_id)
    )
    if ev_result.scalars().first() is None:
        raise ValueError(f"Event with id={event_id} does not exist.")

    template, _ = await get_or_create_template(session, event_id)

    field = FormField(template_id=template.id, **_build_field_kwargs(data))
    session.add(field)
    await session.commit()
    await session.refresh(field)
    logger.info(
        "Added FormField id=%d ('%s') to template_id=%d",
        field.id, field.label, template.id,
    )
    return field


async def add_fields_bulk(
    session: AsyncSession,
    event_id: int,
    fields_data: List[FormFieldCreateRequest],
) -> List[FormField]:
    """
    Add multiple fields to an event's form in a single transaction.
    All-or-nothing: if any field fails, none are committed.

    Raises:
        ValueError if event does not exist.
    """
    from events.models import ClubEvent  # noqa: PLC0415
    ev_result = await session.execute(
        select(ClubEvent).where(ClubEvent.id == event_id)
    )
    if ev_result.scalars().first() is None:
        raise ValueError(f"Event with id={event_id} does not exist.")

    template, _ = await get_or_create_template(session, event_id)

    new_fields: List[FormField] = []
    for data in fields_data:
        f = FormField(template_id=template.id, **_build_field_kwargs(data))
        session.add(f)
        new_fields.append(f)

    await session.commit()

    # Refresh all to get server-side defaults (id, created_at, etc.)
    for f in new_fields:
        await session.refresh(f)

    logger.info(
        "Bulk-added %d fields to template_id=%d (event_id=%d)",
        len(new_fields), template.id, event_id,
    )
    return new_fields


async def get_form_for_event(
    session: AsyncSession,
    event_id: int,
) -> Optional[Tuple[FormTemplate, List[FormField]]]:
    """
    Retrieve the full form template and its ordered fields for an event.

    Returns:
        (template, [fields ordered by order_no asc, id asc]) or None if no template.
    """
    template = await get_template_by_event(session, event_id)
    if template is None:
        return None

    result = await session.execute(
        select(FormField)
        .where(FormField.template_id == template.id)
        .order_by(FormField.order_no.asc(), FormField.id.asc())
    )
    fields = list(result.scalars().all())
    return template, fields


async def get_field_by_id(
    session: AsyncSession,
    field_id: int,
) -> Optional[FormField]:
    """Fetch a single FormField by primary key."""
    result = await session.execute(
        select(FormField).where(FormField.id == field_id)
    )
    return result.scalars().first()


async def update_field(
    session: AsyncSession,
    field_id: int,
    data: FormFieldUpdateRequest,
) -> FormField:
    """
    Partially update a FormField.

    Applies cross-field consistency rules after merging the update:
    • If field_type changes to a choice type, options must already exist.
    • If field_type changes away from a choice type, options are cleared.
    • File metadata is cleared when switching away from 'file' type.

    Raises:
        ValueError if field not found or post-update validation fails.
    """
    field = await get_field_by_id(session, field_id)
    if field is None:
        raise ValueError(f"FormField with id={field_id} not found.")

    update_data = data.model_dump(exclude_unset=True)

    # Determine the resulting field_type (may be changing)
    new_type = update_data.get("field_type", field.field_type)

    # Handle `options` → `options_json` serialization
    if "options" in update_data:
        update_data["options_json"] = _options_to_json(update_data.pop("options"))
    else:
        update_data.pop("options", None)

    # Apply non-options fields
    for key, value in update_data.items():
        setattr(field, key, value)

    # Post-merge consistency: clear options when switching to non-choice type
    if new_type not in CHOICE_FIELD_TYPES:
        field.options_json = None

    # Post-merge consistency: clear file metadata when switching away from file
    if new_type != "file":
        field.file_max_size_kb   = None
        field.file_allowed_types = None

    # Post-merge consistency: choice types need options
    if new_type in CHOICE_FIELD_TYPES:
        opts = json.loads(field.options_json) if field.options_json else []
        if len(opts) < 2:
            raise ValueError(
                f"'{new_type}' fields require at least 2 options. "
                "Supply 'options' in the request body."
            )

    await session.commit()
    await session.refresh(field)
    logger.info("Updated FormField id=%d type=%r", field.id, field.field_type)
    return field


async def delete_field(
    session: AsyncSession,
    field_id: int,
) -> bool:
    """
    Hard-delete a FormField.

    Returns True if deleted, False if not found.
    """
    field = await get_field_by_id(session, field_id)
    if field is None:
        return False
    await session.delete(field)
    await session.commit()
    logger.info("Deleted FormField id=%d", field_id)
    return True


async def reorder_fields(
    session: AsyncSession,
    template_id: int,
    ordered_ids: List[int],
) -> List[FormField]:
    """
    Reorder fields by assigning order_no = index * 10 for each field id
    in the supplied list.

    Args:
        template_id:  The FormTemplate the fields belong to.
        ordered_ids:  Field ids in the desired display order.

    Returns:
        Updated list of FormField objects.

    Raises:
        ValueError if any id doesn't belong to the template.
    """
    result = await session.execute(
        select(FormField).where(FormField.template_id == template_id)
    )
    template_fields = {f.id: f for f in result.scalars().all()}

    for pos, fid in enumerate(ordered_ids):
        if fid not in template_fields:
            raise ValueError(
                f"FormField id={fid} does not belong to template_id={template_id}."
            )
        template_fields[fid].order_no = pos * 10

    await session.commit()
    updated = [template_fields[fid] for fid in ordered_ids]
    for f in updated:
        await session.refresh(f)

    logger.info("Reordered %d fields for template_id=%d", len(ordered_ids), template_id)
    return updated
