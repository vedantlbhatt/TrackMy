from pydantic import BaseModel
from datetime import datetime

class LostReportCreate(BaseModel):
    user_id: int # need to add this to db
    item_id: int # need to add this to db
    title: str # need to add this to db
    description: str
    longitude: float
    latitude: float
    radius: float
    bounty: float

    