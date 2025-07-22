from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Embed(Base):
    __tablename__ = "embeddings"
    image_id = Column(Integer, ForeignKey("images.image_id"), index=True)
    item_id = Column(Integer, ForeignKey("items.item_id"), unique=True, nullable=False)
    embed_id = Column(Integer, primary_key=True, index=True)
    
    image = relationship("Image", back_populates="embed")
    # Currently flow goes Item->Image->Embedding