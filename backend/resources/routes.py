from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from typing import List

from db import get_db
from .models import ClubResource, UserResourceProgress
from .schemas import ClubResourceResponse, ResourceCreate, ResourceUpdate
from auth.middleware import get_current_user
from events.admin import require_admin

router = APIRouter(tags=["Resources"])

@router.get("/api/resources", response_model=List[ClubResourceResponse])
async def list_resources(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubResource).order_by(ClubResource.order_no.asc())
    )
    return result.scalars().all()

@router.get("/api/resources/progress", response_model=List[int])
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

@router.post("/api/resources/{resource_id}/toggle", response_model=dict)
async def toggle_progress(
    resource_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Toggle completion status for a resource."""
    resource = await db.get(ClubResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    existing = await db.execute(
        select(UserResourceProgress)
        .where(
            UserResourceProgress.user_id == current_user.id,
            UserResourceProgress.resource_id == resource_id
        )
    )
    progress_entry = existing.scalar_one_or_none()
    
    if progress_entry:
        await db.delete(progress_entry)
        await db.commit()
        return {"status": "uncompleted"}
    else:
        new_progress = UserResourceProgress(
            user_id=current_user.id,
            resource_id=resource_id
        )
        db.add(new_progress)
        await db.commit()
        return {"status": "completed"}

@router.post("/api/resources/reset", response_model=dict)
async def reset_progress(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    """Reset all progress for the current user."""
    await db.execute(
        delete(UserResourceProgress).where(UserResourceProgress.user_id == current_user.id)
    )
    await db.commit()
    return {"status": "success", "message": "All progress reset successfully"}

# ── Admin Resource CRUD ──────────────────────────────────────────

@router.post("/api/admin/resources", response_model=ClubResourceResponse, dependencies=[Depends(require_admin)])
async def create_resource(data: ResourceCreate, db: AsyncSession = Depends(get_db)):
    resource = ClubResource(**data.model_dump())
    db.add(resource)
    await db.commit()
    await db.refresh(resource)
    return resource

@router.put("/api/admin/resources/{resource_id}", response_model=ClubResourceResponse, dependencies=[Depends(require_admin)])
async def update_resource(
    resource_id: int,
    data: ResourceUpdate,
    db: AsyncSession = Depends(get_db)
):
    resource = await db.get(ClubResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(resource, key, value)
        
    await db.commit()
    await db.refresh(resource)
    return resource

@router.delete("/api/admin/resources/{resource_id}", dependencies=[Depends(require_admin)])
async def delete_resource(resource_id: int, db: AsyncSession = Depends(get_db)):
    resource = await db.get(ClubResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    await db.delete(resource)
    await db.commit()
    return {"status": "success", "message": "Resource deleted successfully"}

