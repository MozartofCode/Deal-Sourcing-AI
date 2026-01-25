"""
Analysis Routes
"""
import logging
import io
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from app.models import DiligenceReportResponse
from app.database import get_supabase_client, get_authenticated_supabase_client
from app.services.auth_service import decode_access_token
from app.services.analysis_service import analyze_deck
from pypdf import PdfReader

logger = logging.getLogger(__name__)

router = APIRouter()
security = HTTPBearer()

def get_user_id_from_token(token: str) -> str:
    payload = decode_access_token(token)
    if not payload or not payload.get("sub"):
        raise HTTPException(status_code=401, detail="Invalid token")
    return payload.get("sub")

@router.post("/", response_model=DiligenceReportResponse)
async def analyze_pitch_deck(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    file: UploadFile = File(None),
    text_content: str = Form(None),
    company_name: str = Form(None),
    company_domain: str = Form(None),
    stock_ticker: str = Form(None),
    industry: str = Form(None),
):
    """
    Analyze a pitch deck (PDF upload or raw text) against the user's thesis.
    """
    token = credentials.credentials
    user_id = get_user_id_from_token(token)
    
    # Use authenticated client
    supabase = get_authenticated_supabase_client(token)
    
    # 1. Fetch User Thesis
    try:
        profile_response = supabase.table("investor_profiles").select("*").eq("user_id", user_id).maybe_single().execute()
        if not profile_response.data:
            raise HTTPException(status_code=400, detail="Please complete your Investor Profile (Thesis) before analyzing deals.")
        thesis_data = profile_response.data
    except HTTPException:
        raise
    except Exception as e:
        # Check for Postgrest 204 (No Content) error
        error_str = str(e)
        if "204" in error_str and "Missing response" in error_str:
             raise HTTPException(status_code=400, detail="Please complete your Investor Profile (Thesis) before analyzing deals.")

        logger.error(f"Error fetching investor profile: {e}")
        raise HTTPException(status_code=400, detail="Please complete your Investor Profile (Thesis) before analyzing deals.")
    
    # 2. Extract Content
    deck_text = ""
    filename = "Manual Text"
    
    if file:
        filename = file.filename
        content_type = file.content_type
        
        if content_type == "application/pdf":
            try:
                contents = await file.read()
                pdf_file = io.BytesIO(contents)
                reader = PdfReader(pdf_file)
                for page in reader.pages:
                    deck_text += page.extract_text() + "\n"
            except Exception as e:
                logger.error(f"PDF extraction failed: {e}")
                raise HTTPException(status_code=400, detail="Failed to read PDF file")
        elif content_type.startswith("text/"):
            contents = await file.read()
            deck_text = contents.decode("utf-8")
        else:
            raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or Text.")
            
    elif text_content:
        deck_text = text_content
    else:
        raise HTTPException(status_code=400, detail="No deck content provided (file or text)")
        
    if len(deck_text.strip()) < 50:
        raise HTTPException(status_code=400, detail="Deck content too short for analysis.")
    
    # 3. Prepare company metadata for external API enrichment
    company_metadata = None
    if company_name or company_domain or stock_ticker or industry:
        company_metadata = {
            "name": company_name,
            "domain": company_domain,
            "ticker": stock_ticker,
            "industry": industry
        }
        logger.info(f"Company metadata provided: {company_metadata}")
        
    # 4. Analyze with external intelligence
    try:
        analysis_result = await analyze_deck(deck_text, thesis_data, company_metadata)
        
        # 4. Save Record
        record = {
            "user_id": user_id,
            "deck_filename": filename,
            "decision": analysis_result.get("decision", "CAUTION"),
            "score": analysis_result.get("score", 0),
            "summary": analysis_result.get("summary", ""),
            "strengths": analysis_result.get("strengths", []),
            "weaknesses": analysis_result.get("weaknesses", []),
            "analysis_json": analysis_result
        }
        
        response = supabase.table("diligence_reports").insert(record).execute()
        
        if not response.data:
             raise HTTPException(status_code=500, detail="Failed to save analysis record")
             
        return response.data[0]
        
    except Exception as e:
        logger.error(f"Analysis process failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/", response_model=list[DiligenceReportResponse])
async def get_my_reports(credentials: HTTPAuthorizationCredentials = Depends(security)):
    token = credentials.credentials
    user_id = get_user_id_from_token(token)
    
    # Use authenticated client for RLS
    supabase = get_authenticated_supabase_client(token)
    
    response = supabase.table("diligence_reports").select("*").eq("user_id", user_id).order("created_at", desc=True).execute()
    return response.data
