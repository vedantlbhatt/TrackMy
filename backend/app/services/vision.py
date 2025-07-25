from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import faiss
import numpy as np
import os

# Load CLIP model + processor
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

INDEX_PATH = "/Users/rohannair/Desktop/Projects/TrackMy/backend/faiss.index"

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
def embed_image(image_url):
        try:
            image = Image.open(image_url)
            inputs = processor(images=image, return_tensors="pt")
            with torch.no_grad():
                outputs = model.get_image_features(**inputs)
            return outputs[0].numpy()
        except Exception as e:
            print(f"Embedding failed for {image_url}: {e}")
            return None
class vision_store:
    def add_image_to_index(image_url):
        index = init_index()
        vector = embed_image(image_url)
        if vector is not None:
            index.add(np.expand_dims(vector, axis=0))
            write_to_index(index)

    def get_similar_images(image_url, k=5):
        index = init_index()
        vector = embed_image(image_url)
        if vector is not None and index.ntotal > 0:
            D, I = index.search(np.expand_dims(vector, axis=0), k)
            return D, I
        else:
            print("No embeddings in index or failed to embed query.")
            return [], []

# # Example Usage
# add_image_to_index("/Users/rohannair/Desktop/Projects/TrackMy/backend/local_storage/IMG_4400.jpeg")

# # To compare a new image
# distances, indices = get_similar_images("/Users/rohannair/Desktop/Projects/TrackMy/backend/local_storage/IMG_4400.jpeg")
# print(distances, indices)
