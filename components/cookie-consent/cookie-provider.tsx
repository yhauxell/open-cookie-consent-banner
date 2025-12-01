"use client"

import * as React from "react"
import type {
  CategoryConfig,
  ConsentCategories,
  ConsentCategory,
  ConsentChangeEvent,
  ConsentState,
  CookieConsentConfig,
  CookieConsentContextValue,
  ScriptConfig,
} from "./types"
import {
  calculateExpirationDate,
  clearConsentState,
  getAllAcceptedCategories,
  getDefaultCategories,
  getVisitorId,
  loadConsentState,
  saveConsentState,
} from "./utils"
import { trackConsent, retryFailedRecords } from "./tracker"
import {
  loadConsentedScripts,
  unloadRevokedScripts,
  getLoadedScripts,
  registerScript as registerScriptInternal,
  unregisterScript as unregisterScriptInternal,
} from "./script-manager"

const CookieConsentContext = React.createContext<CookieConsentContextValue | null>(null)

export const defaultCategories: CategoryConfig[] = [
  {
    key: "necessary",
    title: "Necessary",
    description: "Essential cookies required for the website to function properly. These cannot be disabled.",
    required: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Cookies that help us understand how visitors interact with our website.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Cookies used for advertising and tracking across websites.",
  },
  {
    key: "preferences",
    title: "Preferences",
    description: "Cookies that remember your settings and preferences.",
  },
]

interface CookieConsentProviderProps {
  children: React.ReactNode
  config: CookieConsentConfig
}

export function CookieConsentProvider({ children, config }: CookieConsentProviderProps) {
  const [state, setState] = React.useState<ConsentState>(() => ({
    hasConsented: false,
    categories: getDefaultCategories(),
    lastUpdated: null,
    consentVersion: config.consentVersion,
    visitorId: "",
  }))
  const [isBannerVisible, setIsBannerVisible] = React.useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false)
  const [isInitialized, setIsInitialized] = React.useState(false)

  const previousCategoriesRef = React.useRef<ConsentCategories>(getDefaultCategories())

  // Initialize state from localStorage
  React.useEffect(() => {
    const visitorId = getVisitorId()
    const stored = loadConsentState()

    if (stored && stored.consentVersion === config.consentVersion) {
      setState({ ...stored, visitorId })
      setIsBannerVisible(false)
      previousCategoriesRef.current = stored.categories

      loadConsentedScripts(stored.categories)
    } else {
      setState((prev) => ({ ...prev, visitorId }))
      setIsBannerVisible(true)
    }

    setIsInitialized(true)

    if (config.traceability?.enabled) {
      retryFailedRecords(config.traceability)
    }
  }, [config.consentVersion, config.traceability])

  const saveAndTrack = React.useCallback(
    async (categories: ConsentCategories, action: "accept_all" | "reject_all" | "custom" | "update") => {
      const expirationDays = config.expirationDays ?? 365
      const expiresAt = calculateExpirationDate(expirationDays)
      const visitorId = getVisitorId()

      const previousCategories = previousCategoriesRef.current

      const newState: ConsentState = {
        hasConsented: true,
        categories,
        lastUpdated: new Date().toISOString(),
        consentVersion: config.consentVersion,
        visitorId,
      }

      setState(newState)
      saveConsentState(newState)
      setIsBannerVisible(false)

      const revokedCategories = unloadRevokedScripts(previousCategories, categories)
      loadConsentedScripts(categories)

      const grantedCategories: ConsentCategory[] = []
      ;(Object.keys(categories) as ConsentCategory[]).forEach((category) => {
        if (!previousCategories[category] && categories[category]) {
          grantedCategories.push(category)
        }
      })

      if (config.onConsentChange) {
        const event: ConsentChangeEvent = {
          previousCategories,
          currentCategories: categories,
          action,
          revokedCategories,
          grantedCategories,
        }
        config.onConsentChange(event)
      }

      // Update previous categories ref
      previousCategoriesRef.current = categories

      // Track consent if traceability is enabled
      if (config.traceability?.enabled) {
        const userId = await config.consentScope?.getUserId?.()
        await trackConsent({
          categories,
          action,
          consentVersion: config.consentVersion,
          expiresAt,
          config: config.traceability,
          userId: userId ?? undefined,
          scope: config.consentScope?.mode ?? "device",
        })
      }
    },
    [config],
  )

  const acceptAll = React.useCallback(async () => {
    await saveAndTrack(getAllAcceptedCategories(), "accept_all")
  }, [saveAndTrack])

  const rejectAll = React.useCallback(async () => {
    await saveAndTrack(getDefaultCategories(), "reject_all")
  }, [saveAndTrack])

  const updateConsent = React.useCallback(
    async (categories: Partial<ConsentCategories>) => {
      const newCategories: ConsentCategories = {
        ...state.categories,
        ...categories,
        necessary: true,
      }
      const action = state.hasConsented ? "update" : "custom"
      await saveAndTrack(newCategories, action)
    },
    [state.categories, state.hasConsented, saveAndTrack],
  )

  const openSettings = React.useCallback(() => {
    setIsSettingsOpen(true)
  }, [])

  const closeSettings = React.useCallback(() => {
    setIsSettingsOpen(false)
  }, [])

  const hideBanner = React.useCallback(() => {
    setIsBannerVisible(false)
  }, [])

  const resetConsent = React.useCallback(() => {
    const defaultCats = getDefaultCategories()
    unloadRevokedScripts(state.categories, defaultCats)

    clearConsentState()
    setState({
      hasConsented: false,
      categories: defaultCats,
      lastUpdated: null,
      consentVersion: config.consentVersion,
      visitorId: getVisitorId(),
    })
    previousCategoriesRef.current = defaultCats
    setIsBannerVisible(true)
  }, [config.consentVersion, state.categories])

  const hasConsent = React.useCallback(
    (category: "necessary" | "analytics" | "marketing" | "preferences") => {
      return state.categories[category] ?? false
    },
    [state.categories],
  )

  const registerScript = React.useCallback((script: ScriptConfig) => {
    registerScriptInternal(script)
  }, [])

  const unregisterScript = React.useCallback((id: string) => {
    unregisterScriptInternal(id)
  }, [])

  const value: CookieConsentContextValue = React.useMemo(
    () => ({
      state,
      isBannerVisible: isInitialized && isBannerVisible,
      isSettingsOpen,
      acceptAll,
      rejectAll,
      updateConsent,
      openSettings,
      closeSettings,
      hideBanner,
      resetConsent,
      hasConsent,
      config,
      registerScript,
      unregisterScript,
      getLoadedScripts,
    }),
    [
      state,
      isInitialized,
      isBannerVisible,
      isSettingsOpen,
      acceptAll,
      rejectAll,
      updateConsent,
      openSettings,
      closeSettings,
      hideBanner,
      resetConsent,
      hasConsent,
      config,
      registerScript,
      unregisterScript,
    ],
  )

  return <CookieConsentContext.Provider value={value}>{children}</CookieConsentContext.Provider>
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = React.useContext(CookieConsentContext)
  if (!context) {
    throw new Error("useCookieConsent must be used within a CookieConsentProvider")
  }
  return context
}

export { CookieConsentContext }
