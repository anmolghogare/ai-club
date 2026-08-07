from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubAchievement(Base):
    __tablename__ = "club_achievements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=True)
    student = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    category = Column(String(100), nullable=True)
    icon = Column(String(50), nullable=True, default="Award")
    image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
