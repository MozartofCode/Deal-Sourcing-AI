from fastapi import APIRouter, HTTPException, Request
from pydantic import BaseModel
from typing import Optional, List
from app.services.openai_service import get_openai_response
from app.services.rate_limiter import rate_limiter

router = APIRouter()


class StartupSearchRequest(BaseModel):
    query: str
    industry: Optional[str] = None
    stage: Optional[str] = None


class StartupAnalysisRequest(BaseModel):
    startup_name: str
    analysis_type: str = "comprehensive"  # comprehensive, ip, financials, team, market


class SearchRequest(BaseModel):
    query: str
    search_type: str = "all"  # all, startups, founders, technologies, markets


def get_user_id(request: Request) -> str:
    """Get user identifier from request (IP address)"""
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        return forwarded.split(",")[0].strip()
    
    real_ip = request.headers.get("X-Real-IP")
    if real_ip:
        return real_ip
    
    if request.client:
        return request.client.host
    
    return "unknown"


@router.post("/discover")
async def discover_startups(request: StartupSearchRequest, http_request: Request):
    """
    Discover startups using OpenAI to generate search results
    """
    user_id = get_user_id(http_request)
    
    # Check rate limit
    is_allowed, remaining = rate_limiter.is_allowed(user_id)
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "message": "You have reached the maximum of 5 requests. Please try again later.",
                "remaining_requests": 0
            }
        )
    
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    try:
        # Build a prompt for startup discovery
        prompt = f"""As a VC analyst, help me discover startups. 
        
Search query: {request.query}
{f"Industry filter: {request.industry}" if request.industry and request.industry != "all" else ""}
{f"Stage filter: {request.stage}" if request.stage and request.stage != "all" else ""}

Please provide a list of 5-10 relevant startups that match this search. For each startup, provide:
- Name
- Industry
- Stage (Pre-Seed, Seed, Series A, Series B, Series C+)
- Brief description (1-2 sentences)
- Location
- Founded year
- Team size estimate

Format the response as a clear list with these details for each startup."""

        response_message = await get_openai_response(prompt)
        
        return {
            "results": response_message,
            "query": request.query,
            "remaining_requests": remaining
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.post("/analyze")
async def analyze_startup(request: StartupAnalysisRequest, http_request: Request):
    """
    Analyze a startup using OpenAI - IP, financials, team, market position
    """
    user_id = get_user_id(http_request)
    
    # Check rate limit
    is_allowed, remaining = rate_limiter.is_allowed(user_id)
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "message": "You have reached the maximum of 5 requests. Please try again later.",
                "remaining_requests": 0
            }
        )
    
    if not request.startup_name or not request.startup_name.strip():
        raise HTTPException(status_code=400, detail="Startup name cannot be empty")
    
    try:
        # Build analysis prompt based on type
        analysis_prompts = {
            "comprehensive": f"""Provide a comprehensive analysis of {request.startup_name}. Include:
1. Company Overview - brief description, business model, value proposition
2. Intellectual Property - patents, trademarks, proprietary technology
3. Financial Health - funding rounds, revenue estimates, growth metrics, unit economics
4. Founding Team - key members, backgrounds, experience
5. Market Position - competitive landscape, market size, differentiation

Be detailed and data-driven.""",
            
            "ip": f"""Analyze the intellectual property portfolio of {request.startup_name}. Include:
- Number of patents (active and pending)
- Key patent areas/technologies
- Trademarks and brand protection
- Proprietary technology or trade secrets
- IP strategy and competitive advantages""",
            
            "financials": f"""Analyze the financial metrics of {request.startup_name}. Include:
- Funding rounds and amounts raised
- Revenue estimates (ARR if available)
- Growth rate (YoY)
- Unit economics (CAC, LTV, margins)
- Burn rate and runway
- Valuation estimates if known""",
            
            "team": f"""Analyze the founding team of {request.startup_name}. Include:
- Key team members and their roles
- Professional backgrounds and previous experience
- Education and expertise
- Track record and achievements
- Team composition and gaps""",
            
            "market": f"""Analyze the market position of {request.startup_name}. Include:
- Target market size (TAM, SAM, SOM)
- Competitive landscape and key competitors
- Market share and positioning
- Competitive advantages and differentiation
- Market trends and opportunities"""
        }
        
        prompt = analysis_prompts.get(
            request.analysis_type, 
            analysis_prompts["comprehensive"]
        )
        
        response_message = await get_openai_response(prompt)
        
        return {
            "analysis": response_message,
            "startup_name": request.startup_name,
            "analysis_type": request.analysis_type,
            "remaining_requests": remaining
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.post("/search")
async def search(request: SearchRequest, http_request: Request):
    """
    General search across startups, founders, technologies, and markets using OpenAI
    """
    user_id = get_user_id(http_request)
    
    # Check rate limit
    is_allowed, remaining = rate_limiter.is_allowed(user_id)
    if not is_allowed:
        raise HTTPException(
            status_code=429,
            detail={
                "error": "Rate limit exceeded",
                "message": "You have reached the maximum of 5 requests. Please try again later.",
                "remaining_requests": 0
            }
        )
    
    if not request.query or not request.query.strip():
        raise HTTPException(status_code=400, detail="Search query cannot be empty")
    
    try:
        search_type_descriptions = {
            "all": "startups, founders, technologies, and market trends",
            "startups": "startup companies",
            "founders": "founders and entrepreneurs",
            "technologies": "technologies and tech stacks",
            "markets": "market trends and opportunities"
        }
        
        search_scope = search_type_descriptions.get(request.search_type, "all relevant information")
        
        prompt = f"""As a VC analyst, help me search for information about: {request.query}
        
Search scope: {search_scope}

Please provide relevant results. For each result, include:
- Title/Name
- Type (startup, founder, technology, or market trend)
- Brief description
- Key details or metadata

Format as a clear list with 5-10 relevant results."""

        response_message = await get_openai_response(prompt)
        
        return {
            "results": response_message,
            "query": request.query,
            "search_type": request.search_type,
            "remaining_requests": remaining
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

