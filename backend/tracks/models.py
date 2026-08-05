from sqlalchemy import Column, Integer, String, Text
from db import Base

class ClubTrack(Base):
    __tablename__ = "club_tracks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    audience = Column(String(255), nullable=True)
