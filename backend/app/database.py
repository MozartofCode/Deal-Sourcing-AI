"""
Database connection and configuration using Supabase
"""
import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")  # Service role key for backend operations

from supabase.lib.client_options import ClientOptions

# Initialize Supabase client
supabase: Client = None

def get_supabase_client() -> Client:
    """Get or create Supabase client"""
    global supabase
    if supabase is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise ValueError(
                "Supabase credentials not configured. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env"
            )
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    return supabase

def get_authenticated_supabase_client(token: str) -> Client:
    """
    Get a Supabase client authenticated with the user's token.
    Useful when RLS is enabled and we are not using the Service Role key.
    """
    if not SUPABASE_URL or not SUPABASE_KEY:
        raise ValueError("Supabase configuration missing")
    
    # Pass the user's token in the headers
    headers = {"Authorization": f"Bearer {token}"}
    return create_client(SUPABASE_URL, SUPABASE_KEY, options=ClientOptions(headers=headers))

