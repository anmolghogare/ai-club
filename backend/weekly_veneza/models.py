from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Boolean, UniqueConstraint
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class WeeklyVenezaWeek(Base):
    __tablename__ = "weekly_veneza_weeks"

    id = Column(Integer, primary_key=True, index=True)
    week_number = Column(Integer, nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    target_date = Column(String(100), nullable=True)  # ISO string or date
    is_current = Column(Boolean, default=False, nullable=False)
    status = Column(String(50), default="active")     # "past", "current", "upcoming"
    order_no = Column(Integer, default=0, nullable=False)

    resources = relationship(
        "WeeklyVenezaResource",
        back_populates="week",
        cascade="all, delete-orphan",
        order_by="WeeklyVenezaResource.order_no.asc()"
    )

    def __repr__(self) -> str:
        return f"<WeeklyVenezaWeek id={self.id} week_number={self.week_number} title={self.title!r}>"

class WeeklyVenezaResource(Base):
    __tablename__ = "weekly_veneza_resources"

    id = Column(Integer, primary_key=True, index=True)
    week_id = Column(Integer, ForeignKey("weekly_veneza_weeks.id", ondelete="CASCADE"), nullable=False, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    resource_type = Column(String(50), nullable=False)  # VIDEO, COURSE, BOOK, PAPER, ARTICLE, CODE
    url = Column(String(500), nullable=False)
    est_minutes = Column(Integer, default=45, nullable=False)
    order_no = Column(Integer, default=0, nullable=False)

    week = relationship("WeeklyVenezaWeek", back_populates="resources")

    def __repr__(self) -> str:
        return f"<WeeklyVenezaResource id={self.id} title={self.title!r}>"

class UserWeeklyVenezaProgress(Base):
    __tablename__ = "user_weekly_veneza_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    resource_id = Column(Integer, ForeignKey("weekly_veneza_resources.id", ondelete="CASCADE"), nullable=False, index=True)
    completed_at = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    __table_args__ = (
        UniqueConstraint('user_id', 'resource_id', name='uq_user_weekly_veneza_resource'),
    )

    def __repr__(self) -> str:
        return f"<UserWeeklyVenezaProgress user_id={self.user_id} resource_id={self.resource_id}>"
