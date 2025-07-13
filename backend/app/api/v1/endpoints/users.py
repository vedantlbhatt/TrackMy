from fastapi import APIRouter, Depends
from app.services.db import create_user
from app.core.init_db import SessionLocal
from app.models.user import User

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/users/")
def add_user(email: str, user_name: str, payment_source: str, db=Depends(get_db)):
    return create_user(db, email, user_name, payment_source)