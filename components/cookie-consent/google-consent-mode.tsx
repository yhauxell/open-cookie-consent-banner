"use client"

import { useEffect } from "react"

/**
 * Google Consent Mode v2 default consent state
 * These values are set BEFORE gtag.js loads to ensure compliance
 */
export interface GoogleConsentModeDefaults {
  /** Analytics storage consent */
  analytics_storage?: "granted" | "denied"
  /** Ad storage consent */
  ad_storage?: "granted" | "denied"
  /** Ad user data consent */
  ad_user_data?: "granted" | "denied"
  /** Ad personalization consent */
  ad_personalization?: "granted" | "denied"
  /** Functionality storage consent */
  functionality_storage?: "granted" | "denied"
  /** Personalization storage consent */
  personalization_storage?: "granted" | "denied"
  /** Security storage consent */
  security_storage?: "granted" | "denied"
}

export interface GoogleConsentModeProps {
  /** Default consent state (must be "denied" for GDPR compliance) */
  defaults?: GoogleConsentModeDefaults
  /** Time (ms) to wait for CMP to load before using defaults */
  waitForUpdate?: number
  /** Regions to apply defaults to (empty = all regions) */
  regions?: string[]
}

/**
 * GoogleConsentMode - Sets default consent state for Google Consent Mode v2
 *
 * **Only use this component if you're using Google Analytics, Google Ads, or other Google services.**
 * If your site doesn't use Google services, you don't need this component.
 *
 * This component MUST be placed in <head> BEFORE gtag.js loads.
 * It sets default consent to "denied" to ensure GDPR compliance.
 *
 * @example
 * ```tsx
 * // Only include if using Google Analytics/Ads
 * // In your root layout.tsx or _document.tsx
 * <head>
 *   <GoogleConsentMode />
 *   <script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX" />
 * </head>
 * ```
 */
export function GoogleConsentMode({
  defaults = {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
  },
  waitForUpdate = 500,
  regions,
}: GoogleConsentModeProps) {
  useEffect(() => {
    // Only initialize if we're in the browser
    if (typeof window === "undefined") return

    // Initialize dataLayer if it doesn't exist
    // This is safe to do even if Google services aren't used - it's just an empty array
    window.dataLayer = window.dataLayer || []

    // Define gtag function if it doesn't exist
    // This allows consent mode to work even if gtag.js hasn't loaded yet
    if (!window.gtag) {
      window.gtag = function gtag(...args: unknown[]) {
        if (window.dataLayer) {
          window.dataLayer.push(args)
        }
      }
    }

    // Set default consent state
    // This MUST run synchronously before gtag.js loads
    // Note: If you don't use Google services, you don't need to include this component
    // But if you do include it, we'll initialize consent mode (user's intent is clear)
    if (window.gtag) {
      window.gtag("consent", "default", {
        ...defaults,
        wait_for_update: waitForUpdate,
        ...(regions?.length ? { region: regions } : {}),
      })
    }
  }, [defaults, waitForUpdate, regions])

  // This component doesn't render anything
  return null
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}
