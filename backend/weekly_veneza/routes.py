from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy import delete
from sqlalchemy.orm import selectinload
from typing import List

from db import get_db
from .models import WeeklyVenezaWeek, WeeklyVenezaResource, UserWeeklyVenezaProgress
from .schemas import (
    WeeklyVenezaWeekResponse, WeeklyVenezaWeekCreate, WeeklyVenezaWeekUpdate,
    WeeklyVenezaResourceResponse, WeeklyVenezaResourceCreate, WeeklyVenezaResourceUpdate
)
from auth.middleware import get_current_user
from events.admin import require_admin

router = APIRouter(tags=["Weekly Veneza"])

@router.get("/api/weekly-veneza", response_model=List[WeeklyVenezaWeekResponse])
async def list_weekly_veneza(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(WeeklyVenezaWeek)
        .options(selectinload(WeeklyVenezaWeek.resources))
        .order_by(WeeklyVenezaWeek.week_number.asc(), WeeklyVenezaWeek.order_no.asc())
    )
    return result.scalars().all()

@router.get("/api/weekly-veneza/progress", response_model=List[int])
async def get_progress(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    result = await db.execute(
        select(UserWeeklyVenezaProgress.resource_id)
        .where(UserWeeklyVenezaProgress.user_id == current_user.id)
    )
    return result.scalars().all()

@router.post("/api/weekly-veneza/{resource_id}/toggle", response_model=dict)
async def toggle_progress(
    resource_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    resource = await db.get(WeeklyVenezaResource, resource_id)
    if not resource:
        raise HTTPException(status_code=404, detail="Resource not found")
        
    existing = await db.execute(
        select(UserWeeklyVenezaProgress)
        .where(
            UserWeeklyVenezaProgress.user_id == current_user.id,
            UserWeeklyVenezaProgress.resource_id == resource_id
        )
    )
    progress_entry = existing.scalar_one_or_none()
    
    if progress_entry:
        await db.delete(progress_entry)
        await db.commit()
        return {"status": "uncompleted"}
    else:
        new_progress = UserWeeklyVenezaProgress(
            user_id=current_user.id,
            resource_id=resource_id
        )
        db.add(new_progress)
        await db.commit()
        return {"status": "completed"}

@router.post("/api/weekly-veneza/reset", response_model=dict)
async def reset_progress(
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user)
):
    await db.execute(
        delete(UserWeeklyVenezaProgress).where(UserWeeklyVenezaProgress.user_id == current_user.id)
    )
    await db.commit()
    return {"status": "success", "message": "Weekly Veneza progress reset successfully"}

# ── Admin Weekly Veneza Week & Resource CRUD ────────────────────────

@router.post("/api/admin/weekly-veneza/weeks", response_model=WeeklyVenezaWeekResponse, dependencies=[Depends(require_admin)])
async def create_week(data: WeeklyVenezaWeekCreate, db: AsyncSession = Depends(get_db)):
    if data.is_current:
        existing_current = (await db.execute(select(WeeklyVenezaWeek).where(WeeklyVenezaWeek.is_current == True))).scalars().all()
        for w in existing_current:
            w.is_current = False

    week = WeeklyVenezaWeek(**data.model_dump())
    db.add(week)
    await db.commit()
    
    result = await db.execute(
        select(WeeklyVenezaWeek).options(selectinload(WeeklyVenezaWeek.resources)).where(WeeklyVenezaWeek.id == week.id)
    )
    return result.scalar_one()

@router.put("/api/admin/weekly-veneza/weeks/{week_id}", response_model=WeeklyVenezaWeekResponse, dependencies=[Depends(require_admin)])
async def update_week(week_id: int, data: WeeklyVenezaWeekUpdate, db: AsyncSession = Depends(get_db)):
    week = await db.get(WeeklyVenezaWeek, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")

    update_data = data.model_dump(exclude_unset=True)
    if update_data.get("is_current") is True:
        existing_current = (await db.execute(select(WeeklyVenezaWeek).where(WeeklyVenezaWeek.is_current == True))).scalars().all()
        for w in existing_current:
            if w.id != week_id:
                w.is_current = False

    for key, value in update_data.items():
        setattr(week, key, value)

    await db.commit()
    
    result = await db.execute(
        select(WeeklyVenezaWeek).options(selectinload(WeeklyVenezaWeek.resources)).where(WeeklyVenezaWeek.id == week_id)
    )
    return result.scalar_one()

@router.delete("/api/admin/weekly-veneza/weeks/{week_id}", dependencies=[Depends(require_admin)])
async def delete_week(week_id: int, db: AsyncSession = Depends(get_db)):
    week = await db.get(WeeklyVenezaWeek, week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Week not found")
        
    await db.delete(week)
    await db.commit()
    return {"status": "success", "message": "Week deleted successfully"}

@router.post("/api/admin/weekly-veneza/resources", response_model=WeeklyVenezaResourceResponse, dependencies=[Depends(require_admin)])
async def create_weekly_resource(data: WeeklyVenezaResourceCreate, db: AsyncSession = Depends(get_db)):
    week = await db.get(WeeklyVenezaWeek, data.week_id)
    if not week:
        raise HTTPException(status_code=404, detail="Parent week not found")

    res = WeeklyVenezaResource(**data.model_dump())
    db.add(res)
    await db.commit()
    await db.refresh(res)
    return res

@router.put("/api/admin/weekly-veneza/resources/{res_id}", response_model=WeeklyVenezaResourceResponse, dependencies=[Depends(require_admin)])
async def update_weekly_resource(res_id: int, data: WeeklyVenezaResourceUpdate, db: AsyncSession = Depends(get_db)):
    res = await db.get(WeeklyVenezaResource, res_id)
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")

    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(res, key, value)

    await db.commit()
    await db.refresh(res)
    return res

@router.delete("/api/admin/weekly-veneza/resources/{res_id}", dependencies=[Depends(require_admin)])
async def delete_weekly_resource(res_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.get(WeeklyVenezaResource, res_id)
    if not res:
        raise HTTPException(status_code=404, detail="Resource not found")

    await db.delete(res)
    await db.commit()
    return {"status": "success", "message": "Resource deleted successfully"}
