import { screen, render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { clearMockConsentState } from "../test-utils"
import {
  getAllAcceptedCategories,
  getDefaultCategories,
  getExistingVisitorId,
} from "../utils"
import {
  CookieConsentProvider,
  useCookieConsent,
} from "../cookie-provider"
import { CookieBanner } from "../cookie-banner"
import type { CategoryConfig } from "../types"

function ConsentTestComponent() {
  const { state, acceptAll, rejectAll } = useCookieConsent()
  return (
    <div>
      <div data-testid="has-consented">{state.hasConsented ? "yes" : "no"}</div>
      <div data-testid="analytics">{state.categories.analytics ? "true" : "false"}</div>
      <div data-testid="marketing">{state.categories.marketing ? "true" : "false"}</div>
      <div data-testid="preferences">{state.categories.preferences ? "true" : "false"}</div>
      <button data-testid="btn-accept-all" onClick={acceptAll}>
        Accept All
      </button>
      <button data-testid="btn-reject-all" onClick={rejectAll}>
        Reject All
      </button>
    </div>
  )
}

describe("Issue #1 Bug Fixes & Consent Compliance", () => {
  beforeEach(() => {
    clearMockConsentState()
    localStorage.clear()
  })

  afterEach(() => {
    clearMockConsentState()
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("Bug 1 & 2: Category-aware acceptAll and getDefaultCategories", () => {
    const customCategories: CategoryConfig[] = [
      { key: "necessary", title: "Necessary", description: "Required cookies", required: true },
      { key: "analytics", title: "Analytics", description: "Analytics cookies" },
    ]

    it("getAllAcceptedCategories returns only configured categories", () => {
      const accepted = getAllAcceptedCategories(customCategories)
      expect(accepted.necessary).toBe(true)
      expect(accepted.analytics).toBe(true)
      expect(accepted.marketing).toBe(false)
      expect(accepted.preferences).toBe(false)
    })

    it("getAllAcceptedCategories defaults to all categories when none specified", () => {
      const accepted = getAllAcceptedCategories()
      expect(accepted.necessary).toBe(true)
      expect(accepted.analytics).toBe(true)
      expect(accepted.marketing).toBe(true)
      expect(accepted.preferences).toBe(true)
    })

    it("getDefaultCategories keeps unconfigured and non-required categories false", () => {
      const defaults = getDefaultCategories(customCategories)
      expect(defaults.necessary).toBe(true)
      expect(defaults.analytics).toBe(false)
      expect(defaults.marketing).toBe(false)
      expect(defaults.preferences).toBe(false)
    })

    it("acceptAll in CookieConsentProvider only accepts configured categories", async () => {
      const user = userEvent.setup()
      render(
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            categories: customCategories,
          }}
        >
          <ConsentTestComponent />
        </CookieConsentProvider>
      )

      await user.click(screen.getByTestId("btn-accept-all"))

      expect(screen.getByTestId("analytics")).toHaveTextContent("true")
      expect(screen.getByTestId("marketing")).toHaveTextContent("false")
      expect(screen.getByTestId("preferences")).toHaveTextContent("false")

      const stored = JSON.parse(localStorage.getItem("cookie-consent") || "{}")
      expect(stored.categories.necessary).toBe(true)
      expect(stored.categories.analytics).toBe(true)
      expect(stored.categories.marketing).toBe(false)
      expect(stored.categories.preferences).toBe(false)
    })
  })

  describe("Bug 3: Visitor ID not written to localStorage before consent", () => {
    it("does not store visitor ID in localStorage on initial mount", () => {
      render(
        <CookieConsentProvider config={{ consentVersion: "1.0.0" }}>
          <ConsentTestComponent />
        </CookieConsentProvider>
      )

      expect(localStorage.getItem("cookie-consent-visitor-id")).toBeNull()
      expect(getExistingVisitorId()).toBeNull()
    })

    it("stores visitor ID only after user gives consent", async () => {
      const user = userEvent.setup()
      render(
        <CookieConsentProvider config={{ consentVersion: "1.0.0" }}>
          <ConsentTestComponent />
        </CookieConsentProvider>
      )

      expect(localStorage.getItem("cookie-consent-visitor-id")).toBeNull()

      await user.click(screen.getByTestId("btn-accept-all"))

      const visitorId = localStorage.getItem("cookie-consent-visitor-id")
      expect(visitorId).toBeTruthy()
      expect(visitorId?.length).toBeGreaterThan(10)
    })
  })

  describe("Bug 4: Consent expiration enforcement", () => {
    it("re-displays banner when stored consent has expired", () => {
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem(
        "cookie-consent",
        JSON.stringify({
          hasConsented: true,
          categories: { necessary: true, analytics: true, marketing: false, preferences: false },
          consentVersion: "1.0.0",
          expiresAt: expiredDate,
          timestamp: new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString(),
          visitorId: "existing-visitor",
        })
      )

      render(
        <CookieConsentProvider config={{ consentVersion: "1.0.0", expirationDays: 365 }}>
          <CookieBanner />
          <ConsentTestComponent />
        </CookieConsentProvider>
      )

      // Banner should be visible because consent is expired
      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })

    it("does not display banner when stored consent is still valid", () => {
      const validFutureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem(
        "cookie-consent",
        JSON.stringify({
          hasConsented: true,
          categories: { necessary: true, analytics: true, marketing: false, preferences: false },
          consentVersion: "1.0.0",
          expiresAt: validFutureDate,
          timestamp: new Date().toISOString(),
          visitorId: "existing-visitor",
        })
      )

      render(
        <CookieConsentProvider config={{ consentVersion: "1.0.0", expirationDays: 365 }}>
          <CookieBanner />
          <ConsentTestComponent />
        </CookieConsentProvider>
      )

      // Banner should NOT be visible
      expect(screen.queryByText("Cookie Preferences")).not.toBeInTheDocument()
      expect(screen.getByTestId("has-consented")).toHaveTextContent("yes")
    })
  })
})
