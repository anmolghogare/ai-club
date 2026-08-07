from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AchievementCreate(BaseModel):
    title: Optional[str] = None
    student: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None

class AchievementUpdate(BaseModel):
    title: Optional[str] = None
    student: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None

class AchievementResponse(BaseModel):
    id: int
    title: Optional[str] = None
    student: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    icon: Optional[str] = None
    image_url: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}
