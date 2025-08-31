from fastapi import APIRouter, Depends
from app.services.db import item_store
from app.core.init_db import SessionLocal
from app.schemas.item import ItemCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/getItemByUser/")
def get_item_by_user(user_id: int, item_id: int, db=Depends(get_db)):
    #add some error handling for if user doesnt have items edge case
    return item_store.get_item_by_user(db, user_id, item_id)

@router.get("/getItemsByUser/")
def get_items_by_user(user_id: int, db=Depends(get_db)):
    return item_store.get_items_by_user(db, user_id)
    
@router.post("/addItemByUser/")
def add_item_by_user(item: ItemCreate,  db=Depends(get_db)):
    return item_store.create_item(db, item.user_id, item.name, item.description)
