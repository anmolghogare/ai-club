from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db import get_db
from .models import ClubMember
from .schemas import ClubMemberResponse

router = APIRouter(prefix="/api/members", tags=["Members"])

@router.get("", response_model=List[ClubMemberResponse])
async def list_members(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubMember).order_by(ClubMember.order_no.asc())
    )
    return result.scalars().all()
