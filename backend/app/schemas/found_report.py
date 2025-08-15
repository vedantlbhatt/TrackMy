from pydantic import BaseModel

class FoundReportCreate(BaseModel):
    founder_id: int
    item_id: int 
    description: str
    longitude: float
    latitude: float
    radius: float
    request_bounty: float

    