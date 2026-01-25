"""
Investor Profile Routes
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import InvestorProfileCreate, InvestorProfileResponse
from app.database import get_supabase_client, get_authenticated_supabase_client
from app.services.auth_service import decode_access_token

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
        response = supabase.table("investor_profiles").select("*").eq("user_id", user_id).maybe_single().execute()
        if not response.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        return response.data
    except Exception as e:
        # Check for Postgrest 204 (No Content) error which happens on maybe_single empty result
        error_str = str(e)
        if "204" in error_str and "Missing response" in error_str:
             raise HTTPException(status_code=404, detail="Profile not found")
             
        logger.error(f"Error fetching profile: {e}")
        # If specific 404 was raised, re-raise it
        if isinstance(e, HTTPException):
            raise e
        raise HTTPException(status_code=500, detail="Error fetching profile")

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
            idx = supabase.table("investor_profiles").select("id").eq("user_id", user_id).maybe_single().execute()
            idx_data = idx.data
        except Exception as check_e:
            # Handle 204 Missing response (means no profile found)
            if "204" in str(check_e) and "Missing response" in str(check_e):
                idx_data = None
            else:
                raise check_e
        
        data = profile.model_dump()
        data["user_id"] = user_id
        
        if idx_data:
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
