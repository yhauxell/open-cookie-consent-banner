import type { ConsentCategories, ConsentState } from "./types"

const STORAGE_KEY = "cookie-consent"
const VISITOR_ID_KEY = "cookie-consent-visitor-id"

/**
 * Generate a UUID v4
 */
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * Get or create a visitor ID
 */
export function getVisitorId(): string {
  if (typeof window === "undefined") {
    return generateUUID()
  }

  let visitorId = localStorage.getItem(VISITOR_ID_KEY)
  if (!visitorId) {
    visitorId = generateUUID()
    localStorage.setItem(VISITOR_ID_KEY, visitorId)
  }
  return visitorId
}

/**
 * Get default consent categories (all false except necessary)
 */
export function getDefaultCategories(): ConsentCategories {
  return {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  }
}

/**
 * Get all categories accepted
 */
export function getAllAcceptedCategories(): ConsentCategories {
  return {
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  }
}

/**
 * Save consent state to localStorage
 */
export function saveConsentState(state: ConsentState): void {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

/**
 * Load consent state from localStorage
 */
export function loadConsentState(): ConsentState | null {
  if (typeof window === "undefined") return null

  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return null

  try {
    return JSON.parse(stored) as ConsentState
  } catch {
    return null
  }
}

/**
 * Clear consent state from localStorage
 */
export function clearConsentState(): void {
  if (typeof window === "undefined") return
  localStorage.removeItem(STORAGE_KEY)
}

/**
 * Calculate expiration date
 */
export function calculateExpirationDate(days: number): string {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

/**
 * Check if consent has expired
 */
export function isConsentExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}
