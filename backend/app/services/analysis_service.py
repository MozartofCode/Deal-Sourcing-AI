import os
import httpx
import json
import logging
from typing import Optional, Dict, Any
from app.models import AnalysisDecision

logger = logging.getLogger(__name__)

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

SYSTEM_PROMPT = """You are a cynical, expert Venture Capital Investment Committee member. 
Your job is to ruthlessly analyze startup pitch decks against a specific investment thesis.
You must provide a clear recommendation: PROCEED (high conviction), CAUTION (interesting but flaws), or PASS (misaligned or weak).
You must output strictly valid JSON."""

async def analyze_deck(deck_content: str, thesis: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyze a pitch deck against an investment thesis using Groq.
    Returns structured analysis data.
    """
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY environment variable is not set.")

    # Format Thesis for the prompt
    thesis_str = f"""
    Investment Thesis:
    - Description: {thesis.get('thesis', 'N/A')}
    - Stage: {thesis.get('investment_stage', 'Any')}
    - Ticket Size: ${thesis.get('min_ticket_size', 0)} - ${thesis.get('max_ticket_size', 'Unlimited')}
    - Target Industries: {', '.join(thesis.get('target_industries', []))}
    - Geography: {thesis.get('geography', 'Global')}
    """

    user_message = f"""
    {thesis_str}

    ----------------
    PITCH DECK CONTENT:
    {deck_content[:50000]} 
    ----------------

    Evaluate this opportunity solely based on the provided thesis.
    
    Return ONLY a JSON object with this structure:
    {{
        "decision": "PROCEED" | "CAUTION" | "PASS",
        "score": <integer 0-100>,
        "summary": "<2-3 sentence executive summary>",
        "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
        "weaknesses": ["<weakness 1>", "<weakness 2>", "<weakness 3>"]
    }}
    """

    try:
        response_json = await _get_groq_json_response(user_message)
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
            "raw_error": str(e)
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
