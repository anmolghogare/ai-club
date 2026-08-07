from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubMember(Base):
    __tablename__ = "club_members"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(255), nullable=True)
    role        = Column(String(100), nullable=True)  # 'Convenor' | 'Core Member' | 'Extended Core Member' | 'Member'
    photo       = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    github      = Column(String(255), nullable=True)
    linkedin    = Column(String(255), nullable=True)
    order_no    = Column(Integer, default=0, nullable=False, index=True)
    created_at  = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ClubMember id={self.id} name={self.name!r} role={self.role!r}>"


