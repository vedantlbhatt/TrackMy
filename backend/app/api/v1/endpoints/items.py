from fastapi import APIRouter, Path

router = APIRouter(prefix="/users/{user_id}/items", tags=["items"])