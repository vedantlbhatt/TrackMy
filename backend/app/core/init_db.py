from app.core.config import settings
from app.core.database import Base
from sqlalchemy import create_engine

# Import all models so they are registered with Base
from app.models.user import User
from app.models.item import Item
from app.models.image import Image

engine = create_engine(settings.SQLALCHEMY_DATABASE_URI)

def create_tables():
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    create_tables()
