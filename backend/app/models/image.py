from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Image(Base):
    __tablename__ = "images"
    image_id = Column(Integer, primary_key=True, index=True)
    url = Column(String(255), nullable=False)
    item_id = Column(Integer, ForeignKey("items.item_id"), unique=True, nullable=False)

    item = relationship("Item", back_populates="image")