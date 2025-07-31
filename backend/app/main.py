from fastapi import FastAPI
from app.api import api_router
from app.core.config import settings
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title=settings.PROJECT_NAME)
app.include_router(api_router, prefix=settings.API_V1_STR)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# api_router.include_router(items.router, prefix="/items", tags=["items"]) need to change to follow (person_id/item i think)
