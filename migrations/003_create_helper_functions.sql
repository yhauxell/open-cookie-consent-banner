-- Helper functions for consent management
-- Run this after 002_enable_rls.sql

-- Function: Get latest consent for a visitor
CREATE OR REPLACE FUNCTION get_latest_consent(p_visitor_id TEXT)
RETURNS TABLE (
  consent_id UUID,
  categories JSONB,
  action TEXT,
  timestamp TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_valid BOOLEAN
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    consent_id,
    categories,
    action,
    timestamp,
    expires_at,
    expires_at > NOW() as is_valid
  FROM consent_records
  WHERE visitor_id = p_visitor_id
  ORDER BY timestamp DESC
  LIMIT 1;
$$;

-- Function: Check if visitor has consented to a specific category
CREATE OR REPLACE FUNCTION has_category_consent(
  p_visitor_id TEXT,
  p_category TEXT
)
RETURNS BOOLEAN
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    COALESCE(
      (categories->>p_category)::boolean 
      AND expires_at > NOW(),
      false
    )
  FROM consent_records
  WHERE visitor_id = p_visitor_id
  ORDER BY timestamp DESC
  LIMIT 1;
$$;

-- Function: Get consent statistics for a date range
CREATE OR REPLACE FUNCTION get_consent_stats(
  p_start_date TIMESTAMPTZ DEFAULT NOW() - INTERVAL '30 days',
  p_end_date TIMESTAMPTZ DEFAULT NOW()
)
RETURNS TABLE (
  date DATE,
  action TEXT,
  count BIGINT,
  analytics_accepted BIGINT,
  marketing_accepted BIGINT
)
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT 
    DATE(timestamp) as date,
    action,
    COUNT(*) as count,
    COUNT(*) FILTER (WHERE (categories->>'analytics')::boolean = true) as analytics_accepted,
    COUNT(*) FILTER (WHERE (categories->>'marketing')::boolean = true) as marketing_accepted
  FROM consent_records
  WHERE timestamp BETWEEN p_start_date AND p_end_date
  GROUP BY DATE(timestamp), action
  ORDER BY date DESC, action;
$$;

-- Function: Link device to user account
CREATE OR REPLACE FUNCTION link_device_to_user(
  p_visitor_id TEXT,
  p_user_id TEXT
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_link_id UUID;
BEGIN
  INSERT INTO device_user_links (visitor_id, user_id)
  VALUES (p_visitor_id, p_user_id)
  ON CONFLICT (visitor_id, user_id) DO UPDATE
  SET linked_at = NOW()
  RETURNING id INTO v_link_id;
  
  -- Update existing consent records with user_id
  UPDATE consent_records
  SET user_id = p_user_id
  WHERE visitor_id = p_visitor_id
    AND user_id IS NULL;
  
  RETURN v_link_id;
END;
$$;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION get_latest_consent(TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION has_category_consent(TEXT, TEXT) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_consent_stats(TIMESTAMPTZ, TIMESTAMPTZ) TO service_role;
GRANT EXECUTE ON FUNCTION link_device_to_user(TEXT, TEXT) TO service_role;

-- Comments
COMMENT ON FUNCTION get_latest_consent IS 'Returns the most recent consent record for a visitor';
COMMENT ON FUNCTION has_category_consent IS 'Checks if a visitor has active consent for a category';
COMMENT ON FUNCTION get_consent_stats IS 'Returns aggregated consent statistics for reporting';
COMMENT ON FUNCTION link_device_to_user IS 'Links an anonymous device ID to an authenticated user';
