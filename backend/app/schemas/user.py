from pydantic import BaseModel

class UserCreate(BaseModel):
    email: str
    user_name: str
    payment_source: str
