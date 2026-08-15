from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubNews(Base):
    __tablename__ = "club_news"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    link = Column(String(1024), nullable=False)
    image_url = Column(String(1024), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
