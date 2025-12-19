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

