from pydantic import BaseModel

class SignupRequest(BaseModel):
    email: str
    password: str
    user_name: str