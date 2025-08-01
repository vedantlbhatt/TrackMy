from app.core.config import settings
from app.core.database import Base
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Import all models so they are registered with Base
from app.models.user import User
from app.models.item import Item
from app.models.image import Image
from app.models.embed import Embed
from app.models.foundReport import FoundReport
from app.models.lostReport import LostReport

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
