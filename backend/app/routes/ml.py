from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Dict

from app.database import get_db
from app.services.thesis_learning import ThesisLearningService

router = APIRouter(prefix="/api/ml", tags=["machine-learning"])

def get_current_user():
    return {"id": "user_id_placeholder"}

@router.get("/thesis")
async def get_thesis(db: Session = Depends(get_db),
                    user = Depends(get_current_user)):
    """Get learned investment thesis"""
    service = ThesisLearningService(user['id'], db)
    return await service.extract_thesis_profile()

@router.post("/train")
async def train_model(db: Session = Depends(get_db),
                     user = Depends(get_current_user)):
    """Trigger model training"""
    service = ThesisLearningService(user['id'], db)
    result = await service.train_preference_model()
    return result

@router.post("/recommendations")
async def get_recommendations(startups: List[Dict],
                            db: Session = Depends(get_db),
                            user = Depends(get_current_user)):
    """Get scored recommendations for a list of startups"""
    service = ThesisLearningService(user['id'], db)
    return await service.get_personalized_recommendations(startups)
