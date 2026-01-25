import os
import httpx
import logging
from typing import Optional, Dict, Any, List
from datetime import datetime, timedelta

logger = logging.getLogger(__name__)

# API Keys from environment
COMPANIES_API_KEY = os.getenv("COMPANIES_API_KEY", "")
ALPHA_VANTAGE_API_KEY = os.getenv("ALPHA_VANTAGE_API_KEY", "")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "")

# API Base URLs
COMPANIES_API_BASE = "https://api.thecompaniesapi.com/v1"
ALPHA_VANTAGE_BASE = "https://www.alphavantage.co/query"
NEWS_API_BASE = "https://newsapi.org/v2"


class CompaniesAPIClient:
    """Client for The Companies API - provides company data and competitive analysis"""
    
    @staticmethod
    async def enrich_company(domain: str) -> Optional[Dict[str, Any]]:
        """
        Enrich company data by domain name.
        Returns comprehensive company information including industry, size, funding, etc.
        """
        if not COMPANIES_API_KEY:
            logger.warning("COMPANIES_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{COMPANIES_API_BASE}/companies/{domain}",
                    headers={"Authorization": f"Bearer {COMPANIES_API_KEY}"}
                )
                response.raise_for_status()
                return response.json()
        except Exception as e:
            logger.error(f"Companies API error for {domain}: {str(e)}")
            return None
    
    @staticmethod
    async def search_similar_companies(domain: str) -> Optional[List[Dict[str, Any]]]:
        """
        Find similar/competitor companies based on a domain.
        Useful for competitive analysis.
        """
        if not COMPANIES_API_KEY:
            logger.warning("COMPANIES_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{COMPANIES_API_BASE}/companies/similar/{domain}",
                    headers={"Authorization": f"Bearer {COMPANIES_API_KEY}"}
                )
                response.raise_for_status()
                data = response.json()
                return data.get("companies", [])
        except Exception as e:
            logger.error(f"Companies API similar search error: {str(e)}")
            return None
    
    @staticmethod
    async def search_by_industry(industry: str, limit: int = 10) -> Optional[List[Dict[str, Any]]]:
        """
        Search companies by industry for market analysis.
        """
        if not COMPANIES_API_KEY:
            logger.warning("COMPANIES_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{COMPANIES_API_BASE}/companies",
                    params={"industry": industry, "limit": limit},
                    headers={"Authorization": f"Bearer {COMPANIES_API_KEY}"}
                )
                response.raise_for_status()
                data = response.json()
                return data.get("companies", [])
        except Exception as e:
            logger.error(f"Companies API industry search error: {str(e)}")
            return None


