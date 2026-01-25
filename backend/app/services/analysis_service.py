import os
import httpx
import json
import logging
from typing import Optional, Dict, Any
from app.models import AnalysisDecision
from app.services.external_apis import gather_external_intelligence

logger = logging.getLogger(__name__)

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = """You are a cynical, expert Venture Capital Investment Committee member with access to real-time market data.
Your job is to ruthlessly analyze startup pitch decks against a specific investment thesis using both the pitch deck content AND external market intelligence.
You must provide a clear recommendation: PROCEED (high conviction), CAUTION (interesting but flaws), or PASS (misaligned or weak).
You must output strictly valid JSON."""

async def analyze_deck(deck_content: str, thesis: Dict[str, Any], company_metadata: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    """
    Analyze a pitch deck against an investment thesis using Groq and external market intelligence.
    Returns structured analysis data enriched with real market data.
    
    Args:
        deck_content: Extracted text from the pitch deck
        thesis: Investor's investment thesis
        company_metadata: Optional metadata about the company (name, domain, ticker, industry)
    """
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY environment variable is not set.")

    # Gather external intelligence if company metadata is provided
    external_intelligence = {}
    if company_metadata:
        logger.info(f"Gathering external intelligence for {company_metadata.get('name', 'Unknown')}")
        try:
            external_intelligence = await gather_external_intelligence(
                company_name=company_metadata.get("name", ""),
                company_domain=company_metadata.get("domain"),
                stock_symbol=company_metadata.get("ticker"),
                industry=company_metadata.get("industry")
            )
            logger.info("External intelligence gathered successfully")
        except Exception as e:
            logger.warning(f"Failed to gather external intelligence: {str(e)}")
            external_intelligence = {}

    # Format Thesis for the prompt
    thesis_str = f"""
    Investment Thesis:
    - Description: {thesis.get('thesis', 'N/A')}
    - Stage: {thesis.get('investment_stage', 'Any')}
    - Ticket Size: ${thesis.get('min_ticket_size', 0)} - ${thesis.get('max_ticket_size', 'Unlimited')}
    - Target Industries: {', '.join(thesis.get('target_industries', []))}
    - Geography: {thesis.get('geography', 'Global')}
    """

    # Format external intelligence for the prompt
    intelligence_str = _format_external_intelligence(external_intelligence)

    user_message = f"""
    {thesis_str}

    ----------------
    PITCH DECK CONTENT:
    {deck_content[:30000]} 
    ----------------

    {intelligence_str}

    Evaluate this opportunity based on:
    1. Alignment with the investment thesis
    2. External market data and competitive landscape
    3. Financial health and market position (if available)
    4. Recent news sentiment and industry trends
    5. Competitive advantages vs similar companies
    
    Return ONLY a JSON object with this structure:
    {{
        "decision": "PROCEED" | "CAUTION" | "PASS",
        "score": <integer 0-100>,
        "summary": "<2-3 sentence executive summary incorporating market insights>",
        "strengths": ["<strength 1 with market context>", "<strength 2>", "<strength 3>"],
        "weaknesses": ["<weakness 1 with competitive analysis>", "<weakness 2>", "<weakness 3>"],
        "market_insights": "<1-2 sentences about market position and trends>",
        "competitive_analysis": "<1-2 sentences about competitive landscape>",
        "financial_health": "<1-2 sentences about financial metrics if available, or 'N/A'>"
    }}
    """

    try:
        response_json = await _get_groq_json_response(user_message)
        
        # Add external data summary to response
        response_json["external_data_used"] = _summarize_external_data(external_intelligence)
        
        return response_json
    except Exception as e:
        logger.error(f"Analysis failed: {str(e)}")
        # Fallback if AI fails
        return {
            "decision": "CAUTION",
            "score": 50,
            "summary": "AI Analysis failed to generate a structured response. Please review manually.",
            "strengths": ["Potential technical issue with analysis"],
            "weaknesses": ["Analysis not completed"],
            "market_insights": "N/A",
            "competitive_analysis": "N/A",
            "financial_health": "N/A",
            "raw_error": str(e)
        }


def _format_external_intelligence(intelligence: Dict[str, Any]) -> str:
    """Format external intelligence data for the AI prompt"""
    if not intelligence or not any(intelligence.values()):
        return ""
    
    sections = []
    
    # Company Data
    if intelligence.get("company_data"):
        company = intelligence["company_data"]
        sections.append(f"""
    COMPANY DATA (from The Companies API):
    - Industry: {company.get('industry', 'N/A')}
    - Size: {company.get('size', 'N/A')} employees
    - Founded: {company.get('founded', 'N/A')}
    - Location: {company.get('location', 'N/A')}
    - Description: {company.get('description', 'N/A')[:200]}
        """)
    
    # Competitors
    if intelligence.get("competitors"):
        competitors = intelligence["competitors"][:5]  # Top 5
        comp_names = [c.get('name', 'Unknown') for c in competitors]
        sections.append(f"""
    COMPETITORS:
    - Similar companies: {', '.join(comp_names)}
        """)
    
    # Financial Data
    if intelligence.get("financial_overview"):
        fin = intelligence["financial_overview"]
        sections.append(f"""
    FINANCIAL OVERVIEW (from Alpha Vantage):
    - Market Cap: ${fin.get('MarketCapitalization', 'N/A')}
    - P/E Ratio: {fin.get('PERatio', 'N/A')}
    - Revenue (TTM): ${fin.get('RevenueTTM', 'N/A')}
    - Profit Margin: {fin.get('ProfitMargin', 'N/A')}
    - 52 Week High/Low: ${fin.get('52WeekHigh', 'N/A')} / ${fin.get('52WeekLow', 'N/A')}
        """)
    
    # Stock Quote
    if intelligence.get("stock_quote"):
        quote = intelligence["stock_quote"]
        sections.append(f"""
    CURRENT STOCK DATA:
    - Price: ${quote.get('05. price', 'N/A')}
    - Change: {quote.get('09. change', 'N/A')} ({quote.get('10. change percent', 'N/A')})
    - Volume: {quote.get('06. volume', 'N/A')}
        """)
    
    # News Sentiment
    if intelligence.get("company_news"):
        news = intelligence["company_news"][:3]  # Top 3 articles
        if news:
            news_titles = [f"- {article.get('title', 'N/A')}" for article in news]
            sections.append(f"""
    RECENT NEWS (from News API):
    {chr(10).join(news_titles)}
            """)
    
    # Industry Trends
    if intelligence.get("industry_trends"):
        trends = intelligence["industry_trends"][:3]  # Top 3 trends
        if trends:
            trend_titles = [f"- {article.get('title', 'N/A')}" for article in trends]
            sections.append(f"""
    INDUSTRY TRENDS:
    {chr(10).join(trend_titles)}
            """)
    
    if sections:
        return "\n----------------\nEXTERNAL MARKET INTELLIGENCE:\n" + "\n".join(sections) + "\n----------------\n"
    
    return ""


def _summarize_external_data(intelligence: Dict[str, Any]) -> Dict[str, bool]:
    """Summarize which external data sources were successfully used"""
    return {
        "company_data": bool(intelligence.get("company_data")),
        "competitors": bool(intelligence.get("competitors")),
        "financial_data": bool(intelligence.get("financial_overview")),
        "stock_data": bool(intelligence.get("stock_quote")),
        "news": bool(intelligence.get("company_news")),
        "industry_trends": bool(intelligence.get("industry_trends"))
    }

async def _get_groq_json_response(user_message: str) -> Dict[str, Any]:
    """Get JSON response from Groq API"""
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "user", "content": user_message}
    ]
    
    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.1, # Low temp for structured output
        "response_format": {"type": "json_object"}
    }
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    async with httpx.AsyncClient(timeout=60.0) as client:
        response = await client.post(
            GROQ_API_URL,
            json=payload,
            headers=headers
        )
        response.raise_for_status()
        result = response.json()
        
        if "choices" in result and len(result["choices"]) > 0:
            content = result["choices"][0]["message"]["content"]
            try:
                return json.loads(content)
            except json.JSONDecodeError:
                # Try to clean markdown
                if "```json" in content:
                    content = content.split("```json")[1].split("```")[0]
                elif "```" in content:
                    content = content.split("```")[1].split("```")[0]
                return json.loads(content.strip())
        
        raise Exception("Empty response from AI")
