from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.core.database import Base

class User(Base):
    __tablename__ = "users"
    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    user_name = Column(String(255), nullable=False)
    payment_source = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable = False)
    
    items = relationship("Item", back_populates="user")
