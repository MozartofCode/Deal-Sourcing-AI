# Supabase Setup Guide

## Step 1: Create Supabase Account

1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub (recommended) or email
4. Create a new project

## Step 2: Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (SUPABASE_URL)
   - **service_role key** (SUPABASE_SERVICE_ROLE_KEY) - ⚠️ Keep this secret!

## Step 3: Set Up Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Open the file `database_schema.sql` from this project
3. Copy and paste the entire SQL into the SQL Editor
4. Click **Run** to execute

This will create:
- `users` table
- `portfolios` table
- `conversations` table
- `messages` table
- Indexes for performance
- Row Level Security policies

## Step 4: Configure Environment Variables

1. In your `backend` directory, create or update `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Secret (generate a random string)
JWT_SECRET_KEY=your-random-secret-key-change-this-in-production

# OpenAI (existing)
OPENAI_API_KEY=your-openai-key

# CORS (existing)
ALLOWED_ORIGINS=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# On Linux/Mac:
openssl rand -hex 32

# Or use any random string generator
```

## Step 5: Install Dependencies

```bash
cd backend
pip install -r requirements.txt
```

## Step 6: Test the Setup

1. Start your backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

2. Test the health endpoint:
```bash
curl http://localhost:8000/health
```

3. Test registration (you'll need to use the frontend or Postman):
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "testpassword123",
    "name": "Test User"
  }'
```

## Troubleshooting

### "Supabase credentials not configured"
- Make sure `.env` file exists in `backend` directory
- Check that `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set correctly
- Restart your server after changing `.env`

### "Table does not exist"
- Make sure you ran the SQL schema in Supabase SQL Editor
- Check that tables were created in Supabase dashboard → Table Editor

### "Invalid authentication credentials"
- Check that JWT_SECRET_KEY is set in `.env`
- Make sure you're sending the token in the Authorization header: `Bearer <token>`

## Free Tier Limits

Supabase free tier includes:
- ✅ 500MB database storage
- ✅ 2GB bandwidth
- ✅ Unlimited API requests
- ✅ Perfect for MVP/development

This is more than enough for getting started!

