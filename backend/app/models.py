"""
Database models and schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from enum import Enum


class PortfolioStatus(str, Enum):
    ACTIVE = "Active"
    REVIEWING = "Reviewing"
    INVESTED = "Invested"
    REJECTED = "Rejected"


# User Models
class UserType(str, Enum):
    ENTREPRENEUR = "entrepreneur"
    INVESTOR = "investor"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None
    user_type: Optional[UserType] = None


class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    user_type: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


# Portfolio Models
class PortfolioCreate(BaseModel):
    startup_name: str
    industry: Optional[str] = None
    stage: Optional[str] = None
    status: PortfolioStatus = PortfolioStatus.ACTIVE
    notes: Optional[str] = None
    analysis_data: Optional[dict] = None


class PortfolioUpdate(BaseModel):
    startup_name: Optional[str] = None
    industry: Optional[str] = None
    stage: Optional[str] = None
    status: Optional[PortfolioStatus] = None
    notes: Optional[str] = None
    analysis_data: Optional[dict] = None


class PortfolioResponse(BaseModel):
    id: str
    user_id: str
    startup_name: str
    industry: Optional[str] = None
    stage: Optional[str] = None
    status: str
    notes: Optional[str] = None
    analysis_data: Optional[dict] = None
    added_date: datetime
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Conversation Models
class ConversationCreate(BaseModel):
    title: Optional[str] = None


class ConversationResponse(BaseModel):
    id: str
    user_id: str
    title: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Message Models
class MessageCreate(BaseModel):
    conversation_id: str
    role: str  # "user" or "assistant"
    content: str


class MessageResponse(BaseModel):
    id: str
    conversation_id: str
    role: str
    content: str
    timestamp: datetime

    class Config:
        from_attributes = True


# Auth Models
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


class TokenData(BaseModel):
    user_id: Optional[str] = None


# User Profile Models
class UserProfileCreate(BaseModel):
    bio: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    investment_focus: Optional[str] = None
    startup_stage: Optional[str] = None
    funding_goal: Optional[float] = None
    check_size_min: Optional[float] = None
    check_size_max: Optional[float] = None
    portfolio_size: Optional[int] = None
    profile_image_url: Optional[str] = None
    is_public: bool = True


class UserProfileResponse(BaseModel):
    id: str
    user_id: str
    user_type: str
    bio: Optional[str] = None
    company_name: Optional[str] = None
    industry: Optional[str] = None
    location: Optional[str] = None
    website: Optional[str] = None
    linkedin_url: Optional[str] = None
    twitter_url: Optional[str] = None
    investment_focus: Optional[str] = None
    startup_stage: Optional[str] = None
    funding_goal: Optional[float] = None
    check_size_min: Optional[float] = None
    check_size_max: Optional[float] = None
    portfolio_size: Optional[int] = None
    profile_image_url: Optional[str] = None
    is_public: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Search History Models
class SearchHistoryCreate(BaseModel):
    search_type: str
    query: str
    filters: Optional[dict] = None
    results_count: Optional[int] = None


# Profile View Models
class ProfileViewCreate(BaseModel):
    viewed_type: str
    viewed_id: str
    viewed_name: Optional[str] = None
    metadata: Optional[dict] = None


# Saved Items Models
class SavedItemCreate(BaseModel):
    item_type: str
    item_id: str
    item_name: str
    item_data: Optional[dict] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None


class SavedItemResponse(BaseModel):
    id: str
    user_id: str
    item_type: str
    item_id: str
    item_name: str
    item_data: Optional[dict] = None
    notes: Optional[str] = None
    tags: Optional[List[str]] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Direct Message Models
class DirectMessageCreate(BaseModel):
    recipient_id: str
    subject: Optional[str] = None
    message: str
    related_item_type: Optional[str] = None
    related_item_id: Optional[str] = None


class DirectMessageResponse(BaseModel):
    id: str
    sender_id: str
    recipient_id: str
    subject: Optional[str] = None
    message: str
    is_read: bool
    related_item_type: Optional[str] = None
    related_item_id: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# AI Match Models
class AIMatchResponse(BaseModel):
    id: str
    user_id: str
    match_type: str
    matched_item_type: str
    matched_item_id: str
    matched_item_name: str
    match_score: Optional[float] = None
    match_reason: Optional[str] = None
    suggested_email_draft: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Connection Request Models
class ConnectionRequestCreate(BaseModel):
    recipient_id: str
    message: Optional[str] = None


class ConnectionRequestResponse(BaseModel):
    id: str
    requester_id: str
    recipient_id: str
    message: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

