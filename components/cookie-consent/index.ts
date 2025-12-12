// Main exports for cookie consent components
export { CookieConsentProvider, useCookieConsent, defaultCategories } from "./cookie-provider"
export { CookieBanner } from "./cookie-banner"
export { CookieBannerBackdrop } from "./cookie-banner-backdrop"
export { CookieSettings } from "./cookie-settings"
export { CookieTrigger } from "./cookie-trigger"
export { useConsentValue, useConsentGate } from "./use-cookie-consent"
export { ConsentScript } from "./consent-script"
export { useConsentScript } from "./use-consent-script"

// Types
export type {
  ConsentCategory,
  ConsentCategories,
  ConsentAction,
  ConsentScope,
  ConsentRecord,
  ConsentState,
  CookieConsentConfig,
  CookieConsentContextValue,
  TraceabilityConfig,
  ConsentScopeConfig,
  CategoryConfig,
  BannerPosition,
  ScriptConfig,
  ConsentChangeEvent,
} from "./types"

// Utilities
export { generateUUID, getVisitorId } from "./utils"
export { trackConsent, retryFailedRecords } from "./tracker"
export {
  registerScript,
  unregisterScript,
  loadScript,
  unloadScript,
  registerCleanup,
  getLoadedScripts,
  scriptCleanupHelpers,
} from "./script-manager"
