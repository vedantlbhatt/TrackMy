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

@router.get("getItemByUser/userId/{user_id}/itemId/{item_id}")
def get_user_by_id(user_id: int, item_id: int):
    return item_store.get_item_by_user(user_id, item_id)
    
@router.post("addItemByUser/userId/{user_id}/itemId/{item_id}")
def get_items_by_user(user_id: int):
    return item_store.get_items_by_user(user_id)