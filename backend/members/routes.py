from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List, Optional
from pydantic import BaseModel

from db import get_db
from .models import ClubMember
from .schemas import ClubMemberResponse
from events.admin import require_admin

router = APIRouter(prefix="/api/members", tags=["Members"])


# ── Public: list all members ──────────────────────────────────────────────────

@router.get("", response_model=List[ClubMemberResponse])
async def list_members(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubMember).order_by(ClubMember.order_no.asc())
    )
    return result.scalars().all()


# ── Admin CRUD ────────────────────────────────────────────────────────────────

class MemberCreate(BaseModel):
    name: str
    role: str = "Member"
    photo: Optional[str] = None
    description: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    order_no: int = 0


class MemberUpdate(BaseModel):
    name: Optional[str] = None
    role: Optional[str] = None
    photo: Optional[str] = None
    description: Optional[str] = None
    github: Optional[str] = None
    linkedin: Optional[str] = None
    order_no: Optional[int] = None


@router.post("/admin", response_model=ClubMemberResponse, status_code=status.HTTP_201_CREATED)
async def create_member(
    body: MemberCreate,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    member = ClubMember(**body.model_dump())
    db.add(member)
    await db.commit()
    await db.refresh(member)
    return member


@router.put("/admin/{member_id}", response_model=ClubMemberResponse)
async def update_member(
    member_id: int,
    body: MemberUpdate,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ClubMember).where(ClubMember.id == member_id))
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    for field, value in body.model_dump(exclude_unset=True).items():
        setattr(member, field, value)
    await db.commit()
    await db.refresh(member)
    return member


@router.delete("/admin/{member_id}", status_code=status.HTTP_200_OK)
async def delete_member(
    member_id: int,
    admin=Depends(require_admin),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(select(ClubMember).where(ClubMember.id == member_id))
    member = result.scalar_one_or_none()
    if not member:
        raise HTTPException(status_code=404, detail="Member not found")
    await db.delete(member)
    await db.commit()
    return {"message": f"Member id={member_id} deleted successfully"}

