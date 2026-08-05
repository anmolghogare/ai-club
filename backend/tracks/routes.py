from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List

from db import get_db
from tracks.models import ClubTrack
from tracks.schemas import TrackResponse

router = APIRouter(tags=["Tracks"])

@router.get("/api/tracks", response_model=List[TrackResponse])
async def list_tracks(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(ClubTrack).order_by(ClubTrack.id.asc()))
    tracks = result.scalars().all()
    return tracks
