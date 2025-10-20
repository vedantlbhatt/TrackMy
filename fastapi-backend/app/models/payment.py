from sqlalchemy import Column, Integer, String, ForeignKey, DECIMAL, DateTime, Boolean, Text
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime
from sqlalchemy.sql import func

class PaymentTransaction(Base):
    __tablename__ = "payment_transactions"
    
    transaction_id = Column(Integer, primary_key=True, index=True, nullable=False)
    lost_report_id = Column(Integer, ForeignKey("lost_reports.lost_report_id"), nullable=False)
    payer_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)  # User who lost the item
    payee_id = Column(Integer, ForeignKey("users.user_id"), nullable=True)   # User who found the item
    amount = Column(DECIMAL(10,2), nullable=False)
    currency = Column(String(3), default='USD', nullable=False)
    status = Column(String(20), default='pending', nullable=False)  # pending, completed, failed, refunded
    stripe_payment_intent_id = Column(String(255), nullable=True)
    stripe_transfer_id = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=func.now())
    completed_at = Column(DateTime, nullable=True)
    
    # Relationships
    lost_report = relationship("LostReport", back_populates="payment_transactions")
    payer = relationship("User", foreign_keys=[payer_id], back_populates="paid_transactions")
    payee = relationship("User", foreign_keys=[payee_id], back_populates="received_transactions")

class BountyClaim(Base):
    __tablename__ = "bounty_claims"
    
    claim_id = Column(Integer, primary_key=True, index=True, nullable=False)
    lost_report_id = Column(Integer, ForeignKey("lost_reports.lost_report_id"), nullable=False)
    finder_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    claim_message = Column(Text, nullable=False)
    contact_info = Column(String(255), nullable=False)
    status = Column(String(20), default='pending', nullable=False)  # pending, approved, rejected
    created_at = Column(DateTime, default=func.now())
    reviewed_at = Column(DateTime, nullable=True)
    reviewed_by = Column(Integer, ForeignKey("users.user_id"), nullable=True)
    
    # Relationships
    lost_report = relationship("LostReport", back_populates="bounty_claims")
    finder = relationship("User", foreign_keys=[finder_id], back_populates="bounty_claims")
    reviewer = relationship("User", foreign_keys=[reviewed_by], back_populates="reviewed_claims")
