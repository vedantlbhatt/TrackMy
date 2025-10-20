import stripe
import os
from sqlalchemy.orm import Session
from app.models.payment import PaymentTransaction, BountyClaim
from app.models.lostReport import LostReport
from app.models.user import User
from fastapi import HTTPException, status
from decimal import Decimal

# Initialize Stripe
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

class PaymentService:
    
    @staticmethod
    def create_payment_intent(db: Session, amount: float, currency: str, email: str, report_id: int):
        """Create a Stripe payment intent for bounty payment"""
        try:
            # Create payment intent with Stripe
            intent = stripe.PaymentIntent.create(
                amount=int(amount * 100),  # Convert to cents
                currency=currency,
                metadata={
                    'report_id': str(report_id),
                    'email': email,
                    'type': 'bounty_payment'
                }
            )
            
            # Store transaction in database
            transaction = PaymentTransaction(
                lost_report_id=report_id,
                payer_id=db.query(LostReport).filter(LostReport.lost_report_id == report_id).first().user_id,
                amount=Decimal(str(amount)),
                currency=currency,
                stripe_payment_intent_id=intent.id,
                status='pending'
            )
            
            db.add(transaction)
            db.commit()
            db.refresh(transaction)
            
            return {
                'client_secret': intent.client_secret,
                'transaction_id': transaction.transaction_id
            }
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create payment intent: {str(e)}"
            )
    
    @staticmethod
    def confirm_payment(db: Session, payment_intent_id: str):
        """Confirm payment and update transaction status"""
        try:
            # Retrieve payment intent from Stripe
            intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            
            if intent.status == 'succeeded':
                # Update transaction status
                transaction = db.query(PaymentTransaction).filter(
                    PaymentTransaction.stripe_payment_intent_id == payment_intent_id
                ).first()
                
                if transaction:
                    transaction.status = 'completed'
                    db.commit()
                    return {'status': 'success', 'transaction_id': transaction.transaction_id}
                else:
                    raise HTTPException(
                        status_code=status.HTTP_404_NOT_FOUND,
                        detail="Transaction not found"
                    )
            else:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Payment not successful. Status: {intent.status}"
                )
                
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to confirm payment: {str(e)}"
            )
    
    @staticmethod
    def create_bounty_claim(db: Session, report_id: int, finder_id: int, claim_message: str, contact_info: str):
        """Create a bounty claim"""
        try:
            # Check if report exists and has bounty
            report = db.query(LostReport).filter(LostReport.lost_report_id == report_id).first()
            if not report:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Report not found"
                )
            
            if not report.bounty or report.bounty <= 0:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="This report has no bounty"
                )
            
            # Create bounty claim
            claim = BountyClaim(
                lost_report_id=report_id,
                finder_id=finder_id,
                claim_message=claim_message,
                contact_info=contact_info,
                status='pending'
            )
            
            db.add(claim)
            db.commit()
            db.refresh(claim)
            
            return claim
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to create bounty claim: {str(e)}"
            )
    
    @staticmethod
    def approve_bounty_claim(db: Session, claim_id: int, reviewer_id: int):
        """Approve a bounty claim and process payment"""
        try:
            claim = db.query(BountyClaim).filter(BountyClaim.claim_id == claim_id).first()
            if not claim:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Claim not found"
                )
            
            if claim.status != 'pending':
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Claim has already been processed"
                )
            
            # Update claim status
            claim.status = 'approved'
            claim.reviewed_by = reviewer_id
            claim.reviewed_at = db.query(func.now()).scalar()
            
            # Find the payment transaction for this report
            transaction = db.query(PaymentTransaction).filter(
                PaymentTransaction.lost_report_id == claim.lost_report_id,
                PaymentTransaction.status == 'completed'
            ).first()
            
            if transaction:
                # Update transaction with payee
                transaction.payee_id = claim.finder_id
                transaction.status = 'completed'
                
                # Here you would typically create a transfer to the finder's account
                # For now, we'll just mark it as ready for transfer
                
            db.commit()
            
            return claim
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to approve claim: {str(e)}"
            )
    
    @staticmethod
    def reject_bounty_claim(db: Session, claim_id: int, reviewer_id: int):
        """Reject a bounty claim"""
        try:
            claim = db.query(BountyClaim).filter(BountyClaim.claim_id == claim_id).first()
            if not claim:
                raise HTTPException(
                    status_code=status.HTTP_404_NOT_FOUND,
                    detail="Claim not found"
                )
            
            claim.status = 'rejected'
            claim.reviewed_by = reviewer_id
            claim.reviewed_at = db.query(func.now()).scalar()
            
            db.commit()
            
            return claim
            
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to reject claim: {str(e)}"
            )
    
    @staticmethod
    def get_user_bounty_claims(db: Session, user_id: int):
        """Get all bounty claims for a user"""
        return db.query(BountyClaim).filter(BountyClaim.finder_id == user_id).all()
    
    @staticmethod
    def get_pending_claims_for_reports(db: Session, user_id: int):
        """Get pending claims for reports owned by user"""
        return db.query(BountyClaim).join(LostReport).filter(
            LostReport.user_id == user_id,
            BountyClaim.status == 'pending'
        ).all()
