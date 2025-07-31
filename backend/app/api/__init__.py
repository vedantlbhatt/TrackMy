from fastapi import APIRouter
from app.api.v1 import api_v1_router

api_router = APIRouter()
api_router.include_router(api_v1_router) # replace with constant from config eventually i removed the prefix v1 vedu
