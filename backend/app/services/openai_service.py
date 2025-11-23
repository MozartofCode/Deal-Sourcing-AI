import os
from openai import OpenAI
from typing import Optional

# Initialize OpenAI client
def get_openai_client() -> Optional[OpenAI]:
    """Get OpenAI client, returns None if API key is not set"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None
    return OpenAI(api_key=api_key)


SYSTEM_PROMPT = """You are a professional VC analyst who loves looking into innovative and profitable products. 
You help evaluate startups, analyze market opportunities, assess business models, and provide insights on investment potential. 
Be concise, data-driven, and focus on actionable insights. Always consider market size, competitive landscape, and scalability."""


async def get_openai_response(user_message: str, conversation_history: Optional[list] = None) -> str:
    """
    Get response from OpenAI API
    
    Args:
        user_message: The user's message
        conversation_history: Optional list of previous messages in format [{"role": "user/assistant", "content": "..."}]
    
    Returns:
        Assistant's response text
    """
    client = get_openai_client()
    
    if not client:
        raise ValueError("OpenAI API key not configured. Please set OPENAI_API_KEY environment variable.")
    
    # Build messages array
    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    
    # Add conversation history if provided
    if conversation_history:
        messages.extend(conversation_history)
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})
    
    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # You can change to gpt-4 if needed
            messages=messages,
            temperature=0.7,
            max_tokens=1000,
        )
        
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")

