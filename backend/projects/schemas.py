from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class ClubProjectCreate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    author_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    github_link: Optional[str] = None
    contributors: Optional[str] = None

class ClubProjectUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    author_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    github_link: Optional[str] = None
    contributors: Optional[str] = None

class ClubProjectResponse(BaseModel):
    id: int
    title: Optional[str] = None
    author: Optional[str] = None
    author_id: Optional[int] = None
    description: Optional[str] = None
    tags: Optional[str] = None
    github_link: Optional[str] = None
    contributors: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True
