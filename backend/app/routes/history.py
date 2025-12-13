from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.database import get_supabase_client
from app.services.auth_service import decode_access_token

router = APIRouter()
security = HTTPBearer()


class Conversation(BaseModel):
    id: str
    title: str
    created_at: str
    updated_at: str


class CreateConversationRequest(BaseModel):
    title: Optional[str] = None


def get_user_id_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract user ID from JWT token"""
    token = credentials.credentials
    payload = decode_access_token(token)
    
    if payload is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    
    user_id = payload.get("sub")
    if user_id is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication credentials"
        )
    
    return user_id


@router.get("/history", response_model=List[Conversation])
async def get_history(user_id: str = Depends(get_user_id_from_token)):
    """
    Get conversation history for the authenticated user
    """
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("conversations").select("*").eq("user_id", user_id).order("updated_at", desc=True).execute()
        
        conversations = []
        if response.data:
            for item in response.data:
                conversations.append(Conversation(
                    id=item["id"],
                    title=item["title"],
                    created_at=item["created_at"],
                    updated_at=item["updated_at"]
                ))
        
        return conversations
    except Exception as e:
        print(f"Error fetching conversation history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversation history")


@router.post("/history", response_model=Conversation)
async def create_conversation(
    request: CreateConversationRequest,
    user_id: str = Depends(get_user_id_from_token)
):
    """
    Create a new conversation
    """
    supabase = get_supabase_client()
    
    try:
        title = request.title or f"Conversation {datetime.utcnow().strftime('%Y-%m-%d %H:%M')}"
        
        conversation_data = {
            "user_id": user_id,
            "title": title,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("conversations").insert(conversation_data).execute()
        
        if response.data and len(response.data) > 0:
            item = response.data[0]
            return Conversation(
                id=item["id"],
                title=item["title"],
                created_at=item["created_at"],
                updated_at=item["updated_at"]
            )
        else:
            raise HTTPException(status_code=500, detail="Failed to create conversation")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating conversation: {e}")
        raise HTTPException(status_code=500, detail="Failed to create conversation")
