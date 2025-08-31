from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, VARCHAR, Float
from sqlalchemy.orm import relationship
from app.core.database import Base

class FoundReport(Base):
    __tablename__ = "found_reports"
    found_report_id = Column(Integer, primary_key = True, index = True, nullable = False)
    founder_id = Column(Integer, ForeignKey("users.user_id"), index = True, nullable = False) # tracks person who found the item
    found_item_id = Column(Integer, ForeignKey("items.item_id"), index = True, nullable = False)
    found_report_description = Column(VARCHAR(1000), nullable = True)
    longitude = Column(Float, nullable=True)
    latitude = Column(Float, nullable=True)
    radius = Column(Integer, nullable = True)
    request_bounty = Column(DECIMAL(6,2), nullable = True) # case where item is found before report and founder asks for bounty
    
    user = relationship("User", back_populates="found_reports")
    item = relationship("Item", back_populates="found_reports")
    founder = relationship("User", back_populates="found_reports") # reference to user who found the item
    #images = relationship("Image", back_populates="found_report") # if we want to add images in future