class AlphaVantageClient:
    """Client for Alpha Vantage API - provides stock market and financial data"""
    
    @staticmethod
    async def get_company_overview(symbol: str) -> Optional[Dict[str, Any]]:
        """
        Get fundamental company data including financials, ratios, and metrics.
        """
        if not ALPHA_VANTAGE_API_KEY:
            logger.warning("ALPHA_VANTAGE_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    ALPHA_VANTAGE_BASE,
                    params={
                        "function": "OVERVIEW",
                        "symbol": symbol,
                        "apikey": ALPHA_VANTAGE_API_KEY
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                # Check for API errors
                if "Error Message" in data or "Note" in data:
                    logger.warning(f"Alpha Vantage API limit or error: {data}")
                    return None
                    
                return data
        except Exception as e:
            logger.error(f"Alpha Vantage overview error for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    async def get_stock_quote(symbol: str) -> Optional[Dict[str, Any]]:
        """
        Get current stock price and trading data.
        """
        if not ALPHA_VANTAGE_API_KEY:
            logger.warning("ALPHA_VANTAGE_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    ALPHA_VANTAGE_BASE,
                    params={
                        "function": "GLOBAL_QUOTE",
                        "symbol": symbol,
                        "apikey": ALPHA_VANTAGE_API_KEY
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if "Error Message" in data or "Note" in data:
                    logger.warning(f"Alpha Vantage API limit or error: {data}")
                    return None
                    
                return data.get("Global Quote", {})
        except Exception as e:
            logger.error(f"Alpha Vantage quote error for {symbol}: {str(e)}")
            return None
    
    @staticmethod
    async def get_income_statement(symbol: str) -> Optional[Dict[str, Any]]:
        """
        Get annual and quarterly income statements.
        """
        if not ALPHA_VANTAGE_API_KEY:
            logger.warning("ALPHA_VANTAGE_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    ALPHA_VANTAGE_BASE,
                    params={
                        "function": "INCOME_STATEMENT",
                        "symbol": symbol,
                        "apikey": ALPHA_VANTAGE_API_KEY
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if "Error Message" in data or "Note" in data:
                    logger.warning(f"Alpha Vantage API limit or error: {data}")
                    return None
                    
                return data
        except Exception as e:
            logger.error(f"Alpha Vantage income statement error for {symbol}: {str(e)}")
            return None


class NewsAPIClient:
    """Client for News API - provides news articles and trend analysis"""
    
    @staticmethod
    async def search_company_news(company_name: str, days_back: int = 7) -> Optional[List[Dict[str, Any]]]:
        """
        Search for recent news articles about a company.
        """
        if not NEWS_API_KEY:
            logger.warning("NEWS_API_KEY not set")
            return None
            
        try:
            from_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{NEWS_API_BASE}/everything",
                    params={
                        "q": company_name,
                        "from": from_date,
                        "sortBy": "relevancy",
                        "language": "en",
                        "apiKey": NEWS_API_KEY
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") != "ok":
                    logger.warning(f"News API error: {data}")
                    return None
                    
                return data.get("articles", [])
        except Exception as e:
            logger.error(f"News API search error for {company_name}: {str(e)}")
            return None
    
    @staticmethod
    async def search_industry_trends(industry_keywords: str, days_back: int = 30) -> Optional[List[Dict[str, Any]]]:
        """
        Search for industry trends and news.
        """
        if not NEWS_API_KEY:
            logger.warning("NEWS_API_KEY not set")
            return None
            
        try:
            from_date = (datetime.now() - timedelta(days=days_back)).strftime("%Y-%m-%d")
            
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{NEWS_API_BASE}/everything",
                    params={
                        "q": industry_keywords,
                        "from": from_date,
                        "sortBy": "popularity",
                        "language": "en",
                        "apiKey": NEWS_API_KEY
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") != "ok":
                    logger.warning(f"News API error: {data}")
                    return None
                    
                return data.get("articles", [])
        except Exception as e:
            logger.error(f"News API industry trends error: {str(e)}")
            return None
    
    @staticmethod
    async def get_top_headlines(category: str = "business", country: str = "us") -> Optional[List[Dict[str, Any]]]:
        """
        Get top business headlines for market context.
        """
        if not NEWS_API_KEY:
            logger.warning("NEWS_API_KEY not set")
            return None
            
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.get(
                    f"{NEWS_API_BASE}/top-headlines",
                    params={
                        "category": category,
                        "country": country,
                        "apiKey": NEWS_API_KEY
                    }
                )
                response.raise_for_status()
                data = response.json()
                
                if data.get("status") != "ok":
                    logger.warning(f"News API error: {data}")
                    return None
                    
                return data.get("articles", [])
        except Exception as e:
            logger.error(f"News API headlines error: {str(e)}")
            return None


# Convenience function to gather all external data
async def gather_external_intelligence(
    company_name: str,
    company_domain: Optional[str] = None,
    stock_symbol: Optional[str] = None,
    industry: Optional[str] = None
) -> Dict[str, Any]:
    """
    Gather comprehensive external intelligence about a company and its market.
    
    Args:
        company_name: Name of the company
        company_domain: Company website domain (e.g., "apple.com")
        stock_symbol: Stock ticker symbol (e.g., "AAPL")
        industry: Industry keywords for trend analysis
    
    Returns:
        Dictionary containing all gathered intelligence
    """
    intelligence = {
        "company_data": None,
        "competitors": None,
        "industry_companies": None,
        "financial_overview": None,
        "stock_quote": None,
        "income_statement": None,
        "company_news": None,
        "industry_trends": None,
        "market_headlines": None
    }
    
    # Gather company data
    if company_domain:
        intelligence["company_data"] = await CompaniesAPIClient.enrich_company(company_domain)
        intelligence["competitors"] = await CompaniesAPIClient.search_similar_companies(company_domain)
    
    # Gather industry data
    if industry:
        intelligence["industry_companies"] = await CompaniesAPIClient.search_by_industry(industry)
        intelligence["industry_trends"] = await NewsAPIClient.search_industry_trends(industry)
    
    # Gather financial data
    if stock_symbol:
        intelligence["financial_overview"] = await AlphaVantageClient.get_company_overview(stock_symbol)
        intelligence["stock_quote"] = await AlphaVantageClient.get_stock_quote(stock_symbol)
        intelligence["income_statement"] = await AlphaVantageClient.get_income_statement(stock_symbol)
    
    # Gather news
    intelligence["company_news"] = await NewsAPIClient.search_company_news(company_name)
    intelligence["market_headlines"] = await NewsAPIClient.get_top_headlines()
    
    return intelligence
