from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

router = APIRouter()


class Conversation(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: Optional[str] = None


class CreateConversationRequest(BaseModel):
    title: Optional[str] = None


# Mock data storage (replace with database later)
mock_conversations = [
    {
        "id": "conv_1",
        "title": "Sample Conversation 1",
        "created_at": "2024-01-15T10:00:00Z",
        "updated_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": "conv_2",
        "title": "Sample Conversation 2",
        "created_at": "2024-01-14T14:00:00Z",
        "updated_at": "2024-01-14T15:00:00Z"
    }
]


@router.get("/history", response_model=List[Conversation])
async def get_history():
    """
    Get conversation history - returns mock data for now
    """
    return mock_conversations


@router.post("/history", response_model=Conversation)
async def create_conversation(request: CreateConversationRequest):
    """
    Create a new conversation - placeholder implementation
    """
    now = datetime.utcnow().isoformat() + "Z"
    new_conversation = {
        "id": f"conv_{len(mock_conversations) + 1}",
        "title": request.title or f"New Conversation {len(mock_conversations) + 1}",
        "created_at": now,
        "updated_at": now
    }
    
    mock_conversations.append(new_conversation)
    return new_conversation

