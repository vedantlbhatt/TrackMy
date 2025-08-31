from fastapi import APIRouter
from app.api.v1.endpoints import users, items, compare, reports, images

api_v1_router = APIRouter()
api_v1_router.include_router(users.router)
api_v1_router.include_router(items.router)
api_v1_router.include_router(compare.router)
api_v1_router.include_router(reports.router)
api_v1_router.include_router(images.router)
#add more endpoints here as more endpoints are made
