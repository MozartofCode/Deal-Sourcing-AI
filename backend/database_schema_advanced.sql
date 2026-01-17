-- Scout Advanced Features Database Schema
-- Run this after the main database_schema.sql

-- ============================================
-- EMAIL AUTOMATION TABLES
-- ============================================

-- Emails table - stores incoming emails
CREATE TABLE IF NOT EXISTS emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gmail_id VARCHAR(255) UNIQUE NOT NULL,
    thread_id VARCHAR(255),
    sender_email VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    subject TEXT,
    body TEXT,
    received_at TIMESTAMP WITH TIME ZONE NOT NULL,
    classification VARCHAR(50) CHECK (classification IN ('deal_inquiry', 'follow_up', 'meeting_confirmation', 'general', 'spam')),
    extracted_data JSONB, -- company name, pitch summary, ask amount, stage
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Email threads table - track email conversations
CREATE TABLE IF NOT EXISTS email_threads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    gmail_thread_id VARCHAR(255) UNIQUE NOT NULL,
    startup_name VARCHAR(255),
    last_email_at TIMESTAMP WITH TIME ZONE,
    email_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Deal pipeline table - track deal stages
CREATE TABLE IF NOT EXISTS deal_pipeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    email_thread_id UUID REFERENCES email_threads(id) ON DELETE SET NULL,
    startup_name VARCHAR(255) NOT NULL,
    stage VARCHAR(50) DEFAULT 'new_lead' CHECK (stage IN ('new_lead', 'initial_review', 'follow_up_sent', 'meeting_scheduled', 'due_diligence', 'decision')),
    contact_email VARCHAR(255),
    contact_name VARCHAR(255),
    last_action VARCHAR(255),
    last_action_at TIMESTAMP WITH TIME ZONE,
    next_action VARCHAR(255),
    next_action_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Automated actions log
CREATE TABLE IF NOT EXISTS automated_actions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    action_type VARCHAR(50) NOT NULL, -- 'email_sent', 'meeting_scheduled', 'deal_moved', etc.
    target_id UUID, -- email_id, deal_id, etc.
    target_type VARCHAR(50), -- 'email', 'deal', etc.
    action_data JSONB,
    success BOOLEAN DEFAULT TRUE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INVESTMENT THESIS LEARNING TABLES
-- ============================================

-- User interactions table - track all user actions
CREATE TABLE IF NOT EXISTS user_interactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    startup_id VARCHAR(255), -- external ID from Crunchbase, etc.
    startup_name VARCHAR(255) NOT NULL,
    interaction_type VARCHAR(50) NOT NULL CHECK (interaction_type IN ('view', 'add_to_portfolio', 'mark_interested', 'reject', 'note_added', 'tag_added')),
    interaction_value JSONB, -- additional data like notes, tags, time spent
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Startup features table - extracted features for ML
CREATE TABLE IF NOT EXISTS startup_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id VARCHAR(255) UNIQUE NOT NULL,
    startup_name VARCHAR(255) NOT NULL,
    industry VARCHAR(100),
    sector VARCHAR(100),
    sub_sector VARCHAR(100),
    stage VARCHAR(50),
    funding_total DECIMAL,
    team_size INTEGER,
    founding_year INTEGER,
    geography VARCHAR(100),
    business_model VARCHAR(100),
    technology_stack TEXT[],
    growth_rate DECIMAL,
    revenue DECIMAL,
    description TEXT,
    features_vector JSONB, -- numerical feature vector for ML
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ML models table - store trained models
CREATE TABLE IF NOT EXISTS ml_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    model_type VARCHAR(50) NOT NULL, -- 'preference_classifier', 'thesis_extractor', etc.
    model_version INTEGER NOT NULL,
    model_weights BYTEA, -- pickled model
    model_metadata JSONB, -- accuracy, training date, feature importance, etc.
    is_active BOOLEAN DEFAULT TRUE,
    trained_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Investment thesis table - learned thesis profiles
CREATE TABLE IF NOT EXISTS investment_thesis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    thesis_profile JSONB NOT NULL, -- preferred industries, stages, criteria with weights
    confidence_score DECIMAL, -- how confident we are in this thesis
    sample_size INTEGER, -- number of interactions used to build this
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- NETWORK ANALYSIS TABLES
-- ============================================

-- Network graph table - store user's connections
CREATE TABLE IF NOT EXISTS network_graph (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    connection_id VARCHAR(255) NOT NULL, -- LinkedIn ID
    connection_name VARCHAR(255) NOT NULL,
    connection_email VARCHAR(255),
    connection_title VARCHAR(255),
    connection_company VARCHAR(255),
    connection_industry VARCHAR(100),
    degree INTEGER NOT NULL CHECK (degree IN (1, 2)), -- 1st or 2nd degree
    relationship_strength DECIMAL, -- 0-1 score
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    linkedin_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, connection_id)
);

-- Introduction requests table
CREATE TABLE IF NOT EXISTS introduction_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    startup_name VARCHAR(255) NOT NULL,
    founder_name VARCHAR(255),
    founder_email VARCHAR(255),
    connection_id UUID REFERENCES network_graph(id) ON DELETE SET NULL,
    connection_path JSONB, -- array of connection IDs showing the path
    request_message TEXT,
    forward_message TEXT, -- message to forward to founder
    status VARCHAR(50) DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'accepted', 'declined', 'intro_made')),
    sent_at TIMESTAMP WITH TIME ZONE,
    response_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connection strength metrics
