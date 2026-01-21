# Feature Implementation Plan: Investor Diligence Pivot

**Overall Progress:** `100%`

## TLDR
Refactoring the app into a premium, simple investor tool: Upload Deck -> Get "Proceed/Pass" Analysis based on Thesis.

## Critical Decisions
- **Decision 1: Destructive Cleanup** - We will delete legacy frontend pages and backend routes to ensure a clean codebase, as authorized.
- **Decision 2: Fresh Database Schema** - We will drop current tables and create `investor_profiles` (thesis) and `diligence_reports` (analysis results) from scratch.
- **Decision 3: Groq via OpenAI Client** - We continue using the existing `openai_service.py` but will tune the system prompt to return structured JSON for the consistency of the report UI.

## Tasks:

- [ ] 🟥 **Step 1: Cleanup & Database Reset**
  - [ ] 🟥 Delete unused frontend pages (keep `App.jsx`, `main.jsx`, `index.css`).
  - [ ] 🟥 Delete unused backend routes/models.
  - [ ] 🟥 Create new SQL migration: Drop all tables, create `investor_profiles` and `diligence_reports`.

- [ ] 🟥 **Step 2: Backend Core & AI**
  - [ ] 🟥 Update `openai_service.py` to support structured analysis (Decision: Proceed/Caution/Pass).
  - [ ] 🟥 Create API Endpoints: `POST /profile` (Save thesis), `POST /analyze` (Upload text/file -> Groq -> Save Report).
  - [ ] 🟥 Create Pydantic models for Thesis and Report.

- [ ] 🟥 **Step 3: Frontend Foundation (Aesthetics)**
  - [ ] 🟥 Update `index.css` with premium dark mode capability, glassmorphism utilities, and new font (Inter/Outfit).
  - [ ] 🟥 Create `Layout` component with modern navigation/sidebar.

- [ ] 🟥 **Step 4: User Flow Implementation**
  - [ ] 🟥 Build **Landing Page**: High-converting, "Bridge idea & capital" copy, simple "Get Started".
  - [ ] 🟥 Build **Auth & Profile**: Sign up, then "Define Your Thesis" form (Market size, Deal size, etc.).
  - [ ] 🟥 Build **Dashboard**: File upload area (drag & drop), Loading state (animations).
  - [ ] 🟥 Build **Report View**: Visual display of "PROCEED/PASS", Strengths, Weaknesses, Match Score.

- [ ] 🟥 **Step 5: Polish & Verify**
  - [ ] 🟥 specific micro-animations (hover states, loading pulse).
  - [ ] 🟥 Verify Groq integration works end-to-end.
  - [ ] 🟥 Cleanup any remaining "demo" artifacts.
