/**
 * Unit tests for isGoogleScript utility function
 */

import { describe, it, expect } from "vitest"
import { isGoogleScript } from "../utils"

describe("isGoogleScript utility", () => {
  describe("URL-based detection", () => {
    it("detects googletagmanager.com URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXX",
        })
      ).toBe(true)

      expect(
        isGoogleScript({
          src: "http://www.googletagmanager.com/gtag/js",
        })
      ).toBe(true)
    })

    it("detects google-analytics.com URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.google-analytics.com/analytics.js",
        })
      ).toBe(true)
    })

    it("detects googleadservices.com URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.googleadservices.com/pagead/conversion.js",
        })
      ).toBe(true)
    })

    it("detects google.com/analytics URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.google.com/analytics/analytics.js",
        })
      ).toBe(true)
    })

    it("detects google.com/ads URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.google.com/ads/ads.js",
        })
      ).toBe(true)
    })

    it("detects doubleclick.net URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.doubleclick.net/dclk.js",
        })
      ).toBe(true)
    })

    it("detects googleapis.com/gtag URLs", () => {
      expect(
        isGoogleScript({
          src: "https://www.googleapis.com/gtag/js",
        })
      ).toBe(true)
    })

    it("handles URLs with query parameters", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js?id=G-XXXXX&l=dataLayer&t=123456",
        })
      ).toBe(true)
    })

    it("handles URLs with fragments", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js#test",
        })
      ).toBe(true)
    })

    it("handles case-insensitive matching", () => {
      expect(
        isGoogleScript({
          src: "https://www.GOOGLETAGMANAGER.com/gtag/js",
        })
      ).toBe(true)

      expect(
        isGoogleScript({
          src: "https://www.Google-Analytics.com/analytics.js",
        })
      ).toBe(true)
    })
  })

  describe("Content-based detection", () => {
    it("detects gtag function calls", () => {
      expect(
        isGoogleScript({
          content: "window.gtag('config', 'G-XXXXX')",
        })
      ).toBe(true)

      expect(
        isGoogleScript({
          content: "gtag('event', 'page_view')",
        })
      ).toBe(true)
    })

    it("detects dataLayer references", () => {
      expect(
        isGoogleScript({
          content: "window.dataLayer = window.dataLayer || []",
        })
      ).toBe(true)

      expect(
        isGoogleScript({
          content: "dataLayer.push({'event': 'pageview'})",
        })
      ).toBe(true)
    })

    it("detects ga function calls", () => {
      expect(
        isGoogleScript({
          content: "ga('create', 'UA-XXXXX-Y', 'auto')",
        })
      ).toBe(true)

      expect(
        isGoogleScript({
          content: "ga('send', 'pageview')",
        })
      ).toBe(true)
    })

    it("detects google-analytics references", () => {
      expect(
        isGoogleScript({
          content: "https://www.google-analytics.com/analytics.js",
        })
      ).toBe(true)
    })

    it("detects googletagmanager.com in content", () => {
      expect(
        isGoogleScript({
          content: "https://www.googletagmanager.com/gtag/js?id=G-XXXXX",
        })
      ).toBe(true)
    })

    it("handles complex inline scripts", () => {
      expect(
        isGoogleScript({
          content: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-XXXXX');
          `,
        })
      ).toBe(true)
    })
  })

  describe("Non-Google scripts", () => {
    it("returns false for Facebook Pixel", () => {
      expect(
        isGoogleScript({
          src: "https://connect.facebook.net/en_US/fbevents.js",
        })
      ).toBe(false)
    })

    it("returns false for Twitter Pixel", () => {
      expect(
        isGoogleScript({
          src: "https://analytics.twitter.com/i/adsct",
        })
      ).toBe(false)
    })

    it("returns false for LinkedIn Insight Tag", () => {
      expect(
        isGoogleScript({
          src: "https://snap.licdn.com/li.lms-analytics/insight.min.js",
        })
      ).toBe(false)
    })

    it("returns false for generic scripts", () => {
      expect(
        isGoogleScript({
          src: "https://example.com/script.js",
        })
      ).toBe(false)
    })

    it("returns false for empty object", () => {
      expect(isGoogleScript({})).toBe(false)
    })

    it("returns false for script with neither src nor content", () => {
      expect(
        isGoogleScript({
          id: "some-script",
        } as { src?: string; content?: string })
      ).toBe(false)
    })
  })

  describe("Edge cases", () => {
    it("prioritizes src over content when both are present", () => {
      // If src is Google, should return true even if content is not
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com/gtag/js",
          content: "console.log('not google')",
        })
      ).toBe(true)

      // If src is not Google but content is, should return true
      expect(
        isGoogleScript({
          src: "https://example.com/script.js",
          content: "window.gtag('config', 'G-XXXXX')",
        })
      ).toBe(true)
    })

    it("handles partial domain matches correctly", () => {
      // Should match googletagmanager.com
      expect(
        isGoogleScript({
          src: "https://subdomain.googletagmanager.com/gtag/js",
        })
      ).toBe(true)

      // Should not match similar domains
      expect(
        isGoogleScript({
          src: "https://www.fakegoogletagmanager.com/script.js",
        })
      ).toBe(false)
    })

    it("handles URLs with ports", () => {
      expect(
        isGoogleScript({
          src: "https://www.googletagmanager.com:443/gtag/js",
        })
      ).toBe(true)
    })

    it("handles relative URLs with Google domains", () => {
      // This is an edge case - relative URLs shouldn't typically contain full domains
      // but we test to ensure the function handles it
      expect(
        isGoogleScript({
          src: "//www.googletagmanager.com/gtag/js",
        })
      ).toBe(true)
    })
  })
})
