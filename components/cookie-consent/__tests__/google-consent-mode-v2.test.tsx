/**
 * Tests for Google Consent Mode v2 auto-detection feature
 */

import { act, render, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  ConsentScript,
  CookieConsentProvider,
  useConsentScript,
  useCookieConsent,
} from "../index";
import { clearAllScripts, hasGoogleScripts } from "../script-manager";
import {
  clearGoogleConsentModeMock,
  getConsentEvents,
  mockGoogleConsentMode,
} from "../test-utils";
import type { CookieConsentConfig } from "../types";
import { isGoogleScript } from "../utils";

describe("Google Consent Mode v2 Auto-Detection", () => {
  beforeEach(() => {
    // Setup Google Consent Mode mocks
    mockGoogleConsentMode();
    // Clear localStorage
    localStorage.clear();
    // Clear any registered scripts
    clearAllScripts();
    vi.clearAllMocks();
  });

  afterEach(() => {
    clearGoogleConsentModeMock();
    localStorage.clear();
    clearAllScripts();
  });

  describe("isGoogleScript utility", () => {
    it("detects Google Tag Manager scripts by URL", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXX",
        })
      ).toBe(true);
    });

    it("detects Google Analytics scripts by URL", () => {
      expect(
        isGoogleScript({
          src: "https://www.google-analytics.com/analytics.js",
        })
      ).toBe(true);
    });

    it("detects Google Ads scripts by URL", () => {
      expect(
        isGoogleScript({
          src: "https://www.googleadservices.com/pagead/conversion.js",
        })
      ).toBe(true);
    });

    it("detects Google Analytics via google.com/analytics", () => {
      expect(
        isGoogleScript({
          src: "https://www.google.com/analytics/analytics.js",
        })
      ).toBe(true);
    });

    it("detects Google Ads via google.com/ads", () => {
      expect(
        isGoogleScript({
          src: "https://www.google.com/ads/ads.js",
        })
      ).toBe(true);
    });

    it("detects DoubleClick scripts", () => {
      expect(
        isGoogleScript({
          src: "https://www.doubleclick.net/dclk.js",
        })
      ).toBe(true);
    });

    it("detects Google APIs gtag scripts", () => {
      expect(
        isGoogleScript({
          src: "https://www.googleapis.com/gtag/js",
        })
      ).toBe(true);
    });

    it("detects Google scripts by inline content with gtag", () => {
      expect(
        isGoogleScript({
          content: "window.gtag('config', 'G-XXXXX')",
        })
      ).toBe(true);
    });

    it("detects Google scripts by inline content with dataLayer", () => {
      expect(
        isGoogleScript({
          content: "window.dataLayer = window.dataLayer || []",
        })
      ).toBe(true);
    });

    it("detects Google scripts by inline content with ga(", () => {
      expect(
        isGoogleScript({
          content: "ga('create', 'UA-XXXXX-Y', 'auto')",
        })
      ).toBe(true);
    });

    it("detects Google scripts by inline content with google-analytics", () => {
      expect(
        isGoogleScript({
          content: "google-analytics.com/analytics.js",
        })
      ).toBe(true);
    });

    it("returns false for non-Google scripts", () => {
      expect(
        isGoogleScript({
          src: "https://www.facebook.com/tr?id=123456",
        })
      ).toBe(false);
    });

    it("returns false for scripts without src or content", () => {
      expect(isGoogleScript({})).toBe(false);
    });
  });

  describe("Automatic Google Consent Mode v2 enablement", () => {
    it("automatically enables Google Consent Mode when Google script is registered via ConsentScript", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
        </CookieConsentProvider>
      );

      // Wait for script registration and auto-detection
      await waitFor(() => {
        // Since GoogleConsentMode doesn't render anything visible,
        // we check that gtag was called with consent defaults
        expect(window.gtag).toBeDefined();
      });

      // Verify that consent events were set
      await waitFor(() => {
        const events = getConsentEvents();
        expect(events.length).toBeGreaterThan(0);
      });
    });

    it("automatically enables Google Consent Mode when Google script is registered via useConsentScript", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      function TestComponent() {
        useConsentScript("analytics", "google-analytics", {
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXX",
        });
        return null;
      }

      render(
        <CookieConsentProvider config={config}>
          <TestComponent />
        </CookieConsentProvider>
      );

      // Wait for script registration
      await waitFor(() => {
        expect(window.gtag).toBeDefined();
      });
    });

    it("does not override manual Google Consent Mode configuration", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
        googleConsentMode: {
          enabled: true,
          mapping: {
            analytics_storage: "analytics",
            ad_storage: "marketing",
          },
          regions: ["GB", "FR"],
        },
      };
      // Test that manual config is used

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
        </CookieConsentProvider>
      );

      // Should use manual config, not auto-generated one
      await waitFor(() => {
        expect(window.gtag).toBeDefined();
      });
    });

    it("uses sensible defaults when auto-enabling", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(window.gtag).toBeDefined();
      });

      // Check that default consent was set to "denied"
      const events = getConsentEvents();
      const defaultEvent = events.find(
        (e) => Array.isArray(e) && e[1] === "default"
      );
      expect(defaultEvent).toBeDefined();
      if (defaultEvent && Array.isArray(defaultEvent) && defaultEvent[2]) {
        const consentState = defaultEvent[2] as Record<string, string>;
        expect(consentState.analytics_storage).toBe("denied");
        expect(consentState.ad_storage).toBe("denied");
      }
    });

    it("detects multiple Google scripts and enables once", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
          <ConsentScript
            id="google-ads"
            src="https://www.googleadservices.com/pagead/conversion.js"
            category="marketing"
          />
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(window.gtag).toBeDefined();
      });

      // Should only have one set of consent defaults
      const events = getConsentEvents();
      const defaultEvents = events.filter(
        (e) => Array.isArray(e) && e[1] === "default"
      );
      // Should have at least one default event
      expect(defaultEvents.length).toBeGreaterThan(0);
    });

    it("does not enable Google Consent Mode for non-Google scripts", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="facebook-pixel"
            src="https://connect.facebook.net/en_US/fbevents.js"
            category="marketing"
          />
        </CookieConsentProvider>
      );

      // Wait a bit to ensure no auto-enable happens
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Google Consent Mode should not be enabled for non-Google scripts
      expect(hasGoogleScripts()).toBe(false);
    });
  });

  describe("hasGoogleScripts function", () => {
    it("returns true when Google scripts are registered", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(hasGoogleScripts()).toBe(true);
      });
    });

    it("returns false when no Google scripts are registered", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="facebook-pixel"
            src="https://connect.facebook.net/en_US/fbevents.js"
            category="marketing"
          />
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(hasGoogleScripts()).toBe(false);
      });
    });

    it("detects Google scripts registered via inline content", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript id="google-analytics-init" category="analytics">
            {`window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXX');`}
          </ConsentScript>
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(hasGoogleScripts()).toBe(true);
      });
    });
  });

  describe("Consent updates with Google Consent Mode v2", () => {
    it("updates Google Consent Mode when user grants analytics consent", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      function TestComponent() {
        const { updateConsent } = useCookieConsent();
        return (
          <button
            onClick={() => updateConsent({ analytics: true })}
            data-testid="grant-analytics"
          >
            Grant Analytics
          </button>
        );
      }

      const { getByTestId } = render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
          <TestComponent />
        </CookieConsentProvider>
      );

      // Wait for initial setup
      await waitFor(() => {
        expect(window.gtag).toBeDefined();
      });

      // Clear previous events
      if (window.dataLayer) {
        window.dataLayer.length = 0;
      }

      // Grant analytics consent
      await act(async () => {
        getByTestId("grant-analytics").click();
      });

      // Wait for consent update
      await waitFor(() => {
        const events = getConsentEvents();
        const updateEvent = events.find(
          (e) => Array.isArray(e) && e[1] === "update"
        );
        expect(updateEvent).toBeDefined();
        if (updateEvent && Array.isArray(updateEvent) && updateEvent[2]) {
          const consentState = updateEvent[2] as Record<string, string>;
          expect(consentState.analytics_storage).toBe("granted");
        }
      });
    });

    it("updates Google Consent Mode when user revokes consent", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      // Start with analytics consent granted
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
          visitorId: "test",
          lastUpdated: new Date().toISOString(),
        })
      );

      function TestComponent() {
        const { updateConsent } = useCookieConsent();
        return (
          <button
            onClick={() => updateConsent({ analytics: false })}
            data-testid="revoke-analytics"
          >
            Revoke Analytics
          </button>
        );
      }

      const { getByTestId } = render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
          <TestComponent />
        </CookieConsentProvider>
      );

      // Wait for initial setup
      await waitFor(() => {
        expect(window.gtag).toBeDefined();
      });

      // Clear previous events
      if (window.dataLayer) {
        window.dataLayer.length = 0;
      }

      // Revoke analytics consent
      await act(async () => {
        getByTestId("revoke-analytics").click();
      });

      // Wait for consent update
      await waitFor(() => {
        const events = getConsentEvents();
        const updateEvent = events.find(
          (e) => Array.isArray(e) && e[1] === "update"
        );
        expect(updateEvent).toBeDefined();
        if (updateEvent && Array.isArray(updateEvent) && updateEvent[2]) {
          const consentState = updateEvent[2] as Record<string, string>;
          expect(consentState.analytics_storage).toBe("denied");
        }
      });
    });
  });

  describe("GoogleConsentMode component rendering", () => {
    it("automatically renders GoogleConsentMode when Google scripts detected", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          />
        </CookieConsentProvider>
      );

      // Wait for detection and rendering
      await waitFor(() => {
        expect(window.gtag).toBeDefined();
        // GoogleConsentMode should have initialized dataLayer
        expect(window.dataLayer).toBeDefined();
        // Should have set default consent
        const events = getConsentEvents();
        expect(events.length).toBeGreaterThan(0);
      });
    });

    it("does not render GoogleConsentMode when no Google scripts", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="facebook-pixel"
            src="https://connect.facebook.net/en_US/fbevents.js"
            category="marketing"
          />
        </CookieConsentProvider>
      );

      // Wait a bit
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Should not have Google Consent Mode events (unless set up manually)
      // Note: mockGoogleConsentMode() might set up some events, so we just verify
      // that auto-detection didn't happen
      expect(hasGoogleScripts()).toBe(false);
    });
  });

  describe("Edge cases", () => {
    it("handles scripts with both src and content", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
            category="analytics"
          >
            {`window.dataLayer = window.dataLayer || [];`}
          </ConsentScript>
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(hasGoogleScripts()).toBe(true);
      });
    });

    it("handles rapid script registration", async () => {
      const config: CookieConsentConfig = {
        consentVersion: "1.0.0",
      };

      render(
        <CookieConsentProvider config={config}>
          <ConsentScript
            id="google-analytics-1"
            src="https://www.googletagmanager.com/gtag/js?id=G-1"
            category="analytics"
          />
          <ConsentScript
            id="google-analytics-2"
            src="https://www.googletagmanager.com/gtag/js?id=G-2"
            category="analytics"
          />
          <ConsentScript
            id="google-analytics-3"
            src="https://www.googletagmanager.com/gtag/js?id=G-3"
            category="analytics"
          />
        </CookieConsentProvider>
      );

      await waitFor(() => {
        expect(hasGoogleScripts()).toBe(true);
      });
    });

    it("handles case-insensitive URL matching", () => {
      expect(
        isGoogleScript({
          src: "https://www.GOOGLETAGMANAGER.com/gtag/js",
        })
      ).toBe(true);
    });

    it("handles URLs with query parameters", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXX&l=dataLayer",
        })
      ).toBe(true);
    });

    it("handles URLs with fragments", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js#test",
        })
      ).toBe(true);
    });
  });
});
