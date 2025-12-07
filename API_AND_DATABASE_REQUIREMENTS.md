# Laguna AI - Complete API & Database Requirements

## Overview
This document outlines all APIs and database needs for full functionality without mock data.

---

## 🔌 REQUIRED APIs

### 1. **Portfolio Management APIs** (CRITICAL - Portfolio Page)
**Status:** ❌ Not implemented (currently using mock data)

#### Endpoints Needed:
- `GET /api/portfolio` - Get user's portfolio startups
- `POST /api/portfolio` - Add startup to portfolio
- `GET /api/portfolio/:id` - Get specific startup details
- `PUT /api/portfolio/:id` - Update startup (notes, status, etc.)
- `DELETE /api/portfolio/:id` - Remove startup from portfolio
- `GET /api/portfolio/stats` - Get portfolio statistics (Total, Active, Reviewing, Invested)

**Data Structure:**
```json
{
  "id": "uuid",
  "name": "string",
  "industry": "string",
  "stage": "string",
  "status": "Active|Reviewing|Invested|Rejected",
  "notes": "string",
  "addedDate": "datetime",
  "userId": "uuid",
  "analysisData": "json",
  "documents": ["url"],
  "tags": ["string"]
}
```

---

### 2. **Startup Database API** (CRITICAL - Discover Startups Page)
**Status:** ❌ Not implemented (currently using mock data)

#### Options:
**Option A: Use External Startup Database APIs**
- **Crunchbase API** - Comprehensive startup database
- **PitchBook API** - Financial and investment data
- **AngelList API** - Startup listings
- **CB Insights API** - Market intelligence

**Option B: Build Your Own Database**
- `GET /api/startups` - List startups with filters
- `GET /api/startups/:id` - Get startup details
- `POST /api/startups` - Add new startup (admin)
- `GET /api/startups/search` - Search startups

**Recommended:** Start with **Crunchbase API** (has free tier) + build your own database for saved/custom data

---

### 3. **File Export APIs** (Portfolio Page)
**Status:** ❌ Not implemented

#### Endpoints Needed:
- `POST /api/portfolio/export/csv` - Export portfolio as CSV
- `POST /api/portfolio/export/pdf` - Export portfolio as PDF
- `POST /api/analysis/export/:id` - Export analysis report as PDF

**Libraries Needed:**
- `pandas` (Python) for CSV
- `reportlab` or `weasyprint` (Python) for PDF
- Or use frontend libraries: `jsPDF`, `csv-export`

---

### 4. **Report Generation API** (Portfolio & Analysis Pages)
**Status:** ❌ Not implemented

#### Endpoints Needed:
- `POST /api/reports/generate` - Generate comprehensive portfolio report
- `GET /api/reports/:id` - Get generated report
- `POST /api/analysis/report` - Generate analysis report

**Features:**
- Portfolio summary
- Startup comparisons
- Market analysis
- Investment recommendations
- Charts and visualizations

---

### 5. **Sharing & Collaboration APIs** (Portfolio & Analysis Pages)
**Status:** ❌ Not implemented

#### Endpoints Needed:
- `POST /api/portfolio/share` - Share portfolio with team members
- `GET /api/portfolio/shared` - Get shared portfolios
- `POST /api/analysis/share` - Share analysis
- `POST /api/portfolio/collaborate` - Add collaborators

**Features:**
- Share via link (public/private)
- Team collaboration
- Permission levels (view/edit)
- Comments/annotations

---

### 6. **Conversation History API** (Chat Page)
**Status:** ⚠️ Partially implemented (mock data)

#### Endpoints Needed:
- `GET /api/conversations` - Get all conversations (✅ exists but returns mock)
- `POST /api/conversations` - Create new conversation (✅ exists)
- `GET /api/conversations/:id` - Get conversation with messages
- `PUT /api/conversations/:id` - Update conversation (title, etc.)
- `DELETE /api/conversations/:id` - Delete conversation
- `GET /api/conversations/:id/messages` - Get messages for conversation

**Current:** Returns mock data - needs database integration

---

### 7. **Startup Details API** (Discover Startups - "View Details" button)
**Status:** ❌ Not implemented

#### Endpoints Needed:
- `GET /api/startups/:id/details` - Get comprehensive startup details
- `GET /api/startups/:id/financials` - Get financial data
- `GET /api/startups/:id/team` - Get team information
- `GET /api/startups/:id/ip` - Get IP portfolio

**Data Sources:**
- External APIs (Crunchbase, PitchBook)
- Your own database
- Web scraping (with proper permissions)

---

### 8. **User Authentication & Management APIs** (All Pages)
**Status:** ❌ Not implemented

#### Endpoints Needed:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/me` - Update user profile
- `POST /api/auth/refresh` - Refresh token

**Features:**
- JWT tokens
- Password reset
- Email verification
- User profiles

---

### 9. **Analytics & Stats API** (Home Page)
**Status:** ❌ Not implemented (hardcoded stats)

#### Endpoints Needed:
- `GET /api/stats/overview` - Get platform statistics
- `GET /api/stats/user` - Get user-specific stats
- `GET /api/stats/trends` - Get market trends

**Data:**
- Total startups in database
- Industries covered
- User activity stats
- Popular searches

---

### 10. **Document Storage API** (Portfolio - "documents" feature)
**Status:** ❌ Not implemented

#### Endpoints Needed:
- `POST /api/documents/upload` - Upload document
- `GET /api/documents/:id` - Get document
- `DELETE /api/documents/:id` - Delete document
- `GET /api/documents` - List user documents

