from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.services.network_analysis import NetworkAnalysisService

router = APIRouter(prefix="/api/network", tags=["network"])

def get_current_user():
    return {"id": "user_id_placeholder"}

@router.post("/sync")
async def sync_network(access_token: str = None,
                      db: Session = Depends(get_db),
                      user = Depends(get_current_user)):
    """Sync LinkedIn network"""
    service = NetworkAnalysisService(user['id'], db)
    await service.sync_linkedin_network(access_token)
    return {"status": "sync_started"}

@router.get("/connections/{startup_name}")
async def find_connections(startup_name: str,
                         db: Session = Depends(get_db),
                         user = Depends(get_current_user)):
    """Find connections to a startup"""
    service = NetworkAnalysisService(user['id'], db)
    paths = await service.find_paths_to_startup(startup_name)
    return {"paths": paths}

@router.post("/intro/draft")
async def draft_intro(request_id: str = "new",
                     db: Session = Depends(get_db),
                     user = Depends(get_current_user)):
    """Draft introduction email"""
    service = NetworkAnalysisService(user['id'], db)
    return await service.draft_introduction_email(request_id)
