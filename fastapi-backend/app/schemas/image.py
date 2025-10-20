from pydantic import BaseModel
from typing import Optional

class ImageCreate(BaseModel):
    url: str
    item_id : int
    faiss_id: Optional[str] = None