**Storage Options:**
- AWS S3
- Google Cloud Storage
- Azure Blob Storage
- Cloudinary (for images)

---

## 🗄️ DATABASE RECOMMENDATIONS

### **YES, you absolutely need a database!**

### Recommended Options:

#### **Option 1: PostgreSQL (Recommended for Production)**
**Why:**
- ✅ Relational database - perfect for structured data
- ✅ Excellent for complex queries (startups, portfolios, relationships)
- ✅ ACID compliance
- ✅ Free tier available (Supabase, Railway, Render)
- ✅ Great for VC analyst data (structured, relational)

**Best For:**
- User accounts
- Portfolio data
- Startup database
- Conversation history
- Relationships between entities

**Hosting Options:**
- **Supabase** (Free tier: 500MB, recommended for start)
- **Railway** (Free tier available)
- **Render** (Free tier available)
- **Neon** (Serverless PostgreSQL, free tier)
- **AWS RDS** (Production, paid)

---

#### **Option 2: MongoDB (Alternative)**
**Why:**
- ✅ Flexible schema (good for varying startup data)
- ✅ Easy to scale
- ✅ Good for document storage

**Best For:**
- If startup data structure varies significantly
- Document-heavy applications

**Hosting:**
- **MongoDB Atlas** (Free tier: 512MB)

---

#### **Option 3: Hybrid Approach (Recommended)**
- **PostgreSQL** for structured data (users, portfolios, conversations)
- **External APIs** for startup data (Crunchbase, etc.)
- **Object Storage** (S3/Cloudinary) for documents/images

---

## 📊 DATABASE SCHEMA SUGGESTIONS

### Core Tables:

#### **users**
```sql
- id (UUID, primary key)
- email (string, unique)
- password_hash (string)
- name (string)
- created_at (timestamp)
- updated_at (timestamp)
- subscription_tier (string)
```

#### **portfolios**
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- startup_name (string)
- startup_id (string, nullable - if from external API)
- industry (string)
- stage (string)
- status (enum: Active, Reviewing, Invested, Rejected)
- notes (text)
- analysis_data (JSONB)
- added_date (timestamp)
- created_at (timestamp)
- updated_at (timestamp)
```

#### **conversations**
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- title (string)
- created_at (timestamp)
- updated_at (timestamp)
```

#### **messages**
```sql
- id (UUID, primary key)
- conversation_id (UUID, foreign key)
- role (enum: user, assistant)
- content (text)
- timestamp (timestamp)
```

#### **analyses**
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- startup_name (string)
- analysis_type (string)
- analysis_data (JSONB)
- created_at (timestamp)
```

#### **documents**
```sql
- id (UUID, primary key)
- user_id (UUID, foreign key)
- portfolio_id (UUID, foreign key, nullable)
- filename (string)
- file_url (string)
- file_type (string)
- created_at (timestamp)
```

#### **shared_portfolios**
```sql
- id (UUID, primary key)
- portfolio_id (UUID, foreign key)
- shared_by (UUID, foreign key)
- shared_with (UUID, foreign key)
- permission (enum: view, edit)
- created_at (timestamp)
```

---

## 🚀 IMPLEMENTATION PRIORITY

### **Phase 1: Critical (Must Have)**
1. ✅ OpenAI API (Already implemented)
2. ❌ User Authentication API
3. ❌ Portfolio CRUD API
4. ❌ Database Setup (PostgreSQL)
5. ❌ Conversation History API (real database)

### **Phase 2: Important (Should Have)**
6. ❌ Startup Database API (Crunchbase integration)
7. ❌ Startup Details API
8. ❌ Export APIs (CSV/PDF)
9. ❌ Report Generation API

### **Phase 3: Nice to Have**
10. ❌ Sharing & Collaboration APIs
11. ❌ Document Storage API
12. ❌ Analytics & Stats API

---

## 💰 COST ESTIMATES

### **Free Tier Options:**
- **Supabase PostgreSQL**: 500MB free, perfect for MVP
- **MongoDB Atlas**: 512MB free
- **Railway**: $5/month free credit
- **Render**: Free tier available

### **Paid Options (as you scale):**
- **Supabase Pro**: $25/month (8GB database)
- **AWS RDS**: ~$15-50/month depending on size
- **Crunchbase API**: $99-499/month (depending on tier)

---

## 🛠️ RECOMMENDED TECH STACK

### **Database:**
- **PostgreSQL** (via Supabase or Railway)
- **ORM**: SQLAlchemy (Python) or Prisma (if using Node.js)

### **External APIs:**
- **Crunchbase API** - Startup database
- **OpenAI API** - Already using ✅
- **PitchBook API** - Financial data (optional, paid)

### **File Storage:**
- **AWS S3** or **Cloudinary** (for documents/images)

### **Authentication:**
- **JWT tokens** (implement yourself)
- Or use **Supabase Auth** (includes user management)

---

## 📝 NEXT STEPS

1. **Set up PostgreSQL database** (Supabase recommended)
2. **Implement User Authentication API**
3. **Create Portfolio CRUD API**
4. **Integrate Crunchbase API** for startup data
5. **Update frontend** to use real APIs instead of mock data
6. **Add file export functionality**
7. **Implement sharing features**

---

## 🔗 USEFUL RESOURCES

- **Supabase**: https://supabase.com (Free PostgreSQL + Auth)
- **Crunchbase API**: https://data.crunchbase.com/docs
- **Railway**: https://railway.app (Database hosting)
- **PostgreSQL Docs**: https://www.postgresql.org/docs/

