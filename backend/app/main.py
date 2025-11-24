from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
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

# Get allowed origins from environment or use defaults
default_origins = "http://localhost:3000,http://127.0.0.1:3000,https://deal-sourcing-ai.vercel.app"
allowed_origins_str = os.getenv("ALLOWED_ORIGINS", default_origins)
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(",") if origin.strip()]

# Ensure production frontend URL is always included
production_frontend = "https://deal-sourcing-ai.vercel.app"
if production_frontend not in allowed_origins:
    allowed_origins.append(production_frontend)
    logger.info(f"Added production frontend URL to allowed origins: {production_frontend}")

# Log configured origins for debugging
logger.info(f"CORS allowed origins: {allowed_origins}")

# Configure CORS - must be added before routes and other middleware
# Using allow_origin_regex for more flexible matching
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https://.*\.vercel\.app",  # Allow all Vercel subdomains
    allow_credentials=False,  # Set to False - we don't need credentials for this API
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
    max_age=3600,
)

# Add middleware to log incoming requests for debugging (runs after CORS)
@app.middleware("http")
async def log_requests(request: Request, call_next):
    origin = request.headers.get("origin")
    if origin:
        logger.info(f"Request from origin: {origin}, path: {request.url.path}, method: {request.method}")
    response = await call_next(request)
    return response

# Include routers
app.include_router(chat.router, prefix="/api", tags=["chat"])
app.include_router(history.router, prefix="/api", tags=["history"])


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "message": "API is running"}

