from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    message: str
    conversation_id: Optional[str] = None


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint - placeholder implementation
    Returns a mock response for now
    """
    # Placeholder response - replace with actual AI logic later
    response_message = f"This is a placeholder response to: {request.message}"
    
    # If no conversation_id provided, generate a new one
    conversation_id = request.conversation_id or f"conv_{hash(request.message) % 10000}"
    
    return ChatResponse(
        message=response_message,
        conversation_id=conversation_id
    )

