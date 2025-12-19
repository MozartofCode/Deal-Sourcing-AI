"""
Routes for tracking searches, profile views, and saved items
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from datetime import datetime
from app.models import (
    SearchHistoryCreate,
    ProfileViewCreate,
    SavedItemCreate,
    SavedItemResponse,
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


@router.post("/search-history")
async def save_search_history(
    search_data: SearchHistoryCreate,
    user_id: str = Depends(get_user_id_from_token)
):
    """Save a search to history"""
    supabase = get_supabase_client()
    
    try:
        search_dict = {
            "user_id": user_id,
            "search_type": search_data.search_type,
            "query": search_data.query,
            "filters": search_data.filters,
            "results_count": search_data.results_count,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("search_history").insert(search_dict).execute()
        
        if response.data and len(response.data) > 0:
            return {"message": "Search saved", "id": response.data[0]["id"]}
        else:
            raise HTTPException(status_code=500, detail="Failed to save search")
    except Exception as e:
        print(f"Error saving search: {e}")
        raise HTTPException(status_code=500, detail="Failed to save search")


@router.get("/search-history")
async def get_search_history(
    limit: int = 50,
    user_id: str = Depends(get_user_id_from_token)
):
    """Get user's search history"""
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("search_history")\
            .select("*")\
            .eq("user_id", user_id)\
            .order("created_at", desc=True)\
            .limit(limit)\
            .execute()
        
        return response.data or []
    except Exception as e:
        print(f"Error fetching search history: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch search history")


@router.post("/profile-view")
async def track_profile_view(
    view_data: ProfileViewCreate,
    user_id: str = Depends(get_user_id_from_token)
):
    """Track when a user views a profile"""
    supabase = get_supabase_client()
    
    try:
        view_dict = {
            "viewer_id": user_id,
            "viewed_type": view_data.viewed_type,
            "viewed_id": view_data.viewed_id,
            "viewed_name": view_data.viewed_name,
            "metadata": view_data.metadata,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("profile_views").insert(view_dict).execute()
        
        if response.data and len(response.data) > 0:
            return {"message": "View tracked", "id": response.data[0]["id"]}
        else:
            raise HTTPException(status_code=500, detail="Failed to track view")
    except Exception as e:
        print(f"Error tracking view: {e}")
        raise HTTPException(status_code=500, detail="Failed to track view")


@router.post("/saved-items")
async def save_item(
    item_data: SavedItemCreate,
    user_id: str = Depends(get_user_id_from_token)
):
    """Save an item (startup/VC) to saved items"""
    supabase = get_supabase_client()
    
    try:
        # Check if already saved
        existing = supabase.table("saved_items")\
            .select("id")\
            .eq("user_id", user_id)\
            .eq("item_type", item_data.item_type)\
            .eq("item_id", item_data.item_id)\
            .execute()
        
        if existing.data and len(existing.data) > 0:
            # Update existing
            update_dict = {
                "item_name": item_data.item_name,
                "item_data": item_data.item_data,
                "notes": item_data.notes,
                "tags": item_data.tags,
                "updated_at": datetime.utcnow().isoformat()
            }
            response = supabase.table("saved_items")\
                .update(update_dict)\
                .eq("id", existing.data[0]["id"])\
                .execute()
        else:
            # Create new
            item_dict = {
                "user_id": user_id,
                "item_type": item_data.item_type,
                "item_id": item_data.item_id,
                "item_name": item_data.item_name,
                "item_data": item_data.item_data,
                "notes": item_data.notes,
                "tags": item_data.tags or [],
                "created_at": datetime.utcnow().isoformat(),
                "updated_at": datetime.utcnow().isoformat()
            }
            response = supabase.table("saved_items").insert(item_dict).execute()
        
        if response.data and len(response.data) > 0:
            return SavedItemResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to save item")
    except Exception as e:
        print(f"Error saving item: {e}")
        raise HTTPException(status_code=500, detail="Failed to save item")


@router.get("/saved-items")
async def get_saved_items(
    item_type: str = None,
    user_id: str = Depends(get_user_id_from_token)
):
    """Get user's saved items"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("saved_items")\
            .select("*")\
            .eq("user_id", user_id)
        
        if item_type:
            query = query.eq("item_type", item_type)
        
        response = query.order("created_at", desc=True).execute()
        
        return [SavedItemResponse(**item) for item in (response.data or [])]
    except Exception as e:
        print(f"Error fetching saved items: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch saved items")


@router.delete("/saved-items/{item_id}")
async def delete_saved_item(
    item_id: str,
    item_type: str,
    user_id: str = Depends(get_user_id_from_token)
):
    """Delete a saved item"""
    supabase = get_supabase_client()
    
    try:
        supabase.table("saved_items")\
            .delete()\
            .eq("user_id", user_id)\
            .eq("item_type", item_type)\
            .eq("item_id", item_id)\
            .execute()
        
        return {"message": "Item deleted successfully"}
    except Exception as e:
        print(f"Error deleting item: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete item")

