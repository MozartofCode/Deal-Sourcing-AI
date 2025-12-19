-- Additional database tables for tracking, messaging, and AI matching
-- Run this SQL in your Supabase SQL Editor after the base schema

-- User profiles (public information visible to other users)
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('entrepreneur', 'investor')),
    bio TEXT,
    company_name VARCHAR(255),
    industry VARCHAR(100),
    location VARCHAR(255),
    website VARCHAR(255),
    linkedin_url VARCHAR(255),
    twitter_url VARCHAR(255),
    investment_focus TEXT, -- For investors: what they invest in
    startup_stage VARCHAR(50), -- For entrepreneurs: what stage they're at
    funding_goal DECIMAL(15, 2), -- For entrepreneurs
    check_size_min DECIMAL(15, 2), -- For investors
    check_size_max DECIMAL(15, 2), -- For investors
    portfolio_size INTEGER, -- For investors: number of investments
    profile_image_url VARCHAR(500),
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Search history (track all searches)
CREATE TABLE IF NOT EXISTS search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    search_type VARCHAR(50) NOT NULL, -- 'startup', 'vc', 'investor', 'general'
    query TEXT NOT NULL,
    filters JSONB, -- Store filters like industry, stage, etc.
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profile views (track when users view startups/VCs/other users)
CREATE TABLE IF NOT EXISTS profile_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    viewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    viewed_type VARCHAR(50) NOT NULL, -- 'startup', 'vc', 'user'
    viewed_id VARCHAR(255) NOT NULL, -- ID of the viewed item (could be external or internal)
    viewed_name VARCHAR(255),
    metadata JSONB, -- Store additional info about what was viewed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Saved items (bookmarks for startups/VCs)
CREATE TABLE IF NOT EXISTS saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    item_type VARCHAR(50) NOT NULL, -- 'startup', 'vc', 'investor'
    item_id VARCHAR(255) NOT NULL,
    item_name VARCHAR(255),
    item_data JSONB, -- Store full item data for quick access
    notes TEXT,
    tags TEXT[], -- Array of tags
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, item_type, item_id)
);

-- Direct messages between users
CREATE TABLE IF NOT EXISTS direct_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject VARCHAR(255),
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    related_item_type VARCHAR(50), -- 'startup', 'vc', null
    related_item_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI matches and suggestions
CREATE TABLE IF NOT EXISTS ai_matches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    match_type VARCHAR(50) NOT NULL, -- 'startup_for_investor', 'investor_for_entrepreneur'
    matched_item_type VARCHAR(50) NOT NULL, -- 'startup', 'vc', 'user'
    matched_item_id VARCHAR(255) NOT NULL,
    matched_item_name VARCHAR(255),
    match_score DECIMAL(5, 2), -- 0-100 match score
    match_reason TEXT, -- Why this is a good match
    suggested_email_draft TEXT, -- AI-generated warm email
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'viewed', 'contacted', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Connection requests (when users want to connect)
CREATE TABLE IF NOT EXISTS connection_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    requester_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    recipient_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(requester_id, recipient_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_type ON user_profiles(user_type);
CREATE INDEX IF NOT EXISTS idx_search_history_user_id ON search_history(user_id);
CREATE INDEX IF NOT EXISTS idx_search_history_created_at ON search_history(created_at);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewer_id ON profile_views(viewer_id);
CREATE INDEX IF NOT EXISTS idx_profile_views_viewed_type ON profile_views(viewed_type);
CREATE INDEX IF NOT EXISTS idx_saved_items_user_id ON saved_items(user_id);
CREATE INDEX IF NOT EXISTS idx_saved_items_item_type ON saved_items(item_type);
CREATE INDEX IF NOT EXISTS idx_direct_messages_sender_id ON direct_messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_recipient_id ON direct_messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_direct_messages_created_at ON direct_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_ai_matches_user_id ON ai_matches(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_matches_status ON ai_matches(status);
CREATE INDEX IF NOT EXISTS idx_connection_requests_requester_id ON connection_requests(requester_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_recipient_id ON connection_requests(recipient_id);
CREATE INDEX IF NOT EXISTS idx_connection_requests_status ON connection_requests(status);

-- Enable Row Level Security
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE direct_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE connection_requests ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- User profiles: Users can view public profiles, update own profile
DROP POLICY IF EXISTS "Users can view public profiles" ON user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON user_profiles;
CREATE POLICY "Users can view public profiles" ON user_profiles FOR SELECT USING (is_public = true OR auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Search history: Users can only see their own searches
DROP POLICY IF EXISTS "Users can view own search history" ON search_history;
DROP POLICY IF EXISTS "Users can insert own search history" ON search_history;
CREATE POLICY "Users can view own search history" ON search_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own search history" ON search_history FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Profile views: Users can only see their own views
DROP POLICY IF EXISTS "Users can view own profile views" ON profile_views;
DROP POLICY IF EXISTS "Users can insert own profile views" ON profile_views;
CREATE POLICY "Users can view own profile views" ON profile_views FOR SELECT USING (auth.uid() = viewer_id);
CREATE POLICY "Users can insert own profile views" ON profile_views FOR INSERT WITH CHECK (auth.uid() = viewer_id);

-- Saved items: Users can only see their own saved items
DROP POLICY IF EXISTS "Users can view own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can insert own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can update own saved items" ON saved_items;
DROP POLICY IF EXISTS "Users can delete own saved items" ON saved_items;
CREATE POLICY "Users can view own saved items" ON saved_items FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own saved items" ON saved_items FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own saved items" ON saved_items FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own saved items" ON saved_items FOR DELETE USING (auth.uid() = user_id);

-- Direct messages: Users can see messages they sent or received
DROP POLICY IF EXISTS "Users can view own messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can send messages" ON direct_messages;
DROP POLICY IF EXISTS "Users can update own messages" ON direct_messages;
CREATE POLICY "Users can view own messages" ON direct_messages FOR SELECT USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can send messages" ON direct_messages FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update own messages" ON direct_messages FOR UPDATE USING (auth.uid() = sender_id OR auth.uid() = recipient_id);

-- AI matches: Users can only see their own matches
DROP POLICY IF EXISTS "Users can view own AI matches" ON ai_matches;
DROP POLICY IF EXISTS "Users can update own AI matches" ON ai_matches;
CREATE POLICY "Users can view own AI matches" ON ai_matches FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own AI matches" ON ai_matches FOR UPDATE USING (auth.uid() = user_id);

-- Connection requests: Users can see requests they sent or received
DROP POLICY IF EXISTS "Users can view own connection requests" ON connection_requests;
DROP POLICY IF EXISTS "Users can create connection requests" ON connection_requests;
DROP POLICY IF EXISTS "Users can update own connection requests" ON connection_requests;
CREATE POLICY "Users can view own connection requests" ON connection_requests FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = recipient_id);
CREATE POLICY "Users can create connection requests" ON connection_requests FOR INSERT WITH CHECK (auth.uid() = requester_id);
CREATE POLICY "Users can update own connection requests" ON connection_requests FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = recipient_id);

