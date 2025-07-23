from PIL import Image
import torch
from transformers import CLIPProcessor, CLIPModel
import faiss
import numpy as np

# Load CLIP model
model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32")
processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")

    
def init_index():
   index = faiss.read_index("/Users/rohannair/Desktop/Projects/TrackMy/backend/faiss.index")
    if index.ntotal == 0:
        index = faiss.IndexFlatL2(512) 
    return index
def write_to_index():
    faiss.write_index(index, "/Users/rohannair/Desktop/Projects/TrackMy/backend/faiss.index")
# Function to embed image
def embed_image(image_url):
    index = init_index()
    image = Image.open(image_url)
    inputs = processor(images=image, return_tensors="pt")
    with torch.no_grad():
        outputs = model.get_image_features(**inputs)
    index.add(np.expand_dims(outputs[0].numpy(), axis=0))
    write_to_index()
    
def get_image_comp(image_url):
    index = init_index()
    query_embedding = get_embedding(image_url)
    D, I = index.search(np.expand_dims(query_embedding, axis=0), k=5)
