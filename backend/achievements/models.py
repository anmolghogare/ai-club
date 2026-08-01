from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubAchievement(Base):
    __tablename__ = "club_achievements"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    student = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    category = Column(String(100), nullable=False)
    icon = Column(String(50), nullable=False, default="Award")
    created_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)
