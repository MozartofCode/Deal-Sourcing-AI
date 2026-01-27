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

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

def format_error_message(e: Exception) -> str:
    """Helper to extract detailed error message from exceptions"""
    error_msg = str(e)
    # Handle Supabase/Gotrue error objects which might have 'message' or 'msg'
    if hasattr(e, 'message'):
        error_msg = e.message
    elif hasattr(e, 'msg'):
        error_msg = e.msg
    
    # Check if it has a code
    if hasattr(e, 'code'):
        error_msg = f"{error_msg} (Code: {e.code})"
        
    return error_msg



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
    """
    supabase = get_supabase_client()
    
    try:
        auth_response = supabase.auth.sign_in_with_password({
            "email": email,
            "password": password
        })
        
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
        
        logger.info(f"Successfully authenticated user: {email}")
        
        # Get session tokens
        access_token = None
        refresh_token = None
        if auth_response.session:
            access_token = auth_response.session.access_token
            refresh_token = auth_response.session.refresh_token
            
        return {
            "id": user.id,
            "email": user.email or email,
            "name": name,
            "created_at": created_at,
            "access_token": access_token,
            "refresh_token": refresh_token
        }, None
        
    except Exception as e:
        detailed_error = format_error_message(e)
        logger.error(f"Authentication error for {email}: {detailed_error}", exc_info=True)
        
        error_msg_lower = detailed_error.lower()
        if "invalid login credentials" in error_msg_lower or "invalid credentials" in error_msg_lower:
             return None, "Incorrect email or password. Please try again."
        elif "email not confirmed" in error_msg_lower:
             return None, "Please verify your email address before signing in. Check your inbox."
        
        # Return the actual error message if it helps debugging, but keep it user friendly enough
        return None, f"Unable to sign in: {detailed_error}"


async def create_user(email: str, password: str, name: Optional[str] = None) -> Tuple[Optional[dict], Optional[str]]:
    """
    Create a new user using Supabase Auth API
    """
    supabase = get_supabase_client()
    
    try:
        if not password or len(password) < 6:
            return None, "Password must be at least 6 characters long"
        
        user_metadata = {}
        if name:
            user_metadata["name"] = name
            user_metadata["full_name"] = name
        
        auth_response = supabase.auth.sign_up({
            "email": email,
            "password": password,
            "options": {
                "data": user_metadata
            }
        })
        
        if hasattr(auth_response, 'error') and auth_response.error:
            error_msg = str(auth_response.error).lower()
            logger.warning(f"Registration failed for {email}: {auth_response.error}")
            if "user already registered" in error_msg or "already registered" in error_msg:
                return None, "An account with this email already exists. Please sign in instead."
            elif "email already exists" in error_msg:
                return None, "An account with this email already exists. Please sign in instead."
            elif "invalid email" in error_msg:
                return None, "Please enter a valid email address"
            elif "password" in error_msg:
                return None, "Password is too weak. Please use at least 6 characters."
            else:
                return None, "Unable to create account. Please check your information and try again"
        
        if auth_response.user is None:
            logger.warning(f"Registration failed for {email}: No user returned")
            return None, "Failed to create account. Please try again."
        
        user = auth_response.user
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
        
        logger.info(f"Successfully created user: {email}")
        
        # Get session tokens if available (auto sign-in)
        access_token = None
        refresh_token = None
        if auth_response.session:
            access_token = auth_response.session.access_token
            refresh_token = auth_response.session.refresh_token
            
        return {
            "id": user.id,
            "email": user.email or email,
            "name": name,
            "created_at": created_at,
            "access_token": access_token,
            "refresh_token": refresh_token
        }, None
        
    except Exception as e:
        detailed_error = format_error_message(e)
        logger.error(f"Registration error for {email}: {detailed_error}", exc_info=True)
        
        error_msg_lower = detailed_error.lower()
        if "user already registered" in error_msg_lower or "already registered" in error_msg_lower:
             return None, "An account with this email already exists. Please sign in instead."
        elif "password" in error_msg_lower and ("weak" in error_msg_lower or "short" in error_msg_lower):
             return None, "Password is too weak. Please use at least 6 characters."
        
        return None, f"Unable to create account: {detailed_error}"


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """
    Get user by ID from Supabase Auth
    """
    supabase = get_supabase_client()
    
    try:
        # Use Supabase Admin API to get user by ID
        admin_response = supabase.auth.admin.get_user_by_id(user_id)
        
        if admin_response.user is None:
            return None
        
        user = admin_response.user
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
        
        return {
            "id": user.id,
            "email": user.email,
            "name": name,
            "created_at": created_at
        }
    except Exception as e:
        detailed_error = format_error_message(e)
        logger.error(f"Get user error for {user_id}: {detailed_error}", exc_info=True)
        return None
