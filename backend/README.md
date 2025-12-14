# Deal Sourcing AI - Backend

FastAPI backend for the Deal Sourcing AI application with Ollama (free, local AI) integration.

## Setup

1. **No installation needed!** The app uses Hugging Face Inference API by default (free, cloud-based, no disk space required).

2. (Optional) Get a free Hugging Face API key for better performance:
   - Sign up at: https://huggingface.co/join
   - Get your token at: https://huggingface.co/settings/tokens
   - Add to `.env`: `HF_API_KEY=your-token-here`

3. Install Python dependencies:
```bash
pip install -r requirements.txt
```

4. (Optional) Create a `.env` file in the backend directory to customize:
```env
# Use Hugging Face (default, no installation needed)
AI_PROVIDER=huggingface
HF_API_URL=https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2
HF_API_KEY=your-huggingface-token-here  # Optional but recommended

# OR use Ollama (if you have it installed locally)
# AI_PROVIDER=ollama
# OLLAMA_BASE_URL=http://localhost:11434
# OLLAMA_MODEL=llama3.2
```

**Note**: Hugging Face is free and requires no installation or disk space!

## Running the Server

Start the development server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /api/chat` - Send a chat message (Hugging Face-powered, rate limited to 5 requests per user per hour)
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

- `AI_PROVIDER` (optional, default: `huggingface`) - Choose "huggingface" or "ollama"
- `HF_API_URL` (optional) - Hugging Face model URL
- `HF_API_KEY` (optional) - Hugging Face API token (free tier, recommended for better performance)
- `OLLAMA_BASE_URL` (optional, default: `http://localhost:11434`) - Ollama server URL (if using Ollama)
- `OLLAMA_MODEL` (optional, default: `llama3.2`) - Model to use (if using Ollama)
- `ALLOWED_ORIGINS` (optional) - Comma-separated list of allowed CORS origins

## Deployment

See deployment instructions in the main README.md

