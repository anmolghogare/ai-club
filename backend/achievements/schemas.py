from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AchievementCreate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    student: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    icon: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=500)

class AchievementUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    student: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    category: Optional[str] = Field(None, max_length=100)
    icon: Optional[str] = Field(None, max_length=50)
    image_url: Optional[str] = Field(None, max_length=500)

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
