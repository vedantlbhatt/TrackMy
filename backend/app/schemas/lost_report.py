from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class LostReportCreate(BaseModel):
    user_id: int # need to add this to db
    item_id: int # need to add this to db
    title: str # need to add this to db
    description: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    radius: Optional[float] = None
    bounty: Optional[float] = None
    