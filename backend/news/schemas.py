from pydantic import BaseModel, Field, HttpUrl
from datetime import datetime
from typing import Optional

class NewsCreate(BaseModel):
    title: str = Field(..., max_length=255)
    description: Optional[str] = None
    link: str = Field(..., max_length=1024)
    image_url: Optional[str] = Field(None, max_length=1024)

class NewsUpdate(BaseModel):
    title: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    link: Optional[str] = Field(None, max_length=1024)
    image_url: Optional[str] = Field(None, max_length=1024)

class NewsResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    link: str
    image_url: Optional[str] = None
    created_at: datetime
    
    model_config = {"from_attributes": True}
