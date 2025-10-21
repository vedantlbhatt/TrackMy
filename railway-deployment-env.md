# Railway Deployment Environment Variables

## 🚫 DO NOT USE YOUR LOCAL .env FILES FOR PRODUCTION

Your local `.env` and `web-app/.env.local` files contain development settings and should **NEVER** be used in production.

## ✅ Railway + Supabase Setup (No Migration!)

You're deploying your **FastAPI backend to Railway** while keeping your **existing Supabase database**. This is the perfect setup!

## 🔧 Backend Service Variables (Railway):

### Database Variables (copy from your Supabase dashboard):
```bash
# Supabase Database Connection (your existing database - no changes needed!)
POSTGRES_HOST=db.zfrqgpyspgmuzpxijmhh.supabase.co
POSTGRES_PORT=6543
POSTGRES_DB=postgres
POSTGRES_USER=postgres.zfrqgpyspgmuzpxijmhh
POSTGRES_PASSWORD=your-supabase-database-password

# Security (generate new for production)
SECRET_KEY=your-super-secure-production-secret-key

# Supabase API (if your code uses Supabase features)
SUPABASE_URL=https://zfrqgpyspgmuzpxijmhh.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
```

## 🌐 Web App Service Variables (Railway):

### Frontend Configuration:
```bash
# Point to your Railway backend (not localhost!)
NEXT_PUBLIC_API_URL=https://your-backend-service.railway.app

# External Services (keep your existing keys)
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-publishable-key
```

## 📋 How to Set Variables in Railway:

1. **Go to [railway.app](https://railway.app)**
2. **Open your project**
3. **Go to your service settings** (backend service)
4. **Click "Variables" tab**
5. **Add each variable above**

## ⚠️ Important Security Notes:

- **Generate a new SECRET_KEY** for production: `openssl rand -hex 32`
- **Copy exact values from your Supabase dashboard**
- **Never commit .env files** to version control
- **Keep your existing Supabase database** - no migration needed!

## 🚀 Current Status:

✅ **Supabase database stays exactly as it is**
✅ **FastAPI backend deploys to Railway**
✅ **No data migration or schema changes**
❌ **Just need to set environment variables in Railway**

## 📋 Get Your Supabase Values:

1. **Go to [supabase.com](https://supabase.com)**
2. **Open your project dashboard**
3. **Go to Settings → Database**
4. **Copy the connection string values** to use in Railway variables above
