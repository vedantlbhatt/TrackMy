from PIL import Image as PILImage
import torch
from transformers import CLIPProcessor, CLIPModel
from app.services.db import item_store
from app.models.item import Item
from app.models.image import Image
import faiss
import numpy as np
import os

# Load CLIP model + processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

INDEX_PATH = "faiss.index"
# All of the functions not in the store may have to be moved to a utils folder
def init_index():
    try:
        if os.path.exists(INDEX_PATH):
            index = faiss.read_index(INDEX_PATH)
        else:
            index = faiss.IndexFlatL2(512)
    except Exception as e:
        print("Failed to load index, creating new one:", e)
        index = faiss.IndexFlatL2(512)
    return index

def write_to_index(index):
    faiss.write_index(index, INDEX_PATH)
def embed_image(image_url): # this is just a search function does not add to index 
    try:
        print("this exists", os.path.exists(image_url))
        image = PILImage.open(image_url)
        inputs = processor(images=image, return_tensors="pt")
        with torch.no_grad():
            outputs = model.get_image_features(**inputs)
        return outputs[0].numpy()
    except Exception as e:
        print(f"Embedding failed for {image_url}: {e}")
        return None

def add_image_to_index(image_url):
    index = init_index()
    vector = embed_image(image_url)
    
    if vector is not None:
        index.add(np.expand_dims(vector, axis=0))
        write_to_index(index)
        faiss_id = index.ntotal - 1
        return faiss_id
    return None

def get_similar_images(image_url, k=5):
        index = init_index()
        vector = embed_image(image_url)
        if vector is not None and index.ntotal > 0:
            D, I = index.search(np.expand_dims(vector, axis=0), k)
            results = [
                {'distance': float(d), 'faiss_id': int(i)}
                for d, i in zip(D[0], I[0])
            ]
            return results
        else:
            print("No embeddings in index or failed to embed query.")
            return []

class vision_store:
    def create_image(db, item_id, url):
        faiss_id = add_image_to_index(url)
        image = Image(url=url, item_id=item_id, faiss_id=faiss_id) 
        db.add(image)
        db.commit()
        db.refresh(image)
        # use embed method in vision here
        return image
    def get_if_same_item(db, user_id, item_id, compare_url):
        item = item_store.get_item_by_user(db, user_id, item_id)
        # print("this is item", item)
        images = vision_store.get_images_from_item(db, item_id) # gets all images associated with an item
        # print("these are images", images)
        compare_images = get_similar_images(compare_url)
        for image in images:
            for compare in compare_images:
                print("image faiss id", image.faiss_id)
                print("compare faiss id", compare['faiss_id'])
                return image.faiss_id == compare['faiss_id']
        return False

    def get_images_from_item(db, item_id):
        return db.query(Image).filter(Image.item_id == item_id).all()

    def clear_faiss_index():
        # Load the existing index
        index = init_index()
        # Check if the index is not empty
        if index.ntotal > 0:
            print(f"Clearing {index.ntotal} vectors from the index...")
            index.reset()
            print("Index cleared. Saving...")
            
            # Save the empty index back to the file
            faiss.write_index(index, INDEX_PATH)
        else:
            print("Index is already empty.")
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
