from PIL import Image as PILImage
# import torch
# from transformers import CLIPProcessor, CLIPModel
from app.services.db import item_store
from app.models.item import Item
from app.models.image import Image
# import faiss
# import numpy as np
import os

# Load CLIP model + processor (DISABLED - ML libraries removed)
# model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
# processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

INDEX_PATH = "faiss.index"
# All of the functions not in the store may have to be moved to a utils folder
# ML functions disabled - libraries removed
def init_index():
    print("ML features disabled - init_index not available")
    return None

def write_to_index(index):
    print("ML features disabled - write_to_index not available")
    pass

def embed_image(image_url):
    print("ML features disabled - embed_image not available")
    return None

def add_image_to_index(image_url):
    print("ML features disabled - add_image_to_index not available")
    return None

def get_similar_images(image_url, k=5):
    print("ML features disabled - get_similar_images not available")
    return []

class vision_store:
    def create_image(db, item_id, url):
        # ML features disabled - create image without faiss_id
        image = Image(url=url, item_id=item_id, faiss_id=None) 
        db.add(image)
        db.commit()
        db.refresh(image)
        return image
    
    def get_if_same_item(db, user_id, item_id, compare_url):
        # ML features disabled - always return False for now
        print("ML features disabled - get_if_same_item not available")
        return False

    def get_images_from_item(db, item_id):
        return db.query(Image).filter(Image.item_id == item_id).all()

    def clear_faiss_index():
        # ML features disabled
        print("ML features disabled - clear_faiss_index not available")
        pass
    def delete_image(db, image_id):
        image = db.query(Image).filter(Image.image_id == image_id).first()
        if image:
            db.delete(image)
            db.commit()
            return True
        return False
# Debugging shi
# # Example Usage
# add_image_to_index("/Users/rohannair/Desktop/Projects/TrackMy/backend/local_storage/IMG_4400.jpeg")

# # To compare a new image
# distances, indices = get_similar_images("/Users/rohannair/Desktop/Projects/TrackMy/backend/local_storage/IMG_4400.jpeg")
# print(distances, indices)
