# Database Schema

This page documents the database schema for consent traceability.

## Supabase / PostgreSQL

The migrations are located in `migrations/` directory and are compatible with Supabase CLI.

### Running Migrations

\`\`\`bash
# With Supabase CLI
supabase db push

# Or run directly in SQL editor
# Copy contents of migrations/*.sql
\`\`\`

### Tables

#### consent_records

Main table storing all consent actions.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `visitor_id` | `text` | Device-level identifier |
| `consent_id` | `uuid` | Unique consent action ID |
| `consent_version` | `text` | Privacy policy version |
| `user_id` | `text` | Authenticated user ID (nullable) |
| `scope` | `text` | "device" or "global" |
| `categories` | `jsonb` | Consent categories object |
| `action` | `text` | Action type |
| `timestamp` | `timestamptz` | When consent was given |
| `expires_at` | `timestamptz` | When consent expires |
| `url` | `text` | Page URL |
| `user_agent` | `text` | Browser user agent |
| `language` | `text` | Browser language |
| `linked_from_device` | `text` | Original device (for global) |
| `created_at` | `timestamptz` | Record creation time |

#### device_user_links

Links device IDs to user accounts for hybrid consent mode.

| Column | Type | Description |
|--------|------|-------------|
| `id` | `uuid` | Primary key |
| `visitor_id` | `text` | Device identifier |
| `user_id` | `text` | User account ID |
| `linked_at` | `timestamptz` | When linked |

### Indexes

- `idx_consent_records_visitor_id` - Fast lookup by device
- `idx_consent_records_user_id` - Fast lookup by user
- `idx_consent_records_timestamp` - Time-based queries
- `idx_consent_records_consent_id` - Unique consent lookup

### Row Level Security (RLS)

The migrations include RLS policies:

- Users can read their own consent records
- Service role has full access for API operations
- Anonymous users cannot access the table directly

### Example Queries

\`\`\`sql
-- Get latest consent for a visitor
SELECT * FROM consent_records
WHERE visitor_id = 'abc123'
ORDER BY timestamp DESC
LIMIT 1;

-- Get all consent changes for a user
SELECT * FROM consent_records
WHERE user_id = 'user_456'
ORDER BY timestamp DESC;

-- Check if user has active analytics consent
SELECT 
  (categories->>'analytics')::boolean as has_analytics,
  expires_at > NOW() as is_valid
FROM consent_records
WHERE visitor_id = 'abc123'
ORDER BY timestamp DESC
LIMIT 1;

-- Consent statistics for last 30 days
SELECT
  action,
  COUNT(*) as count,
  DATE_TRUNC('day', timestamp) as day
FROM consent_records
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY action, DATE_TRUNC('day', timestamp)
ORDER BY day DESC;
\`\`\`

## Alternative: Using with Drizzle ORM

If you prefer using an ORM, here's the Drizzle schema:

\`\`\`typescript
// lib/db/schema.ts
import { pgTable, uuid, text, jsonb, timestamp } from "drizzle-orm/pg-core"

export const consentRecords = pgTable("consent_records", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: text("visitor_id").notNull(),
  consentId: uuid("consent_id").notNull().unique(),
  consentVersion: text("consent_version").notNull(),
  userId: text("user_id"),
  scope: text("scope").notNull().default("device"),
  categories: jsonb("categories").notNull(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp", { withTimezone: true }).notNull(),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  url: text("url"),
  userAgent: text("user_agent"),
  language: text("language"),
  linkedFromDevice: text("linked_from_device"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
})

export const deviceUserLinks = pgTable("device_user_links", {
  id: uuid("id").primaryKey().defaultRandom(),
  visitorId: text("visitor_id").notNull(),
  userId: text("user_id").notNull(),
  linkedAt: timestamp("linked_at", { withTimezone: true }).defaultNow(),
})
