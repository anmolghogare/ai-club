from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubMember(Base):
    __tablename__ = "club_members"

    id          = Column(Integer, primary_key=True, index=True)
    name        = Column(String(255), nullable=False)
    role        = Column(String(100), nullable=False)  # 'Convenor' | 'Core Member' | 'Extended Core Member' | 'Member'
    photo       = Column(String(500), nullable=True)
    description = Column(Text, nullable=True)
    github      = Column(String(255), nullable=True)
    linkedin    = Column(String(255), nullable=True)
    order_no    = Column(Integer, default=0, nullable=False, index=True)
    created_at  = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ClubMember id={self.id} name={self.name!r} role={self.role!r}>"

class ClubProject(Base):
    __tablename__ = "club_projects"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(255), nullable=False)
    author      = Column(String(255), nullable=False)
    author_id   = Column(Integer, nullable=True, index=True)  # references ClubMember.id if matching
    description = Column(Text, nullable=False)
    tags        = Column(Text, nullable=True)  # JSON-serialised array of tags
    github_link = Column(String(255), nullable=False)
    created_at  = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ClubProject id={self.id} title={self.title!r} author={self.author!r}>"
