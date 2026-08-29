import { screen, render } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest"
import { clearMockConsentState } from "../test-utils"
import {
  CookieConsentProvider,
  useCookieConsent,
} from "../cookie-provider"
import { CookieBanner } from "../cookie-banner"
import type { CategoryConfig } from "../types"

function TestConsumer() {
  const { state, acceptAll, rejectAll, hasConsent, updateConsent } =
    useCookieConsent()

  return (
    <div>
      <div data-testid="has-consented">
        {state.hasConsented ? "true" : "false"}
      </div>
      <div data-testid="necessary-consent">
        {hasConsent("necessary") ? "granted" : "denied"}
      </div>
      <div data-testid="analytics-consent">
        {hasConsent("analytics") ? "granted" : "denied"}
      </div>
      <div data-testid="marketing-consent">
        {hasConsent("marketing") ? "granted" : "denied"}
      </div>
      <div data-testid="preferences-consent">
        {hasConsent("preferences") ? "granted" : "denied"}
      </div>
      <button data-testid="btn-accept-all" onClick={acceptAll}>
        Accept All
      </button>
      <button data-testid="btn-reject-all" onClick={rejectAll}>
        Reject All
      </button>
      <button
        data-testid="btn-update-analytics"
        onClick={() => updateConsent({ analytics: true })}
      >
        Enable Analytics
      </button>
    </div>
  )
}

describe("CookieConsentProvider (cookie-provider.tsx)", () => {
  beforeEach(() => {
    clearMockConsentState()
    localStorage.clear()
  })

  afterEach(() => {
    clearMockConsentState()
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe("Visitor ID Lifecycle (ePrivacy Directive Compliance)", () => {
    it("does not store visitor ID in localStorage on initial mount before consent (#1)", () => {
      render(
        <CookieConsentProvider config={{ consentVersion: "1.0.0" }}>
          <TestConsumer />
        </CookieConsentProvider>
      )

      expect(localStorage.getItem("cookie-consent-visitor-id")).toBeNull()
    })

    it("generates and stores visitor ID after user consents (#1)", async () => {
      const user = userEvent.setup()
      render(
        <CookieConsentProvider config={{ consentVersion: "1.0.0" }}>
          <TestConsumer />
        </CookieConsentProvider>
      )

      expect(localStorage.getItem("cookie-consent-visitor-id")).toBeNull()

      await user.click(screen.getByTestId("btn-accept-all"))

      const storedId = localStorage.getItem("cookie-consent-visitor-id")
      expect(storedId).toBeTruthy()
      expect(typeof storedId).toBe("string")
    })
  })

  describe("Category-Aware Consent Actions", () => {
    const customCategories: CategoryConfig[] = [
      {
        key: "necessary",
        title: "Necessary",
        description: "Essential cookies",
        required: true,
      },
      {
        key: "analytics",
        title: "Analytics",
        description: "Analytics cookies",
      },
    ]

    it("acceptAll only accepts configured categories and ignores unconfigured ones (#1)", async () => {
      const user = userEvent.setup()
      render(
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            categories: customCategories,
          }}
        >
          <TestConsumer />
        </CookieConsentProvider>
      )

      await user.click(screen.getByTestId("btn-accept-all"))

      expect(screen.getByTestId("has-consented")).toHaveTextContent("true")
      expect(screen.getByTestId("necessary-consent")).toHaveTextContent("granted")
      expect(screen.getByTestId("analytics-consent")).toHaveTextContent("granted")
      expect(screen.getByTestId("marketing-consent")).toHaveTextContent("denied")
      expect(screen.getByTestId("preferences-consent")).toHaveTextContent("denied")

      const stored = JSON.parse(localStorage.getItem("cookie-consent") || "{}")
      expect(stored.categories).toEqual({
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: false,
      })
    })

    it("rejectAll denies all optional categories while keeping necessary granted", async () => {
      const user = userEvent.setup()
      render(
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            categories: customCategories,
          }}
        >
          <TestConsumer />
        </CookieConsentProvider>
      )

      await user.click(screen.getByTestId("btn-reject-all"))

      expect(screen.getByTestId("has-consented")).toHaveTextContent("true")
      expect(screen.getByTestId("necessary-consent")).toHaveTextContent("granted")
      expect(screen.getByTestId("analytics-consent")).toHaveTextContent("denied")
      expect(screen.getByTestId("marketing-consent")).toHaveTextContent("denied")
      expect(screen.getByTestId("preferences-consent")).toHaveTextContent("denied")
    })
  })

  describe("Consent Expiration Enforcement", () => {
    it("re-displays banner when stored consent has expired (#1)", () => {
      const expiredDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem(
        "cookie-consent",
        JSON.stringify({
          hasConsented: true,
          categories: {
            necessary: true,
            analytics: true,
            marketing: false,
            preferences: false,
          },
          consentVersion: "1.0.0",
          expiresAt: expiredDate,
          lastUpdated: new Date(Date.now() - 366 * 24 * 60 * 60 * 1000).toISOString(),
          visitorId: "existing-visitor",
        })
      )

      render(
        <CookieConsentProvider
          config={{ consentVersion: "1.0.0", expirationDays: 365 }}
        >
          <CookieBanner />
          <TestConsumer />
        </CookieConsentProvider>
      )

      expect(screen.getByText("Cookie Preferences")).toBeInTheDocument()
    })

    it("does not display banner when stored consent is still valid", () => {
      const futureDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      localStorage.setItem(
        "cookie-consent",
        JSON.stringify({
          hasConsented: true,
          categories: {
            necessary: true,
            analytics: true,
            marketing: false,
            preferences: false,
          },
          consentVersion: "1.0.0",
          expiresAt: futureDate,
          lastUpdated: new Date().toISOString(),
          visitorId: "existing-visitor",
        })
      )

      render(
        <CookieConsentProvider
          config={{ consentVersion: "1.0.0", expirationDays: 365 }}
        >
          <CookieBanner />
          <TestConsumer />
        </CookieConsentProvider>
      )

      expect(screen.queryByText("Cookie Preferences")).not.toBeInTheDocument()
      expect(screen.getByTestId("has-consented")).toHaveTextContent("true")
    })
  })
})
