"""
Authentication routes
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import UserCreate, UserLogin, UserResponse, Token
from app.services.auth_service import (
    authenticate_user,
    create_user,
    create_access_token,
    get_user_by_id,
    decode_access_token,
)
from datetime import timedelta

router = APIRouter()
security = HTTPBearer()


@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    """
    Register a new user
    """
    # Create user
    user = await create_user(
        email=user_data.email,
        password=user_data.password,
        name=user_data.name
    )
    
    if user is None:
        raise HTTPException(
            status_code=400,
            detail="Email already registered or invalid data"
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
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
    user = await authenticate_user(user_data.email, user_data.password)
    
    if user is None:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=60 * 24 * 7)  # 7 days
    access_token = create_access_token(
        data={"sub": user["id"]},
        expires_delta=access_token_expires
    )
    
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
    
    user = await get_user_by_id(user_id)
    if user is None:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )
    
    return UserResponse(**user)

