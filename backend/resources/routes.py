from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db import get_db
from .models import ClubResource
from .schemas import ClubResourceResponse

router = APIRouter(prefix="/api/resources", tags=["Resources"])

@router.get("", response_model=List[ClubResourceResponse])
async def list_resources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubResource).order_by(ClubResource.group_name.asc(), ClubResource.order_no.asc())
    )
    return result.scalars().all()
