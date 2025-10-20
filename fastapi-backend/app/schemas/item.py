from pydantic import BaseModel

class ItemCreate(BaseModel):
    user_id: int
    description: str
    name : str
