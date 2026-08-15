import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select, desc
from sqlalchemy.ext.asyncio import AsyncSession

from db import async_session
from news.models import ClubNews
from news.schemas import NewsCreate, NewsUpdate, NewsResponse
from events.admin import require_admin

router = APIRouter(tags=["News"])
logger = logging.getLogger(__name__)

async def get_db():
    async with async_session() as session:
        yield session

@router.get("/api/news", response_model=List[NewsResponse])
async def get_news(session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(ClubNews).order_by(desc(ClubNews.created_at))
    )
    return list(result.scalars().all())

@router.post("/api/admin/news", response_model=NewsResponse, dependencies=[Depends(require_admin)])
async def create_news(data: NewsCreate, session: AsyncSession = Depends(get_db)):
    news_item = ClubNews(**data.model_dump())
    session.add(news_item)
    await session.commit()
    await session.refresh(news_item)
    return news_item

@router.put("/api/admin/news/{news_id}", response_model=NewsResponse, dependencies=[Depends(require_admin)])
async def update_news(news_id: int, data: NewsUpdate, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(ClubNews).where(ClubNews.id == news_id))
    news_item = result.scalars().first()
    if not news_item:
        raise HTTPException(status_code=404, detail="News item not found")
    
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(news_item, key, value)
        
    await session.commit()
    await session.refresh(news_item)
    return news_item

@router.delete("/api/admin/news/{news_id}", dependencies=[Depends(require_admin)])
async def delete_news(news_id: int, session: AsyncSession = Depends(get_db)):
    result = await session.execute(select(ClubNews).where(ClubNews.id == news_id))
    news_item = result.scalars().first()
    if not news_item:
        raise HTTPException(status_code=404, detail="News item not found")
        
    await session.delete(news_item)
    await session.commit()
    return {"status": "success", "message": "News item deleted successfully"}
