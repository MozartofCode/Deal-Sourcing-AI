# Deal Sourcing AI - Backend

FastAPI backend for the Deal Sourcing AI application with OpenAI integration.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the backend directory:
```bash
cp .env.example .env
```

3. Add your OpenAI API key to `.env`:
```
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/chat` - Send a chat message (OpenAI-powered, rate limited to 5 requests per user per hour)
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

- `OPENAI_API_KEY` (required) - Your OpenAI API key
- `ALLOWED_ORIGINS` (optional) - Comma-separated list of allowed CORS origins

## Deployment

See deployment instructions in the main README.md

