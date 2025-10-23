# Supabase Authentication Setup

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in to your account
3. Click "New Project"
4. Choose your organization
5. Enter project details:
   - Name: `trackmy-auth`
   - Database Password: (generate a strong password)
   - Region: Choose closest to your users
6. Click "Create new project"

## 2. Get Your Project Credentials

1. In your Supabase dashboard, go to Settings > API
2. Copy the following values:
   - Project URL
   - Anon public key

## 3. Update Environment Variables

Update your `.env.local` file with your Supabase credentials:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. Set Up Database Schema (Optional)

If you want to store additional user profile data, run this SQL in your Supabase SQL editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  user_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
```

## 5. Configure Authentication Settings

1. Go to Authentication > Settings in your Supabase dashboard
2. Configure the following:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/**`
   - Email confirmation: Enable if desired
   - Password requirements: Set as needed

## 6. Test the Integration

1. Start your development servers:
   ```bash
   # Backend
   cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   
   # Frontend
   cd web-app && npm run dev
   ```

2. Visit `http://localhost:3000`
3. Try signing up with a new account
4. Check your Supabase dashboard to see the new user

## Features Included

- ✅ User registration with email/password
- ✅ User login with email/password
- ✅ Secure session management
- ✅ Automatic logout on token expiry
- ✅ Protected routes
- ✅ User profile management
- ✅ Real-time auth state updates

## Security Benefits

- 🔒 Secure password hashing (bcrypt)
- 🔒 JWT tokens with automatic refresh
- 🔒 Row Level Security (RLS) for data protection
- 🔒 Email verification (optional)
- 🔒 Rate limiting and abuse protection
- 🔒 GDPR compliant data handling


