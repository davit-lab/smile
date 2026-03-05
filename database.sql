
-- Full Idempotent Supabase SQL for Smile Agency Dental Clinic

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Site Global Content Table
CREATE TABLE IF NOT EXISTS site_content (
    id INT PRIMARY KEY,
    ka_data JSONB DEFAULT '{}'::jsonb,
    en_data JSONB DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Team Members Table
CREATE TABLE IF NOT EXISTS team_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name_ka TEXT NOT NULL,
    name_en TEXT NOT NULL,
    role_ka TEXT NOT NULL,
    role_en TEXT NOT NULL,
    image_url TEXT,
    bio_ka TEXT,
    bio_en TEXT,
    education_ka TEXT,
    education_en TEXT,
    specialization_ka TEXT,
    specialization_en TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Blog Posts Table
CREATE TABLE IF NOT EXISTS blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title_ka TEXT NOT NULL,
    title_en TEXT NOT NULL,
    content_ka TEXT NOT NULL,
    content_en TEXT NOT NULL,
    category_ka TEXT NOT NULL,
    category_en TEXT NOT NULL,
    excerpt_ka TEXT,
    excerpt_en TEXT,
    image_url TEXT,
    post_date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Leads (Appointments) Table
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    doctor TEXT,
    concern TEXT,
    message TEXT,
    date TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Seed initial site content
INSERT INTO site_content (id, ka_data, en_data) 
VALUES (1, '{}', '{}') 
ON CONFLICT (id) DO NOTHING;

-- 6. Enable Row Level Security (RLS)
ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

-- 7. Drop existing policies to avoid "already exists" errors
DROP POLICY IF EXISTS "Allow public all site_content" ON site_content;
DROP POLICY IF EXISTS "Allow public all team" ON team_members;
DROP POLICY IF EXISTS "Allow public all blog" ON blog_posts;
DROP POLICY IF EXISTS "Allow public all leads" ON leads;

-- 8. Create Policies (Public access for demo purposes, restrict in production)
CREATE POLICY "Allow public all site_content" ON site_content FOR ALL USING (true);
CREATE POLICY "Allow public all team" ON team_members FOR ALL USING (true);
CREATE POLICY "Allow public all blog" ON blog_posts FOR ALL USING (true);
CREATE POLICY "Allow public all leads" ON leads FOR ALL USING (true);
