"""
Test script for external API integrations
Run this to verify all API keys are working correctly
"""
import asyncio
import os
from pathlib import Path
from dotenv import load_dotenv

# Load environment variables from backend/.env
env_path = Path(__file__).parent / 'backend' / '.env'
load_dotenv(env_path)

# Import our API clients
import sys
sys.path.append('backend')
from app.services.external_apis import (
    CompaniesAPIClient,
    AlphaVantageClient,
    NewsAPIClient,
    gather_external_intelligence
)

async def test_companies_api():
    """Test The Companies API"""
    print("\n" + "="*60)
    print("Testing The Companies API")
    print("="*60)
    
    # Test company enrichment
    print("\n1. Testing company enrichment for 'stripe.com'...")
    result = await CompaniesAPIClient.enrich_company("stripe.com")
    if result:
        print("✅ SUCCESS - Company data retrieved")
        print(f"   Company: {result.get('name', 'N/A')}")
        print(f"   Industry: {result.get('industry', 'N/A')}")
        print(f"   Size: {result.get('size', 'N/A')}")
    else:
        print("❌ FAILED - Check API key or rate limits")
    
    # Test similar companies
    print("\n2. Testing competitor search...")
    competitors = await CompaniesAPIClient.search_similar_companies("stripe.com")
    if competitors:
        print(f"✅ SUCCESS - Found {len(competitors)} similar companies")
        if competitors:
            print(f"   Examples: {', '.join([c.get('name', 'Unknown') for c in competitors[:3]])}")
    else:
        print("❌ FAILED - Check API key or rate limits")

async def test_alpha_vantage_api():
    """Test Alpha Vantage API"""
    print("\n" + "="*60)
    print("Testing Alpha Vantage API")
    print("="*60)
    
    # Test company overview
    print("\n1. Testing company overview for 'IBM'...")
    result = await AlphaVantageClient.get_company_overview("IBM")
    if result:
        print("✅ SUCCESS - Financial data retrieved")
        print(f"   Symbol: {result.get('Symbol', 'N/A')}")
        print(f"   Market Cap: ${result.get('MarketCapitalization', 'N/A')}")
        print(f"   P/E Ratio: {result.get('PERatio', 'N/A')}")
    else:
        print("❌ FAILED - Check API key or rate limits")
    
    # Test stock quote
    print("\n2. Testing stock quote for 'IBM'...")
    quote = await AlphaVantageClient.get_stock_quote("IBM")
    if quote:
        print("✅ SUCCESS - Stock quote retrieved")
        print(f"   Price: ${quote.get('05. price', 'N/A')}")
        print(f"   Volume: {quote.get('06. volume', 'N/A')}")
    else:
        print("❌ FAILED - Check API key or rate limits")

async def test_news_api():
    """Test News API"""
    print("\n" + "="*60)
    print("Testing News API")
    print("="*60)
    
    # Test company news
    print("\n1. Testing company news for 'Tesla'...")
    articles = await NewsAPIClient.search_company_news("Tesla", days_back=7)
    if articles:
        print(f"✅ SUCCESS - Found {len(articles)} articles")
        if articles:
            print(f"   Latest: {articles[0].get('title', 'N/A')}")
    else:
        print("❌ FAILED - Check API key or rate limits")
    
    # Test industry trends
    print("\n2. Testing industry trends for 'artificial intelligence'...")
    trends = await NewsAPIClient.search_industry_trends("artificial intelligence", days_back=7)
    if trends:
        print(f"✅ SUCCESS - Found {len(trends)} trend articles")
        if trends:
            print(f"   Top trend: {trends[0].get('title', 'N/A')}")
    else:
        print("❌ FAILED - Check API key or rate limits")

async def test_full_integration():
    """Test the full intelligence gathering function"""
    print("\n" + "="*60)
    print("Testing Full Intelligence Gathering")
    print("="*60)
    
    print("\nGathering intelligence for Tesla...")
    intelligence = await gather_external_intelligence(
        company_name="Tesla",
        company_domain="tesla.com",
        stock_symbol="TSLA",
        industry="Electric Vehicles"
    )
    
    print("\nResults:")
    print(f"  Company Data: {'✅' if intelligence.get('company_data') else '❌'}")
    print(f"  Competitors: {'✅' if intelligence.get('competitors') else '❌'}")
    print(f"  Industry Companies: {'✅' if intelligence.get('industry_companies') else '❌'}")
    print(f"  Financial Overview: {'✅' if intelligence.get('financial_overview') else '❌'}")
    print(f"  Stock Quote: {'✅' if intelligence.get('stock_quote') else '❌'}")
    print(f"  Company News: {'✅' if intelligence.get('company_news') else '❌'}")
    print(f"  Industry Trends: {'✅' if intelligence.get('industry_trends') else '❌'}")

async def main():
    """Run all tests"""
    print("\n" + "="*60)
    print("EXTERNAL API INTEGRATION TEST SUITE")
    print("="*60)
    
    # Check if API keys are set
    print("\nChecking API Keys...")
    companies_key = os.getenv("COMPANIES_API_KEY")
    alpha_key = os.getenv("ALPHA_VANTAGE_API_KEY")
    news_key = os.getenv("NEWS_API_KEY")
    
    print(f"  The Companies API: {'✅ Set' if companies_key else '❌ Missing'}")
    print(f"  Alpha Vantage API: {'✅ Set' if alpha_key else '❌ Missing'}")
    print(f"  News API: {'✅ Set' if news_key else '❌ Missing'}")
    
    if not all([companies_key, alpha_key, news_key]):
        print("\n⚠️  WARNING: Some API keys are missing!")
        print("Please check your .env file and ensure all keys are set.")
        return
    
    # Run individual API tests
    await test_companies_api()
    await test_alpha_vantage_api()
    await test_news_api()
    
    # Run full integration test
    await test_full_integration()
    
    print("\n" + "="*60)
    print("TEST SUITE COMPLETE")
    print("="*60)
    print("\nNote: Some failures may be due to API rate limits.")
    print("If you see consistent failures, verify your API keys.\n")

if __name__ == "__main__":
    asyncio.run(main())
