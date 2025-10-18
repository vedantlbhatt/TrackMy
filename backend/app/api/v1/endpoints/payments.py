from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.init_db import SessionLocal
from app.services.payment import PaymentService
from app.schemas.payment import PaymentIntentCreate, BountyClaimCreate, ClaimApproval
from sqlalchemy.sql import func

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/create-payment-intent")
def create_payment_intent(request: PaymentIntentCreate, db: Session = Depends(get_db)):
    """Create a Stripe payment intent for bounty payment"""
    return PaymentService.create_payment_intent(
        db=db,
        amount=request.amount,
        currency=request.currency,
        email=request.email,
        report_id=request.report_id
    )

@router.post("/confirm-payment")
def confirm_payment(payment_intent_id: str, db: Session = Depends(get_db)):
    """Confirm payment completion"""
    return PaymentService.confirm_payment(db=db, payment_intent_id=payment_intent_id)

@router.post("/create-bounty-claim")
def create_bounty_claim(request: BountyClaimCreate, db: Session = Depends(get_db)):
    """Create a bounty claim for a lost item"""
    return PaymentService.create_bounty_claim(
        db=db,
        report_id=request.report_id,
        finder_id=request.finder_id,
        claim_message=request.claim_message,
        contact_info=request.contact_info
    )

@router.post("/approve-claim/{claim_id}")
def approve_claim(claim_id: int, reviewer_id: int, db: Session = Depends(get_db)):
    """Approve a bounty claim"""
    return PaymentService.approve_bounty_claim(
        db=db,
        claim_id=claim_id,
        reviewer_id=reviewer_id
    )

@router.post("/reject-claim/{claim_id}")
def reject_claim(claim_id: int, reviewer_id: int, db: Session = Depends(get_db)):
    """Reject a bounty claim"""
    return PaymentService.reject_bounty_claim(
        db=db,
        claim_id=claim_id,
        reviewer_id=reviewer_id
    )

@router.get("/user-claims/{user_id}")
def get_user_claims(user_id: int, db: Session = Depends(get_db)):
    """Get all bounty claims made by a user"""
    return PaymentService.get_user_bounty_claims(db=db, user_id=user_id)

@router.get("/pending-claims/{user_id}")
def get_pending_claims(user_id: int, db: Session = Depends(get_db)):
    """Get pending claims for reports owned by user"""
    return PaymentService.get_pending_claims_for_reports(db=db, user_id=user_id)
