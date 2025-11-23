from datetime import datetime, timedelta
from typing import Dict, Tuple
import time

class RateLimiter:
    """
    Simple in-memory rate limiter
    Tracks requests per user (identified by IP or user_id)
    Allows max 5 requests per user
    """
    
    def __init__(self, max_requests: int = 5, window_seconds: int = 3600):
        """
        Args:
            max_requests: Maximum number of requests allowed
            window_seconds: Time window in seconds (default 1 hour)
        """
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests: Dict[str, list] = {}  # {user_id: [timestamp1, timestamp2, ...]}
    
    def _clean_old_requests(self, user_id: str):
        """Remove requests outside the time window"""
        now = time.time()
        if user_id in self.requests:
            self.requests[user_id] = [
                ts for ts in self.requests[user_id]
                if now - ts < self.window_seconds
            ]
    
    def is_allowed(self, user_id: str) -> Tuple[bool, int]:
        """
        Check if request is allowed
        Returns: (is_allowed, remaining_requests)
        """
        self._clean_old_requests(user_id)
        
        if user_id not in self.requests:
            self.requests[user_id] = []
        
        request_count = len(self.requests[user_id])
        
        if request_count >= self.max_requests:
            return False, 0
        
        # Record this request
        self.requests[user_id].append(time.time())
        remaining = self.max_requests - (request_count + 1)
        
        return True, remaining
    
    def get_remaining(self, user_id: str) -> int:
        """Get remaining requests for a user"""
        self._clean_old_requests(user_id)
        
        if user_id not in self.requests:
            return self.max_requests
        
        return max(0, self.max_requests - len(self.requests[user_id]))


# Global rate limiter instance
rate_limiter = RateLimiter(max_requests=5, window_seconds=3600)

