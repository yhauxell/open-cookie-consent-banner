# Configuration

## CookieConsentConfig

The main configuration object passed to `CookieConsentProvider`.

\`\`\`tsx
interface CookieConsentConfig {
  // Required
  consentVersion: string

  // Optional
  expirationDays?: number           // Default: 365
  privacyPolicyUrl?: string         // Link to privacy policy
  position?: BannerPosition         // Default: "bottom"
  categories?: CategoryConfig[]     // Custom category definitions
  traceability?: TraceabilityConfig // Consent tracking
  consentScope?: ConsentScopeConfig // Device vs global consent
  onConsentChange?: (event: ConsentChangeEvent) => void
}
\`\`\`

## Basic Configuration

\`\`\`tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    expirationDays: 365,
    privacyPolicyUrl: "/privacy-policy",
    position: "bottom",
  }}
>
  {children}
</CookieConsentProvider>
\`\`\`

## Banner Positions

\`\`\`tsx
type BannerPosition = "bottom" | "top" | "bottom-left" | "bottom-right"
\`\`\`

## Custom Categories

Override the default category definitions:

\`\`\`tsx
const customCategories: CategoryConfig[] = [
  {
    key: "necessary",
    title: "Essential Cookies",
    description: "Required for the website to function properly.",
    required: true,
  },
  {
    key: "analytics",
    title: "Analytics Cookies",
    description: "Help us understand how visitors interact with our website.",
  },
  {
    key: "marketing",
    title: "Marketing Cookies",
    description: "Used to deliver personalized advertisements.",
  },
  {
    key: "preferences",
    title: "Preference Cookies",
    description: "Remember your settings and preferences.",
  },
]

<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    categories: customCategories,
  }}
>
\`\`\`

## Traceability Configuration

Send consent records to your backend for audit purposes:

\`\`\`tsx
interface TraceabilityConfig {
  enabled: boolean
  endpoint: string                    // Your API endpoint
  method?: "POST" | "PUT"             // Default: "POST"
  headers?: Record<string, string>    // Custom headers
  getVisitorId?: () => string | Promise<string>
  includeUserAgent?: boolean          // Default: true
  includeUrl?: boolean                // Default: true
  retryOnFailure?: boolean            // Default: true
  maxRetries?: number                 // Default: 3
  onSuccess?: (record: ConsentRecord) => void
  onError?: (error: Error, record: ConsentRecord) => void
}
\`\`\`

Example:

\`\`\`tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    traceability: {
      enabled: true,
      endpoint: "/api/consent",
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_CONSENT_API_KEY!,
      },
      getVisitorId: () => {
        // Use authenticated user ID if available
        return getAuthUserId() ?? getAnonymousId()
      },
      onSuccess: (record) => {
        console.log("Consent recorded:", record.consentId)
      },
      onError: (error, record) => {
        // Records are automatically stored in localStorage for retry
        console.error("Failed to record consent:", error)
      },
    },
  }}
>
\`\`\`

## Consent Scope Configuration

Configure device-level vs global consent:

\`\`\`tsx
interface ConsentScopeConfig {
  mode: "device" | "global" | "hybrid"
  syncEndpoint?: string              // For global/hybrid mode
  getUserId?: () => string | null | Promise<string | null>
  conflictStrategy?: "server-wins" | "device-wins" | "most-recent"
  syncOnAuth?: boolean               // Default: true
  linkDeviceToUser?: boolean         // Default: true
}
\`\`\`

Example hybrid setup:

\`\`\`tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    consentScope: {
      mode: "hybrid",
      syncEndpoint: "/api/consent/sync",
      getUserId: () => session?.user?.id ?? null,
      conflictStrategy: "most-recent",
    },
  }}
>
\`\`\`

## Consent Change Callback

React to consent changes (useful for loading/unloading scripts):

\`\`\`tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    onConsentChange: (event) => {
      console.log("Previous:", event.previousCategories)
      console.log("Current:", event.currentCategories)
      console.log("Granted:", event.grantedCategories)
      console.log("Revoked:", event.revokedCategories)

      // Handle revoked categories
      if (event.revokedCategories.includes("analytics")) {
        // Disable analytics
        window.gtag?.("consent", "update", { analytics_storage: "denied" })
      }
    },
  }}
>
