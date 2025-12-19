import os
import httpx
from typing import Optional

# Groq API configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")  # Default Groq model

SYSTEM_PROMPT = """You are a professional VC analyst who loves looking into innovative and profitable products. 
You help evaluate startups, analyze market opportunities, assess business models, and provide insights on investment potential. 
Be concise, data-driven, and focus on actionable insights. Always consider market size, competitive landscape, and scalability."""


async def get_openai_response(user_message: str, conversation_history: Optional[list] = None) -> str:
    """
    Get response from Groq API
    
    Args:
        user_message: The user's message
        conversation_history: Optional list of previous messages in format [{"role": "user/assistant", "content": "..."}]
    
    Returns:
        Assistant's response text
    """
    if not GROQ_API_KEY:
        raise Exception("GROQ_API_KEY environment variable is not set. Please set it in your .env file.")
    
    return await _get_groq_response(user_message, conversation_history)


async def _get_groq_response(user_message: str, conversation_history: Optional[list] = None) -> str:
    """Get response from Groq API"""
    
    # Build messages array for Groq (OpenAI-compatible format)
    messages = []
    
    # Add system prompt as first message
    messages.append({"role": "system", "content": SYSTEM_PROMPT})
    
    # Add conversation history if provided
    if conversation_history:
        messages.extend(conversation_history)
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})
    
    # Prepare request payload for Groq API (OpenAI-compatible)
    payload = {
        "model": GROQ_MODEL,
        "messages": messages,
        "temperature": 0.7,
        "max_tokens": 2000,
    }
    
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                GROQ_API_URL,
                json=payload,
                headers=headers
            )
            response.raise_for_status()
            result = response.json()
            
            # Extract response from Groq API format (OpenAI-compatible)
            if "choices" in result and len(result["choices"]) > 0:
                if "message" in result["choices"][0] and "content" in result["choices"][0]["message"]:
                    return result["choices"][0]["message"]["content"].strip()
            
            raise Exception(f"Unexpected response format from Groq API: {result}")
                
    except httpx.TimeoutException:
        raise Exception("Groq API request timed out. Please try again.")
    except httpx.HTTPStatusError as e:
        error_text = e.response.text if hasattr(e.response, 'text') else str(e.response)
        raise Exception(f"Groq API error: {e.response.status_code} - {error_text}")
    except Exception as e:
        raise Exception(f"Groq API error: {str(e)}")
