from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class FoundReportCreate(BaseModel):
    founder_id: int
    item_id: Optional[int] = None
    title: str
    description: Optional[str] = None
    longitude: Optional[float] = None
    latitude: Optional[float] = None
    radius: Optional[float] = None
    