from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class PastEvent(Base):
    __tablename__ = "past_events"

    id           = Column(Integer, primary_key=True, index=True)
    title        = Column(Text, nullable=True)
    description  = Column(Text, nullable=True)
    category     = Column(Text, nullable=True)
    date_label   = Column(Text, nullable=True)
    image_url    = Column(Text, nullable=True)
    speaker      = Column(Text, nullable=True)
    participants = Column(Integer, nullable=True)
    sort_order   = Column(Integer, default=0, nullable=True)
    winners      = Column(Text, nullable=True)
    winner_link  = Column(Text, nullable=True)
    created_at   = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<PastEvent id={self.id} title={self.title!r}>"
