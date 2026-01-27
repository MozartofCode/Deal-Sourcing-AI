"""
Investor Profile Routes
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from app.models import InvestorProfileCreate, InvestorProfileResponse
from app.database import get_supabase_client
from datetime import datetime

logger = logging.getLogger(__name__)

router = APIRouter()

# correct way to define hardcoded user id
HARDCODED_USER_ID = "00000000-0000-0000-0000-000000000000"

@router.get("/", response_model=InvestorProfileResponse)
async def get_my_profile():
    user_id = HARDCODED_USER_ID
    
    # Use standard client (assumes RLS is disabled or allows public access for this user)
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("investor_profiles").select("*").eq("user_id", user_id).limit(1).execute()
        
        if not response.data or len(response.data) == 0:
            # Return empty profile or 404. 
            # If 404, frontend might redirect to setup.
            raise HTTPException(status_code=404, detail="Profile not found")
            
        return response.data[0]
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")

@router.post("/", response_model=InvestorProfileResponse)
async def create_or_update_profile(profile: InvestorProfileCreate):
    user_id = HARDCODED_USER_ID
    
    # Use standard client
    supabase = get_supabase_client()
    
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
