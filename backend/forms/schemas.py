"""
forms/schemas.py
----------------
Pydantic v2 schemas for the Dynamic Event Form Builder.

Three layers
────────────
1. Request schemas  — what the admin sends (create / update).
2. Response schemas — what the API returns to callers.
3. Dynamic validator — generates a runtime Pydantic model from a list of
   FormField rows so form submissions can be validated against the live schema.

Field type vocabulary (canonical lowercase)
───────────────────────────────────────────
  text | email | phone | number | textarea |
  dropdown | radio | checkbox | date | file

Options rules
─────────────
• `options` is required (≥2 items) for: dropdown, radio, checkbox
• `options` must be omitted / None for all other types
• `file_max_size_kb` defaults to 5120 (5 MB) if not supplied for file fields
• `file_allowed_types` defaults to common document/image MIME types
"""

from __future__ import annotations

import json
from typing import Annotated, Any, List, Literal, Optional

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
    model_validator,
)


# ─── Constants ────────────────────────────────────────────────────────────────

CHOICE_FIELD_TYPES  = {"dropdown", "radio", "checkbox"}
ALL_FIELD_TYPES     = {
    "text", "email", "phone", "number", "textarea",
    "dropdown", "radio", "checkbox", "date", "file",
}
DEFAULT_MAX_SIZE_KB  = 5120   # 5 MB
DEFAULT_FILE_MIMES   = "image/jpeg,image/png,image/gif,application/pdf,text/plain"


# ─────────────────────────────────────────────────────────────────────────────
# Request Models
# ─────────────────────────────────────────────────────────────────────────────

class FormFieldCreateRequest(BaseModel):
    """
    Payload for adding a single field to an event's form.
    All fields except label and field_type have sensible defaults.
    """

    label:              str  = Field(..., min_length=1, max_length=255,
                                     description="Display label shown to the registrant.")
    field_type:         str  = Field(..., description=f"One of: {', '.join(sorted(ALL_FIELD_TYPES))}")
    placeholder:        Optional[str]        = Field(None, max_length=255)
    required:           bool                 = Field(False, description="Whether this field must be filled.")
    options:            Optional[List[str]]  = Field(None, description="Choices for dropdown/radio/checkbox.")
    order_no:           int                  = Field(0, ge=0, description="Display order (ascending).")
    file_max_size_kb:   Optional[int]        = Field(None, ge=1, le=102400,
                                                     description="Max upload size in KB (file fields only).")
    file_allowed_types: Optional[str]        = Field(None, max_length=255,
                                                     description="Comma-separated MIME types (file fields only).")

    # ── Field-level validators ────────────────────────────────────────────────

    @field_validator("field_type")
    @classmethod
    def field_type_must_be_valid(cls, v: str) -> str:
        v = v.lower().strip()
        if v not in ALL_FIELD_TYPES:
            raise ValueError(
                f"Invalid field_type '{v}'. Allowed: {', '.join(sorted(ALL_FIELD_TYPES))}"
            )
        return v

    @field_validator("options")
    @classmethod
    def options_must_be_strings(cls, v: Optional[List[str]]) -> Optional[List[str]]:
        if v is None:
            return v
        cleaned = [str(opt).strip() for opt in v]
        empties = [o for o in cleaned if not o]
        if empties:
            raise ValueError("options list must not contain empty strings.")
        return cleaned

    @field_validator("file_allowed_types")
    @classmethod
    def mime_types_must_be_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        parts = [p.strip() for p in v.split(",") if p.strip()]
        for part in parts:
            if "/" not in part:
                raise ValueError(
                    f"'{part}' is not a valid MIME type (expected format: 'type/subtype')."
                )
        return ",".join(parts)

    # ── Cross-field validators ────────────────────────────────────────────────

    @model_validator(mode="after")
    def validate_field_type_constraints(self) -> "FormFieldCreateRequest":
        errors: list[str] = []

        is_choice = self.field_type in CHOICE_FIELD_TYPES
        is_file   = self.field_type == "file"

        # Choice fields must have ≥ 2 options
        if is_choice:
            if not self.options or len(self.options) < 2:
                errors.append(
                    f"'{self.field_type}' fields require at least 2 options."
                )
        else:
            # Non-choice fields must NOT supply options
            if self.options:
                errors.append(
                    f"'options' must not be set for '{self.field_type}' fields."
                )

        # File metadata only makes sense on file fields
        if not is_file:
            if self.file_max_size_kb is not None:
                errors.append("'file_max_size_kb' is only valid for 'file' fields.")
            if self.file_allowed_types is not None:
                errors.append("'file_allowed_types' is only valid for 'file' fields.")

        # Apply defaults for file fields
        if is_file:
            if self.file_max_size_kb is None:
                self.file_max_size_kb = DEFAULT_MAX_SIZE_KB
            if self.file_allowed_types is None:
                self.file_allowed_types = DEFAULT_FILE_MIMES

        if errors:
            raise ValueError(" | ".join(errors))

        return self


