from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db import get_db
from .models import PastEvent
from .schemas import PastEventResponse, PastEventCreate, PastEventUpdate
from events.admin import require_admin

router = APIRouter(tags=["Past Events"])

@router.get("/api/past-events", response_model=List[PastEventResponse])
async def list_past_events(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(PastEvent).order_by(PastEvent.sort_order.asc(), PastEvent.created_at.desc())
    )
    return result.scalars().all()

@router.post("/api/admin/past-events", response_model=PastEventResponse, dependencies=[Depends(require_admin)])
async def create_past_event(data: PastEventCreate, db: AsyncSession = Depends(get_db)):
    past_event = PastEvent(**data.model_dump())
    db.add(past_event)
    await db.commit()
    await db.refresh(past_event)
    return past_event

@router.put("/api/admin/past-events/{past_event_id}", response_model=PastEventResponse, dependencies=[Depends(require_admin)])
async def update_past_event(past_event_id: int, data: PastEventUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PastEvent).where(PastEvent.id == past_event_id))
    past_event = result.scalars().first()
    if not past_event:
        raise HTTPException(status_code=404, detail="Past event not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(past_event, key, value)
        
    await db.commit()
    await db.refresh(past_event)
    return past_event

@router.delete("/api/admin/past-events/{past_event_id}", dependencies=[Depends(require_admin)])
async def delete_past_event(past_event_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(PastEvent).where(PastEvent.id == past_event_id))
    past_event = result.scalars().first()
    if not past_event:
        raise HTTPException(status_code=404, detail="Past event not found")
        
    await db.delete(past_event)
    await db.commit()
    return {"status": "success", "message": "Past event deleted successfully"}
