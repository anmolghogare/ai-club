from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db import get_db
from .models import ClubRoadmap
from .schemas import ClubRoadmapResponse

router = APIRouter(prefix="/api/roadmaps", tags=["Roadmaps"])

@router.get("", response_model=List[ClubRoadmapResponse])
async def list_roadmaps(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubRoadmap).order_by(ClubRoadmap.roadmap_type.asc(), ClubRoadmap.order_no.asc())
    )
    items = result.scalars().all()
    # Manual serialization since we overrode from_orm
    return [ClubRoadmapResponse.from_orm(item) for item in items]
