-- ============================================
-- WAITLIST TABLE For collecting early access signups
-- ============================================
CREATE TABLE waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY (RLS) policies to control access
-- ============================================

-- Enable RLS on waitlist table
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Anyone can join the waitlist
-- Allows unauthenticated users to sign up
CREATE POLICY "Anyone can join waitlist" ON waitlist
  FOR INSERT WITH CHECK (true);

-- POLICY 2: Users can check their own waitlist status
-- Allows checking using email (from JWT or session)
CREATE POLICY "Users can check waitlist status" ON waitlist
  FOR SELECT USING (
    email = current_setting('request.jwt.claims')::json->>'email'
  );

-- ============================================
-- HELPER FUNCTIONS
-- ============================================
-- Query to get a user's position (no need for a column)
-- Example usage: 
-- SELECT COUNT(*) as position 
-- FROM waitlist 
-- WHERE created_at <= (
--   SELECT created_at FROM waitlist WHERE email = 'user@example.com'
-- );
-- (This is a comment, not an executable statement)

-- ============================================
-- INDEXES (For performance)
-- ============================================

-- For quick lookups by email
CREATE INDEX idx_waitlist_email ON waitlist(email);