from fastapi import APIRouter, Depends
from app.services.db import image_store
from app.core.init_db import SessionLocal
from app.schemas.image import ImageCreate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/addImage/")
def add_image(image: ImageCreate, db=Depends(get_db)):
    return image_store.add_image(db, image.item_id, image.url, image.faiss_id)