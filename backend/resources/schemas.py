from pydantic import BaseModel
from typing import Optional

class ResourceCreate(BaseModel):
    title: str
    description: str
    resource_type: str  # VIDEO, COURSE, BOOK, PAPER, etc.
    url: str
    group_name: str
    order_no: int = 0

class ResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    resource_type: Optional[str] = None
    url: Optional[str] = None
    group_name: Optional[str] = None
    order_no: Optional[int] = None

class ClubResourceResponse(BaseModel):
    id: int
    title: str
    description: str
    resource_type: str
    url: str
    group_name: str
    order_no: int

    class Config:
        from_attributes = True

