from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.core.database import Base

class Item(Base):
    __tablename__ = "items"
    item_id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    
    user = relationship("User", back_populates="items")
    image = relationship("Image", back_populates="item", uselist=True)
    lost_reports = relationship("LostReport", back_populates= "item")
    found_reports = relationship("FoundReport", back_populates = "item")    