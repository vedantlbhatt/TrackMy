from fastapi import APIRouter, Depends
from app.services.db import create_user
from app.services.db impport get_user_by_id # Change this to be classes
from app.core.init_db import SessionLocal
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/addUser/")
def add_user(email: str, user_name: str, payment_source: str, db=Depends(get_db)):
    return create_user(db, email, user_name, payment_source)

@router.get("getUser/{user_id}")
def get_user(user_id: int):
    return get_user_by_id(user_id, db=Depends(get_db))