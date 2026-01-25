# Scout 🚀

**Your AI-Powered Investment Committee with Real-Time Market Intelligence**

Scout streamlines early-stage diligence by automating investment decisions. Investors define their thesis, upload a pitch deck, and receive an instant, data-driven analysis enhanced with real-time market intelligence from external APIs.

---

## ✨ Features

### Core Features
- **📊 Thesis Alignment**: Define your investment DNA (stage, ticket size, industries, geography)
- **⚡ Instant Analysis**: Upload PDF pitch decks or paste text for immediate analysis
- **🤖 AI-Powered Diligence**: Uses Groq (Llama 3.3 70B) to score deals and highlight strengths/weaknesses
- **🎨 Premium UI**: Dark mode, glassmorphism, smooth animations with Framer Motion

### Enhanced Market Intelligence (NEW!)
- **🏢 Company Data**: Enriches analysis with company information and competitor insights
- **💰 Financial Metrics**: Validates claims with real-time stock data and financial ratios
- **📰 News Sentiment**: Analyzes recent news and industry trends
- **🎯 Competitive Analysis**: Identifies market positioning and competitive landscape

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI framework
- **Tailwind CSS** - Styling
- **Framer Motion** - Animations
- **Lucide React** - Icons
- **Axios** - HTTP client

### Backend
- **FastAPI** - Python web framework
- **Pydantic** - Data validation
- **PyPDF** - PDF text extraction
- **httpx** - Async HTTP client

### Database & APIs
- **Supabase** - PostgreSQL database
- **Groq API** - AI analysis (Llama 3.3 70B)
- **The Companies API** - Company data & competitors
- **Alpha Vantage API** - Financial data & stock prices
- **News API** - News articles & industry trends

---

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- Supabase account
- API keys (Groq, The Companies API, Alpha Vantage, News API)

### 1. Database Setup