CREATE TABLE IF NOT EXISTS connection_strength (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    network_graph_id UUID NOT NULL REFERENCES network_graph(id) ON DELETE CASCADE,
    metric_type VARCHAR(50) NOT NULL, -- 'message_count', 'endorsements', 'shared_connections', etc.
    metric_value DECIMAL NOT NULL,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- SIGNAL ANALYSIS TABLES
-- ============================================

-- Startup signals table - store signal scores
CREATE TABLE IF NOT EXISTS startup_signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id VARCHAR(255) UNIQUE NOT NULL,
    startup_name VARCHAR(255) NOT NULL,
    founder_score DECIMAL DEFAULT 0 CHECK (founder_score >= 0 AND founder_score <= 100),
    traction_score DECIMAL DEFAULT 0 CHECK (traction_score >= 0 AND traction_score <= 100),
    momentum_score DECIMAL DEFAULT 0 CHECK (momentum_score >= 0 AND momentum_score <= 100),
    winner_potential_score DECIMAL DEFAULT 0 CHECK (winner_potential_score >= 0 AND winner_potential_score <= 100),
    signal_breakdown JSONB, -- detailed breakdown of each score component
    last_calculated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Signal history table - track changes over time
CREATE TABLE IF NOT EXISTS signal_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    startup_id VARCHAR(255) NOT NULL,
    signal_type VARCHAR(50) NOT NULL, -- 'founder', 'traction', 'momentum', 'overall'
    score DECIMAL NOT NULL,
    metadata JSONB,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Founder profiles table - cache founder data
CREATE TABLE IF NOT EXISTS founder_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    linkedin_id VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    current_company VARCHAR(255),
    previous_companies JSONB, -- array of {company, role, duration}
    education JSONB, -- array of {school, degree, field}
    is_serial_entrepreneur BOOLEAN DEFAULT FALSE,
    previous_exits JSONB, -- array of exit details
    faang_experience BOOLEAN DEFAULT FALSE,
    network_size INTEGER,
    profile_data JSONB, -- full profile data
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

-- Email automation indexes
CREATE INDEX IF NOT EXISTS idx_emails_user_id ON emails(user_id);
CREATE INDEX IF NOT EXISTS idx_emails_gmail_id ON emails(gmail_id);
CREATE INDEX IF NOT EXISTS idx_emails_classification ON emails(classification);
CREATE INDEX IF NOT EXISTS idx_email_threads_user_id ON email_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_user_id ON deal_pipeline(user_id);
CREATE INDEX IF NOT EXISTS idx_deal_pipeline_stage ON deal_pipeline(stage);
CREATE INDEX IF NOT EXISTS idx_automated_actions_user_id ON automated_actions(user_id);

-- ML indexes
CREATE INDEX IF NOT EXISTS idx_user_interactions_user_id ON user_interactions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_interactions_startup_id ON user_interactions(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_features_startup_id ON startup_features(startup_id);
CREATE INDEX IF NOT EXISTS idx_ml_models_user_id ON ml_models(user_id);
CREATE INDEX IF NOT EXISTS idx_ml_models_active ON ml_models(is_active);
CREATE INDEX IF NOT EXISTS idx_investment_thesis_user_id ON investment_thesis(user_id);

-- Network indexes
CREATE INDEX IF NOT EXISTS idx_network_graph_user_id ON network_graph(user_id);
CREATE INDEX IF NOT EXISTS idx_network_graph_connection_id ON network_graph(connection_id);
CREATE INDEX IF NOT EXISTS idx_introduction_requests_user_id ON introduction_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_introduction_requests_status ON introduction_requests(status);

-- Signal indexes
CREATE INDEX IF NOT EXISTS idx_startup_signals_startup_id ON startup_signals(startup_id);
CREATE INDEX IF NOT EXISTS idx_startup_signals_winner_score ON startup_signals(winner_potential_score);
CREATE INDEX IF NOT EXISTS idx_signal_history_startup_id ON signal_history(startup_id);
CREATE INDEX IF NOT EXISTS idx_founder_profiles_linkedin_id ON founder_profiles(linkedin_id);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Enable RLS on all new tables
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE deal_pipeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE automated_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE ml_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE investment_thesis ENABLE ROW LEVEL SECURITY;
ALTER TABLE network_graph ENABLE ROW LEVEL SECURITY;
ALTER TABLE introduction_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_strength ENABLE ROW LEVEL SECURITY;
ALTER TABLE startup_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE signal_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE founder_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (users can only access their own data)
CREATE POLICY "Users can view own emails" ON emails FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own emails" ON emails FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own email_threads" ON email_threads FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own email_threads" ON email_threads FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own deal_pipeline" ON deal_pipeline FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own deal_pipeline" ON deal_pipeline FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own automated_actions" ON automated_actions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own automated_actions" ON automated_actions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own user_interactions" ON user_interactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own user_interactions" ON user_interactions FOR ALL USING (auth.uid() = user_id);

-- Startup features are shared (read-only for all users)
CREATE POLICY "All users can view startup_features" ON startup_features FOR SELECT USING (true);

CREATE POLICY "Users can view own ml_models" ON ml_models FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own ml_models" ON ml_models FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own investment_thesis" ON investment_thesis FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own investment_thesis" ON investment_thesis FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own network_graph" ON network_graph FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own network_graph" ON network_graph FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own introduction_requests" ON introduction_requests FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own introduction_requests" ON introduction_requests FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own connection_strength" ON connection_strength FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM network_graph 
        WHERE network_graph.id = connection_strength.network_graph_id 
        AND network_graph.user_id = auth.uid()
    )
);

-- Startup signals are shared (read-only for all users)
CREATE POLICY "All users can view startup_signals" ON startup_signals FOR SELECT USING (true);
CREATE POLICY "All users can view signal_history" ON signal_history FOR SELECT USING (true);
CREATE POLICY "All users can view founder_profiles" ON founder_profiles FOR SELECT USING (true);
