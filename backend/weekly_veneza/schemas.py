from pydantic import BaseModel
from typing import Optional, List

class WeeklyVenezaResourceBase(BaseModel):
    title: str
    description: str
    resource_type: str
    url: str
    est_minutes: int = 45
    order_no: int = 0

class WeeklyVenezaResourceCreate(WeeklyVenezaResourceBase):
    week_id: int

class WeeklyVenezaResourceUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    resource_type: Optional[str] = None
    url: Optional[str] = None
    est_minutes: Optional[int] = None
    order_no: Optional[int] = None
    week_id: Optional[int] = None

class WeeklyVenezaResourceResponse(WeeklyVenezaResourceBase):
    id: int
    week_id: int

    class Config:
        from_attributes = True

class WeeklyVenezaWeekBase(BaseModel):
    week_number: int
    title: str
    description: Optional[str] = None
    target_date: Optional[str] = None
    is_current: bool = False
    status: str = "active"
    order_no: int = 0

class WeeklyVenezaWeekCreate(WeeklyVenezaWeekBase):
    pass

class WeeklyVenezaWeekUpdate(BaseModel):
    week_number: Optional[int] = None
    title: Optional[str] = None
    description: Optional[str] = None
    target_date: Optional[str] = None
    is_current: Optional[bool] = None
    status: Optional[str] = None
    order_no: Optional[int] = None

class WeeklyVenezaWeekResponse(WeeklyVenezaWeekBase):
    id: int
    resources: List[WeeklyVenezaResourceResponse] = []

    class Config:
        from_attributes = True
