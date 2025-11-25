from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import Response
from app.routes import chat, history
import os
import logging
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Deal Sourcing AI API", version="1.0.0")

# Define allowed origins - always include production frontend
allowed_origins = [
    "https://deal-sourcing-ai.vercel.app",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

# Check if ALLOWED_ORIGINS env var is set and merge with defaults
env_origins = os.getenv("ALLOWED_ORIGINS", "")
if env_origins:
    env_origin_list = [origin.strip() for origin in env_origins.split(",") if origin.strip()]
    # Add any additional origins from env, but always keep production frontend
    for origin in env_origin_list:
        if origin not in allowed_origins:
            allowed_origins.append(origin)

# Ensure production frontend is always first (most important)
if "https://deal-sourcing-ai.vercel.app" not in allowed_origins:
    allowed_origins.insert(0, "https://deal-sourcing-ai.vercel.app")

logger.info(f"CORS configured with origins: {allowed_origins}")

# Configure CORS middleware - MUST be added before routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept", "Origin", "X-Requested-With"],
)

# Add explicit CORS header middleware as backup to ensure headers are always set
@app.middleware("http")
async def add_cors_headers(request: Request, call_next):
    origin = request.headers.get("origin")
    
    # Handle OPTIONS preflight requests explicitly
    if request.method == "OPTIONS":
        if origin in allowed_origins:
            return Response(
                status_code=200,
                headers={
                    "Access-Control-Allow-Origin": origin,
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
                    "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, Origin, X-Requested-With",
                    "Access-Control-Max-Age": "3600",
                }
            )
        else:
            return Response(status_code=403)
    
    # For other requests, process normally and add CORS headers
    response = await call_next(request)
    
    if origin in allowed_origins:
        response.headers["Access-Control-Allow-Origin"] = origin
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization, Accept, Origin, X-Requested-With"
    
    return response

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(history.router, prefix="/api", tags=["history"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

