"""
Analysis Routes (Local File Storage)
"""
import logging
import io
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException, Depends, UploadFile, File, Form
from app.models import DiligenceReportResponse
from app.services.analysis_service import analyze_deck
from app.storage import get_profile, get_reports, save_report
from pypdf import PdfReader

logger = logging.getLogger(__name__)

router = APIRouter()

@router.post("/", response_model=DiligenceReportResponse)
async def analyze_pitch_deck(
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
    
    # 1. Fetch User Thesis from file storage
    thesis_data = get_profile()
    if not thesis_data:
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
                    extracted = page.extract_text()
                    if extracted:
                        deck_text += extracted + "\n"
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
        
    deck_text_stripped = deck_text.strip()
    if len(deck_text_stripped) < 10:
        logger.warning(f"Deck content too short. Length: {len(deck_text_stripped)}")
        raise HTTPException(
            status_code=400, 
            detail="Could not extract enough text from the file. If this is a PDF, it might be a scanned image without selectable text. Please upload a text-based PDF or paste the text directly."
        )
    
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
        
        # 5. Save Record
        record = {
            "id": str(uuid.uuid4()),
            "created_at": datetime.now().isoformat(),
            "user_id": "guest-user",
            "deck_filename": filename,
            "decision": analysis_result.get("decision", "CAUTION"),
            "score": analysis_result.get("score", 0),
            "summary": analysis_result.get("summary", ""),
            "strengths": analysis_result.get("strengths", []),
            "weaknesses": analysis_result.get("weaknesses", []),
            "analysis_json": analysis_result
        }
        
        save_report(record)
        
        return record
        
    except Exception as e:
        logger.error(f"Analysis process failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    
    
@router.get("/", response_model=list[DiligenceReportResponse])
async def get_my_reports():
    return get_reports()
