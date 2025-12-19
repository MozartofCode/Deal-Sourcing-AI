"""
Routes for direct messaging between users
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from datetime import datetime
from app.models import (
    DirectMessageCreate,
    DirectMessageResponse,
    ConnectionRequestCreate,
    ConnectionRequestResponse,
)
from app.database import get_supabase_client
from app.services.auth_service import decode_access_token

router = APIRouter()
security = HTTPBearer()


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


@router.post("/messages", response_model=DirectMessageResponse)
async def send_message(
    message_data: DirectMessageCreate,
    sender_id: str = Depends(get_user_id_from_token)
):
    """Send a direct message to another user"""
    supabase = get_supabase_client()
    
    try:
        if sender_id == message_data.recipient_id:
            raise HTTPException(status_code=400, detail="Cannot send message to yourself")
        
        message_dict = {
            "sender_id": sender_id,
            "recipient_id": message_data.recipient_id,
            "subject": message_data.subject,
            "message": message_data.message,
            "related_item_type": message_data.related_item_type,
            "related_item_id": message_data.related_item_id,
            "is_read": False,
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("direct_messages").insert(message_dict).execute()
        
        if response.data and len(response.data) > 0:
            return DirectMessageResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to send message")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error sending message: {e}")
        raise HTTPException(status_code=500, detail="Failed to send message")


@router.get("/messages", response_model=List[DirectMessageResponse])
async def get_messages(
    conversation_with: str = None,
    limit: int = 50,
    user_id: str = Depends(get_user_id_from_token)
):
    """Get user's messages (sent and received)"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("direct_messages")\
            .select("*")\
            .or_(f"sender_id.eq.{user_id},recipient_id.eq.{user_id}")
        
        if conversation_with:
            query = query.or_(f"and(sender_id.eq.{user_id},recipient_id.eq.{conversation_with}),and(sender_id.eq.{conversation_with},recipient_id.eq.{user_id})")
        
        response = query.order("created_at", desc=True).limit(limit).execute()
        
        return [DirectMessageResponse(**msg) for msg in (response.data or [])]
    except Exception as e:
        print(f"Error fetching messages: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch messages")


@router.get("/messages/conversations")
async def get_conversations(user_id: str = Depends(get_user_id_from_token)):
    """Get list of conversations (unique users you've messaged with)"""
    supabase = get_supabase_client()
    
    try:
        # Get all messages where user is sender or recipient
        response = supabase.table("direct_messages")\
            .select("sender_id, recipient_id, created_at, is_read")\
            .or_(f"sender_id.eq.{user_id},recipient_id.eq.{user_id}")\
            .order("created_at", desc=True)\
            .execute()
        
        # Group by other user
        conversations = {}
        for msg in (response.data or []):
            other_user_id = msg["recipient_id"] if msg["sender_id"] == user_id else msg["sender_id"]
            if other_user_id not in conversations:
                conversations[other_user_id] = {
                    "user_id": other_user_id,
                    "last_message_at": msg["created_at"],
                    "unread_count": 0
                }
            if msg["recipient_id"] == user_id and not msg["is_read"]:
                conversations[other_user_id]["unread_count"] += 1
        
        return list(conversations.values())
    except Exception as e:
        print(f"Error fetching conversations: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch conversations")


