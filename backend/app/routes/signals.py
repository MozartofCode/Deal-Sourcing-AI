from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.services.signal_analysis import SignalAnalysisService

router = APIRouter(prefix="/api/signals", tags=["signals"])

def get_current_user():
    return {"id": "user_id_placeholder"}

@router.post("/analyze/{startup_id}")
async def analyze_startup(startup_id: str,
                         startup_data: Dict,
                         db: Session = Depends(get_db),
                         user = Depends(get_current_user)):
    """Analyze startup signals"""
    service = SignalAnalysisService(user['id'], db)
    return await service.analyze_startup(startup_id, startup_data)
