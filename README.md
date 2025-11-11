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

3. Start the server:
```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

## Features

- ChatGPT-like chat interface with message bubbles
- Left sidebar with conversation history
- Responsive design (mobile-friendly)
- FastAPI backend with placeholder endpoints
- CORS configured for frontend-backend communication

## API Endpoints

- `GET /health` - Health check
- `POST /api/chat` - Send chat message (placeholder)
- `GET /api/history` - Get conversation history (mock data)
- `POST /api/history` - Create new conversation (placeholder)

## API Documentation

Once the backend is running:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Development Notes

- The backend currently returns placeholder/mock data
- Frontend is fully functional and ready for backend integration
- Both projects have their own README files with detailed setup instructions

## Next Steps

- Implement actual AI logic in the backend
- Add database integration for conversation persistence
- Enhance UI/UX features
- Add authentication if needed
