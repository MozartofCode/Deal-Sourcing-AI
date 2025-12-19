"""
Routes for AI-powered matching and email generation
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from datetime import datetime
from app.models import AIMatchResponse
from app.database import get_supabase_client
from app.services.auth_service import decode_access_token, get_user_by_id
from app.services.openai_service import get_openai_response

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


@router.post("/generate-matches")
async def generate_ai_matches(user_id: str = Depends(get_user_id_from_token)):
    """Generate AI matches for the current user"""
    supabase = get_supabase_client()
    
    try:
        # Get user info
        user = await get_user_by_id(user_id)
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        user_type = user.get("user_type", "investor")
        
        # Get user profile
        profile_response = supabase.table("user_profiles")\
            .select("*")\
            .eq("user_id", user_id)\
            .execute()
        
        profile = profile_response.data[0] if profile_response.data and len(profile_response.data) > 0 else {}
        
        # Get saved items and portfolio to understand user preferences
        saved_items = supabase.table("saved_items")\
            .select("*")\
            .eq("user_id", user_id)\
            .limit(20)\
            .execute()
        
        portfolio = supabase.table("portfolios")\
            .select("*")\
            .eq("user_id", user_id)\
            .limit(20)\
            .execute()
        
        # Get other users' profiles for matching
        if user_type == "entrepreneur":
            # Match with investors
            other_profiles = supabase.table("user_profiles")\
                .select("*")\
                .eq("user_type", "investor")\
                .eq("is_public", True)\
                .limit(50)\
                .execute()
            match_type = "investor_for_entrepreneur"
        else:
            # Match with entrepreneurs
            other_profiles = supabase.table("user_profiles")\
                .select("*")\
                .eq("user_type", "entrepreneur")\
                .eq("is_public", True)\
                .limit(50)\
                .execute()
            match_type = "startup_for_investor"
        
        # Use AI to find best matches
        matches = []
        for other_profile in (other_profiles.data or [])[:10]:  # Limit to 10 for performance
            try:
                # Build context for AI
                context = f"""
User Profile:
- Type: {user_type}
- Name: {user.get('name', 'N/A')}
- Industry: {profile.get('industry', 'N/A')}
- Location: {profile.get('location', 'N/A')}
- Company: {profile.get('company_name', 'N/A')}
- Bio: {profile.get('bio', 'N/A')}
- Investment Focus: {profile.get('investment_focus', 'N/A')}
- Funding Goal: {profile.get('funding_goal', 'N/A')}
- Stage: {profile.get('startup_stage', 'N/A')}

Potential Match Profile:
- Type: {other_profile.get('user_type', 'N/A')}
- Name: {other_profile.get('company_name', 'N/A')}
- Industry: {other_profile.get('industry', 'N/A')}
- Location: {other_profile.get('location', 'N/A')}
- Bio: {other_profile.get('bio', 'N/A')}
- Investment Focus: {other_profile.get('investment_focus', 'N/A')}
- Funding Goal: {other_profile.get('funding_goal', 'N/A')}
- Stage: {other_profile.get('startup_stage', 'N/A')}
"""
                
                prompt = f"""As a VC analyst, analyze if these two profiles would be a good match for investment/funding.

{context}

Provide:
1. Match score (0-100) - how well they match
2. Brief reason why this is a good match (2-3 sentences)
3. A warm, professional email draft that the {user_type} could send to introduce themselves and express interest

Format your response as:
MATCH_SCORE: [number]
REASON: [text]
EMAIL_DRAFT:
Subject: [subject line]

[email body]
"""
                
                ai_response = await get_openai_response(prompt)
                
                # Parse AI response
                match_score = 70  # Default
                match_reason = "Potential match based on profile analysis"
                email_draft = f"Subject: Connection Request\n\nHi,\n\nI came across your profile and thought we might be a good fit. Would love to connect!"
                
                # Try to parse the response
                lines = ai_response.split('\n')
                for i, line in enumerate(lines):
                    if 'MATCH_SCORE:' in line.upper():
                        try:
                            score_text = line.split(':')[1].strip()
                            match_score = int(score_text.split()[0])
                        except:
                            pass
                    elif 'REASON:' in line.upper():
                        match_reason = line.split(':', 1)[1].strip() if ':' in line else match_reason
                    elif 'EMAIL_DRAFT:' in line.upper() or 'SUBJECT:' in line.upper():
                        email_draft = '\n'.join(lines[i:]).split('EMAIL_DRAFT:')[-1].strip()
                
                # Only save matches with score >= 60
                if match_score >= 60:
                    match_dict = {
                        "user_id": user_id,
                        "match_type": match_type,
                        "matched_item_type": "user",
                        "matched_item_id": other_profile["user_id"],
                        "matched_item_name": other_profile.get("company_name") or other_profile.get("user_id"),
                        "match_score": match_score,
                        "match_reason": match_reason,
                        "suggested_email_draft": email_draft,
                        "status": "pending",
                        "created_at": datetime.utcnow().isoformat(),
                        "updated_at": datetime.utcnow().isoformat()
                    }
                    
                    # Check if match already exists
                    existing = supabase.table("ai_matches")\
                        .select("id")\
                        .eq("user_id", user_id)\
                        .eq("matched_item_id", other_profile["user_id"])\
                        .execute()
                    
                    if not existing.data or len(existing.data) == 0:
                        response = supabase.table("ai_matches").insert(match_dict).execute()
                        if response.data:
                            matches.append(response.data[0])
            except Exception as e:
                print(f"Error processing match for {other_profile.get('user_id')}: {e}")
                continue
        
        return {
            "message": f"Generated {len(matches)} matches",
            "matches": matches
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error generating matches: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate matches")


@router.get("/matches", response_model=List[AIMatchResponse])
async def get_ai_matches(
    status: str = None,
    user_id: str = Depends(get_user_id_from_token)
):
    """Get user's AI matches"""
    supabase = get_supabase_client()
    
    try:
        query = supabase.table("ai_matches")\
            .select("*")\
            .eq("user_id", user_id)
        
        if status:
            query = query.eq("status", status)
        
        response = query.order("match_score", desc=True).order("created_at", desc=True).execute()
        
        return [AIMatchResponse(**match) for match in (response.data or [])]
    except Exception as e:
        print(f"Error fetching matches: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch matches")


@router.put("/matches/{match_id}")
async def update_match_status(
    match_id: str,
    status: str,  # 'viewed', 'contacted', 'dismissed'
    user_id: str = Depends(get_user_id_from_token)
):
    """Update AI match status"""
    supabase = get_supabase_client()
    
    try:
        if status not in ["viewed", "contacted", "dismissed"]:
            raise HTTPException(status_code=400, detail="Invalid status")
        
        # Verify match belongs to user
        check = supabase.table("ai_matches")\
            .select("id")\
            .eq("id", match_id)\
            .eq("user_id", user_id)\
            .execute()
        
        if not check.data or len(check.data) == 0:
            raise HTTPException(status_code=404, detail="Match not found")
        
        response = supabase.table("ai_matches")\
            .update({"status": status, "updated_at": datetime.utcnow().isoformat()})\
            .eq("id", match_id)\
            .execute()
        
        if response.data and len(response.data) > 0:
            return AIMatchResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to update match")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating match: {e}")
        raise HTTPException(status_code=500, detail="Failed to update match")

