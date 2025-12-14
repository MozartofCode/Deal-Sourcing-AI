import os
import asyncio
import httpx
from typing import Optional

# Configuration - Choose your AI provider
AI_PROVIDER = os.getenv("AI_PROVIDER", "huggingface")  # Options: "huggingface", "ollama"

# Hugging Face configuration (default - no installation needed!)
HF_API_URL = os.getenv("HF_API_URL", "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2")
HF_API_KEY = os.getenv("HF_API_KEY", "")  # Optional - free tier works without key, but better with key

# Ollama configuration (if you want to use local Ollama later)
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3.2")

SYSTEM_PROMPT = """You are a professional VC analyst who loves looking into innovative and profitable products. 
You help evaluate startups, analyze market opportunities, assess business models, and provide insights on investment potential. 
Be concise, data-driven, and focus on actionable insights. Always consider market size, competitive landscape, and scalability."""


async def get_openai_response(user_message: str, conversation_history: Optional[list] = None) -> str:
    """
    Get response from AI (Hugging Face or Ollama)
    
    Args:
        user_message: The user's message
        conversation_history: Optional list of previous messages in format [{"role": "user/assistant", "content": "..."}]
    
    Returns:
        Assistant's response text
    """
    if AI_PROVIDER.lower() == "ollama":
        return await _get_ollama_response(user_message, conversation_history)
    else:
        return await _get_huggingface_response(user_message, conversation_history)


async def _get_huggingface_response(user_message: str, conversation_history: Optional[list] = None) -> str:
    """Get response from Hugging Face Inference API (free, cloud-based)"""
    
    # Build the prompt with system message and conversation
    prompt_parts = [f"System: {SYSTEM_PROMPT}"]
    
    # Add conversation history if provided
    if conversation_history:
        for msg in conversation_history:
            role = msg.get("role", "user")
            content = msg.get("content", "")
            if role == "user":
                prompt_parts.append(f"User: {content}")
            elif role == "assistant":
                prompt_parts.append(f"Assistant: {content}")
    
    # Add current user message
    prompt_parts.append(f"User: {user_message}")
    prompt_parts.append("Assistant:")
    
    full_prompt = "\n\n".join(prompt_parts)
    
    # Prepare request payload
    payload = {
        "inputs": full_prompt,
        "parameters": {
            "temperature": 0.7,
            "max_new_tokens": 1000,
            "return_full_text": False
        }
    }
    
    headers = {}
    if HF_API_KEY:
        headers["Authorization"] = f"Bearer {HF_API_KEY}"
    
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(
                HF_API_URL,
                json=payload,
                headers=headers
            )
            
            # Hugging Face may return 503 if model is loading, wait and retry
            if response.status_code == 503:
                # Wait a bit and retry once
                await asyncio.sleep(5)
                response = await client.post(
                    HF_API_URL,
                    json=payload,
                    headers=headers
                )
            
            response.raise_for_status()
            result = response.json()
            
            # Handle different response formats
            if isinstance(result, list) and len(result) > 0:
                if "generated_text" in result[0]:
                    return result[0]["generated_text"].strip()
                elif "text" in result[0]:
                    return result[0]["text"].strip()
            
            # Try to extract text from any format
            if isinstance(result, dict):
                if "generated_text" in result:
                    return result["generated_text"].strip()
                elif "text" in result:
                    return result["text"].strip()
            
            # Fallback: return string representation
            return str(result).strip()
                
    except httpx.TimeoutException:
        raise Exception("Hugging Face API request timed out. Please try again.")
    except httpx.HTTPStatusError as e:
        if e.response.status_code == 503:
            raise Exception(
                "Hugging Face model is loading. Please wait a moment and try again. "
                "Free tier models may take 20-30 seconds to wake up if inactive."
            )
        raise Exception(f"Hugging Face API error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        raise Exception(f"Hugging Face API error: {str(e)}")


async def _get_ollama_response(user_message: str, conversation_history: Optional[list] = None) -> str:
    """Get response from Ollama (local, requires installation)"""
    
    # Build messages array for Ollama
    messages = []
    
    # Add system prompt as first message
    messages.append({"role": "system", "content": SYSTEM_PROMPT})
    
    # Add conversation history if provided
    if conversation_history:
        messages.extend(conversation_history)
    
    # Add current user message
    messages.append({"role": "user", "content": user_message})
    
    # Prepare request payload for Ollama
    payload = {
        "model": OLLAMA_MODEL,
        "messages": messages,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_predict": 1000,  # max_tokens equivalent
        }
    }
    
    try:
        async with httpx.AsyncClient(timeout=120.0) as client:
            response = await client.post(
                f"{OLLAMA_BASE_URL}/api/chat",
                json=payload
            )
            response.raise_for_status()
            result = response.json()
            
            if "message" in result and "content" in result["message"]:
                return result["message"]["content"]
            else:
                raise Exception(f"Unexpected response format from Ollama: {result}")
                
    except httpx.TimeoutException:
        raise Exception("Ollama request timed out. Make sure Ollama is running and the model is downloaded.")
    except httpx.ConnectError:
        raise Exception(
            f"Cannot connect to Ollama at {OLLAMA_BASE_URL}. "
            "Please make sure Ollama is installed and running. "
            "Install from: https://ollama.ai/download"
        )
    except httpx.HTTPStatusError as e:
        raise Exception(f"Ollama API error: {e.response.status_code} - {e.response.text}")
    except Exception as e:
        raise Exception(f"Ollama API error: {str(e)}")