class FormFieldUpdateRequest(BaseModel):
    """
    Payload for updating a single field (all fields optional — partial update).
    Cross-field validation only runs when related fields are both supplied.
    """

    label:              Optional[str]        = Field(None, min_length=1, max_length=255)
    field_type:         Optional[str]        = None
    placeholder:        Optional[str]        = Field(None, max_length=255)
    required:           Optional[bool]       = None
    options:            Optional[List[str]]  = None
    order_no:           Optional[int]        = Field(None, ge=0)
    file_max_size_kb:   Optional[int]        = Field(None, ge=1, le=102400)
    file_allowed_types: Optional[str]        = Field(None, max_length=255)

    @field_validator("field_type")
    @classmethod
    def field_type_must_be_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is not None:
            v = v.lower().strip()
            if v not in ALL_FIELD_TYPES:
                raise ValueError(
                    f"Invalid field_type '{v}'. Allowed: {', '.join(sorted(ALL_FIELD_TYPES))}"
                )
        return v

    @field_validator("file_allowed_types")
    @classmethod
    def mime_types_must_be_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        parts = [p.strip() for p in v.split(",") if p.strip()]
        for part in parts:
            if "/" not in part:
                raise ValueError(f"'{part}' is not a valid MIME type.")
        return ",".join(parts)


class BulkFormFieldCreateRequest(BaseModel):
    """Create multiple fields for an event's form in one request."""

    fields: List[FormFieldCreateRequest] = Field(
        ..., min_length=1, description="List of fields to create."
    )

    @field_validator("fields")
    @classmethod
    def no_duplicate_labels(cls, v: List[FormFieldCreateRequest]) -> List[FormFieldCreateRequest]:
        labels = [f.label.lower() for f in v]
        if len(labels) != len(set(labels)):
            raise ValueError("Duplicate field labels are not allowed within the same request.")
        return v


# ─────────────────────────────────────────────────────────────────────────────
# Response Models
# ─────────────────────────────────────────────────────────────────────────────

class FormFieldResponse(BaseModel):
    """Single field as returned by the API. `options` is deserialized from JSON."""

    id:                 int
    template_id:        int
    label:              str
    field_type:         str
    placeholder:        Optional[str]
    required:           bool
    options:            Optional[List[str]]   # deserialized from options_json
    order_no:           int
    file_max_size_kb:   Optional[int]
    file_allowed_types: Optional[str]
    created_at:         Any   # datetime

    model_config = {"from_attributes": True}

    @classmethod
    def from_orm_field(cls, field) -> "FormFieldResponse":
        """Build response from ORM object, deserializing options_json → list."""
        options: Optional[List[str]] = None
        if field.options_json:
            try:
                options = json.loads(field.options_json)
            except (json.JSONDecodeError, TypeError):
                options = None

        return cls(
            id=field.id,
            template_id=field.template_id,
            label=field.label,
            field_type=field.field_type,
            placeholder=field.placeholder,
            required=field.required,
            options=options,
            order_no=field.order_no,
            file_max_size_kb=field.file_max_size_kb,
            file_allowed_types=field.file_allowed_types,
            created_at=field.created_at,
        )


class FormTemplateResponse(BaseModel):
    """Full form template for an event — includes all fields ordered by order_no."""

    template_id: int
    event_id:    int
    fields:      List[FormFieldResponse]


class FormFieldCreateResponse(BaseModel):
    status:  str = "success"
    message: str
    field:   FormFieldResponse


class BulkFormFieldCreateResponse(BaseModel):
    status:  str = "success"
    message: str
    fields:  List[FormFieldResponse]


class FormFieldUpdateResponse(BaseModel):
    status:  str = "success"
    message: str = "Field updated successfully."
    field:   FormFieldResponse


class FormFieldDeleteResponse(BaseModel):
    status:  str = "success"
    message: str


# ─────────────────────────────────────────────────────────────────────────────
# Dynamic Validator Generator
# ─────────────────────────────────────────────────────────────────────────────

