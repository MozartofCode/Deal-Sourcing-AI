"""
Authentication routes (Dummy Version)
"""
import logging
from fastapi import APIRouter
from app.models import UserCreate, UserLogin, UserResponse, Token

logger = logging.getLogger(__name__)

router = APIRouter()

GUEST_USER = {
    "id": "guest-user",
    "email": "guest@example.com",
    "name": "Guest User",
    "created_at": "2023-01-01T00:00:00",
    "has_profile": True
}

@router.post("/register", response_model=Token)
async def register(user_data: UserCreate):
    return {
        "access_token": "dummy-token",
        "token_type": "bearer",
        "user": UserResponse(**GUEST_USER)
    }

@router.post("/login", response_model=Token)
async def login(user_data: UserLogin):
    return {
        "access_token": "dummy-token",
        "token_type": "bearer",
        "user": UserResponse(**GUEST_USER)
    }

@router.get("/me", response_model=UserResponse)
async def get_current_user_info():
    return UserResponse(**GUEST_USER)

