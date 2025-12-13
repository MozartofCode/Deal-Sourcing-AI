"""
Portfolio management routes
"""
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from typing import List
from datetime import datetime
from app.models import (
    PortfolioCreate,
    PortfolioUpdate,
    PortfolioResponse,
    PortfolioStatus
)
from app.database import get_supabase_client
from app.services.auth_service import decode_access_token

router = APIRouter()
security = HTTPBearer()


def get_user_id_from_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> str:
    """Extract user ID from JWT token"""
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
    
    return user_id


@router.get("", response_model=List[PortfolioResponse])
async def get_portfolio(user_id: str = Depends(get_user_id_from_token)):
    """
    Get all startups in user's portfolio
    """
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("portfolios").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
        
        portfolios = []
        for item in response.data:
            portfolios.append(PortfolioResponse(**item))
        
        return portfolios
    except Exception as e:
        print(f"Error fetching portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio")


@router.post("", response_model=PortfolioResponse)
async def add_to_portfolio(
    portfolio_data: PortfolioCreate,
    user_id: str = Depends(get_user_id_from_token)
):
    """
    Add a startup to portfolio
    """
    supabase = get_supabase_client()
    
    try:
        portfolio_dict = {
            "user_id": user_id,
            "startup_name": portfolio_data.startup_name,
            "industry": portfolio_data.industry,
            "stage": portfolio_data.stage,
            "status": portfolio_data.status.value,
            "notes": portfolio_data.notes,
            "analysis_data": portfolio_data.analysis_data,
            "added_date": datetime.utcnow().isoformat(),
            "created_at": datetime.utcnow().isoformat(),
            "updated_at": datetime.utcnow().isoformat()
        }
        
        response = supabase.table("portfolios").insert(portfolio_dict).execute()
        
        if response.data and len(response.data) > 0:
            return PortfolioResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to create portfolio item")
    except Exception as e:
        print(f"Error adding to portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to add to portfolio")


@router.get("/{portfolio_id}", response_model=PortfolioResponse)
async def get_portfolio_item(
    portfolio_id: str,
    user_id: str = Depends(get_user_id_from_token)
):
    """
    Get a specific portfolio item
    """
    supabase = get_supabase_client()
    
    try:
        response = supabase.table("portfolios").select("*").eq("id", portfolio_id).eq("user_id", user_id).execute()
        
        if not response.data or len(response.data) == 0:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        return PortfolioResponse(**response.data[0])
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error fetching portfolio item: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio item")


@router.put("/{portfolio_id}", response_model=PortfolioResponse)
async def update_portfolio_item(
    portfolio_id: str,
    portfolio_data: PortfolioUpdate,
    user_id: str = Depends(get_user_id_from_token)
):
    """
    Update a portfolio item
    """
    supabase = get_supabase_client()
    
    try:
        # First verify the item belongs to the user
        check_response = supabase.table("portfolios").select("id").eq("id", portfolio_id).eq("user_id", user_id).execute()
        
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        # Build update dict (only include fields that are provided)
        update_dict = {"updated_at": datetime.utcnow().isoformat()}
        
        if portfolio_data.startup_name is not None:
            update_dict["startup_name"] = portfolio_data.startup_name
        if portfolio_data.industry is not None:
            update_dict["industry"] = portfolio_data.industry
        if portfolio_data.stage is not None:
            update_dict["stage"] = portfolio_data.stage
        if portfolio_data.status is not None:
            update_dict["status"] = portfolio_data.status.value
        if portfolio_data.notes is not None:
            update_dict["notes"] = portfolio_data.notes
        if portfolio_data.analysis_data is not None:
            update_dict["analysis_data"] = portfolio_data.analysis_data
        
        response = supabase.table("portfolios").update(update_dict).eq("id", portfolio_id).eq("user_id", user_id).execute()
        
        if response.data and len(response.data) > 0:
            return PortfolioResponse(**response.data[0])
        else:
            raise HTTPException(status_code=500, detail="Failed to update portfolio item")
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error updating portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to update portfolio")


@router.delete("/{portfolio_id}")
async def delete_portfolio_item(
    portfolio_id: str,
    user_id: str = Depends(get_user_id_from_token)
):
    """
    Delete a portfolio item
    """
    supabase = get_supabase_client()
    
    try:
        # Verify the item belongs to the user
        check_response = supabase.table("portfolios").select("id").eq("id", portfolio_id).eq("user_id", user_id).execute()
        
        if not check_response.data or len(check_response.data) == 0:
            raise HTTPException(status_code=404, detail="Portfolio item not found")
        
        # Delete the item
        supabase.table("portfolios").delete().eq("id", portfolio_id).eq("user_id", user_id).execute()
        
        return {"message": "Portfolio item deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error deleting portfolio: {e}")
        raise HTTPException(status_code=500, detail="Failed to delete portfolio item")


@router.get("/stats/summary")
async def get_portfolio_stats(user_id: str = Depends(get_user_id_from_token)):
    """
    Get portfolio statistics
    """
    supabase = get_supabase_client()
    
    try:
        # Get all portfolios for user
        response = supabase.table("portfolios").select("status").eq("user_id", user_id).execute()
        
        total = len(response.data) if response.data else 0
        active = sum(1 for item in response.data if item.get("status") == "Active") if response.data else 0
        reviewing = sum(1 for item in response.data if item.get("status") == "Reviewing") if response.data else 0
        invested = sum(1 for item in response.data if item.get("status") == "Invested") if response.data else 0
        
        return {
            "total": total,
            "active": active,
            "reviewing": reviewing,
            "invested": invested
        }
    except Exception as e:
        print(f"Error fetching portfolio stats: {e}")
        raise HTTPException(status_code=500, detail="Failed to fetch portfolio statistics")

