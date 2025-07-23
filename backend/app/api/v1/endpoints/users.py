from fastapi import APIRouter, Depends
from app.services.db import item_store
from app.services.db import user_store
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
    return user_store.create_user(db, email, user_name, payment_source)

@router.get("/getUser/")
def get_user(user_id: int, db=Depends(get_db)):
    print(user_id)
    return user_store.get_user_by_id(db, user_id)