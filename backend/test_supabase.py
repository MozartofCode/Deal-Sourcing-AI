"""
Test script to verify Supabase configuration
Run this script to check if your Supabase setup is working correctly.

Usage:
    python test_supabase.py
"""
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

def test_environment_variables():
    """Test if required environment variables are set"""
    print("=" * 60)
    print("Testing Environment Variables")
    print("=" * 60)
    
    required_vars = {
        "SUPABASE_URL": os.getenv("SUPABASE_URL"),
        "SUPABASE_SERVICE_ROLE_KEY": os.getenv("SUPABASE_SERVICE_ROLE_KEY"),
        "JWT_SECRET_KEY": os.getenv("JWT_SECRET_KEY"),
    }
    
    all_set = True
    for var_name, var_value in required_vars.items():
        if var_value:
            # Mask sensitive values
            if "KEY" in var_name:
                masked = var_value[:10] + "..." + var_value[-4:] if len(var_value) > 14 else "***"
                print(f"[OK] {var_name}: {masked}")
            else:
                print(f"[OK] {var_name}: {var_value}")
        else:
            print(f"[FAIL] {var_name}: NOT SET")
            all_set = False
    
    print()
    return all_set


def test_supabase_connection():
    """Test if Supabase connection works"""
    print("=" * 60)
    print("Testing Supabase Connection")
    print("=" * 60)
    
    try:
        from app.database import get_supabase_client
        
        supabase = get_supabase_client()
        print("[OK] Supabase client created successfully")
        
        # Test connection by querying a system table
        # This will fail if credentials are wrong
        response = supabase.table("users").select("id").limit(1).execute()
        print("[OK] Successfully connected to Supabase")
        print(f"   Connection test query executed successfully")
        print()
        return True, supabase
        
    except ValueError as e:
        print(f"[FAIL] Configuration Error: {e}")
        print()
        return False, None
    except Exception as e:
        print(f"[FAIL] Connection Error: {str(e)}")
        print("   Check your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY")
        print()
        return False, None


def test_tables_exist(supabase):
    """Test if all required tables exist"""
    print("=" * 60)
    print("Testing Database Tables")
    print("=" * 60)
    
    required_tables = ["users", "portfolios", "conversations", "messages"]
    all_exist = True
    
    for table_name in required_tables:
        try:
            # Try to query the table (even if empty)
            response = supabase.table(table_name).select("*").limit(0).execute()
            print(f"[OK] Table '{table_name}' exists")
        except Exception as e:
            error_msg = str(e)
            if "relation" in error_msg.lower() or "does not exist" in error_msg.lower():
                print(f"[FAIL] Table '{table_name}' does NOT exist")
                print(f"   Run database_schema.sql in Supabase SQL Editor")
                all_exist = False
            else:
                print(f"[WARN] Table '{table_name}' - Error: {error_msg}")
                all_exist = False
    
    print()
    return all_exist


def test_table_structure(supabase):
    """Test if tables have the correct structure by checking columns"""
    print("=" * 60)
    print("Testing Table Structure")
    print("=" * 60)
    
    # Test users table structure
    try:
        # Try to insert a test record (we'll delete it immediately)
        test_email = f"test_{os.urandom(4).hex()}@test.com"
        test_data = {
            "email": test_email,
            "password_hash": "test_hash",
            "name": "Test User"
        }
        
        # Insert test user
        insert_response = supabase.table("users").insert(test_data).execute()
        test_user_id = insert_response.data[0]["id"]
        print("[OK] Users table: Can insert records")
        
        # Try to read it back
        read_response = supabase.table("users").select("*").eq("id", test_user_id).execute()
        if read_response.data:
            print("[OK] Users table: Can read records")
        
        # Clean up - delete test user
        supabase.table("users").delete().eq("id", test_user_id).execute()
        print("[OK] Users table: Can delete records")
        
    except Exception as e:
        print(f"[FAIL] Users table structure test failed: {str(e)}")
        print()
        return False
    
    # Test portfolios table structure
    try:
        # First, we need a user to reference
        test_email = f"test_{os.urandom(4).hex()}@test.com"
        user_data = {
            "email": test_email,
            "password_hash": "test_hash",
            "name": "Test User"
        }
        user_response = supabase.table("users").insert(user_data).execute()
        test_user_id = user_response.data[0]["id"]
        
        # Test portfolio insert
        portfolio_data = {
            "user_id": test_user_id,
            "startup_name": "Test Startup",
            "industry": "Tech",
            "stage": "Seed",
            "status": "Active"
        }
        portfolio_response = supabase.table("portfolios").insert(portfolio_data).execute()
        print("[OK] Portfolios table: Can insert records")
        
        # Clean up
        supabase.table("portfolios").delete().eq("user_id", test_user_id).execute()
        supabase.table("users").delete().eq("id", test_user_id).execute()
        print("[OK] Portfolios table: Structure is correct")
        
    except Exception as e:
        print(f"[FAIL] Portfolios table structure test failed: {str(e)}")
        print()
        return False
    
    print()
    return True


def test_rls_enabled(supabase):
    """Test if Row Level Security is enabled (optional check)"""
    print("=" * 60)
    print("Testing Row Level Security (RLS)")
    print("=" * 60)
    
    # Note: RLS check requires querying pg_policies which might not be accessible
    # So we'll just note that RLS should be enabled
    print("[INFO] RLS status: Check in Supabase Dashboard -> Authentication -> Policies")
    print("   RLS should be enabled for: users, portfolios, conversations, messages")
    print()
    return True


def main():
    """Run all tests"""
    print("\n" + "=" * 60)
    print("Supabase Configuration Test")
    print("=" * 60 + "\n")
    
    # Test 1: Environment variables
    env_ok = test_environment_variables()
    if not env_ok:
        print("[FAIL] FAILED: Environment variables not set correctly")
        print("\nPlease set the following in your .env file:")
        print("  - SUPABASE_URL")
        print("  - SUPABASE_SERVICE_ROLE_KEY")
        print("  - JWT_SECRET_KEY")
        sys.exit(1)
    
    # Test 2: Supabase connection
    connection_ok, supabase = test_supabase_connection()
    if not connection_ok:
        print("[FAIL] FAILED: Cannot connect to Supabase")
        print("\nPlease check:")
        print("  1. Your SUPABASE_URL is correct")
        print("  2. Your SUPABASE_SERVICE_ROLE_KEY is correct")
        print("  3. Your Supabase project is active")
        sys.exit(1)
    
    # Test 3: Tables exist
    tables_ok = test_tables_exist(supabase)
    if not tables_ok:
        print("[FAIL] FAILED: Some tables are missing")
        print("\nPlease run database_schema.sql in Supabase SQL Editor")
        sys.exit(1)
    
    # Test 4: Table structure
    structure_ok = test_table_structure(supabase)
    if not structure_ok:
        print("[FAIL] FAILED: Table structure issues detected")
        sys.exit(1)
    
    # Test 5: RLS (informational)
    test_rls_enabled(supabase)
    
    # Summary
    print("=" * 60)
    print("[OK] ALL TESTS PASSED!")
    print("=" * 60)
    print("\nYour Supabase configuration is working correctly!")
    print("You can now start your backend server:")
    print("  uvicorn app.main:app --reload --port 8000")
    print()


if __name__ == "__main__":
    main()

