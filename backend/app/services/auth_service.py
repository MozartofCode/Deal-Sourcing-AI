"""
Authentication service using Supabase Auth API
All password hashing and authentication is handled by Supabase
"""
import os
import logging
from datetime import datetime, timedelta
from typing import Optional, Tuple
from jose import JWTError, jwt
from app.database import get_supabase_client

logger = logging.getLogger(__name__)

# JWT Configuration for API tokens (separate from Supabase auth tokens)
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token for API authentication"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[dict]:
    """Decode and verify a JWT token"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return None


async def authenticate_user(email: str, password: str) -> Tuple[Optional[dict], Optional[str]]:
    """
    Authenticate a user using Supabase Auth API
    Returns: (user_dict, error_message)
    - If successful: (user_dict, None)
    - If invalid credentials: (None, "Incorrect email or password")
    - If other error: (None, error_message)
    """
    supabase = get_supabase_client()
    
    try:
        # Use Supabase Auth API to sign in (handles password verification automatically)
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
        # Check for errors in response
        if hasattr(auth_response, 'error') and auth_response.error:
            error_msg = str(auth_response.error).lower()
            logger.warning(f"Login failed for {email}: {auth_response.error}")
            if "invalid login credentials" in error_msg or "invalid credentials" in error_msg:
                return None, "Incorrect email or password"
            elif "email not confirmed" in error_msg:
                return None, "Please verify your email address before signing in"
            else:
                return None, "Unable to sign in. Please check your credentials and try again"
        
        if auth_response.user is None:
            logger.warning(f"Login failed for {email}: No user returned")
            return None, "Incorrect email or password"
        
        user = auth_response.user
        
        # Get user metadata (name might be stored in user_metadata or raw_user_meta_data)
        user_metadata = user.user_metadata or {}
        name = user_metadata.get("name") or user_metadata.get("full_name")
        
        # Get created_at from user object
        created_at_str = user.created_at
        if created_at_str:
            try:
                created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            except:
                created_at = datetime.utcnow()
        else:
            created_at = datetime.utcnow()
        
        logger.info(f"Successfully authenticated user: {email}")
        return {
            "id": user.id,
            "email": user.email or email,
            "name": name,
            "created_at": created_at
        }, None
        
    except Exception as e:
        error_msg = str(e)
        error_lower = error_msg.lower()
        
        logger.error(f"Authentication error for {email}: {error_msg}", exc_info=True)
        
        # Parse Supabase auth errors for better messages
        if "invalid login credentials" in error_lower or "invalid credentials" in error_lower:
            return None, "Incorrect email or password"
        elif "email not confirmed" in error_lower or "email_not_confirmed" in error_lower:
            return None, "Please verify your email address before signing in"
        elif "too many requests" in error_lower or "rate limit" in error_lower:
            return None, "Too many login attempts. Please try again in a few minutes"
        elif "user not found" in error_lower:
            return None, "No account found with this email address"
        else:
            return None, "Unable to sign in. Please check your credentials and try again"


async def create_user(email: str, password: str, name: Optional[str] = None) -> Tuple[Optional[dict], Optional[str]]:
    """
    Create a new user using Supabase Auth API
    Password hashing is handled automatically by Supabase
    Returns: (user_dict, error_message)
    - If successful: (user_dict, None)
    - If email exists: (None, "An account with this email already exists")
    - If other error: (None, error_message)
    """
    supabase = get_supabase_client()
    
    try:
        # Validate password
        if not password or len(password) < 6:
            return None, "Password must be at least 6 characters long"
        
        # Prepare user metadata
        user_metadata = {}
        if name:
            user_metadata["name"] = name
            user_metadata["full_name"] = name
        
        # Use Supabase Auth API to sign up (handles password hashing automatically)
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": user_metadata
            }
        })
        
        # Check for errors in response
        if hasattr(auth_response, 'error') and auth_response.error:
            error_msg = str(auth_response.error).lower()
            logger.warning(f"Registration failed for {email}: {auth_response.error}")
            if "user already registered" in error_msg or "already registered" in error_msg:
                return None, "An account with this email already exists. Please sign in instead."
            elif "email already exists" in error_msg or "duplicate" in error_msg:
                return None, "An account with this email already exists. Please sign in instead."
            elif "invalid email" in error_msg:
                return None, "Please enter a valid email address"
            elif "password" in error_msg and ("weak" in error_msg or "short" in error_msg):
                return None, "Password is too weak. Please use at least 6 characters."
            else:
                return None, "Unable to create account. Please check your information and try again"
        
        if auth_response.user is None:
            logger.warning(f"Registration failed for {email}: No user returned")
            return None, "Failed to create account. Please try again."
        
        user = auth_response.user
        
        # Get user metadata
        user_metadata = user.user_metadata or {}
        name = user_metadata.get("name") or user_metadata.get("full_name")
        
        # Get created_at from user object
        created_at_str = user.created_at
        if created_at_str:
            try:
                created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            except:
                created_at = datetime.utcnow()
        else:
            created_at = datetime.utcnow()
        
        logger.info(f"Successfully created user: {email}")
        return {
            "id": user.id,
            "email": user.email or email,
            "name": name,
            "created_at": created_at
        }, None
        
    except Exception as e:
        error_msg = str(e)
        error_lower = error_msg.lower()
        
        logger.error(f"Registration error for {email}: {error_msg}", exc_info=True)
        
        # Parse Supabase auth errors for better messages
        if "user already registered" in error_lower or "already registered" in error_lower:
            return None, "An account with this email already exists. Please sign in instead."
        elif "email already exists" in error_lower or "duplicate" in error_lower:
            return None, "An account with this email already exists. Please sign in instead."
        elif "invalid email" in error_lower:
            return None, "Please enter a valid email address"
        elif "password" in error_lower and ("weak" in error_lower or "short" in error_lower):
            return None, "Password is too weak. Please use at least 6 characters."
        elif "email rate limit" in error_lower or "too many requests" in error_lower:
            return None, "Too many registration attempts. Please try again in a few minutes"
        else:
            # Generic error message
            return None, "Unable to create account. Please check your information and try again"


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Get user by ID from Supabase Auth
    """
    supabase = get_supabase_client()
    
    try:
        # Use Supabase Admin API to get user by ID
        # Note: This requires service role key
        admin_response = supabase.auth.admin.get_user_by_id(user_id)
        
        if admin_response.user is None:
            return None
        
        user = admin_response.user
        user_metadata = user.user_metadata or {}
        name = user_metadata.get("name") or user_metadata.get("full_name")
        
        # Get created_at
        created_at_str = user.created_at
        if created_at_str:
            try:
                created_at = datetime.fromisoformat(created_at_str.replace('Z', '+00:00'))
            except:
                created_at = datetime.utcnow()
        else:
            created_at = datetime.utcnow()
        
        return {
            "id": user.id,
            "email": user.email,
            "name": name,
            "created_at": created_at
        }
    except Exception as e:
        logger.error(f"Get user error for {user_id}: {e}", exc_info=True)
        return None
