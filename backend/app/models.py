"""
Database models and schemas for Deal Sourcing AI
"""
from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum

# --- Enums ---
class AnalysisDecision(str, Enum):
    PROCEED = "PROCEED"
    CAUTION = "CAUTION"
    PASS = "PASS"

# --- User Models ---
class UserCreate(BaseModel):
    email: EmailStr
    password: str
    name: Optional[str] = None

class UserResponse(BaseModel):
    id: str
    email: str
    name: Optional[str] = None
    has_profile: bool = False
    created_at: datetime

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# --- Auth Models ---
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class TokenData(BaseModel):
    user_id: Optional[str] = None

# --- Investor Profile (Thesis) Models ---
class InvestorProfileBase(BaseModel):
    thesis: str
    min_ticket_size: Optional[float] = None  # in USD
    max_ticket_size: Optional[float] = None
    target_industries: List[str] = []
    geography: Optional[str] = None
    investment_stage: Optional[str] = None # Seed, Series A, etc.
    expected_return: Optional[str] = None # e.g. "10x in 5 years"

class InvestorProfileCreate(InvestorProfileBase):
    pass

class InvestorProfileUpdate(InvestorProfileBase):
    pass

class InvestorProfileResponse(InvestorProfileBase):
    id: str
    user_id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# --- Diligence Report Models ---
class DiligenceReportCreate(BaseModel):
    deck_content: str # content extracted or URL
    deck_filename: Optional[str] = None

class DiligenceReportResponse(BaseModel):
    id: str
    user_id: str
    deck_filename: Optional[str]
    decision: AnalysisDecision
    score: int # 0-100
    summary: str
    strengths: List[str]
    weaknesses: List[str]
    analysis_json: Dict[str, Any] # Full raw analysis
    created_at: datetime

    class Config:
        from_attributes = True
