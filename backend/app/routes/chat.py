from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional
from app.services.openai_service import get_openai_response
from app.services.rate_limiter import rate_limiter

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    conversation_id: Optional[str] = None
    remaining_requests: Optional[int] = None


def get_user_id(request: Request) -> str:
    """Get user identifier from request (IP address)"""
    # Try to get IP from various headers (for proxies/load balancers)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    # Fallback to direct client IP
    if request.client:
        return request.client.host
    
    return "unknown"


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, http_request: Request):
    """
    Chat endpoint with OpenAI integration and rate limiting
    Max 5 requests per user per hour
    """
    # Get user identifier for rate limiting
    user_id = get_user_id(http_request)
    
    # Check rate limit
    is_allowed, remaining = rate_limiter.is_allowed(user_id)
    
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "message": "You have reached the maximum of 5 requests. Please try again later.",
                "remaining_requests": 0
            }
        )
    
    # Validate message
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    try:
        # Get response from OpenAI
        response_message = await get_openai_response(request.message)
        
        # Generate conversation_id if not provided
        conversation_id = request.conversation_id or f"conv_{hash(request.message + user_id) % 10000}"
        
        return ChatResponse(
            message=response_message,
            conversation_id=conversation_id,
            remaining_requests=remaining
        )
    except ValueError as e:
        # OpenAI API key not configured
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        # Other OpenAI errors
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

