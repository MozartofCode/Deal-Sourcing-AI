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


class PortfolioStartupInfo(BaseModel):
    id: int
    startup_name: str
    industry: Optional[str] = None
    stage: Optional[str] = None
    notes: Optional[str] = None


class StartupAnalysisRequest(BaseModel):
    startup_name: str
    analysis_types: List[str] = ["comprehensive"]  # List of: comprehensive, ip, financials, team, market
    custom_query: Optional[str] = None
    portfolio_startup: Optional[PortfolioStartupInfo] = None


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
    Discover startups using Groq API to generate search results
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
    Analyze a startup using Groq API - IP, financials, team, market position
    Supports multiple analysis types, custom queries, and portfolio startup info
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
    
    if not request.analysis_types or len(request.analysis_types) == 0:
        raise HTTPException(status_code=400, detail="At least one analysis type must be selected")
    
    try:
        # Build portfolio context if provided
        portfolio_context = ""
        if request.portfolio_startup:
            portfolio_context = f"""
            
PORTFOLIO CONTEXT (from user's saved portfolio):
- Startup Name: {request.portfolio_startup.startup_name}
- Industry: {request.portfolio_startup.industry or 'Not specified'}
- Stage: {request.portfolio_startup.stage or 'Not specified'}
- User Notes: {request.portfolio_startup.notes or 'No notes provided'}
"""
        
        # Build analysis sections based on selected types
        analysis_sections = []
        
        if "comprehensive" in request.analysis_types:
            analysis_sections.append("""
1. COMPANY OVERVIEW
   - Brief description, business model, value proposition
   - Key products/services
   - Target customers
""")
        
        if "ip" in request.analysis_types:
            analysis_sections.append("""
2. INTELLECTUAL PROPERTY PORTFOLIO
   - Number of patents (active and pending)
   - Key patent areas/technologies
   - Trademarks and brand protection
   - Proprietary technology or trade secrets
   - IP strategy and competitive advantages
""")
        
        if "financials" in request.analysis_types:
            analysis_sections.append("""
3. FINANCIAL METRICS
   - Funding rounds and amounts raised
   - Revenue estimates (ARR if available)
   - Growth rate (YoY)
   - Unit economics (CAC, LTV, margins)
   - Burn rate and runway
   - Valuation estimates if known
""")
        
        if "team" in request.analysis_types:
            analysis_sections.append("""
4. FOUNDING TEAM
   - Key team members and their roles
   - Professional backgrounds and previous experience
   - Education and expertise
   - Track record and achievements
   - Team composition and gaps
""")
        
        if "market" in request.analysis_types:
            analysis_sections.append("""
5. MARKET POSITION
   - Target market size (TAM, SAM, SOM)
   - Competitive landscape and key competitors
   - Market share and positioning
   - Competitive advantages and differentiation
   - Market trends and opportunities
""")
        
        # Build the main prompt
        sections_text = "\n".join(analysis_sections)
        
        prompt = f"""As a VC analyst, provide a detailed analysis of {request.startup_name}.{portfolio_context}

Please provide the following analysis:{sections_text}

Be detailed, data-driven, and provide actionable insights."""
        
        # Add custom query if provided
        if request.custom_query and request.custom_query.strip():
            prompt += f"\n\nADDITIONAL QUESTION FROM USER:\n{request.custom_query}\n\nPlease address this specific question in your analysis."
        
        response_message = await get_openai_response(prompt)
        
        return {
            "analysis": response_message,
            "startup_name": request.startup_name,
            "analysis_types": request.analysis_types,
            "remaining_requests": remaining
        }
    except ValueError as e:
        raise HTTPException(status_code=500, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.post("/search")
async def search(request: SearchRequest, http_request: Request):
    """
    General search across startups, founders, technologies, and markets using Groq API
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

