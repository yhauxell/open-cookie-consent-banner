import { describe, it, expect, beforeEach, afterEach } from "vitest"
import {
  clearConsentState,
  generateUUID,
  getAllAcceptedCategories,
  getDefaultCategories,
  getExistingVisitorId,
  getVisitorId,
  isConsentExpired,
  loadConsentState,
  saveConsentState,
} from "../utils"
import type { CategoryConfig } from "../types"

describe("Cookie Consent Utilities (utils.ts)", () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    localStorage.clear()
  })

  describe("generateUUID", () => {
    it("generates a valid UUID v4 format string", () => {
      const uuid = generateUUID()
      expect(uuid).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      )
    })
  })

  describe("getExistingVisitorId vs getVisitorId", () => {
    it("getExistingVisitorId returns null when no visitor ID exists in localStorage", () => {
      expect(getExistingVisitorId()).toBeNull()
      expect(localStorage.getItem("cookie-consent-visitor-id")).toBeNull()
    })

    it("getExistingVisitorId returns existing ID without generating a new one", () => {
      localStorage.setItem("cookie-consent-visitor-id", "test-visitor-id")
      expect(getExistingVisitorId()).toBe("test-visitor-id")
    })

    it("getVisitorId generates and persists a new UUID when none exists", () => {
      const id = getVisitorId()
      expect(id).toBeTruthy()
      expect(localStorage.getItem("cookie-consent-visitor-id")).toBe(id)
    })

    it("getVisitorId returns existing ID if one is already in localStorage", () => {
      localStorage.setItem("cookie-consent-visitor-id", "existing-id")
      expect(getVisitorId()).toBe("existing-id")
    })
  })

  describe("getAllAcceptedCategories", () => {
    it("defaults to all standard categories accepted when no config is provided", () => {
      const categories = getAllAcceptedCategories()
      expect(categories).toEqual({
        necessary: true,
        analytics: true,
        marketing: true,
        preferences: true,
      })
    })

    it("only sets configured categories to true, keeping unconfigured categories false (#1)", () => {
      const customConfig: CategoryConfig[] = [
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

      const categories = getAllAcceptedCategories(customConfig)
      expect(categories).toEqual({
        necessary: true,
        analytics: true,
        marketing: false,
        preferences: false,
      })
    })
  })

  describe("getDefaultCategories", () => {
    it("returns necessary as true and optional categories as false", () => {
      const categories = getDefaultCategories()
      expect(categories).toEqual({
        necessary: true,
        analytics: false,
        marketing: false,
        preferences: false,
      })
    })

    it("sets any category marked required: true as true by default", () => {
      const customConfig: CategoryConfig[] = [
        {
          key: "necessary",
          title: "Necessary",
          description: "Essential cookies",
          required: true,
        },
        {
          key: "preferences",
          title: "Preferences",
          description: "Functional preferences",
          required: true,
        },
        {
          key: "analytics",
          title: "Analytics",
          description: "Analytics cookies",
        },
      ]

      const categories = getDefaultCategories(customConfig)
      expect(categories).toEqual({
        necessary: true,
        preferences: true,
        analytics: false,
        marketing: false,
      })
    })
  })

  describe("isConsentExpired", () => {
    it("returns true when expiration date is in the past", () => {
      const pastDate = new Date(Date.now() - 1000).toISOString()
      expect(isConsentExpired(pastDate)).toBe(true)
    })

    it("returns false when expiration date is in the future", () => {
      const futureDate = new Date(Date.now() + 60000).toISOString()
      expect(isConsentExpired(futureDate)).toBe(false)
    })
  })

  describe("Consent State Persistence", () => {
    it("saves and loads consent state from localStorage", () => {
      const state = {
        hasConsented: true,
        categories: {
          necessary: true,
          analytics: true,
          marketing: false,
          preferences: false,
        },
        lastUpdated: new Date().toISOString(),
        consentVersion: "1.0.0",
        visitorId: "visitor-123",
        expiresAt: new Date(Date.now() + 86400000).toISOString(),
      }

      saveConsentState(state)
      const loaded = loadConsentState()
      expect(loaded).toEqual(state)

      clearConsentState()
      expect(loadConsentState()).toBeNull()
    })
  })
})
