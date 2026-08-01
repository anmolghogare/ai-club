import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession
from db import async_session
from achievements.models import ClubAchievement
from achievements.schemas import AchievementCreate, AchievementUpdate, AchievementResponse
from events.admin import require_admin

router = APIRouter(tags=["Achievements"])
logger = logging.getLogger(__name__)

async def get_db():
    async with async_session() as session:
        yield session

@router.get("/api/achievements", response_model=List[AchievementResponse])
async def get_achievements(session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(ClubAchievement).order_by(desc(ClubAchievement.created_at))
    )
    return list(result.scalars().all())

@router.post("/api/admin/achievements", response_model=AchievementResponse, dependencies=[Depends(require_admin)])
async def create_achievement(data: AchievementCreate, session: AsyncSession = Depends(get_db)):
    achievement = ClubAchievement(**data.model_dump())
    session.add(achievement)
    await session.commit()
    await session.refresh(achievement)
    return achievement

@router.put("/api/admin/achievements/{achievement_id}", response_model=AchievementResponse, dependencies=[Depends(require_admin)])
async def update_achievement(achievement_id: int, data: AchievementUpdate, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(ClubAchievement).where(ClubAchievement.id == achievement_id))
    achievement = result.scalars().first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(achievement, key, value)
        
    await session.commit()
    await session.refresh(achievement)
    return achievement

@router.delete("/api/admin/achievements/{achievement_id}", dependencies=[Depends(require_admin)])
async def delete_achievement(achievement_id: int, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(ClubAchievement).where(ClubAchievement.id == achievement_id))
    achievement = result.scalars().first()
    if not achievement:
        raise HTTPException(status_code=404, detail="Achievement not found")
        
    await session.delete(achievement)
    await session.commit()
    return {"status": "success", "message": "Achievement deleted successfully"}
