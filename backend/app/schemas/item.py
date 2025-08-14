from pydantic import BaseModel

class ItemCreate(BaseModel):
    user_id: int
    name : str
