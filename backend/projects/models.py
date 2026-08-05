from datetime import datetime, timezone
from sqlalchemy import Column, Integer, String, Text, DateTime
from db import Base

def _utcnow() -> datetime:
    return datetime.now(timezone.utc)

class ClubProject(Base):
    __tablename__ = "club_projects"

    id          = Column(Integer, primary_key=True, index=True)
    title       = Column(String(255), nullable=False)
    author      = Column(String(255), nullable=False)
    author_id   = Column(Integer, nullable=True, index=True)
    description = Column(Text, nullable=False)
    tags        = Column(Text, nullable=True)  # JSON-serialised array of tags
    github_link = Column(String(255), nullable=False)
    created_at  = Column(DateTime(timezone=True), default=_utcnow, nullable=False)

    def __repr__(self) -> str:
        return f"<ClubProject id={self.id} title={self.title!r} author={self.author!r}>"
