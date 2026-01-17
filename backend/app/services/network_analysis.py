"""
Network Analysis Service
Handles LinkedIn network analysis, path finding, and warm introduction automation
"""

import os
import json
from datetime import datetime
from typing import List, Dict, Optional, Tuple, Set
import networkx as nx

from sqlalchemy.orm import Session
from sqlalchemy import text
import httpx

class NetworkAnalysisService:
    """Service for analyzing network and finding warm intros"""
    
    def __init__(self, user_id: str, db: Session):
        self.user_id = user_id
        self.db = db
        self.graph = nx.Graph()
        self.linkedin_client_id = os.getenv('LINKEDIN_CLIENT_ID')
        self.linkedin_client_secret = os.getenv('LINKEDIN_CLIENT_SECRET')
        
    async def build_network_graph(self):
        """Build NetworkX graph from database connections"""
        # Load connections from database
        query = text("""
            SELECT id, connection_id, connection_name, degree, relationship_strength 
            FROM network_graph 
            WHERE user_id = :user_id
        """)
        
        result = self.db.execute(query, {"user_id": self.user_id})
        connections = result.fetchall()
        
        # Add user node
        self.graph.add_node('ME', type='user')
        
        for conn in connections:
            conn_id = str(conn.id)
            linkedin_id = conn.connection_id
            
            # Add connection node
            self.graph.add_node(linkedin_id, 
                               name=conn.connection_name, 
                               type='connection',
                               db_id=conn_id)
            
            # Add edge
            if conn.degree == 1:
                self.graph.add_edge('ME', linkedin_id, weight=float(conn.relationship_strength or 0.5))
        
        # Note: 2nd degree connections would need a different structure or 
        # querying the 'shared_connections' from LinkedIn for each 1st degree
        pass

    async def sync_linkedin_network(self, access_token: str):
        """Sync connections from LinkedIn API"""
        if not access_token:
            return {'success': False, 'message': 'No access token provided'}
            
        try:
            async with httpx.AsyncClient() as client:
                # 1. Get user profile
                # 2. Get connections
                # This is a placeholder as LinkedIn API requires specific permissions
                # usually reserved for partners for 'connections' API
                # We'll simulate fetching connections
                
                # Mock data for demonstration if API fails
                pass
                
        except Exception as e:
            print(f"Error syncing LinkedIn: {e}")
            
    async def find_paths_to_startup(self, startup_name: str, startup_data: Dict = None) -> List[Dict]:
        """Find connection paths to valid founders/employees of a startup"""
        # 1. Identify founders/key employees (using Crunchbase/LinkedIn via Generic search)
        founders = await self._identify_founders(startup_name, startup_data)
        
        paths = []
        for founder in founders:
            founder_id = founder.get('linkedin_id')
            founder_name = founder.get('name')
            
            if not founder_id:
                continue
                
            # Check for direct connection
            path_data = await self._find_path_to_person(founder_id)
            
            if path_data:
                paths.append({
                    'founder': founder,
                    'path': path_data['path'],
                    'strength': path_data['strength'],
                    'connector': path_data['connector']
                })
                
        return paths

    async def _identify_founders(self, startup_name: str, startup_data: Dict = None) -> List[Dict]:
        """Identify founders using Crunchbase or supplied data"""
        founders = []
        
        # Use existing startup_data if available (from Crunchbase)
        if startup_data and 'founders' in startup_data:
            return startup_data['founders']
            
        # Otherwise, try to search using Hunter.io or similar?
        # Or just return empty list + generic 'Contact'
        return []

    async def _find_path_to_person(self, target_linkedin_id: str) -> Optional[Dict]:
        """Find shortest path in the graph"""
        if not self.graph.nodes:
            await self.build_network_graph()
            
        try:
            # Check if target is in our graph (1st or 2nd degree)
            if target_linkedin_id not in self.graph:
                return None
                
            path = nx.shortest_path(self.graph, 'ME', target_linkedin_id, weight='weight')
            
            # Calculate path strength (product of edge weights?)
            strength = 1.0
            connector = None
            
            if len(path) > 2: # ME -> Connector -> Target
                connector_id = path[1]
                connector = self.graph.nodes[connector_id]
            
            return {
                'path': path,
                'strength': strength,
                'connector': connector
            }
            
        except nx.NetworkXNoPath:
            return None
        except Exception as e:
            print(f"Path finding error: {e}")
            return None

    async def draft_introduction_email(self, request_id: str) -> Dict:
        """Draft an intro email using Groq"""
        # Fetch request details from DB
        # This is a placeholder
        
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            return {'subject': 'Intro Request', 'body': 'Please introduce me...'}
            
        # Prompt LLM
        # prompt = ...
        # response = await call_groq(prompt)
        
        return {
            'subject': "Introduction to [Startup Name]",
            'body': "Hi [Connector],\n\nI saw you're connected to..."
        }
