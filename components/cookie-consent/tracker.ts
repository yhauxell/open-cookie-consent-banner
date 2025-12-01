import type { ConsentAction, ConsentCategories, ConsentRecord, TraceabilityConfig } from "./types"
import { generateUUID, getVisitorId } from "./utils"

interface TrackConsentParams {
  categories: ConsentCategories
  action: ConsentAction
  consentVersion: string
  expiresAt: string
  config: TraceabilityConfig
  userId?: string
  scope?: "device" | "global"
}

/**
 * Send consent record to the configured endpoint
 */
export async function trackConsent(params: TrackConsentParams): Promise<ConsentRecord | null> {
  const { categories, action, consentVersion, expiresAt, config, userId, scope = "device" } = params

  if (!config.enabled || !config.endpoint) {
    return null
  }

  const visitorId = config.getVisitorId ? await config.getVisitorId() : getVisitorId()

  const record: ConsentRecord = {
    visitorId,
    consentId: generateUUID(),
    consentVersion,
    userId,
    scope,
    categories,
    action,
    timestamp: new Date().toISOString(),
    expiresAt,
    url: config.includeUrl !== false && typeof window !== "undefined" ? window.location.href : "",
    userAgent: config.includeUserAgent !== false && typeof navigator !== "undefined" ? navigator.userAgent : "",
    language: typeof navigator !== "undefined" ? navigator.language : "",
  }

  const maxRetries = config.retryOnFailure !== false ? (config.maxRetries ?? 3) : 1

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await fetch(config.endpoint, {
        method: config.method ?? "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      config.onSuccess?.(record)
      return record
    } catch (error) {
      if (attempt === maxRetries - 1) {
        const err = error instanceof Error ? error : new Error(String(error))
        config.onError?.(err, record)

        // Store in localStorage as fallback
        storeFailedRecord(record)
      }
    }
  }

  return null
}

/**
 * Store failed record for later retry
 */
function storeFailedRecord(record: ConsentRecord): void {
  if (typeof window === "undefined") return

  const key = "cookie-consent-pending"
  const pending = JSON.parse(localStorage.getItem(key) ?? "[]") as ConsentRecord[]
  pending.push(record)
  localStorage.setItem(key, JSON.stringify(pending))
}

/**
 * Retry sending failed records
 */
export async function retryFailedRecords(config: TraceabilityConfig): Promise<void> {
  if (typeof window === "undefined" || !config.enabled || !config.endpoint) return

  const key = "cookie-consent-pending"
  const pending = JSON.parse(localStorage.getItem(key) ?? "[]") as ConsentRecord[]

  if (pending.length === 0) return

  const stillPending: ConsentRecord[] = []

  for (const record of pending) {
    try {
      const response = await fetch(config.endpoint, {
        method: config.method ?? "POST",
        headers: {
          "Content-Type": "application/json",
          ...config.headers,
        },
        body: JSON.stringify(record),
      })

      if (!response.ok) {
        stillPending.push(record)
      } else {
        config.onSuccess?.(record)
      }
    } catch {
      stillPending.push(record)
    }
  }

  localStorage.setItem(key, JSON.stringify(stillPending))
}
