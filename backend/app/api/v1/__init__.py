from fastapi import APIRouter
from app.api.v1.endpoints import users, items, compare, reports

api_v1_router = APIRouter()
api_v1_router.include_router(users.router)
api_v1_router.include_router(items.router)
api_v1_router.include_router(compare.router)
api_v1_router.include_router(reports.router)
#add more endpoints here as more endpoints are made
