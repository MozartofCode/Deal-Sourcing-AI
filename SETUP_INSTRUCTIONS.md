# Complete Setup Instructions

## ✅ What's Been Implemented

1. **Supabase Database Integration** - PostgreSQL database connection
2. **User Authentication API** - Register, Login, JWT tokens
3. **Portfolio CRUD API** - Full CRUD operations for portfolio management
4. **Updated Conversation History** - Now uses real database
5. **Frontend Authentication** - Login page and auth context
6. **Frontend Portfolio Integration** - Connected to real APIs

## 🚀 Setup Steps

### 1. Create Supabase Account & Project

1. Go to https://supabase.com
2. Sign up (free account is perfect)
3. Create a new project
4. Wait for project to be ready (~2 minutes)

### 2. Get Supabase Credentials

1. In Supabase dashboard → **Settings** → **API**
2. Copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **service_role key** (the secret one, not the anon key)

### 3. Set Up Database Schema

1. In Supabase dashboard → **SQL Editor**
2. Open `backend/database_schema.sql` from this project
3. Copy the entire SQL content
4. Paste into SQL Editor
5. Click **Run** (or press Ctrl+Enter)

This creates all necessary tables:
- `users` - User accounts
- `portfolios` - Saved startups
- `conversations` - Chat conversations
- `messages` - Chat messages

### 4. Configure Backend Environment

1. In `backend` directory, create/update `.env` file:

```env
# Supabase Configuration
SUPABASE_URL=https://your-project-id.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# JWT Secret (generate a random string)
JWT_SECRET_KEY=your-random-secret-key-min-32-characters

# OpenAI (existing)
OPENAI_API_KEY=your-openai-key

# CORS
ALLOWED_ORIGINS=http://localhost:3000
```

**Generate JWT Secret:**
```bash
# Linux/Mac:
openssl rand -hex 32

# Or use: https://randomkeygen.com/
```

### 5. Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 6. Start Backend Server

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000
```

### 7. Start Frontend

```bash
cd frontend
npm install  # If you haven't already
npm run dev
```

### 8. Test the Setup

1. Open http://localhost:3000
2. Click **Login** in navigation
3. Click **Sign up** to create an account
4. Enter email, password, and name
5. You should be logged in automatically
6. Go to **My Portfolio** page
7. Click **+ Add Startup** to test portfolio functionality

## 🧪 API Testing

You can test the APIs using:

### Swagger UI (Recommended)
- Go to: http://localhost:8000/docs
- Interactive API documentation
- Test endpoints directly

### Or use curl:

**Register:**
```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }'
```

**Get Portfolio (requires token):**
```bash
curl http://localhost:8000/api/portfolio \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## 📁 Project Structure

```
backend/
├── app/
│   ├── database.py          # Supabase connection
│   ├── models.py            # Pydantic models
│   ├── main.py              # FastAPI app
│   ├── routes/
│   │   ├── auth.py          # Authentication endpoints
│   │   ├── portfolio.py     # Portfolio CRUD endpoints
│   │   ├── chat.py          # Chat endpoints
│   │   ├── history.py       # Conversation history
│   │   └── startups.py      # Startup search/analysis
│   ├── services/
│   │   └── auth_service.py # Auth utilities
│   └── middleware/
│       └── auth_middleware.py
├── database_schema.sql       # Database schema
└── requirements.txt         # Python dependencies

frontend/
├── src/
│   ├── components/
│   │   ├── AuthContext.jsx  # Auth state management
│   │   └── Navigation.jsx   # Updated with auth
│   ├── pages/
│   │   ├── Login.jsx        # Login/Register page
│   │   └── Portfolio.jsx   # Updated with real API
│   └── services/
│       └── api.js           # API client with auth
```

## 🔒 Security Notes

- **JWT_SECRET_KEY**: Use a strong random string (32+ characters)
- **SUPABASE_SERVICE_ROLE_KEY**: Keep this secret! Never commit to git
- Passwords are hashed with bcrypt before storage
- JWT tokens expire after 7 days
- All portfolio/conversation data is user-scoped

## 🐛 Troubleshooting

### "Supabase credentials not configured"
- Check `.env` file exists in `backend` directory
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set
- Restart backend server after changing `.env`

### "Table does not exist"
- Make sure you ran `database_schema.sql` in Supabase SQL Editor
- Check Supabase dashboard → Table Editor to see if tables exist

### "Invalid authentication credentials"
- Check JWT_SECRET_KEY is set in `.env`
- Make sure token is sent as: `Authorization: Bearer <token>`
- Token might be expired (7 days)

### Frontend can't connect to backend
- Check backend is running on port 8000
- Check `VITE_API_URL` in frontend `.env` (if using)
- Check CORS settings in `backend/app/main.py`

## ✅ What Works Now

- ✅ User registration and login
- ✅ JWT-based authentication
- ✅ Add startups to portfolio
- ✅ View portfolio with real data
- ✅ Update startup status
- ✅ Delete startups from portfolio
- ✅ Portfolio statistics
- ✅ Conversation history (database-backed)
- ✅ Protected routes (require authentication)

## 🎯 Next Steps (Optional)

- Add password reset functionality
- Add email verification
- Implement file uploads for documents
- Add export functionality (CSV/PDF)
- Add sharing/collaboration features

## 💡 Free Tier Limits

Supabase free tier includes:
- 500MB database (plenty for MVP)
- 2GB bandwidth
- Unlimited API requests
- Perfect for development and small production use

You're all set! 🎉

