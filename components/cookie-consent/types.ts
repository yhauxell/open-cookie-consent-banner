// Cookie consent types following shadcn patterns

export type ConsentCategory = "necessary" | "analytics" | "marketing" | "preferences"

export type ConsentAction = "accept_all" | "reject_all" | "custom" | "update"

export type ConsentScope = "device" | "global"

export type BannerPosition = "bottom" | "top" | "bottom-left" | "bottom-right"

export interface ConsentCategories {
  necessary: boolean
  analytics: boolean
  marketing: boolean
  preferences: boolean
}

export interface ConsentRecord {
  /** Unique device identifier */
  visitorId: string
  /** Unique consent action identifier */
  consentId: string
  /** Version of consent policy */
  consentVersion: string
  /** User account ID when authenticated */
  userId?: string
  /** Consent scope */
  scope: ConsentScope
  /** Category consent values */
  categories: ConsentCategories
  /** Type of action taken */
  action: ConsentAction
  /** ISO 8601 timestamp */
  timestamp: string
  /** When consent expires */
  expiresAt: string
  /** Page URL where consent was given */
  url: string
  /** Browser user agent */
  userAgent: string
  /** Browser language */
  language: string
  /** Device ID that was linked (for global scope) */
  linkedFromDevice?: string
}

export interface TraceabilityConfig {
  /** Enable consent traceability */
  enabled: boolean
  /** API endpoint to send consent records */
  endpoint: string
  /** HTTP method */
  method?: "POST" | "PUT"
  /** Custom headers */
  headers?: Record<string, string>
  /** Custom visitor ID generator */
  getVisitorId?: () => string | Promise<string>
  /** Include user agent in record */
  includeUserAgent?: boolean
  /** Include URL in record */
  includeUrl?: boolean
  /** Retry on failure */
  retryOnFailure?: boolean
  /** Max retry attempts */
  maxRetries?: number
  /** Success callback */
  onSuccess?: (record: ConsentRecord) => void
  /** Error callback */
  onError?: (error: Error, record: ConsentRecord) => void
}

export interface ConsentScopeConfig {
  /** Consent scope mode */
  mode: "device" | "global" | "hybrid"
  /** Sync endpoint for global/hybrid mode */
  syncEndpoint?: string
  /** Get user ID for global consent */
  getUserId?: () => string | null | Promise<string | null>
  /** Conflict resolution strategy */
  conflictStrategy?: "server-wins" | "device-wins" | "most-recent"
  /** Sync on authentication */
  syncOnAuth?: boolean
  /** Link device to user */
  linkDeviceToUser?: boolean
}

export interface CategoryConfig {
  key: ConsentCategory
  title: string
  description: string
  required?: boolean
}

export interface ScriptConfig {
  /** Unique identifier for the script */
  id: string
  /** Script source URL */
  src?: string
  /** Inline script content */
  content?: string
  /** Consent category required */
  category: ConsentCategory
  /** Script loading strategy */
  strategy?: "afterInteractive" | "lazyOnload" | "beforeInteractive"
  /** Additional script attributes */
  attributes?: Record<string, string>
  /** Callback when script loads */
  onLoad?: () => void
  /** Callback when script fails */
  onError?: (error: Error) => void
  /** Cleanup function when consent is revoked */
  onRevoke?: () => void
}

export interface ConsentChangeEvent {
  previousCategories: ConsentCategories
  currentCategories: ConsentCategories
  action: ConsentAction
  revokedCategories: ConsentCategory[]
  grantedCategories: ConsentCategory[]
}

export interface GoogleConsentModeConfig {
  /** Enable Google Consent Mode v2 integration */
  enabled: boolean
  /** Custom mapping of consent categories to Google consent types */
  mapping?: {
    analytics_storage?: ConsentCategory
    ad_storage?: ConsentCategory
    ad_user_data?: ConsentCategory
    ad_personalization?: ConsentCategory
    functionality_storage?: ConsentCategory
    personalization_storage?: ConsentCategory
    security_storage?: ConsentCategory
  }
  /** Regions to apply consent mode to (empty = all regions) */
  regions?: string[]
}

export interface CookieConsentConfig {
  consentVersion: string
  expirationDays?: number
  privacyPolicyUrl?: string
  position?: BannerPosition
  categories?: CategoryConfig[]
  traceability?: TraceabilityConfig
  consentScope?: ConsentScopeConfig
  googleConsentMode?: GoogleConsentModeConfig
  onConsentChange?: (event: ConsentChangeEvent) => void
}

export interface ConsentState {
  /** Whether consent has been given */
  hasConsented: boolean
  /** Current consent categories */
  categories: ConsentCategories
  /** When consent was last updated */
  lastUpdated: string | null
  /** Consent version */
  consentVersion: string
  /** Visitor ID */
  visitorId: string
}

export interface CookieConsentContextValue {
  state: ConsentState
  isBannerVisible: boolean
  isSettingsOpen: boolean
  acceptAll: () => Promise<void>
  rejectAll: () => Promise<void>
  updateConsent: (categories: Partial<ConsentCategories>) => Promise<void>
  openSettings: () => void
  closeSettings: () => void
  hideBanner: () => void
  resetConsent: () => void
  hasConsent: (category: ConsentCategory) => boolean
  config: CookieConsentConfig
  registerScript: (script: ScriptConfig) => void
  unregisterScript: (id: string) => void
  getLoadedScripts: () => string[]
}
