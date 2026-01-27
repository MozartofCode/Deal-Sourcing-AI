"""
Investor Profile Routes (Local File Storage)
"""
import logging
from typing import Optional
import uuid
import json
from pathlib import Path
from datetime import datetime
from fastapi import APIRouter, HTTPException
from app.models import InvestorProfileCreate, InvestorProfileResponse
from app.storage import get_profile, save_profile

logger = logging.getLogger(__name__)

router = APIRouter()

@router.get("/", response_model=Optional[InvestorProfileResponse])
async def get_my_profile():
    profile = get_profile()
    
    if not profile:
        return None
        
    return profile

@router.post("/", response_model=InvestorProfileResponse)
async def create_or_update_profile(profile: InvestorProfileCreate):
    current_profile = get_profile()
    
    data = profile.model_dump()
    # Mock fields that Supabase would have added
    data["id"] = str(uuid.uuid4()) if not current_profile else current_profile.get("id", str(uuid.uuid4()))
    now = datetime.now().isoformat()
    data["created_at"] = now if not current_profile else current_profile.get("created_at", now)
    data["updated_at"] = now
    data["user_id"] = "guest-user" 
    
    save_profile(data)
    
    return data
