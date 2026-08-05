from pydantic import BaseModel
from typing import List
import json

class ClubRoadmapResponse(BaseModel):
    id: int
    roadmap_type: str
    phase: str
    title: str
    duration: str
    color: str
    icon_name: str
    topics: List[str]
    order_no: int

    class Config:
        from_attributes = True

    @classmethod
    def from_orm(cls, obj):
        # Override to parse topics JSON string to list
        import json
        topics_list = []
        if obj.topics:
            try:
                topics_list = json.loads(obj.topics)
            except Exception:
                pass
        
        return cls(
            id=obj.id,
            roadmap_type=obj.roadmap_type,
            phase=obj.phase,
            title=obj.title,
            duration=obj.duration,
            color=obj.color,
            icon_name=obj.icon_name,
            topics=topics_list,
            order_no=obj.order_no
        )