@router.put("/messages/{message_id}/read")
async def mark_message_read(
    message_id: str,
    user_id: str = Depends(get_user_id_from_token)
):
    """Mark a message as read"""
    supabase = get_supabase_client()
    
    try:
        # Verify user is recipient
        check = supabase.table("direct_messages")\
            .select("id")\
            .eq("id", message_id)\
            .eq("recipient_id", user_id)\
            .execute()
        
        if not check.data or len(check.data) == 0:
            raise HTTPException(status_code=404, detail="Message not found")
        
        response = supabase.table("direct_messages")\
            .update({"is_read": True, "updated_at": datetime.utcnow().isoformat()})\
            .eq("id", message_id)\
            .execute()
        
        return {"message": "Message marked as read"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error marking message read: {e}")
        raise HTTPException(status_code=500, detail="Failed to mark message as read")


@router.post("/connection-requests", response_model=ConnectionRequestResponse)
async def create_connection_request(
    request_data: ConnectionRequestCreate,
    requester_id: str = Depends(get_user_id_from_token)
):
    """Create a connection request"""
    supabase = get_supabase_client()
    
    try:
        if requester_id == request_data.recipient_id:
            raise HTTPException(status_code=400, detail="Cannot send connection request to yourself")
        
        # Check if request already exists
        existing = supabase.table("connection_requests")\
            .select("id, status")\
            .eq("requester_id", requester_id)\
            .eq("recipient_id", request_data.recipient_id)\
            .execute()
        
        if existing.data and len(existing.data) > 0:
            existing_req = existing.data[0]
            if existing_req["status"] == "pending":
                raise HTTPException(status_code=400, detail="Connection request already pending")
            elif existing_req["status"] == "accepted":
                raise HTTPException(status_code=400, detail="Already connected")
        
        request_dict = {
            "requester_id": requester_id,
            "recipient_id": request_data.recipient_id,
            "message": request_data.message,
            "status": "pending",
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("connection_requests").insert(request_dict).execute()
        
        if response.data and len(response.data) > 0:
            return ConnectionRequestResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to create connection request")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error creating connection request: {e}")
        raise HTTPException(status_code=500, detail="Failed to create connection request")


@router.get("/connection-requests", response_model=List[ConnectionRequestResponse])
async def get_connection_requests(
    status: str = None,
    user_id: str = Depends(get_user_id_from_token)
):
    """Get connection requests (sent and received)"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("connection_requests")\
            .select("*")\
            .or_(f"requester_id.eq.{user_id},recipient_id.eq.{user_id}")
        
        if status:
            query = query.eq("status", status)
        
        response = query.order("created_at", desc=True).execute()
        
        return [ConnectionRequestResponse(**req) for req in (response.data or [])]
    except Exception as e:
        print(f"Error fetching connection requests: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch connection requests")


@router.put("/connection-requests/{request_id}")
async def update_connection_request(
    request_id: str,
    status: str,  # 'accepted', 'rejected', 'cancelled'
    user_id: str = Depends(get_user_id_from_token)
):
    """Update connection request status"""
    supabase = get_supabase_client()
    
    try:
        if status not in ["accepted", "rejected", "cancelled"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        # Verify user has permission (must be requester or recipient)
        check = supabase.table("connection_requests")\
            .select("id, requester_id, recipient_id, status")\
            .eq("id", request_id)\
            .execute()
        
        if not check.data or len(check.data) == 0:
            raise HTTPException(status_code=404, detail="Connection request not found")
        
        req = check.data[0]
        if user_id != req["requester_id"] and user_id != req["recipient_id"]:
            raise HTTPException(status_code=403, detail="Not authorized")
        
        if req["status"] != "pending":
            raise HTTPException(status_code=400, detail="Request already processed")
        
        # Only recipient can accept/reject, requester can cancel
        if status == "accepted" or status == "rejected":
            if user_id != req["recipient_id"]:
                raise HTTPException(status_code=403, detail="Only recipient can accept or reject")
        elif status == "cancelled":
            if user_id != req["requester_id"]:
                raise HTTPException(status_code=403, detail="Only requester can cancel")
        
        response = supabase.table("connection_requests")\
            .update({"status": status, "updated_at": datetime.utcnow().isoformat()})\
            .eq("id", request_id)\
            .execute()
        
        if response.data and len(response.data) > 0:
            return ConnectionRequestResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to update connection request")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating connection request: {e}")
        raise HTTPException(status_code=500, detail="Failed to update connection request")

