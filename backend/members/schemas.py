from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClubMemberResponse(BaseModel):
    id: int
    name: str
    role: str
    photo: Optional[str] = None
    description: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    order_no: int
    created_at: datetime

    class Config:
        from_attributes = True
