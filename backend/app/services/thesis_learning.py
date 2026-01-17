"""
Investment Thesis Learning Service
Uses machine learning to learn user preferences and investment thesis
"""

import os
import pickle
import json
from datetime import datetime
from typing import List, Dict, Optional, Tuple
import numpy as np
import pandas as pd

from sklearn.ensemble import RandomForestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sentence_transformers import SentenceTransformer

from sqlalchemy.orm import Session
import httpx


class ThesisLearningService:
    """Service for learning investment thesis from user behavior"""
    
    def __init__(self, user_id: str, db: Session):
        self.user_id = user_id
        self.db = db
        self.model = None
        self.scaler = StandardScaler()
        self.sentence_model = None
        
    async def collect_user_interactions(self) -> pd.DataFrame:
        """Collect all user interactions with startups"""
        # Query user_interactions table
        # Join with startup_features table
        # Return as DataFrame
        
        # Placeholder data structure
        interactions = []
        
        # This would query the database
        # SELECT ui.*, sf.* FROM user_interactions ui
        # JOIN startup_features sf ON ui.startup_id = sf.startup_id
        # WHERE ui.user_id = self.user_id
        
        return pd.DataFrame(interactions)
    
    async def enrich_startup_data(self, startup_id: str, startup_name: str) -> Dict:
        """Enrich startup data using Crunchbase API"""
        crunchbase_api_key = os.getenv('CRUNCHBASE_API_KEY')
        if not crunchbase_api_key:
            return {}
        
        try:
            async with httpx.AsyncClient() as client:
                # Crunchbase API endpoint
                url = f"https://api.crunchbase.com/api/v4/entities/organizations/{startup_id}"
                headers = {
                    'X-cb-user-key': crunchbase_api_key
                }
                
                response = await client.get(url, headers=headers, timeout=30.0)
                
                if response.status_code == 200:
                    data = response.json()
                    properties = data.get('properties', {})
                    
                    return {
                        'industry': properties.get('categories', [{}])[0].get('value', ''),
                        'sector': properties.get('category_groups', [{}])[0].get('value', ''),
                        'stage': properties.get('funding_stage', ''),
                        'funding_total': properties.get('funding_total', {}).get('value', 0),
                        'team_size': properties.get('num_employees_enum', ''),
                        'founding_year': properties.get('founded_on', {}).get('year', 0),
                        'geography': properties.get('location_identifiers', [{}])[0].get('value', ''),
                        'description': properties.get('short_description', '')
                    }
        except Exception as e:
            print(f"Error enriching startup data: {e}")
        
        return {}
    
    def extract_features(self, startup_data: Dict) -> np.ndarray:
        """Extract numerical features from startup data"""
        features = []
        
        # Categorical features (one-hot encoded)
        industries = ['fintech', 'healthtech', 'saas', 'ecommerce', 'ai', 'other']
        stages = ['pre-seed', 'seed', 'series-a', 'series-b', 'later']
        
        # Industry encoding
        industry = startup_data.get('industry', '').lower()
        industry_vector = [1 if ind in industry else 0 for ind in industries]
        features.extend(industry_vector)
        
        # Stage encoding
        stage = startup_data.get('stage', '').lower()
        stage_vector = [1 if stg in stage else 0 for stg in stages]
        features.extend(stage_vector)
        
        # Numerical features (normalized)
        features.append(startup_data.get('funding_total', 0) / 1000000)  # in millions
        features.append(startup_data.get('team_size', 0) / 100)  # normalized
        features.append((2024 - startup_data.get('founding_year', 2024)) / 10)  # age in decades
        features.append(startup_data.get('growth_rate', 0))
        features.append(startup_data.get('revenue', 0) / 1000000)  # in millions
        
        return np.array(features)
    
    async def train_preference_model(self) -> Dict:
        """Train ML model to predict user preferences"""
        # Collect interaction data
        interactions_df = await self.collect_user_interactions()
        
        if len(interactions_df) < 10:
            return {
                'success': False,
                'message': 'Not enough data to train model (minimum 10 interactions required)',
                'sample_size': len(interactions_df)
            }
        
        # Prepare features and labels
        X = []
        y = []
        
        for _, row in interactions_df.iterrows():
            features = self.extract_features(row.to_dict())
            X.append(features)
            
            # Label: 1 for positive interactions, 0 for negative
            interaction_type = row.get('interaction_type', '')
            if interaction_type in ['add_to_portfolio', 'mark_interested']:
                y.append(1)
            elif interaction_type in ['reject']:
                y.append(0)
            else:
                continue  # Skip neutral interactions
        
        if len(X) < 10:
            return {
                'success': False,
                'message': 'Not enough labeled data',
                'sample_size': len(X)
            }
        
        X = np.array(X)
        y = np.array(y)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Scale features
        X_train_scaled = self.scaler.fit_transform(X_train)
        X_test_scaled = self.scaler.transform(X_test)
        
        # Train model
        self.model = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42
        )
        self.model.fit(X_train_scaled, y_train)
        
        # Evaluate
        train_score = self.model.score(X_train_scaled, y_train)
        test_score = self.model.score(X_test_scaled, y_test)
        
        # Get feature importance
        feature_names = self._get_feature_names()
        feature_importance = dict(zip(feature_names, self.model.feature_importances_))
        
        # Save model to database
        await self._save_model_to_db(train_score, test_score, feature_importance)
        
        return {
            'success': True,
            'train_accuracy': train_score,
            'test_accuracy': test_score,
            'feature_importance': feature_importance,
            'sample_size': len(X)
        }
    
    def _get_feature_names(self) -> List[str]:
        """Get feature names for interpretability"""
        names = []
        
        # Industry features
        industries = ['fintech', 'healthtech', 'saas', 'ecommerce', 'ai', 'other']
        names.extend([f'industry_{ind}' for ind in industries])
        
        # Stage features
        stages = ['pre-seed', 'seed', 'series-a', 'series-b', 'later']
        names.extend([f'stage_{stg}' for stg in stages])
        
        # Numerical features
        names.extend(['funding_total', 'team_size', 'company_age', 'growth_rate', 'revenue'])
        
        return names
    
    async def _save_model_to_db(self, train_score: float, test_score: float, feature_importance: Dict):
        """Save trained model to database"""
        # Serialize model
        model_bytes = pickle.dumps({
            'model': self.model,
            'scaler': self.scaler
        })
        
        # Save to ml_models table
        # This would use SQLAlchemy
        pass
    
    async def predict_interest(self, startup_data: Dict) -> float:
        """Predict user's interest in a startup (0-1 score)"""
        if not self.model:
            # Try to load model from database
            await self._load_model_from_db()
        
        if not self.model:
            return 0.5  # Default neutral score
        
        # Extract features
        features = self.extract_features(startup_data)
        features_scaled = self.scaler.transform(features.reshape(1, -1))
        
        # Predict probability
        probability = self.model.predict_proba(features_scaled)[0][1]
        
        return probability
    
    async def _load_model_from_db(self):
        """Load latest active model from database"""
        # Query ml_models table for latest active model
        # Deserialize and load
        pass
    
    async def extract_thesis_profile(self) -> Dict:
        """Extract investment thesis from user behavior and notes"""
        # Collect user data
        interactions_df = await self.collect_user_interactions()
        
        if len(interactions_df) == 0:
            return {
                'preferred_industries': {},
                'preferred_stages': {},
                'key_criteria': [],
                'confidence_score': 0.0
            }
        
        # Analyze patterns
        thesis_profile = {
            'preferred_industries': {},
            'preferred_stages': {},
            'key_criteria': [],
            'confidence_score': 0.0
        }
        
        # Calculate industry preferences
        positive_interactions = interactions_df[
            interactions_df['interaction_type'].isin(['add_to_portfolio', 'mark_interested'])
        ]
        
        if len(positive_interactions) > 0:
            # Industry distribution
            industry_counts = positive_interactions['industry'].value_counts()
            total = len(positive_interactions)
            thesis_profile['preferred_industries'] = {
                industry: count / total
                for industry, count in industry_counts.items()
            }
            
            # Stage distribution
            stage_counts = positive_interactions['stage'].value_counts()
            thesis_profile['preferred_stages'] = {
                stage: count / total
                for stage, count in stage_counts.items()
            }
            
            # Extract key criteria from notes using NLP
            notes = positive_interactions['interaction_value'].apply(
                lambda x: x.get('notes', '') if isinstance(x, dict) else ''
            ).tolist()
            
            thesis_profile['key_criteria'] = await self._extract_criteria_from_notes(notes)
            
            # Confidence score based on sample size
            thesis_profile['confidence_score'] = min(len(positive_interactions) / 50, 1.0)
        
        # Save to database
        await self._save_thesis_to_db(thesis_profile)
        
        return thesis_profile
    
    async def _extract_criteria_from_notes(self, notes: List[str]) -> List[str]:
        """Extract key investment criteria from notes using NLP"""
        if not notes or all(not note for note in notes):
            return []
        
        # Use Groq API for extraction
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            return []
        
        combined_notes = '\n'.join([note for note in notes if note])[:2000]
        
        prompt = f"""Analyze these investment notes and extract the top 5 key criteria this investor looks for in startups.
Return ONLY a JSON array of strings, each being a concise criterion (e.g., "strong technical team", "proven traction").

Notes:
{combined_notes}"""

        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(
                    'https://api.groq.com/openai/v1/chat/completions',
                    headers={
                        'Authorization': f'Bearer {groq_api_key}',
                        'Content-Type': 'application/json'
                    },
                    json={
                        'model': 'llama-3.3-70b-versatile',
                        'messages': [{'role': 'user', 'content': prompt}],
                        'temperature': 0.1
                    },
                    timeout=30.0
                )
                
                if response.status_code == 200:
                    result = response.json()
                    content = result['choices'][0]['message']['content']
                    try:
                        return json.loads(content)
                    except:
                        return []
        except Exception as e:
            print(f"Error extracting criteria: {e}")
        
        return []
    
    async def _save_thesis_to_db(self, thesis_profile: Dict):
        """Save thesis profile to database"""
        # Save to investment_thesis table
        pass
    
    async def get_personalized_recommendations(self, startups: List[Dict], limit: int = 10) -> List[Dict]:
        """Get personalized startup recommendations"""
        if not self.model:
            await self._load_model_from_db()
        
        # Score each startup
        scored_startups = []
        for startup in startups:
            score = await self.predict_interest(startup)
            scored_startups.append({
                **startup,
                'recommendation_score': score
            })
        
        # Sort by score and return top N
        scored_startups.sort(key=lambda x: x['recommendation_score'], reverse=True)
        
        return scored_startups[:limit]
    
    async def record_feedback(self, startup_id: str, feedback: str):
        """Record user feedback to improve recommendations"""
        # Save to user_interactions table
        # This helps retrain the model
        pass
