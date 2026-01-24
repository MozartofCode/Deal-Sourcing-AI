# Environment Variables Setup Guide

## Backend (Render)

Set these environment variables in your Render dashboard:

### Required Variables

1. **SUPABASE_URL**
   - Value: `https://glyxhlhiomqlluxmwryb.supabase.co`
   - Description: Your Supabase project URL

2. **SUPABASE_SERVICE_ROLE_KEY**
   - Value: `<YOUR_SUPABASE_SERVICE_ROLE_KEY>`
   - Description: Supabase service role key for backend operations

3. **JWT_SECRET_KEY**
   - Value: `<YOUR_JWT_SECRET_KEY>`
   - Description: Secret key for JWT token generation

4. **GROQ_API_KEY**
   - Value: `<YOUR_GROQ_API_KEY>`
   - Description: API key for Groq AI service

5. **ALLOWED_ORIGINS**
   - Value: `https://deal-sourcing-ai.vercel.app`
   - Description: Allowed CORS origins (your frontend URL)

## Frontend (Vercel)

Set these environment variables in your Vercel project settings:

### Required Variables

1. **VITE_API_URL**
   - Value: `https://deal-sourcing-ai-backend.onrender.com/api`
   - Description: Backend API URL (IMPORTANT: Must include `/api` at the end)

## How to Set Environment Variables

### On Render:
1. Go to https://dashboard.render.com
2. Select your `deal-sourcing-ai-backend` service
3. Click on "Environment" in the left sidebar
4. Click "Add Environment Variable"
5. Add each variable listed above
6. Click "Save Changes"
7. The service will automatically redeploy

### On Vercel:
1. Go to https://vercel.com/dashboard
2. Select your `deal-sourcing-ai` project
3. Go to "Settings" → "Environment Variables"
4. Add the `VITE_API_URL` variable
5. Make sure it's available for all environments (Production, Preview, Development)
6. Click "Save"
7. Redeploy your application

## Verification

After setting all environment variables and redeploying:

1. **Check Backend Health**:
   - Visit: `https://deal-sourcing-ai-backend.onrender.com/health`
   - Should return: `{"status": "healthy", "database": "connected"}`

2. **Check Frontend**:
   - Visit: `https://deal-sourcing-ai.vercel.app`
   - Try to register a new account
   - Try to login with existing credentials

## Troubleshooting

If you still see 404 errors:

1. **Verify the API URL in browser console**:
   - Open browser DevTools (F12)
   - Go to Network tab
   - Try to login/register
   - Check the request URL - it should be: `https://deal-sourcing-ai-backend.onrender.com/api/auth/login` or `/api/auth/register`

2. **Check Render logs**:
   - Go to your Render dashboard
   - Click on your service
   - Click "Logs" to see if there are any errors

3. **Verify Supabase connection**:
   - Check the `/health` endpoint
   - If database shows "disconnected", verify your Supabase credentials

## API Endpoints

Your backend exposes these authentication endpoints:

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login existing user
- `GET /api/auth/me` - Get current user info (requires authentication)

All endpoints are prefixed with `/api` as configured in `backend/app/main.py`.