def build_submission_validator(fields: list) -> type[BaseModel]:
    """
    Generate a Pydantic model at runtime from a list of FormField ORM rows.

    This is the core of "dynamic validation generation": each field in the
    form template becomes a typed, optionally-required attribute on a fresh
    BaseModel subclass. The returned class can be used to validate a dict of
    submitted values before they are stored.

    Rules per field_type
    ────────────────────
    text      → str (stripped)
    email     → EmailStr
    phone     → str, regex: digits/spaces/+/-/() only
    number    → float (accepts int input too)
    textarea  → str
    dropdown  → str, must be in allowed options
    radio     → str, must be in allowed options
    checkbox  → List[str], each must be in allowed options
    date      → str, ISO 8601 date (YYYY-MM-DD)
    file      → str (filename / URL — actual binary handled by multipart route)

    Args:
        fields: List of FormField ORM objects ordered by order_no.

    Returns:
        A dynamically-created Pydantic BaseModel class.
    """
    import re
    from typing import get_type_hints
    from pydantic import create_model, field_validator as fv

    field_definitions: dict[str, Any] = {}
    validators: dict[str, Any] = {}

    for f in fields:
        fname = _field_key(f.label)
        ft    = f.field_type.lower()

        # Deserialize options
        options: list[str] = []
        if f.options_json:
            try:
                options = json.loads(f.options_json)
            except Exception:
                options = []

        # ── Choose Python type and default ────────────────────────────────────
        if ft == "email":
            py_type = EmailStr
        elif ft == "number":
            py_type = float
        elif ft == "checkbox":
            py_type = List[str]
        else:
            py_type = str

        default = ... if f.required else None
        if not f.required:
            py_type = Optional[py_type]  # type: ignore[assignment]

        field_definitions[fname] = (py_type, Field(default, description=f.label))

        # ── Add inline validators for constrained types ───────────────────────
        if ft == "phone":
            PHONE_RE = re.compile(r"^[\d\s\+\-\(\)]{7,20}$")

            def make_phone_validator(key):
                @fv(key)
                @classmethod
                def _validate(cls, v):
                    if v is not None and not PHONE_RE.match(v):
                        raise ValueError(
                            "Invalid phone number. Use digits, spaces, +, -, and ()."
                        )
                    return v
                return _validate

            validators[f"validate_{fname}_phone"] = make_phone_validator(fname)

        elif ft in {"dropdown", "radio"} and options:
            allowed = options

            def make_choice_validator(key, choices):
                @fv(key)
                @classmethod
                def _validate(cls, v):
                    if v is not None and v not in choices:
                        raise ValueError(
                            f"Invalid selection '{v}'. Allowed: {', '.join(choices)}"
                        )
                    return v
                return _validate

            validators[f"validate_{fname}_choice"] = make_choice_validator(fname, allowed)

        elif ft == "checkbox" and options:
            allowed = options

            def make_checkbox_validator(key, choices):
                @fv(key)
                @classmethod
                def _validate(cls, v):
                    if v is not None:
                        invalid = [x for x in v if x not in choices]
                        if invalid:
                            raise ValueError(
                                f"Invalid option(s): {invalid}. Allowed: {choices}"
                            )
                    return v
                return _validate

            validators[f"validate_{fname}_checkbox"] = make_checkbox_validator(fname, allowed)

        elif ft == "date":
            DATE_RE = re.compile(r"^\d{4}-\d{2}-\d{2}$")

            def make_date_validator(key):
                @fv(key)
                @classmethod
                def _validate(cls, v):
                    if v is not None and not DATE_RE.match(v):
                        raise ValueError("Date must be in YYYY-MM-DD format.")
                    return v
                return _validate

            validators[f"validate_{fname}_date"] = make_date_validator(fname)

    # Build and return the dynamic model
    DynamicModel = create_model(
        "DynamicSubmissionModel",
        **field_definitions,
        __validators__=validators,
    )
    return DynamicModel


def _field_key(label: str) -> str:
    """
    Convert a human-readable label into a safe Python identifier.
    'First Name' → 'first_name'
    """
    import re
    key = label.lower().strip()
    key = re.sub(r"[^\w\s]", "", key)   # remove punctuation
    key = re.sub(r"\s+", "_", key)       # spaces → underscores
    key = re.sub(r"_+", "_", key)        # collapse multiple underscores
    return key.strip("_") or f"field_{id(label)}"
