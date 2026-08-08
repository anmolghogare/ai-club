from pydantic import BaseModel
from typing import Optional

class TrackBase(BaseModel):
    title: str
    description: str
    audience: Optional[str] = None

class TrackCreate(TrackBase):
    pass

class TrackResponse(TrackBase):
    id: int

    class Config:
        from_attributes = True
