from fastapi import APIRouter, Depends
from app.services.vision import vision_store
from app.core.init_db import SessionLocal

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/addImageToIndex/")
def add_image(item_id: int, image_url: str, db=Depends(get_db)):
    return vision_store.create_image(db, item_id, image_url)

@router.get("/getImageComparison/")
def get_image_comparison(item_id: int, image_url: str, db=Depends(get_db)):
    return vision_store.get_if_same_item(db, item_id, image_url)

@router.delete("/deleteFaissIndex/")
def clear_faiss_index():
    return vision_store.clear_faiss_index()

