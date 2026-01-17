"""
Email Automation Service
Handles Gmail integration, email classification, and automated workflows
"""

import os
import pickle
import base64
from datetime import datetime, timedelta
from typing import List, Dict, Optional
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

from sqlalchemy.orm import Session
from app.database import get_db
import httpx
import json

# Gmail API scopes
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/gmail.send',
          'https://www.googleapis.com/auth/gmail.modify']


class EmailAutomationService:
    """Service for automating email workflows"""
    
    def __init__(self, user_id: str, db: Session):
        self.user_id = user_id
        self.db = db
        self.service = None
        self.credentials_path = os.getenv('GMAIL_CREDENTIALS_PATH', 'credentials/gmail_credentials.json')
        self.token_path = f'credentials/token_{user_id}.pickle'
        
    def authenticate(self) -> bool:
        """Authenticate with Gmail API"""
        creds = None
        
        # Load existing token
        if os.path.exists(self.token_path):
            with open(self.token_path, 'rb') as token:
                creds = pickle.load(token)
        
        # Refresh or get new credentials
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                if not os.path.exists(self.credentials_path):
                    return False
                flow = InstalledAppFlow.from_client_secrets_file(
                    self.credentials_path, SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save credentials
            os.makedirs(os.path.dirname(self.token_path), exist_ok=True)
            with open(self.token_path, 'wb') as token:
                pickle.dump(creds, token)
        
        self.service = build('gmail', 'v1', credentials=creds)
        return True
    
    async def sync_emails(self, max_results: int = 50) -> List[Dict]:
        """Sync emails from Gmail"""
        if not self.service:
            if not self.authenticate():
                raise Exception("Failed to authenticate with Gmail")
        
        try:
            # Get unread messages
            results = self.service.users().messages().list(
                userId='me',
                q='is:unread',
                maxResults=max_results
            ).execute()
            
            messages = results.get('messages', [])
            synced_emails = []
            
            for msg in messages:
                email_data = await self._fetch_and_classify_email(msg['id'])
                if email_data:
                    synced_emails.append(email_data)
            
            return synced_emails
            
        except HttpError as error:
            print(f'An error occurred: {error}')
            return []
    
    async def _fetch_and_classify_email(self, message_id: str) -> Optional[Dict]:
        """Fetch email details and classify it"""
        try:
            message = self.service.users().messages().get(
                userId='me',
                id=message_id,
                format='full'
            ).execute()
            
            # Extract email data
            headers = message['payload']['headers']
            subject = next((h['value'] for h in headers if h['name'] == 'Subject'), '')
            sender = next((h['value'] for h in headers if h['name'] == 'From'), '')
            date_str = next((h['value'] for h in headers if h['name'] == 'Date'), '')
            
            # Get email body
            body = self._get_email_body(message['payload'])
            
            # Classify email using simple keyword matching (can be enhanced with ML)
            classification = self._classify_email(subject, body)
            
            # Extract deal-related data
            extracted_data = await self._extract_deal_data(subject, body)
            
            email_data = {
                'gmail_id': message_id,
                'thread_id': message.get('threadId'),
                'sender_email': self._extract_email(sender),
                'sender_name': self._extract_name(sender),
                'subject': subject,
                'body': body,
                'received_at': self._parse_date(date_str),
                'classification': classification,
                'extracted_data': extracted_data,
                'is_read': False
            }
            
            # Save to database
            await self._save_email_to_db(email_data)
            
            return email_data
            
        except HttpError as error:
            print(f'Error fetching email {message_id}: {error}')
            return None
    
    def _get_email_body(self, payload: Dict) -> str:
        """Extract email body from payload"""
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain':
                    data = part['body'].get('data', '')
                    return base64.urlsafe_b64decode(data).decode('utf-8')
        elif 'body' in payload:
            data = payload['body'].get('data', '')
            if data:
                return base64.urlsafe_b64decode(data).decode('utf-8')
        return ''
    
    def _classify_email(self, subject: str, body: str) -> str:
        """Classify email based on content"""
        text = (subject + ' ' + body).lower()
        
        # Simple keyword-based classification
        if any(word in text for word in ['pitch', 'startup', 'funding', 'raise', 'investment opportunity']):
            return 'deal_inquiry'
        elif any(word in text for word in ['follow up', 'following up', 'checking in']):
            return 'follow_up'
        elif any(word in text for word in ['meeting', 'calendar', 'schedule', 'call']):
            return 'meeting_confirmation'
        elif any(word in text for word in ['spam', 'unsubscribe', 'click here']):
            return 'spam'
        else:
            return 'general'
    
    async def _extract_deal_data(self, subject: str, body: str) -> Dict:
        """Extract deal-related information from email using AI"""
        # Use Groq API to extract structured data
        groq_api_key = os.getenv('GROQ_API_KEY')
        if not groq_api_key:
            return {}
        
        prompt = f"""Extract the following information from this email:
- Company name
- Pitch summary (1-2 sentences)
- Funding amount requested
- Current stage (seed, series A, etc.)
- Industry/sector

Email Subject: {subject}
Email Body: {body[:1000]}

Return ONLY a JSON object with keys: company_name, pitch_summary, funding_amount, stage, industry.
If information is not found, use null."""

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
                    # Try to parse JSON from response
                    try:
                        return json.loads(content)
                    except:
                        return {}
        except Exception as e:
            print(f"Error extracting deal data: {e}")
        
        return {}
    
    async def _save_email_to_db(self, email_data: Dict):
        """Save email to database"""
        # This would use SQLAlchemy to insert into emails table
        # For now, just a placeholder
        pass
    
    def _extract_email(self, sender: str) -> str:
        """Extract email address from sender string"""
        import re
        match = re.search(r'<(.+?)>', sender)
        return match.group(1) if match else sender
    
    def _extract_name(self, sender: str) -> str:
        """Extract name from sender string"""
        import re
        match = re.search(r'^(.+?)\s*<', sender)
        return match.group(1).strip() if match else sender
    
    def _parse_date(self, date_str: str) -> datetime:
        """Parse email date string"""
        from email.utils import parsedate_to_datetime
        try:
            return parsedate_to_datetime(date_str)
        except:
            return datetime.now()
    
    async def send_follow_up(self, deal_id: str, template: str = None) -> bool:
        """Send automated follow-up email"""
        if not self.service:
            if not self.authenticate():
                return False
        
        # Get deal information from database
        # Generate personalized follow-up using AI
        # Send email via Gmail API
        
        try:
            # This is a placeholder - would need actual implementation
            message = MIMEText("Follow-up email body")
            message['to'] = "recipient@example.com"
            message['subject'] = "Following up on our conversation"
            
            raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
            
            self.service.users().messages().send(
                userId='me',
                body={'raw': raw_message}
            ).execute()
            
            return True
            
        except HttpError as error:
            print(f'Error sending email: {error}')
            return False
    
    async def schedule_meeting(self, deal_id: str, calendly_link: str = None) -> Dict:
        """Schedule meeting with startup"""
        # Generate meeting invitation email
        # Include Calendly or Cal.com link
        # Send via Gmail API
        
        # Placeholder implementation
        return {
            'success': True,
            'meeting_link': calendly_link or 'https://calendly.com/your-link',
            'email_sent': True
        }
    
    async def move_deal_stage(self, deal_id: str, new_stage: str) -> bool:
        """Move deal to new pipeline stage"""
        # Update deal_pipeline table
        # Trigger appropriate automated actions
        # Log the action
        
        # Placeholder implementation
        return True


class DealPipelineManager:
    """Manages deal pipeline automation"""
    
    def __init__(self, user_id: str, db: Session):
        self.user_id = user_id
        self.db = db
    
    async def process_pipeline_rules(self):
        """Process automated pipeline rules"""
        # Check for deals that need automated actions
        # Examples:
        # - No response after 3 days -> send follow-up
        # - Meeting confirmed -> move to due diligence
        # - User marked as interested -> schedule meeting
        
        pass
    
    async def get_pipeline_status(self) -> Dict:
        """Get current pipeline status"""
        # Return counts for each stage
        return {
            'new_lead': 5,
            'initial_review': 3,
            'follow_up_sent': 2,
            'meeting_scheduled': 1,
            'due_diligence': 0,
            'decision': 0
        }
