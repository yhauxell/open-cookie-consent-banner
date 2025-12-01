-- Cookie Consent Traceability Schema
-- Compatible with Supabase / PostgreSQL

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main consent records table
CREATE TABLE IF NOT EXISTS consent_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Identifiers
  visitor_id TEXT NOT NULL,
  consent_id UUID NOT NULL UNIQUE,
  consent_version TEXT NOT NULL,
  user_id TEXT,
  
  -- Scope
  scope TEXT NOT NULL DEFAULT 'device' CHECK (scope IN ('device', 'global')),
  
  -- Consent data (stored as JSONB for flexibility)
  categories JSONB NOT NULL,
  -- Example: {"necessary": true, "analytics": false, "marketing": false, "preferences": true}
  
  -- Action type
  action TEXT NOT NULL CHECK (action IN ('accept_all', 'reject_all', 'custom', 'update')),
  
  -- Timestamps
  timestamp TIMESTAMPTZ NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  
  -- Context
  url TEXT,
  user_agent TEXT,
  language TEXT,
  
  -- Linking for global scope
  linked_from_device TEXT,
  
  -- Audit
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Device to user linking table (for hybrid consent mode)
CREATE TABLE IF NOT EXISTS device_user_links (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id TEXT NOT NULL,
  user_id TEXT NOT NULL,
  linked_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure unique pairing
  UNIQUE(visitor_id, user_id)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_consent_records_visitor_id ON consent_records(visitor_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_user_id ON consent_records(user_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_timestamp ON consent_records(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_consent_records_consent_id ON consent_records(consent_id);
CREATE INDEX IF NOT EXISTS idx_consent_records_action ON consent_records(action);

CREATE INDEX IF NOT EXISTS idx_device_user_links_visitor_id ON device_user_links(visitor_id);
CREATE INDEX IF NOT EXISTS idx_device_user_links_user_id ON device_user_links(user_id);

-- Comments for documentation
COMMENT ON TABLE consent_records IS 'Stores all cookie consent actions for GDPR compliance';
COMMENT ON TABLE device_user_links IS 'Links anonymous device IDs to authenticated user accounts';

COMMENT ON COLUMN consent_records.visitor_id IS 'Device-level unique identifier';
COMMENT ON COLUMN consent_records.consent_id IS 'Unique identifier for this specific consent action';
COMMENT ON COLUMN consent_records.consent_version IS 'Version of the privacy policy consented to';
COMMENT ON COLUMN consent_records.categories IS 'JSONB object with boolean values for each consent category';
COMMENT ON COLUMN consent_records.scope IS 'Whether consent is device-specific or global (synced)';
