from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List

from db import get_db
from .models import ClubResource, UserResourceProgress
from .schemas import ClubResourceResponse
from auth.middleware import get_current_user

router = APIRouter(prefix="/api/resources", tags=["Resources"])

@router.get("", response_model=List[ClubResourceResponse])
async def list_resources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubResource).order_by(ClubResource.order_no.asc())
    )
    return result.scalars().all()

@router.get("/progress", response_model=List[int])
async def get_progress(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Get list of completed resource IDs for the current user."""
    result = await db.execute(
        select(UserResourceProgress.resource_id)
        .where(UserResourceProgress.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("/{resource_id}/toggle", response_model=dict)
async def toggle_progress(
    resource_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Toggle completion status for a resource."""
    # Check if resource exists
    resource = await db.get(ClubResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    # Check if already completed
    existing = await db.execute(
        select(UserResourceProgress)
        .where(
            UserResourceProgress.user_id == current_user.id,
            UserResourceProgress.resource_id == resource_id
        )
    )
    progress_entry = existing.scalar_one_or_none()
    
    if progress_entry:
        # If exists, remove it (unmark as completed)
        await db.delete(progress_entry)
        await db.commit()
        return {"status": "uncompleted"}
    else:
        # If doesn't exist, add it (mark as completed)
        new_progress = UserResourceProgress(
            user_id=current_user.id,
            resource_id=resource_id
        )
        db.add(new_progress)
        await db.commit()
        return {"status": "completed"}
