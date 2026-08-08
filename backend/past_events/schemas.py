from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PastEventCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date_label: Optional[str] = None
    image_url: Optional[str] = None
    speaker: Optional[str] = None
    participants: Optional[int] = None
    sort_order: Optional[int] = 0
    winners: Optional[str] = None
    winner_link: Optional[str] = None

class PastEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date_label: Optional[str] = None
    image_url: Optional[str] = None
    speaker: Optional[str] = None
    participants: Optional[int] = None
    sort_order: Optional[int] = None
    winners: Optional[str] = None
    winner_link: Optional[str] = None

class PastEventResponse(BaseModel):
    id: int
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    date_label: Optional[str] = None
    image_url: Optional[str] = None
    speaker: Optional[str] = None
    participants: Optional[int] = None
    sort_order: Optional[int] = 0
    winners: Optional[str] = None
    winner_link: Optional[str] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
