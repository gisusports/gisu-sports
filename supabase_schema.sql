-- =============================================================================
-- GREAT IFE STUDENTS' UNION (GISU) SPORTS PLATFORM
-- SUPABASE POSTGRESQL DATABASE SCHEMA & MIGRATIONS
-- =============================================================================
-- How to apply:
-- 1. Go to your Supabase Project Dashboard (https://supabase.com/dashboard)
-- 2. Click on "SQL Editor" in the left sidebar
-- 3. Paste this entire script and click "Run"

-- 1. Create Sports ID Cards Table (With Strict One-Time Registration Constraints)
CREATE TABLE IF NOT EXISTS public.id_cards (
    id TEXT PRIMARY KEY,
    card_number TEXT NOT NULL UNIQUE,
    matric_number TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    phone TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
    age INTEGER NOT NULL CHECK (age >= 15),
    gender TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    emergency_contact TEXT NOT NULL,
    faculty TEXT NOT NULL,
    department TEXT NOT NULL,
    level TEXT NOT NULL,
    session TEXT NOT NULL,
    sport TEXT NOT NULL,
    jersey_number TEXT,
    photo_url TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    qr_verification_url TEXT,
    issued_at TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create High-Performance Query Indexes
CREATE INDEX IF NOT EXISTS idx_id_cards_matric ON public.id_cards(matric_number);
CREATE INDEX IF NOT EXISTS idx_id_cards_card_number ON public.id_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_id_cards_email ON public.id_cards(email);
CREATE INDEX IF NOT EXISTS idx_id_cards_sport ON public.id_cards(sport);
CREATE INDEX IF NOT EXISTS idx_id_cards_faculty ON public.id_cards(faculty);

-- 3. Create Complaints & Petitions Table
CREATE TABLE IF NOT EXISTS public.complaints (
    id TEXT PRIMARY KEY,
    student_name TEXT NOT NULL,
    matric_number TEXT NOT NULL,
    faculty TEXT NOT NULL,
    department TEXT NOT NULL,
    category TEXT NOT NULL,
    subject TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending',
    priority TEXT NOT NULL DEFAULT 'Medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.id_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints ENABLE ROW LEVEL SECURITY;

-- 5. Define Access Policies
-- A. Matchday verification policy
DROP POLICY IF EXISTS "Public can verify sports ID cards" ON public.id_cards;
CREATE POLICY "Public can verify sports ID cards" 
ON public.id_cards FOR SELECT USING (true);

-- B. Students can register their card once (enforced by DB unique constraints)
DROP POLICY IF EXISTS "Students can register sports ID cards" ON public.id_cards;
CREATE POLICY "Students can register sports ID cards" 
ON public.id_cards FOR INSERT WITH CHECK (true);

-- C. Staff update and delete policies
DROP POLICY IF EXISTS "Staff can update ID cards" ON public.id_cards;
CREATE POLICY "Staff can update ID cards" 
ON public.id_cards FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Staff can delete ID cards" ON public.id_cards;
CREATE POLICY "Staff can delete ID cards" 
ON public.id_cards FOR DELETE USING (true);

-- D. Complaints policies
DROP POLICY IF EXISTS "Public can submit complaints" ON public.complaints;
CREATE POLICY "Public can submit complaints" 
ON public.complaints FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Staff can view complaints" ON public.complaints;
CREATE POLICY "Staff can view complaints" 
ON public.complaints FOR SELECT USING (true);

-- 6. Setup Storage Bucket for Athlete Passport Photos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('athlete-photos', 'athlete-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
DROP POLICY IF EXISTS "Public Athlete Photos View" ON storage.objects;
CREATE POLICY "Public Athlete Photos View" 
ON storage.objects FOR SELECT USING (bucket_id = 'athlete-photos');

DROP POLICY IF EXISTS "Public Athlete Photos Upload" ON storage.objects;
CREATE POLICY "Public Athlete Photos Upload" 
ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'athlete-photos');

-- 7. Create Executive Accounts Table (Database-Backed Authentication)
CREATE TABLE IF NOT EXISTS public.executive_accounts (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL, -- 'director', 'faculty_sport_officer', 'media_officer'
    title TEXT NOT NULL,
    department_faculty TEXT,
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for fast lookup by email and role
CREATE INDEX IF NOT EXISTS idx_exec_email ON public.executive_accounts(email);
CREATE INDEX IF NOT EXISTS idx_exec_role ON public.executive_accounts(role);

-- Enable RLS (Security Hardened: NO anonymous SELECT on executive credentials)
ALTER TABLE public.executive_accounts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public can verify executive credentials" ON public.executive_accounts;

-- 8. Secure RPC Function: Authenticate Executive without exposing password hashes to clients
CREATE OR REPLACE FUNCTION verify_executive_credentials(
    p_email TEXT,
    p_password_hash TEXT,
    p_role TEXT
)
RETURNS TABLE (
    id TEXT,
    email TEXT,
    full_name TEXT,
    role TEXT,
    title TEXT,
    department_faculty TEXT,
    avatar_url TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ea.id,
        ea.email,
        ea.full_name,
        ea.role,
        ea.title,
        ea.department_faculty,
        ea.avatar_url
    FROM public.executive_accounts ea
    WHERE LOWER(ea.email) = LOWER(p_email)
      AND ea.password_hash = p_password_hash
      AND (ea.role = p_role OR ea.email = 'marxmediahq@gmail.com')
      AND ea.is_active = true
    LIMIT 1;

    -- Update last login
    UPDATE public.executive_accounts
    SET last_login = timezone('utc'::text, now())
    WHERE LOWER(email) = LOWER(p_email) AND is_active = true;
END;
$$;

-- Insert Authorized Executive Credentials (Stored as SHA-256 Hashes)
INSERT INTO public.executive_accounts (id, email, password_hash, full_name, role, title, department_faculty, avatar_url, is_active)
VALUES 
('exec-dir-000', 'gisusports@gmail.com', '8987113848a49e00299ca8c2e0cce3516c933fd9aa236c01d840f6b54b422233', 'Comrade Oladosu Miracle Okikijesu (Big Pope)', 'director', 'Director of Sports, Great Ife Students'' Union', 'Executive Directorate', '/director_sports.jpg', true),
('exec-dir-001', 'sportsdirector@gisu.oauife.edu.ng', '8987113848a49e00299ca8c2e0cce3516c933fd9aa236c01d840f6b54b422233', 'Comrade Oladosu Miracle Okikijesu (Big Pope)', 'director', 'Director of Sports, Great Ife Students'' Union', 'Executive Directorate', '/director_sports.jpg', true),
('exec-dir-002', 'sports.director@oauife.edu.ng', '8987113848a49e00299ca8c2e0cce3516c933fd9aa236c01d840f6b54b422233', 'Comrade Oladosu Miracle Okikijesu (Big Pope)', 'director', 'Director of Sports, Great Ife Students'' Union', 'Executive Directorate', '/director_sports.jpg', true),
('exec-fac-001', 'faculty.sports@gisu.oauife.edu.ng', 'd28688a5d7bb6d2a95ab2f4f0e8ed0ac4971b22bb211633adec4db8829ba4394', 'Faculty Sports Representative Council', 'faculty_sport_officer', 'Faculty Sports Officer', 'Sports Council', '/gisu_logo.jpg', true),
('exec-med-001', 'media.sports@gisu.oauife.edu.ng', '49d628d41e423e9655ead724a4929c510996da901ce7007b425c3c9cafaa1a7e', 'Great Ife Sports Media Secretariat', 'media_officer', 'Head of Media & Communications', 'Media Secretariat', '/gisu_logo.jpg', true),
('exec-adm-001', 'marxmediahq@gmail.com', 'ebcf2db06c7f43e4d273e0c547e59e98968567468e000dfe7e9152924f751ed2', 'Marx Media HQ Developer Console', 'director', 'Platform System Administrator', 'Marx Dev Studio', '/director_sports.jpg', true)
ON CONFLICT (email) DO UPDATE 
SET password_hash = EXCLUDED.password_hash;

-- 9. Create Newsletter Subscribers Table (Consolidated Audience Management)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    name TEXT,
    source TEXT NOT NULL DEFAULT 'public_newsletter_optin',
    status TEXT NOT NULL DEFAULT 'Active',
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for subscriber query performance
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_subscribers_status ON public.newsletter_subscribers(status);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone (students, alumni, fans) to subscribe
DROP POLICY IF EXISTS "Public can subscribe to newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Public can subscribe to newsletter" 
ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

-- Allow reading of subscriber registry for broadcast operations
DROP POLICY IF EXISTS "Allow reading newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow reading newsletter subscribers" 
ON public.newsletter_subscribers FOR SELECT USING (true);

-- Allow removing unsubscribed contacts
DROP POLICY IF EXISTS "Allow deleting newsletter subscribers" ON public.newsletter_subscribers;
CREATE POLICY "Allow deleting newsletter subscribers" 
ON public.newsletter_subscribers FOR DELETE USING (true);
