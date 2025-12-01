-- Useful views for consent management
-- Run this after 003_create_helper_functions.sql

-- View: Latest consent per visitor (deduplicated)
CREATE OR REPLACE VIEW latest_consent_per_visitor AS
SELECT DISTINCT ON (visitor_id)
  id,
  visitor_id,
  consent_id,
  consent_version,
  user_id,
  scope,
  categories,
  action,
  timestamp,
  expires_at,
  expires_at > NOW() as is_valid,
  (categories->>'analytics')::boolean as analytics_enabled,
  (categories->>'marketing')::boolean as marketing_enabled,
  (categories->>'preferences')::boolean as preferences_enabled
FROM consent_records
ORDER BY visitor_id, timestamp DESC;

-- View: Active consents only (not expired)
CREATE OR REPLACE VIEW active_consents AS
SELECT *
FROM latest_consent_per_visitor
WHERE is_valid = true;

-- View: Consent audit log (all actions with readable format)
CREATE OR REPLACE VIEW consent_audit_log AS
SELECT
  consent_id,
  visitor_id,
  user_id,
  consent_version,
  action,
  CASE action
    WHEN 'accept_all' THEN 'Accepted all cookies'
    WHEN 'reject_all' THEN 'Rejected non-essential cookies'
    WHEN 'custom' THEN 'Custom selection'
    WHEN 'update' THEN 'Updated preferences'
  END as action_description,
  categories,
  timestamp,
  url,
  language
FROM consent_records
ORDER BY timestamp DESC;

-- View: Daily consent summary
CREATE OR REPLACE VIEW daily_consent_summary AS
SELECT
  DATE(timestamp) as date,
  COUNT(*) as total_actions,
  COUNT(*) FILTER (WHERE action = 'accept_all') as accept_all_count,
  COUNT(*) FILTER (WHERE action = 'reject_all') as reject_all_count,
  COUNT(*) FILTER (WHERE action = 'custom') as custom_count,
  COUNT(*) FILTER (WHERE action = 'update') as update_count,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE (categories->>'analytics')::boolean) / COUNT(*),
    1
  ) as analytics_acceptance_rate,
  ROUND(
    100.0 * COUNT(*) FILTER (WHERE (categories->>'marketing')::boolean) / COUNT(*),
    1
  ) as marketing_acceptance_rate
FROM consent_records
GROUP BY DATE(timestamp)
ORDER BY date DESC;

-- Grant access to views
GRANT SELECT ON latest_consent_per_visitor TO service_role;
GRANT SELECT ON active_consents TO service_role;
GRANT SELECT ON consent_audit_log TO service_role;
GRANT SELECT ON daily_consent_summary TO service_role;

-- Comments
COMMENT ON VIEW latest_consent_per_visitor IS 'Shows the most recent consent status for each visitor';
COMMENT ON VIEW active_consents IS 'Shows only non-expired consent records';
COMMENT ON VIEW consent_audit_log IS 'Human-readable audit log of all consent actions';
COMMENT ON VIEW daily_consent_summary IS 'Aggregated daily consent statistics for dashboards';
