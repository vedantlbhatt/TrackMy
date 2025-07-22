from app.core.config import settings
from app.core.database import Base
from sqlalchemy import create_engine

# Import all models so they are registered with Base
from app.models.user import User
from app.models.item import Item
from app.models.image import Image

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

Base.metadata.create_all(bind=engine)
