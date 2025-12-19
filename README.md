# Deal-Sourcing-AI

A ChatGPT-like interface for deal sourcing with React frontend and Python FastAPI backend.

## Project Structure

```
Deal-Sourcing-AI/
├── frontend/          # React + Vite frontend
├── backend/           # FastAPI backend
└── README.md
```

## Quick Start

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. **Get a Groq API key:**
   - Sign up at: https://console.groq.com/
   - Get your API key from: https://console.groq.com/keys
   - Create `.env` file in `backend` folder:
     ```env
     GROQ_API_KEY=your-groq-api-key-here
     ```

5. Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

## Features

- ChatGPT-like chat interface with message bubbles
- Left sidebar with conversation history
- Responsive design (mobile-friendly)
- FastAPI backend with Groq API integration
- Rate limiting (5 requests per user per hour)
- CORS configured for frontend-backend communication

## API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Send chat message (Groq-powered, rate limited)
- `GET /api/history` - Get conversation history (mock data)
- `POST /api/history` - Create new conversation (placeholder)

## Rate Limiting

- Each user can make **5 requests per hour** (based on IP address)
- Rate limit resets after 1 hour
- Response includes `remaining_requests` field

## API Documentation

Once the backend is running:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## 🚀 Deployment (FREE with Auto-Deploy!)

**Want to deploy for FREE with automatic updates?** Check out the comprehensive guide:

👉 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Step-by-step instructions for free deployment

### Quick Summary:
- **Frontend**: Deploy to [Vercel](https://vercel.com) (free, auto-deploys on push)
- **Backend**: Deploy to [Render.com](https://render.com) (free tier, auto-deploys on push)
- **AI**: Uses Groq API - fast inference with high-quality models!
- **Auto-Deploy**: Every `git push` automatically deploys your changes

### Why This Setup?
- ✅ **100% Free** (within generous limits)
- ✅ **Automatic deployments** on every push to GitHub
- ✅ **Secure** - API keys stored in platform secrets, never in code
- ✅ **Easy** - No credit card required, simple setup

See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for detailed instructions!

## Environment Variables

### Backend (.env)
- `GROQ_API_KEY` (required) - Your Groq API key from https://console.groq.com/keys
- `GROQ_MODEL` (optional, default: `llama-3.3-70b-versatile`) - Groq model to use
- `ALLOWED_ORIGINS` (optional) - Comma-separated CORS origins

### Frontend (.env)
- `VITE_API_URL` (optional) - Backend API URL (defaults to http://localhost:8000)

## Important Notes

- **Groq API**: Fast inference with high-quality models - get your API key at https://console.groq.com/keys
- **API Key**: Required - sign up at https://console.groq.com/ to get your free API key
- **Rate Limiting**: Users are limited to 5 requests per hour (per IP address)
- **CORS**: Update `ALLOWED_ORIGINS` in production to include your frontend URL
- **System Prompt**: The AI is configured as a professional VC analyst focused on innovative and profitable products
