from sqlalchemy import Column, Integer, String, Text
from db import Base

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
