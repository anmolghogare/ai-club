from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db import get_db
from .models import ClubProject
from .schemas import ClubProjectResponse

router = APIRouter(prefix="/api/projects", tags=["Projects"])

@router.get("", response_model=List[ClubProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubProject).order_by(ClubProject.created_at.desc())
    )
    return result.scalars().all()
