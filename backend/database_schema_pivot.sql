-- CLEANUP: Drop existing tables if they exist
DROP TABLE IF EXISTS public.diligence_reports CASCADE;
DROP TABLE IF EXISTS public.investor_profiles CASCADE;
-- Also drop old tables if they remain
DROP TABLE IF EXISTS public.portfolio_startups CASCADE;
DROP TABLE IF EXISTS public.chat_messages CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.startup_tracking CASCADE;
DROP TABLE IF EXISTS public.user_profiles CASCADE;
DROP TABLE IF EXISTS public.connections CASCADE;
DROP TABLE IF EXISTS public.notifications CASCADE;

-- INVESTOR PROFILES
CREATE TABLE public.investor_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    thesis TEXT NOT NULL,
    min_ticket_size NUMERIC,
    max_ticket_size NUMERIC,
    target_industries TEXT[],
    geography TEXT,
    investment_stage TEXT,
    expected_return TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- DILIGENCE REPORTS
CREATE TABLE public.diligence_reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    deck_content TEXT, -- Could be text extracted or a URL to the file
    deck_filename TEXT,
    decision TEXT NOT NULL CHECK (decision IN ('PROCEED', 'CAUTION', 'PASS')),
    score INTEGER CHECK (score >= 0 AND score <= 100),
    summary TEXT,
    strengths TEXT[],
    weaknesses TEXT[],
    analysis_json JSONB, -- The full raw analysis object
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS POLICIES
ALTER TABLE public.investor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diligence_reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.investor_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON public.investor_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON public.investor_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own reports" ON public.diligence_reports
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reports" ON public.diligence_reports
    FOR INSERT WITH CHECK (auth.uid() = user_id);
