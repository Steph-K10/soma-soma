CREATE TABLE email_log (
  id             UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email          TEXT NOT NULL,
  status         TEXT NOT NULL CHECK (status IN ('sent', 'failed')),
  error_message  TEXT,
  broadcast_type TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_email_log_status         ON email_log (status);
CREATE INDEX idx_email_log_broadcast_type ON email_log (broadcast_type);

ALTER TABLE email_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "service_role_full_access" ON email_log
  FOR ALL USING (auth.role() = 'service_role');