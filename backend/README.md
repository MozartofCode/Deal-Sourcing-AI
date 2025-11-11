# Deal Sourcing AI - Backend

FastAPI backend for the Deal Sourcing AI application.

## Setup

1. Install dependencies directly:
```bash
pip install -r requirements.txt
```

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/chat` - Send a chat message (placeholder)
- `GET /api/history` - Get conversation history (mock data)
- `POST /api/history` - Create a new conversation (placeholder)

## API Documentation

Once the server is running, you can access:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Notes

This is a bare-bones implementation with placeholder endpoints. The actual AI logic and database integration should be implemented later.

