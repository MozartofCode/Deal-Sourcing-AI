"""
Investor Profile Routes (In-Memory Version)
"""
import logging
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.models import InvestorProfileCreate, InvestorProfileResponse

logger = logging.getLogger(__name__)

router = APIRouter()

# In-memory storage for the single active profile
PROFILE_DB = {}

def get_current_profile():
    return PROFILE_DB.get("current")

@router.get("/", response_model=InvestorProfileResponse)
async def get_my_profile():
    profile = get_current_profile()
    
    if not profile:
        raise HTTPException(status_code=404, detail="Profile not found")
        
    return profile

@router.post("/", response_model=InvestorProfileResponse)
async def create_or_update_profile(profile: InvestorProfileCreate):
    current_profile = get_current_profile()
    
    data = profile.model_dump()
    # Mock fields that Supabase would have added
    data["id"] = str(uuid.uuid4()) if not current_profile else current_profile["id"]
    now = datetime.now().isoformat()
    data["created_at"] = now
    data["updated_at"] = now
    data["user_id"] = "guest-user" 
    
    PROFILE_DB["current"] = data
    
    return data
