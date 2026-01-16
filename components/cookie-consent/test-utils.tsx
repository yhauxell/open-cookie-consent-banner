/**
 * Test utilities for OpenConsent
 *
 * These utilities make it easy to test consent-dependent code in your application.
 */

import * as React from "react"
import { render, type RenderOptions } from "@testing-library/react"
import { vi } from "vitest"
import type {
  ConsentCategories,
  ConsentState,
  CookieConsentConfig,
} from "./types"
import { CookieConsentProvider } from "./cookie-provider"
import { getDefaultCategories } from "./utils"

/**
 * Mock consent state for testing
 */
export interface MockConsentState {
  hasConsented?: boolean
  categories?: Partial<ConsentCategories>
  consentVersion?: string
  visitorId?: string
  lastUpdated?: string | null
}

/**
 * Create a mock consent state
 */
export function createMockConsentState(
  overrides: MockConsentState = {}
): ConsentState {
  const defaultCategories = getDefaultCategories()
  const categories: ConsentCategories = {
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
    ...overrides.categories,
  }

  return {
    hasConsented: overrides.hasConsented ?? false,
    categories,
    consentVersion: overrides.consentVersion ?? "1.0.0",
    visitorId: overrides.visitorId ?? "test-visitor-id",
    lastUpdated: overrides.lastUpdated ?? null,
  }
}

/**
 * Mock consent categories for testing
 */
export const mockConsentCategories = {
  none: (): ConsentCategories => ({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: false,
  }),
  all: (): ConsentCategories => ({
    necessary: true,
    analytics: true,
    marketing: true,
    preferences: true,
  }),
  analyticsOnly: (): ConsentCategories => ({
    necessary: true,
    analytics: true,
    marketing: false,
    preferences: false,
  }),
  marketingOnly: (): ConsentCategories => ({
    necessary: true,
    analytics: false,
    marketing: true,
    preferences: false,
  }),
  preferencesOnly: (): ConsentCategories => ({
    necessary: true,
    analytics: false,
    marketing: false,
    preferences: true,
  }),
}

/**
 * Options for rendering with consent
 */
export interface RenderWithConsentOptions extends RenderOptions {
  /** Initial consent state */
  initialConsent?: MockConsentState
  /** CookieConsentProvider config */
  consentConfig?: Partial<CookieConsentConfig>
  /** Whether to show the banner initially */
  showBanner?: boolean
}

/**
 * Render a component with OpenConsent provider
 *
 * @example
 * ```tsx
 * const { rerender } = renderWithConsent(<MyComponent />, {
 *   initialConsent: { categories: { analytics: true } }
 * })
 * ```
 */
export function renderWithConsent(
  ui: React.ReactElement,
  options: RenderWithConsentOptions = {}
) {
  const {
    initialConsent,
    consentConfig = {},
    showBanner = false,
    ...renderOptions
  } = options

  // Create mock state if provided
  const mockState = initialConsent
    ? createMockConsentState(initialConsent)
    : undefined

  // Pre-populate localStorage if mock state provided
  // Use the same key as the actual provider ("cookie-consent")
  if (mockState && typeof window !== "undefined") {
    localStorage.setItem(
      "cookie-consent",
      JSON.stringify(mockState)
    )
  }

  const config: CookieConsentConfig = {
    consentVersion: "1.0.0",
    ...consentConfig,
  }

  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <CookieConsentProvider config={config}>
        {children}
      </CookieConsentProvider>
    )
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions })
}

/**
 * Mock consent state in localStorage
 */
export function mockConsentState(state: MockConsentState) {
  if (typeof window === "undefined") return

  const mockState = createMockConsentState(state)
  // Use the same key as the actual provider ("cookie-consent")
  localStorage.setItem("cookie-consent", JSON.stringify(mockState))
}

/**
 * Clear consent state from localStorage
 */
export function clearMockConsentState() {
  if (typeof window === "undefined") return
  // Use the same key as the actual provider ("cookie-consent")
  localStorage.removeItem("cookie-consent")
}

/**
 * Wait for consent to be initialized
 */
export async function waitForConsentInit() {
  // Wait for next tick to allow provider to initialize
  await new Promise((resolve) => setTimeout(resolve, 0))
}

/**
 * Mock Google Consent Mode
 */
export function mockGoogleConsentMode() {
  if (typeof window === "undefined") return

  window.dataLayer = []
  const mockGtag = (...args: unknown[]) => {
    window.dataLayer?.push(args)
  }
  window.gtag = mockGtag as unknown as typeof window.gtag
}

/**
 * Clear Google Consent Mode mocks
 */
export function clearGoogleConsentModeMock() {
  if (typeof window === "undefined") return
  delete (window as unknown as { dataLayer?: unknown[] }).dataLayer
  delete (window as unknown as { gtag?: unknown }).gtag
}

/**
 * Get consent events from dataLayer
 */
export function getConsentEvents() {
  if (typeof window === "undefined" || !window.dataLayer) return []
  return window.dataLayer.filter(
    (item: unknown) =>
      Array.isArray(item) &&
      item.length >= 2 &&
      item[0] === "consent"
  )
}

/**
 * Test helpers for common consent scenarios
 */
export const consentTestHelpers = {
  /**
   * Accept all categories
   */
  acceptAll: () => {
    mockConsentState({
      hasConsented: true,
      categories: mockConsentCategories.all(),
    })
  },

  /**
   * Reject all optional categories
   */
  rejectAll: () => {
    mockConsentState({
      hasConsented: true,
      categories: mockConsentCategories.none(),
    })
  },

  /**
   * Grant specific category
   */
  grantCategory: (category: keyof ConsentCategories) => {
    const categories = mockConsentCategories.none()
    categories[category] = true
    mockConsentState({
      hasConsented: true,
      categories,
    })
  },

  /**
   * Revoke specific category
   */
  revokeCategory: (category: keyof ConsentCategories) => {
    const categories = mockConsentCategories.all()
    if (category !== "necessary") {
      categories[category] = false
    }
    mockConsentState({
      hasConsented: true,
      categories,
    })
  },
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
