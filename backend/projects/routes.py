from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import List

from db import get_db
from .models import ClubProject
from .schemas import ClubProjectResponse, ClubProjectCreate, ClubProjectUpdate
from events.admin import require_admin

router = APIRouter(tags=["Projects"])

@router.get("/api/projects", response_model=List[ClubProjectResponse])
async def list_projects(db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(ClubProject).order_by(ClubProject.created_at.desc())
    )
    return result.scalars().all()

@router.post("/api/admin/projects", response_model=ClubProjectResponse, dependencies=[Depends(require_admin)])
async def create_project(data: ClubProjectCreate, db: AsyncSession = Depends(get_db)):
    project = ClubProject(**data.model_dump())
    db.add(project)
    await db.commit()
    await db.refresh(project)
    return project

@router.put("/api/admin/projects/{project_id}", response_model=ClubProjectResponse, dependencies=[Depends(require_admin)])
async def update_project(project_id: int, data: ClubProjectUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClubProject).where(ClubProject.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(project, key, value)
        
    await db.commit()
    await db.refresh(project)
    return project

@router.delete("/api/admin/projects/{project_id}", dependencies=[Depends(require_admin)])
async def delete_project(project_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClubProject).where(ClubProject.id == project_id))
    project = result.scalars().first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
        
    await db.delete(project)
    await db.commit()
    return {"status": "success", "message": "Project deleted successfully"}
