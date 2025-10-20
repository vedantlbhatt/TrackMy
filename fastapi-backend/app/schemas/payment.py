from pydantic import BaseModel
from typing import Optional
from decimal import Decimal

class PaymentIntentCreate(BaseModel):
    amount: float
    currency: str = "usd"
    email: str
    report_id: int

class BountyClaimCreate(BaseModel):
    report_id: int
    finder_id: int
    claim_message: str
    contact_info: str

class ClaimApproval(BaseModel):
    claim_id: int
    reviewer_id: int
    approved: bool

class PaymentTransactionResponse(BaseModel):
    transaction_id: int
    amount: Decimal
    currency: str
    status: str
    created_at: str
    
    class Config:
        from_attributes = True

class BountyClaimResponse(BaseModel):
    claim_id: int
    report_id: int
    finder_id: int
    claim_message: str
    contact_info: str
    status: str
    created_at: str
    
    class Config:
        from_attributes = True
