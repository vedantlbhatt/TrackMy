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
def add_image(image_url: str):
    return vision_store.add_image_to_index(image_url)

@router.get("/getImageComparison/")
def get_image_comparison(image_url: str):
    return vision_store.get_similar_images(image_url)


