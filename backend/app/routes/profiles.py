"""
Routes for user profiles
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List, Optional
from datetime import datetime
from app.models import (
    UserProfileCreate,
    UserProfileResponse,
)
from app.database import get_supabase_client
from app.services.auth_service import decode_access_token, get_user_by_id

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


@router.get("/me", response_model=UserProfileResponse)
async def get_my_profile(user_id: str = Depends(get_user_id_from_token)):
    """Get current user's profile"""
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("user_profiles").select("*").eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return UserProfileResponse(**response.data[0])
        else:
            # Return empty profile if doesn't exist
            user = await get_user_by_id(user_id)
            if not user:
                raise HTTPException(status_code=404, detail="User not found")
            
            return UserProfileResponse(
                id="",
                user_id=user_id,
                user_type=user.get("user_type", "investor"),
                bio=None,
                company_name=None,
                industry=None,
                location=None,
                website=None,
                linkedin_url=None,
                twitter_url=None,
                investment_focus=None,
                startup_stage=None,
                funding_goal=None,
                check_size_min=None,
                check_size_max=None,
                portfolio_size=None,
                profile_image_url=None,
                is_public=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow()
            )
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@router.put("/me", response_model=UserProfileResponse)
async def update_my_profile(
    profile_data: UserProfileCreate,
    user_id: str = Depends(get_user_id_from_token)
):
    """Create or update current user's profile"""
    supabase = get_supabase_client()
    
    try:
        # Get user info to determine user_type
        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_type = user.get("user_type", "investor")
        
        # Check if profile exists
        existing = supabase.table("user_profiles").select("id").eq("user_id", user_id).execute()
        
        profile_dict = {
            "user_id": user_id,
            "user_type": user_type,
            "bio": profile_data.bio,
            "company_name": profile_data.company_name,
            "industry": profile_data.industry,
            "location": profile_data.location,
            "website": profile_data.website,
            "linkedin_url": profile_data.linkedin_url,
            "twitter_url": profile_data.twitter_url,
            "investment_focus": profile_data.investment_focus,
            "startup_stage": profile_data.startup_stage,
            "funding_goal": profile_data.funding_goal,
            "check_size_min": profile_data.check_size_min,
            "check_size_max": profile_data.check_size_max,
            "portfolio_size": profile_data.portfolio_size,
            "profile_image_url": profile_data.profile_image_url,
            "is_public": profile_data.is_public,
            "updated_at": datetime.utcnow().isoformat()
        }
        
        if existing.data and len(existing.data) > 0:
            # Update existing
            response = supabase.table("user_profiles")\
                .update(profile_dict)\
                .eq("id", existing.data[0]["id"])\
                .execute()
        else:
            # Create new
            profile_dict["created_at"] = datetime.utcnow().isoformat()
            response = supabase.table("user_profiles").insert(profile_dict).execute()
        
        if response.data and len(response.data) > 0:
            return UserProfileResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to update profile")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to update profile")


@router.get("/{user_id}", response_model=UserProfileResponse)
async def get_user_profile(
    user_id: str,
    current_user_id: str = Depends(get_user_id_from_token)
):
    """Get a user's public profile"""
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("user_profiles")\
            .select("*")\
            .eq("user_id", user_id)\
            .eq("is_public", True)\
            .execute()
        
        if response.data and len(response.data) > 0:
            return UserProfileResponse(**response.data[0])
        else:
            raise HTTPException(status_code=404, detail="Profile not found or not public")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching profile: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch profile")


@router.get("/", response_model=List[UserProfileResponse])
async def search_profiles(
    user_type: Optional[str] = None,
    industry: Optional[str] = None,
    limit: int = 50,
    current_user_id: str = Depends(get_user_id_from_token)
):
    """Search public user profiles"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("user_profiles")\
            .select("*")\
            .eq("is_public", True)
        
        if user_type:
            query = query.eq("user_type", user_type)
        if industry:
            query = query.eq("industry", industry)
        
        response = query.limit(limit).execute()
        
        return [UserProfileResponse(**item) for item in (response.data or [])]
    except Exception as e:
        print(f"Error searching profiles: {e}")
        raise HTTPException(status_code=500, detail="Failed to search profiles")

