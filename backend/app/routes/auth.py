"""
Authentication routes
"""
import logging
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import (
    authenticate_user,
    create_user,
    create_access_token,
    decode_access_token,
)
from datetime import timedelta

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """
    Register a new user
    """
    logger.info(f"Registration attempt for email: {user_data.email}")
    
    # Create user
    user, error_message = await create_user(
        email=user_data.email,
        password=user_data.password,
        name=user_data.name
    )
    
    if user is None:
        final_error = error_message if error_message else "Email already registered or invalid data"
        logger.warning(f"Registration failed for {user_data.email}: {final_error}")
        raise HTTPException(
            status_code=400,
            detail=final_error
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    # New users don't have a profile yet
    user["has_profile"] = False
    
    logger.info(f"Successful registration for user: {user_data.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    }


@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    """
    Login user and return JWT token
    """
    logger.info(f"Login attempt for email: {user_data.email}")
    
    user, error_message = await authenticate_user(user_data.email, user_data.password)
    
    if user is None:
        final_error = error_message if error_message else "Incorrect email or password"
        logger.warning(f"Login failed for {user_data.email}: {final_error}")
        raise HTTPException(
            status_code=401,
            detail=final_error,
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
    # Check if user has a profile
    # Use the authenticated client with the new token to pass RLS
    from app.database import get_authenticated_supabase_client
    try:
        # We need to use the Supabase JWT (from the auth response) if we want to be "that user" on Supabase side
        # BUT, our create_access_token creates a fastAPI-specific token signed by US.
        # However, data storage uses Supabase. Supabase expects ITS OWN tokens or Service Key.
        #
        # WAIT. authenticate_user returns a user dict. It does NOT return the Supabase session token?
        # authenticate_user calls supabase.auth.sign_in_with_password.
        # We discarded the session!
        #
        # If we are using Supabase Auth, we should return the Supabase Token to the frontend or use it.
        # Our auth_service.py wraps Supabase.
        # 
        # Let's check auth_service.py. It creates its OWN JWT?
        # create_access_token uses SECRET_KEY.
        # If SECRET_KEY is the Supabase JWT Secret, then our tokens ARE Supabase tokens.
        # .env says JWT_SECRET_KEY.
        #
        # Assuming our token works for Supabase RLS:
        
        supabase_auth = get_authenticated_supabase_client(access_token)
        # Check if profile exists
        profile_response = supabase_auth.table("investor_profiles").select("id").eq("user_id", user["id"]).maybe_single().execute()
        user["has_profile"] = bool(profile_response.data)
    except Exception as e:
        logger.error(f"Error checking profile existence: {e}")
        user["has_profile"] = False
    
    logger.info(f"Successful login for user: {user_data.email}")
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": UserResponse(**user)
    }


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """
    Get current authenticated user information
    """
    from app.database import get_authenticated_supabase_client
    from datetime import datetime
    
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
    
    # Use the JWT token to get user info 
    try:
        # Authenticate client with user token to bypass RLS restrictions if Anon key is used
        supabase = get_authenticated_supabase_client(token)
        user_response = supabase.auth.get_user(token)
        
        if user_response.user is None:
            raise HTTPException(
                status_code=404,
                detail="User not found"
            )
        
        user = user_response.user
        user_metadata = user.user_metadata or {}
        name = user_metadata.get("name") or user_metadata.get("full_name")
        
        created_at_str = user.created_at
        if created_at_str:
            try:
                created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            except:
                created_at = datetime.utcnow()
        else:
            created_at = datetime.utcnow()
            
        # Check if profile exists using authenticated client
        has_profile = False
        try:
            profile_response = supabase.table("investor_profiles").select("id").eq("user_id", user.id).maybe_single().execute()
            has_profile = bool(profile_response.data)
        except Exception as e:
            # If 204 or other error, assume no profile
            logger.error(f"Error checking profile existence: {e}")
            has_profile = False
        
        return UserResponse(
            id=user.id,
            email=user.email,
            name=name,
            has_profile=has_profile,
            created_at=created_at
        )
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error fetching user info: {e}", exc_info=True)
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

