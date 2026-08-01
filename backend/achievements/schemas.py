from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional

class AchievementCreate(BaseModel):
    title: str = Field(..., min_length=3, max_length=255)
    student: str = Field(..., min_length=2, max_length=255)
    description: str = Field(..., min_length=10)
    category: str = Field(..., min_length=2, max_length=100)
    icon: str = Field(..., max_length=50)

class AchievementUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=3, max_length=255)
    student: Optional[str] = Field(None, min_length=2, max_length=255)
    description: Optional[str] = Field(None, min_length=10)
    category: Optional[str] = Field(None, min_length=2, max_length=100)
    icon: Optional[str] = Field(None, max_length=50)

class AchievementResponse(BaseModel):
    id: int
    title: str
    student: str
    description: str
    category: str
    icon: str
    created_at: datetime
    
    model_config = {"from_attributes": True}
