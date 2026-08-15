from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, UniqueConstraint
from datetime import datetime, timezone
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubResource(Base):
    __tablename__ = "club_resources"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    resource_type = Column(String(50), nullable=False)  # VIDEO, COURSE, BOOK, PAPER
    url = Column(String(500), nullable=False)
    group_name = Column(String(100), nullable=False)    # e.g., 'START HERE', 'GOING DEEPER'
    order_no = Column(Integer, default=0, nullable=False, index=True)

    def __repr__(self) -> str:
        return f"<ClubResource id={self.id} title={self.title!r}>"

class UserResourceProgress(Base):
    """
    Tracks which resources a user has completed.
    """
    __tablename__ = "user_resource_progress"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id = Column(Integer, ForeignKey("club_resources.id", ondelete="CASCADE"), nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'resource_id', name='uq_user_resource'),
    )

    def __repr__(self) -> str:
        return f"<UserResourceProgress user_id={self.user_id} resource_id={self.resource_id}>"
