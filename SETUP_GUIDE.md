# Setup Guide - What You Need to Do

## ✅ What's Already Done

1. ✅ OpenAI integration in backend
2. ✅ Rate limiting (5 requests per user per hour)
3. ✅ System prompt configured as VC analyst
4. ✅ Environment variable support
5. ✅ Deployment configuration files
6. ✅ CORS setup for production

## 🔧 What You Need to Do

### 1. Add OpenAI API Key (REQUIRED)

**Location:** `backend/.env` file

1. Create a file called `.env` in the `backend/` directory
2. Copy the content from `backend/.env.example`
3. Replace `your_openai_api_key_here` with your actual OpenAI API key:

```
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**How to get your API key:**
- Go to https://platform.openai.com/api-keys
- Sign up or log in
- Click "Create new secret key"
- Copy the key and paste it in your `.env` file

### 2. For Local Development

**Backend:**
```bash
cd backend
pip install -r requirements.txt
# Create .env file with your OPENAI_API_KEY
uvicorn app.main:app --reload --port 8000
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 3. For Production Deployment

#### Frontend (Vercel):
1. Push code to GitHub
2. Go to vercel.com → Import repository
3. Set Root Directory to `frontend`
4. Add environment variable:
   - `VITE_API_URL` = your backend URL (e.g., `https://your-backend.railway.app`)

#### Backend (Railway or Render):
1. Push code to GitHub
2. Create new project on Railway.app or Render.com
3. Connect GitHub repository
4. Set Root Directory to `backend`
5. Add environment variables:
   - `OPENAI_API_KEY` = your OpenAI API key
   - `ALLOWED_ORIGINS` = your frontend URL (e.g., `https://your-frontend.vercel.app`)

## 📝 Files You Need to Create/Edit

### Must Create:
- `backend/.env` - Add your OpenAI API key here

### Optional (for production):
- `frontend/.env` - Only if you want to override the default API URL

## 🎯 System Prompt

The AI is configured with this system prompt:
> "You are a professional VC analyst who loves looking into innovative and profitable products. You help evaluate startups, analyze market opportunities, assess business models, and provide insights on investment potential. Be concise, data-driven, and focus on actionable insights. Always consider market size, competitive landscape, and scalability."

This is set in: `backend/app/services/openai_service.py`

## ⚠️ Rate Limiting

- **5 requests per user per hour** (based on IP address)
- Rate limit resets after 1 hour
- Users will get a 429 error if they exceed the limit
- Response includes `remaining_requests` count

## 🔍 Testing

1. Start backend: `cd backend && uvicorn app.main:app --reload --port 8000`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Send a message - it should use OpenAI API!

## 📦 Deployment Files Created

- `frontend/vercel.json` - Vercel configuration
- `backend/railway.json` - Railway configuration
- `backend/Procfile` - For Render/Heroku
- `backend/runtime.txt` - Python version

All set! Just add your OpenAI API key and you're ready to go! 🚀