1. Create a [Supabase project](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy the contents of `backend/database_schema_pivot.sql`
4. Run the SQL to create tables: `investor_profiles` and `diligence_reports`

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

Create a `.env` file in `backend/` directory:

```env
# Supabase Configuration
SUPABASE_URL=your_supabase_url_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# JWT Secret
JWT_SECRET_KEY=your_jwt_secret_key_here

# Groq API
GROQ_API_KEY=your_groq_api_key_here

# External API Keys for Market Intelligence
COMPANIES_API_KEY=your_companies_api_key_here
ALPHA_VANTAGE_API_KEY=your_alpha_vantage_api_key_here
NEWS_API_KEY=your_news_api_key_here
```

**Get your API keys:**
- Supabase: https://supabase.com/dashboard/project/_/settings/api
- Groq: https://console.groq.com/keys
- The Companies API: https://www.thecompaniesapi.com/
- Alpha Vantage: https://www.alphavantage.co/support/#api-key
- News API: https://newsapi.org/register

Run the backend server:

```bash
uvicorn app.main:app --reload
```

Backend will be available at `http://localhost:8000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend will be available at `http://localhost:5173`

---

## 📖 How to Use

### 1. Sign Up & Login
- Create an investor account
- Secure authentication with JWT tokens

### 2. Setup Your Investment Profile
Define your investment thesis:
- **Investment Stage**: Pre-seed, Seed, Series A, etc.
- **Ticket Size**: Min/max investment amount
- **Target Industries**: Focus sectors (e.g., Fintech, SaaS, Healthcare)
- **Geography**: Preferred regions
- **Thesis Description**: Your investment philosophy

### 3. Analyze a Deal

**Basic Analysis:**
1. Click "Upload Pitch Deck"
2. Upload PDF or paste text
3. Get instant AI analysis

**Enhanced Analysis (Optional):**
1. Click "Add Company Info (Optional)"
2. Fill in any combination of:
   - **Company Name** - Enables news search and sentiment analysis
   - **Company Domain** - Provides company data and competitor insights
   - **Stock Ticker** - Adds financial metrics (if public company)
   - **Industry** - Enables industry trend analysis
3. Upload pitch deck
4. Get enhanced analysis with real-time market intelligence!

### 4. Review Analysis Report

**Standard Report Includes:**
- **Decision**: PROCEED, CAUTION, or PASS
- **Match Score**: 0-100% alignment with your thesis
- **Executive Summary**: Key insights
- **Strengths**: Top 3 positive factors
- **Weaknesses**: Top 3 concerns

**Enhanced Report Also Includes (when company info provided):**
- **📊 Market Insights**: Industry trends, market size, growth rates
- **🏆 Competitive Analysis**: Market positioning, competitor comparison
- **💰 Financial Health**: Key metrics, stock performance, financial ratios

---

## 🔑 External API Integration

### The Companies API
**Purpose**: Company data enrichment and competitive analysis

**Provides:**
- Company profile (industry, size, location, description)
- Competitor identification
- Industry benchmarking

**Rate Limits**: 1 credit per company enrichment

### Alpha Vantage API
**Purpose**: Financial data and stock market information

**Provides:**
- Company financial overview (market cap, P/E ratio, revenue)
- Real-time stock quotes
- Income statements and balance sheets

**Rate Limits**: 25 requests/day (free tier), 5 calls/minute

### News API
**Purpose**: News articles and sentiment analysis

**Provides:**
- Company-specific news articles
- Industry trend analysis
- Market sentiment indicators

**Rate Limits**: 100 requests/day (free tier)

### How It Works

When you provide company metadata:
1. System extracts pitch deck content
2. Calls external APIs in parallel to gather:
   - Company data and competitors
   - Financial metrics and stock prices
   - Recent news and industry trends
3. Groq AI analyzes with both pitch deck + external intelligence
4. Returns enhanced report with market context

**Note**: The system gracefully handles API failures. Analysis continues even if some APIs are unavailable.

---

## 📁 Project Structure

```
Deal-Sourcing-AI/
├── backend/
│   ├── app/
│   │   ├── models.py              # Pydantic models
│   │   ├── database.py            # Supabase client
│   │   ├── main.py                # FastAPI app
│   │   ├── routes/
│   │   │   ├── auth.py            # Authentication endpoints
│   │   │   ├── profiles.py        # Profile management
│   │   │   └── analysis.py        # Pitch deck analysis
│   │   └── services/
│   │       ├── auth_service.py    # JWT & password handling
│   │       ├── analysis_service.py # AI analysis logic
│   │       └── external_apis.py   # External API integrations
│   ├── database_schema_pivot.sql  # Database schema
│   ├── requirements.txt           # Python dependencies
│   └── .env.example               # Environment template
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── CompanyMetadataForm.jsx  # Company info form
│   │   ├── pages/
│   │   │   ├── Landing.jsx        # Landing page
│   │   │   ├── Login.jsx          # Login page
│   │   │   ├── Register.jsx       # Registration page
│   │   │   ├── ProfileSetup.jsx   # Thesis setup
│   │   │   └── Dashboard.jsx      # Main dashboard
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state management
│   │   └── main.jsx               # App entry point
│   ├── package.json               # Node dependencies
│   └── .env.example               # Environment template
│
├── test_external_apis.py          # API integration tests
└── README.md                      # This file
```

---

## 🧪 Testing

### Test External APIs

Run the test script to verify all API integrations:

```bash
python test_external_apis.py
```

This will test:
- ✅ The Companies API (company enrichment)
- ✅ Alpha Vantage API (financial data)
- ✅ News API (news articles and trends)
- ✅ Full integration (all APIs together)

### Manual Testing

1. Start backend: `cd backend && uvicorn app.main:app --reload`
2. Start frontend: `cd frontend && npm run dev`
3. Create an account and set up your thesis
4. Upload a pitch deck with company metadata
5. Verify enhanced analysis appears

---

## 🚢 Deployment

### Backend Deployment (Render)

1. Create a new Web Service on [Render](https://render.com)
2. Connect your GitHub repository
3. Configure:
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Environment**: Python 3.11
4. Add environment variables from `.env.example`
5. Deploy!

### Frontend Deployment (Vercel)

1. Install Vercel CLI: `npm i -g vercel`
2. From `frontend/` directory: `vercel`
3. Follow prompts to deploy
4. Set environment variable in Vercel dashboard:
   - **Variable Name**: `VITE_API_URL`
   - **Value**: `https://deal-sourcing-ai-backend.onrender.com/api` (⚠️ MUST include `/api` suffix!)

Alternatively, connect your GitHub repo to Vercel dashboard for automatic deployments.

**Important**: The `/api` suffix is critical! Without it, authentication endpoints will return 404 errors.

---

## 🔒 Security Best Practices

- ✅ All API keys stored in environment variables
- ✅ JWT tokens for secure authentication
- ✅ Password hashing with bcrypt
- ✅ CORS configuration for production
- ✅ Service role keys for backend-only operations
- ✅ No sensitive data in git repository

**Important**: Never commit `.env` files to version control!

---

## 🐛 Troubleshooting

### Backend Issues

**"GROQ_API_KEY not set"**
- Check `.env` file exists in `backend/` directory
- Verify API key is correct
- Restart the backend server

**"Failed to connect to Supabase"**
- Verify `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
- Check Supabase project is active
- Ensure database tables are created

**"External API not working"**
- Check API keys in `.env`
- Verify you haven't exceeded rate limits
- Check backend logs for specific errors

### Frontend Issues

**"Network Error" when uploading**
- Verify backend is running on `http://localhost:8000`
- Check `VITE_API_URL` in frontend `.env`
- Ensure CORS is configured correctly

**"404 Not Found" on login/register**
- **CRITICAL**: Ensure `VITE_API_URL` includes `/api` suffix
- ✅ Correct: `VITE_API_URL=https://deal-sourcing-ai-backend.onrender.com/api`
- ❌ Wrong: `VITE_API_URL=https://deal-sourcing-ai-backend.onrender.com`
- In Vercel dashboard, update environment variable and redeploy
- For local development, check `frontend/.env` file

**"Analysis failed"**
- Check browser console for errors
- Verify you're logged in
- Ensure you've completed your investor profile

---

## 📊 API Rate Limits & Costs

### Free Tier Limits

| API | Free Tier Limit | Notes |
|-----|----------------|-------|
| Groq | Generous free tier | Fast inference |
| The Companies API | 1 credit/enrichment | Check your plan |
| Alpha Vantage | 25 requests/day | 5 calls/minute max |
| News API | 100 requests/day | Developer tier |

**Recommendations:**
- Use company metadata selectively for best results
- Alpha Vantage: Only for public companies
- Cache results when possible
- Consider upgrading APIs for production use

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Groq** - Lightning-fast AI inference
- **Supabase** - Backend as a service
- **The Companies API** - Company data enrichment
- **Alpha Vantage** - Financial market data
- **News API** - News aggregation

---

## 📞 Support

For issues or questions:
- Open an issue on GitHub
- Check the troubleshooting section above
- Review API documentation links in setup section

---

**Built with ❤️ for investors who value data-driven decisions**

*Last updated: January 2026*
