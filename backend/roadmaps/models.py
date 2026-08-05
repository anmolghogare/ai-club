from sqlalchemy import Column, Integer, String, Text
from db import Base

class ClubRoadmap(Base):
    __tablename__ = "club_roadmaps"

    id = Column(Integer, primary_key=True, index=True)
    roadmap_type = Column(String(50), nullable=False)  # 'ML' or 'GENAI'
    phase = Column(String(50), nullable=False)
    title = Column(String(255), nullable=False)
    duration = Column(String(100), nullable=False)
    color = Column(String(100), nullable=False)
    icon_name = Column(String(50), nullable=False)
    topics = Column(Text, nullable=False)  # JSON-serialised array of topics
    order_no = Column(Integer, default=0, nullable=False, index=True)

    def __repr__(self) -> str:
        return f"<ClubRoadmap id={self.id} type={self.roadmap_type!r} phase={self.phase!r}>"
