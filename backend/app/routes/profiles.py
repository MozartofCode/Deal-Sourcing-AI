"""
Investor Profile Routes
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import InvestorProfileCreate, InvestorProfileResponse
from app.database import get_supabase_client, get_authenticated_supabase_client
from app.services.auth_service import decode_access_token
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

def get_user_id_from_token(token: str) -> str:
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.get("/", response_model=InvestorProfileResponse)
async def get_my_profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = get_user_id_from_token(token)
    
    # Use authenticated client to pass RLS
    supabase = get_authenticated_supabase_client(token)
    
    try:
        response = supabase.table("investor_profiles").select("*").eq("user_id", user_id).limit(1).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Profile not found")
            
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")

@router.post("/", response_model=InvestorProfileResponse)
async def create_or_update_profile(profile: InvestorProfileCreate, credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = get_user_id_from_token(token)
    
    # Use authenticated client to pass RLS
    supabase = get_authenticated_supabase_client(token)
    
    try:
        # Check if exists
        idx_data = None
        try:
            idx = supabase.table("investor_profiles").select("id").eq("user_id", user_id).limit(1).execute()
            idx_data = idx.data[0] if idx.data and len(idx.data) > 0 else None
        except Exception as check_e:
            logger.error(f"Error checking profile existence: {check_e}")
            idx_data = None
        
        data = profile.model_dump()
        data["user_id"] = user_id
        
        if idx_data:
            # Update
            response = supabase.table("investor_profiles").update(data).eq("user_id", user_id).select().execute()
        else:
            # Insert
            response = supabase.table("investor_profiles").insert(data).select().execute()
            
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save profile")
            
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))
