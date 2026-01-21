"""
Investor Profile Routes
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import InvestorProfileCreate, InvestorProfileResponse
from app.database import get_supabase_client
from app.services.auth_service import decode_access_token

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

async def get_current_user_id(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    token = credentials.credentials
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.get("/", response_model=InvestorProfileResponse)
async def get_my_profile(user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    try:
        response = supabase.table("investor_profiles").select("*").eq("user_id", user_id).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return response.data
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        # If specific 404 was raised, re-raise it
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Error fetching profile")

@router.post("/", response_model=InvestorProfileResponse)
async def create_or_update_profile(profile: InvestorProfileCreate, user_id: str = Depends(get_current_user_id)):
    supabase = get_supabase_client()
    try:
        # Check if exists
        idx = supabase.table("investor_profiles").select("id").eq("user_id", user_id).maybe_single().execute()
        
        data = profile.model_dump()
        data["user_id"] = user_id
        
        if idx.data:
            # Update
            response = supabase.table("investor_profiles").update(data).eq("user_id", user_id).execute()
        else:
            # Insert
            response = supabase.table("investor_profiles").insert(data).execute()
            
        if not response.data:
            raise HTTPException(status_code=500, detail="Failed to save profile")
            
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Error saving profile: {e}")
        raise HTTPException(status_code=500, detail=str(e))
