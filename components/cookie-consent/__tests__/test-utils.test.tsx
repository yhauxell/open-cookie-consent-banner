/**
 * Example test file demonstrating how to use OpenConsent test utilities
 *
 * This file serves as both tests and documentation for the test utilities.
 */

import { screen } from "@testing-library/react"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import {
  renderWithConsent,
  mockConsentState,
  clearMockConsentState,
  mockConsentCategories,
  consentTestHelpers,
  mockGoogleConsentMode,
  clearGoogleConsentModeMock,
  getConsentEvents,
} from "../test-utils"
import { useCookieConsent, useConsentValue } from "../index"

// Example component that depends on consent
function AnalyticsComponent() {
  const hasAnalytics = useConsentValue("analytics")

  if (!hasAnalytics) {
    return <div>Analytics disabled</div>
  }

  return <div data-testid="analytics">Analytics enabled</div>
}

// Example component using the main hook
function ConsentStatus() {
  const { state, hasConsent } = useCookieConsent()

  return (
    <div>
      <div data-testid="has-consented">
        {state.hasConsented ? "Yes" : "No"}
      </div>
      <div data-testid="analytics-consent">
        {hasConsent("analytics") ? "Granted" : "Denied"}
      </div>
    </div>
  )
}

describe("OpenConsent Test Utilities", () => {
  beforeEach(() => {
    clearMockConsentState()
    clearGoogleConsentModeMock()
  })

  afterEach(() => {
    clearMockConsentState()
    clearGoogleConsentModeMock()
  })

  describe("renderWithConsent", () => {
    it("should render component with consent provider", () => {
      renderWithConsent(<ConsentStatus />)

      expect(screen.getByTestId("has-consented")).toBeInTheDocument()
    })

    it("should use initial consent state", () => {
      renderWithConsent(<ConsentStatus />, {
        initialConsent: {
          hasConsented: true,
          categories: { analytics: true },
        },
      })

      expect(screen.getByTestId("has-consented")).toHaveTextContent("Yes")
      expect(screen.getByTestId("analytics-consent")).toHaveTextContent(
        "Granted"
      )
    })
  })

  describe("useConsentValue", () => {
    it("should return false when analytics consent is not granted", () => {
      renderWithConsent(<AnalyticsComponent />, {
        initialConsent: {
          categories: mockConsentCategories.none(),
        },
      })

      expect(screen.getByText("Analytics disabled")).toBeInTheDocument()
    })

    it("should return true when analytics consent is granted", () => {
      renderWithConsent(<AnalyticsComponent />, {
        initialConsent: {
          categories: mockConsentCategories.analyticsOnly(),
        },
      })

      expect(screen.getByTestId("analytics")).toBeInTheDocument()
      expect(screen.getByTestId("analytics")).toHaveTextContent(
        "Analytics enabled"
      )
    })
  })

  describe("mockConsentState", () => {
    it("should update consent state in localStorage", () => {
      mockConsentState({
        hasConsented: true,
        categories: { analytics: true, marketing: true },
      })

      const stored = localStorage.getItem("cookie-consent")
      expect(stored).toBeTruthy()

      const parsed = JSON.parse(stored!)
      expect(parsed.categories.analytics).toBe(true)
      expect(parsed.categories.marketing).toBe(true)
    })
  })

  describe("consentTestHelpers", () => {
    it("should accept all categories", () => {
      consentTestHelpers.acceptAll()

      const stored = localStorage.getItem("cookie-consent")
      const parsed = JSON.parse(stored!)
      expect(parsed.categories.analytics).toBe(true)
      expect(parsed.categories.marketing).toBe(true)
      expect(parsed.categories.preferences).toBe(true)
    })

    it("should reject all optional categories", () => {
      consentTestHelpers.rejectAll()

      const stored = localStorage.getItem("cookie-consent")
      const parsed = JSON.parse(stored!)
      expect(parsed.categories.analytics).toBe(false)
      expect(parsed.categories.marketing).toBe(false)
      expect(parsed.categories.preferences).toBe(false)
      expect(parsed.categories.necessary).toBe(true) // Always true
    })

    it("should grant specific category", () => {
      consentTestHelpers.grantCategory("analytics")

      const stored = localStorage.getItem("cookie-consent")
      const parsed = JSON.parse(stored!)
      expect(parsed.categories.analytics).toBe(true)
      expect(parsed.categories.marketing).toBe(false)
    })

    it("should revoke specific category", () => {
      consentTestHelpers.acceptAll()
      consentTestHelpers.revokeCategory("analytics")

      const stored = localStorage.getItem("cookie-consent")
      const parsed = JSON.parse(stored!)
      expect(parsed.categories.analytics).toBe(false)
      expect(parsed.categories.marketing).toBe(true) // Still granted
    })
  })

  describe("Google Consent Mode", () => {
    it("should mock Google Consent Mode", () => {
      mockGoogleConsentMode()

      expect(window.dataLayer).toBeDefined()
      expect(window.gtag).toBeDefined()

      window.gtag!("consent", "default", {
        analytics_storage: "denied",
      })

      const events = getConsentEvents()
      expect(events.length).toBeGreaterThan(0)
    })

    it("should clear Google Consent Mode mocks", () => {
      mockGoogleConsentMode()
      clearGoogleConsentModeMock()

      expect(window.dataLayer).toBeUndefined()
      expect(window.gtag).toBeUndefined()
    })
  })
})
