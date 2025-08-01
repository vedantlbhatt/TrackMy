from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, VARCHAR
from sqlalchemy.orm import relationship
from app.core.database import Base

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
    lost_item_id = Column(Integer, ForeignKey("items.item_id"), index = True, nullable = False)
    lost_report_description = Column(VARCHAR(1000), nullable = True)
    longitude = Column(DECIMAL(8,6), nullable = True)
    latitude = Column(DECIMAL(9,6), nullable = True)
    radius = Column(Integer, nullable = True)
    bounty = Column(DECIMAL(6,2), nullable = True)
    
    
    item = relationship("Item", back_populates="lost_reports")
