from pydantic import BaseModel

class LostReportCreate(BaseModel):
    user_id: int # need to add this to db
    item_id: int # need to add this to db
    name: str # need to add this to db
    description: str
    longitude: float
    latitude: float
    radius: float
    bounty: float

    