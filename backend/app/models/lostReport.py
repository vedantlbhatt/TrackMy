from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, VARCHAR, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
from sqlalchemy.sql import func

#create a view that joins item, lostReport, image (maybe image embedding) for easier access later amundo!
#*
#current structure is like 
#                                          /--reference to user who lost item
#              /-- reference to lost item --
# lostReport --                           \-- reference to image/images associated with lost item
#              \--

class LostReport(Base):
    __tablename__ = "lost_reports"
    lost_report_id = Column(Integer, primary_key = True, index = True, nullable = False)
    lost_item_id = Column(Integer, ForeignKey("items.item_id"), index = True, nullable = False) # rename to item_id
    user_id = Column(Integer, ForeignKey("users.user_id"), index = True, nullable = False) # reference to user who lost the item
    title = Column(String(255), nullable = False) 
    lost_report_description = Column(VARCHAR(1000), nullable = True) # rename to description
    longitude = Column(DECIMAL(8,6), nullable = True)
    latitude = Column(DECIMAL(9,6), nullable = True)
    radius = Column(Integer, nullable = True)
    bounty = Column(DECIMAL(6,2), nullable = True)
    created_at = Column(DateTime, default=func.now()) 
    
    
    item = relationship("Item", back_populates="lost_reports")
    user = relationship("User", back_populates="lost_reports") # reference to user who lost the item
