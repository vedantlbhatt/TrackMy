# Vercel Deployment Guide

## Environment Variables Required

When deploying to Vercel, make sure to set these environment variables in your Vercel dashboard:

### Required Environment Variables:

1. **NEXT_PUBLIC_API_URL**
   - Value: `https://backend-production-df0a.up.railway.app`
   - Description: Backend API URL for production

2. **NEXT_PUBLIC_SUPABASE_URL**
   - Value: Your Supabase project URL
   - Description: Supabase project URL for authentication

3. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Value: Your Supabase anon key
   - Description: Supabase anonymous key for client-side auth

4. **NEXT_PUBLIC_GOOGLE_MAPS_API_KEY**
   - Value: Your Google Maps API key
   - Description: Google Maps API key for map functionality

5. **NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY**
   - Value: Your Stripe publishable key
   - Description: Stripe key for payment processing

## How to Set Environment Variables in Vercel:

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each variable with the values above
5. Redeploy your project

## Testing the Deployment:

1. Visit your Vercel deployment URL
2. Go to `/api-test` to test API connectivity
3. Check browser console for any errors
4. Verify that reports load on the home page

## Troubleshooting:

- If you see "API key error", check that `NEXT_PUBLIC_API_URL` is set correctly
- If maps don't load, verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- If authentication fails, check Supabase credentials
- Check browser console for detailed error messages

## Current Configuration:

The app is configured to:
- Use Railway backend in production: `https://backend-production-df0a.up.railway.app`
- Use localhost in development: `http://localhost:8000`
- Automatically detect environment and use appropriate API URL
