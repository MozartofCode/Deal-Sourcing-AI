# Deal Sourcing AI - Backend

FastAPI backend for the Deal Sourcing AI application with Groq API integration.

## Setup

1. **Get a Groq API key:**
   - Sign up at: https://console.groq.com/
   - Get your API key from: https://console.groq.com/keys
   - Add to `.env`: `GROQ_API_KEY=your-groq-api-key-here`

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Create a `.env` file in the backend directory:
```env
# Groq API Configuration (required)
GROQ_API_KEY=your-groq-api-key-here

# Optional: Customize Groq model (default: llama-3.3-70b-versatile)
GROQ_MODEL=llama-3.3-70b-versatile

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:3000
```

**Note**: Groq API provides fast inference with high-quality models!

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/chat` - Send a chat message (Groq-powered, rate limited to 5 requests per user per hour)
- `GET /api/history` - Get conversation history (mock data)
- `POST /api/history` - Create a new conversation (placeholder)

## Rate Limiting

- Each user (identified by IP address) can make **5 requests per hour**
- Rate limit resets after 1 hour
- Response includes `remaining_requests` field

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `GROQ_API_KEY` (required) - Your Groq API key from https://console.groq.com/keys
- `GROQ_MODEL` (optional, default: `llama-3.3-70b-versatile`) - Groq model to use
- `ALLOWED_ORIGINS` (optional) - Comma-separated list of allowed CORS origins

## Deployment

See deployment instructions in the main README.md
