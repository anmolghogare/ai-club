from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClubProjectResponse(BaseModel):
    id: int
    title: str
    author: str
    author_id: Optional[int] = None
    description: str
    tags: Optional[str] = None
    github_link: str
    created_at: datetime

    class Config:
        from_attributes = True
