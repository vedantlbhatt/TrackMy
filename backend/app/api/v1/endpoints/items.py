from fastapi import APIRouter, Depends
from app.services.db import item_store
from app.services.db import user_store
from app.core.init_db import SessionLocal
from app.models.user import User
from app.models.item import Item

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/getItemByUser/")
def get_item_by_user(user_id: int, item_id: int, db=Depends(get_db)):
    # Need error handling for if user doesnt have items
    return item_store.get_item_by_user(db, user_id, item_id)

@router.get("/getItemsByUser/")
def get_items_by_user(user_id: int, db=Depends(get_db)):
    return item_store.get_items_by_user(db, user_id)
    
@router.post("/addItemByUser/")
def get_items_by_user(user_id: int, name: str,  db=Depends(get_db)):
    return item_store.create_item(db, user_id, name)
