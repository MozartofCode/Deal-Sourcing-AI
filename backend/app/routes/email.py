from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.services.email_automation import EmailAutomationService, DealPipelineManager
# Assuming auth middleware provides get_current_user
# from app.middleware.auth import get_current_user

router = APIRouter(prefix="/api/emails", tags=["emails"])

# Mock user dependency for now
def get_current_user():
    return {"id": "user_id_placeholder"}

@router.post("/sync")
async def sync_emails(background_tasks: BackgroundTasks, 
                     db: Session = Depends(get_db),
                     user = Depends(get_current_user)):
    """Trigger email sync from Gmail"""
    service = EmailAutomationService(user['id'], db)
    
    # Run in background
    # background_tasks.add_task(service.sync_emails)
    
    # For demo, await it
    emails = await service.sync_emails()
    
    return {"status": "sync_started", "synced_count": len(emails)}

@router.get("/pipeline")
async def get_pipeline(db: Session = Depends(get_db),
                      user = Depends(get_current_user)):
    """Get deal pipeline status"""
    manager = DealPipelineManager(user['id'], db)
    return await manager.get_pipeline_status()

@router.post("/{deal_id}/follow-up")
async def send_follow_up(deal_id: str, 
                        db: Session = Depends(get_db),
                        user = Depends(get_current_user)):
    """Send automated follow-up"""
    service = EmailAutomationService(user['id'], db)
    result = await service.send_follow_up(deal_id)
    return {"success": result}
