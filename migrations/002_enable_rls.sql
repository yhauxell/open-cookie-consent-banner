-- Enable Row Level Security for consent tables
-- Run this after 001_create_consent_tables.sql

-- Enable RLS on consent_records
ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;

-- Enable RLS on device_user_links
ALTER TABLE device_user_links ENABLE ROW LEVEL SECURITY;

-- Policy: Service role has full access (for API operations)
CREATE POLICY "Service role has full access to consent_records"
  ON consent_records
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role has full access to device_user_links"
  ON device_user_links
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can read their own consent records
CREATE POLICY "Users can read own consent records"
  ON consent_records
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Policy: Authenticated users can read their device links
CREATE POLICY "Users can read own device links"
  ON device_user_links
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid()::text);

-- Policy: Allow anonymous insert via API (service role handles this)
-- The API route uses service role key, so inserts work through the API

-- Comments
COMMENT ON POLICY "Service role has full access to consent_records" ON consent_records 
  IS 'Allows the API to insert and query consent records';
COMMENT ON POLICY "Users can read own consent records" ON consent_records 
  IS 'Users can view their own consent history';
