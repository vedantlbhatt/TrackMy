from fastapi import APIRouter
from app.api.v1.endpoints import items

api_v1_router = APIRouter()
api_v1_router.include_router(items.router, prefix="/items", tags=["items"]) # Also add string to constants file
