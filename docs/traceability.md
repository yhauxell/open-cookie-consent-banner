# Traceability

Consent traceability is essential for GDPR compliance. The library provides a complete audit trail system.

## Overview

Every consent action generates a `ConsentRecord` that can be:

1. Sent to your backend API
2. Stored in a database
3. Used for compliance audits

## ConsentRecord Structure

\`\`\`typescript
interface ConsentRecord {
  // Identifiers
  visitorId: string      // Device-level unique ID
  consentId: string      // Unique ID for this consent action
  userId?: string        // User account ID (when authenticated)

  // Consent details
  consentVersion: string // Your privacy policy version
  scope: "device" | "global"
  categories: {
    necessary: boolean   // Always true
    analytics: boolean
    marketing: boolean
    preferences: boolean
  }
  action: "accept_all" | "reject_all" | "custom" | "update"

  // Timestamps
  timestamp: string      // ISO 8601 when consent was given
  expiresAt: string      // When consent expires

  // Context
  url: string            // Page where consent was given
  userAgent: string      // Browser information
  language: string       // Browser language

  // Linking
  linkedFromDevice?: string  // Original device ID (for global scope)
}
\`\`\`

## Setup

### 1. Enable Traceability

\`\`\`tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    traceability: {
      enabled: true,
      endpoint: "/api/consent",
    },
  }}
>
\`\`\`

### 2. Create API Route

\`\`\`tsx
// app/api/consent/route.ts
import { createClient } from "@supabase/supabase-js"
import { NextResponse } from "next/server"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const record = await request.json()

  const { error } = await supabase
    .from("consent_records")
    .insert(record)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, consentId: record.consentId })
}
\`\`\`

### 3. Run Database Migration

See [Database Schema](./database.md) for the complete migration.

## Advanced Configuration

### Custom Visitor ID

Link consent to your user system:

\`\`\`tsx
traceability: {
  enabled: true,
  endpoint: "/api/consent",
  getVisitorId: async () => {
    // Return authenticated user ID if available
    const session = await getSession()
    if (session?.user?.id) {
      return session.user.id
    }
    // Fall back to anonymous device ID
    return getOrCreateDeviceId()
  },
}
\`\`\`

### Custom Headers

Add authentication or API keys:

\`\`\`tsx
traceability: {
  enabled: true,
  endpoint: "/api/consent",
  headers: {
    "Authorization": `Bearer ${accessToken}`,
    "X-API-Key": process.env.NEXT_PUBLIC_API_KEY!,
  },
}
\`\`\`

### Error Handling

Handle failed API calls:

\`\`\`tsx
traceability: {
  enabled: true,
  endpoint: "/api/consent",
  retryOnFailure: true,
  maxRetries: 3,
  onSuccess: (record) => {
    console.log("Consent recorded:", record.consentId)
  },
  onError: (error, record) => {
    // Record is automatically stored in localStorage for retry
    console.error("Failed to record consent:", error)
    // Optionally notify your error tracking service
    Sentry.captureException(error, { extra: { record } })
  },
}
\`\`\`

## Retry Failed Records

Failed records are stored in localStorage and can be retried:

\`\`\`tsx
import { retryFailedRecords } from "@/components/cookie-consent"

// Retry on app load
useEffect(() => {
  retryFailedRecords({
    enabled: true,
    endpoint: "/api/consent",
  })
}, [])
\`\`\`

## Querying Consent History

### Get User's Consent History

\`\`\`tsx
// app/api/consent/route.ts
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const visitorId = searchParams.get("visitorId")

  const { data, error } = await supabase
    .from("consent_records")
    .select("*")
    .eq("visitor_id", visitorId)
    .order("timestamp", { ascending: false })

  return NextResponse.json({ records: data })
}
\`\`\`

### Admin Dashboard Query

\`\`\`sql
-- Get consent statistics
SELECT
  action,
  COUNT(*) as count,
  DATE(timestamp) as date
FROM consent_records
WHERE timestamp > NOW() - INTERVAL '30 days'
GROUP BY action, DATE(timestamp)
ORDER BY date DESC;

-- Find users who revoked consent
SELECT DISTINCT visitor_id, user_id
FROM consent_records
WHERE action = 'reject_all'
  AND timestamp > NOW() - INTERVAL '7 days';
\`\`\`

## GDPR Compliance Checklist

- [x] Record timestamp of consent
- [x] Record what was consented to (categories)
- [x] Record consent version (policy version)
- [x] Unique identifier per consent action
- [x] Link to device/user for withdrawal requests
- [x] Store page URL where consent was given
- [x] Consent expiration tracking
