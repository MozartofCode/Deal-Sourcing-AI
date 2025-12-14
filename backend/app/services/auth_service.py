"""
Authentication service using JWT and password hashing
"""
import os
from datetime import datetime, timedelta
from typing import Optional, Tuple
from jose import JWTError, jwt
from passlib.context import CryptContext
from app.database import get_supabase_client

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "your-secret-key-change-in-production")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against a hash"""
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create a JWT access token"""
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


async def authenticate_user(email: str, password: str) -> Optional[dict]:
    """Authenticate a user and return user data if valid"""
    supabase = get_supabase_client()
    
    try:
        # Get user from database
        response = supabase.table("users").select("*").eq("email", email).execute()
        
        if not response.data or len(response.data) == 0:
            return None
        
        user = response.data[0]
        
        # Verify password
        if not verify_password(password, user["password_hash"]):
            return None
        
        # Return user data (without password)
        return {
            "id": user["id"],
            "email": user["email"],
            "name": user.get("name"),
            "created_at": user["created_at"]
        }
    except Exception as e:
        print(f"Authentication error: {e}")
        return None


async def create_user(email: str, password: str, name: Optional[str] = None) -> Tuple[Optional[dict], Optional[str]]:
    """
    Create a new user
    Returns: (user_dict, error_message)
    - If successful: (user_dict, None)
    - If email exists: (None, "Email already registered")
    - If other error: (None, error_message)
    """
    supabase = get_supabase_client()
    
    try:
        # Check if user already exists
        existing = supabase.table("users").select("id").eq("email", email).execute()
        if existing.data and len(existing.data) > 0:
            return None, "Email already registered"
        
        # Validate password
        if not password or len(password) < 6:
            return None, "Password must be at least 6 characters long"
        
        # Hash password
        password_hash = get_password_hash(password)
        
        # Insert user
        user_data = {
            "email": email,
            "password_hash": password_hash,
            "name": name,
            "created_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("users").insert(user_data).execute()
        
        if response.data and len(response.data) > 0:
            user = response.data[0]
            return {
                "id": user["id"],
                "email": user["email"],
                "name": user.get("name"),
                "created_at": user["created_at"]
            }, None
        
        return None, "Failed to create user. Please try again."
    except Exception as e:
        error_msg = str(e)
        print(f"User creation error: {error_msg}")
        # Check for specific database errors
        if "duplicate" in error_msg.lower() or "unique" in error_msg.lower():
            return None, "Email already registered"
        return None, f"Database error: {error_msg}"


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """Get user by ID"""
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("users").select("id, email, name, created_at").eq("id", user_id).execute()
        if response.data and len(response.data) > 0:
            return response.data[0]
        return None
    except Exception as e:
        print(f"Get user error: {e}")
        return None

