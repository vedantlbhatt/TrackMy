# Payment Integration Setup Guide

This guide will help you set up the payment system for your Track My app, enabling users to place bounties on lost items and claim rewards when returning them.

## Prerequisites

1. **Stripe Account**: Sign up at [stripe.com](https://stripe.com)
2. **Stripe API Keys**: Get your publishable and secret keys from the Stripe dashboard

## Backend Setup

### 1. Install Dependencies

Add Stripe to your backend requirements:

```bash
cd backend
pip install stripe
```

### 2. Environment Variables

Add these to your backend environment variables:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
```

### 3. Database Migration

Run the database migration to create payment tables:

```bash
cd backend
alembic upgrade head
```

### 4. Update Backend Dependencies

Make sure to import the new models in your `__init__.py` files:

```python
# In backend/app/models/__init__.py
from .payment import PaymentTransaction, BountyClaim
```

## Frontend Setup

### 1. Install Stripe React Native

The Stripe React Native package is already installed. If you need to reinstall:

```bash
cd mobile/react-native-app
npm install @stripe/stripe-react-native
```

### 2. iOS Configuration

For iOS, add the following to your `ios/Track My/Info.plist`:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>This app needs location access to show lost items on the map</string>
```

### 3. Android Configuration

For Android, add to your `android/app/src/main/AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
```

## Stripe Configuration

### 1. Webhook Setup

Set up webhooks in your Stripe dashboard to handle payment events:

- **Endpoint URL**: `https://your-backend-url.com/webhooks/stripe`
- **Events to send**:
  - `payment_intent.succeeded`
  - `payment_intent.payment_failed`
  - `transfer.created`
  - `transfer.failed`

### 2. Test Cards

Use these test card numbers for development:

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **3D Secure**: 4000 0025 0000 3155

## Payment Flow

### 1. Bounty Placement Flow

1. User creates lost report with bounty amount
2. If bounty > 0, payment modal appears
3. User enters payment details
4. Stripe processes payment
5. Payment is held in escrow
6. Report is published with bounty

### 2. Bounty Claiming Flow

1. Finder submits bounty claim
2. Item owner receives notification
3. Owner verifies the claim
4. If approved, payment is transferred to finder
5. Both parties receive confirmation

## API Endpoints

### Payment Endpoints

- `POST /create-payment-intent` - Create payment intent for bounty
- `POST /confirm-payment` - Confirm payment completion
- `POST /create-bounty-claim` - Submit bounty claim
- `POST /approve-claim/{claim_id}` - Approve bounty claim
- `POST /reject-claim/{claim_id}` - Reject bounty claim
- `GET /user-claims/{user_id}` - Get user's bounty claims
- `GET /pending-claims/{user_id}` - Get pending claims for user's reports

## Security Considerations

1. **Never store card details** - Use Stripe tokens
2. **Validate payments server-side** - Don't trust client-side validation
3. **Use HTTPS** - All payment data must be encrypted
4. **Implement rate limiting** - Prevent abuse
5. **Log all transactions** - For auditing and debugging

## Testing

### 1. Test Payment Flow

1. Create a test lost report with bounty
2. Use test card numbers
3. Verify payment intent creation
4. Test payment completion

### 2. Test Claim Flow

1. Submit a bounty claim
2. Approve/reject the claim
3. Verify payment transfer
4. Check transaction status

## Production Deployment

### 1. Switch to Live Keys

Replace test keys with live keys:

```env
STRIPE_SECRET_KEY=sk_live_your_live_secret_key
STRIPE_PUBLISHABLE_KEY=pk_live_your_live_publishable_key
```

### 2. Update Webhook URLs

Point webhooks to your production backend URL.

### 3. Enable Required Features

- Connect accounts for payouts
- Enable international payments if needed
- Set up proper error handling

## Monitoring

### 1. Stripe Dashboard

Monitor payments, disputes, and transfers in the Stripe dashboard.

### 2. Application Logs

Log all payment-related events for debugging.

### 3. Error Handling

Implement proper error handling for:
- Payment failures
- Network issues
- Invalid card details
- Insufficient funds

## Support

For issues with:
- **Stripe Integration**: Check Stripe documentation
- **React Native**: Check @stripe/stripe-react-native docs
- **Backend Issues**: Check FastAPI and SQLAlchemy logs

## Cost Structure

- **Stripe Fees**: 2.9% + $0.30 per transaction
- **International**: Additional fees for international cards
- **Refunds**: No additional fees for refunds

Consider these costs when setting bounty amounts and pricing.
