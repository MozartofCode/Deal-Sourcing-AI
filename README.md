# Deal Sourcing AI

**Your AI-Powered Investment Committee.**

Deal Sourcing AI streamlines early-stage diligence by automating the "Pass/Proceed" decision. Investors define their thesis, upload a pitch deck, and receive an instant, ruthless analysis of the opportunity.

## Features

- **Thesis Alignment**: Define your investment DNA (Market size, Deal size, Stage, Geography).
- **Instant Analysis**: Upload PDF pitch decks or paste text.
- **AI Diligence**: Uses Groq (Llama 3 70B) to score deals and highlight strengths/weaknesses.
- **Premium UI**: Dark mode, glassmorphism, and seamless interactions.

## Tech Stack

- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React.
- **Backend**: FastAPI, Pydantic, PyPDF.
- **Database**: Supabase (PostgreSQL).
- **AI**: Groq API.

## Setup Instructions

### 1. Database Setup
1. Create a Supabase project.
2. Go to the SQL Editor in Supabase.
3. Open `backend/database_schema_pivot.sql` and copy its content.
4. Run the SQL to create the `investor_profiles` and `diligence_reports` tables.

### 2. Backend Setup
```bash
cd backend
python -m venv venv
# Activate venv (Windows: venv\Scripts\activate, Mac: source venv/bin/activate)
pip install -r requirements.txt
```

Create a `.env` file in `backend/`:
```env
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
GROQ_API_KEY=your_groq_api_key
JWT_SECRET_KEY=your_secret_key
```

Run the server:
```bash
uvicorn app.main:app --reload
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

## Workflow
1. **Sign Up**: Create an investor account.
2. **Setup Profile**: Input your investment thesis.
3. **Analyze**: Upload a deck.
4. **Decide**: View the "Proceed" or "Pass" recommendation.
