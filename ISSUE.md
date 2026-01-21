# Issue: Pivot to Simple Investor Diligence Tool

## TL;DR
Refactor the entire application into a streamlined tool for investors. The flow will be: Landing -> Sign Up -> Investor Profile (Thesis) -> Upload Pitch Deck -> AI Diligence Report (Proceed/Caution/Pass).

## Current State vs Expected Outcome
- **Current**: Complex/legacy application structure with unused features.
- **Expected**: A focused, simple web app. All unused pages and complexity removed. Database schema reset to support only Users, Investor Profiles, and Diligence Reports.

## Implementation Details
- **Cleanup**: Delete legacy frontend pages and backend routes.
- **Backend Service**: Utilize existing `backend/app/services/openai_service.py` (Groq) for analysis.
- **Database**: Reset schema. New tables: `users`, `investor_profiles` (thesis criteria), `diligence_reports` (deck analysis).
- **Frontend**:
  - Landing Page: Value prop.
  - Auth: Simple Sign Up/Login.
  - Profile: Form for thesis (market size, ticket size, return expectations).
  - Main: Upload area -> Loading -> Report View.

## Risks & Notes
- **Data Loss**: **APPROVED**. User explicitly allowed deleting all existing data and users.
- **AI Integration**: Use existing Groq integration.
- **Style**: High-quality, premium aesthetic (Glassmorphism, dark mode, animations).

## Relevant Files
- `backend/app/services/openai_service.py`
- `backend/app/main.py`
- `src/*` (Frontend to be heavily pruned/refactored)
