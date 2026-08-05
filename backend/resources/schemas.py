from pydantic import BaseModel

class ClubResourceResponse(BaseModel):
    id: int
    title: str
    description: str
    resource_type: str
    url: str
    group_name: str
    order_no: int

    class Config:
        from_attributes = True
