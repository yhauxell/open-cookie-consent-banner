"use client";

import * as React from "react";
import { GoogleConsentMode } from "./google-consent-mode";
import {
  hasGoogleScripts as checkHasGoogleScripts,
  getLoadedScripts,
  loadConsentedScripts,
  registerScript as registerScriptInternal,
  unloadRevokedScripts,
  unregisterScript as unregisterScriptInternal,
} from "./script-manager";
import { retryFailedRecords, trackConsent } from "./tracker";
import type {
  CategoryConfig,
  ConsentCategories,
  ConsentCategory,
  ConsentChangeEvent,
  ConsentState,
  CookieConsentConfig,
  CookieConsentContextValue,
  GoogleConsentModeConfig,
  ScriptConfig,
} from "./types";
import {
  calculateExpirationDate,
  clearConsentState,
  getAllAcceptedCategories,
  getDefaultCategories,
  getVisitorId,
  isGoogleScript,
  loadConsentState,
  saveConsentState,
} from "./utils";

const CookieConsentContext =
  React.createContext<CookieConsentContextValue | null>(null);

export const defaultCategories: CategoryConfig[] = [
  {
    key: "necessary",
    title: "Necessary",
    description:
      "Essential cookies required for the website to function properly. These cannot be disabled.",
    required: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description:
      "Cookies that help us understand how visitors interact with our website.",
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
];

interface CookieConsentProviderProps {
  children: React.ReactNode;
  config: CookieConsentConfig;
}

export function CookieConsentProvider({
  children,
  config,
}: CookieConsentProviderProps) {
  const [state, setState] = React.useState<ConsentState>(() => ({
    hasConsented: false,
    categories: getDefaultCategories(),
    lastUpdated: null,
    consentVersion: config.consentVersion,
    visitorId: "",
  }));
  const [isBannerVisible, setIsBannerVisible] = React.useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = React.useState(false);
  const [isInitialized, setIsInitialized] = React.useState(false);
  const [hasGoogleScripts, setHasGoogleScripts] = React.useState(false);

  const previousCategoriesRef = React.useRef<ConsentCategories>(
    getDefaultCategories()
  );

  // Auto-enable Google Consent Mode if Google scripts are detected
  const effectiveGoogleConsentMode = React.useMemo(():
    | GoogleConsentModeConfig
    | undefined => {
    // If user explicitly configured it, use their config
    if (config.googleConsentMode) {
      return config.googleConsentMode;
    }
    // If Google scripts are detected, auto-enable with defaults
    if (hasGoogleScripts) {
      return {
        enabled: true,
        mapping: {
          analytics_storage: "analytics",
          ad_storage: "marketing",
          ad_user_data: "marketing",
          ad_personalization: "marketing",
          functionality_storage: "preferences",
          personalization_storage: "preferences",
          security_storage: "necessary",
        },
      };
    }
    return undefined;
  }, [config.googleConsentMode, hasGoogleScripts]);

  // Update Google Consent Mode v2 when consent changes
  // Only updates if Google Consent Mode is enabled AND gtag exists (user is using Google services)
  const updateGoogleConsentMode = React.useCallback(
    (categories: ConsentCategories) => {
      if (!effectiveGoogleConsentMode?.enabled) return;
      if (typeof window === "undefined" || !window.gtag) return;
      // Additional check: only update if dataLayer exists (Google services are actually loaded)
      if (!window.dataLayer) return;

      const mapping = effectiveGoogleConsentMode.mapping || {
        analytics_storage: "analytics",
        ad_storage: "marketing",
        ad_user_data: "marketing",
        ad_personalization: "marketing",
        functionality_storage: "preferences",
        personalization_storage: "preferences",
        security_storage: "necessary",
      };

      const consentUpdate: Record<string, "granted" | "denied"> = {};

      // Map consent categories to Google consent types
      Object.entries(mapping).forEach(([googleType, category]) => {
        if (category && categories[category]) {
          consentUpdate[googleType] = "granted";
        } else {
          consentUpdate[googleType] = "denied";
        }
      });

      // Update Google Consent Mode
      window.gtag("consent", "update", consentUpdate);
    },
    [effectiveGoogleConsentMode]
  );

  // Initialize state from localStorage
  React.useEffect(() => {
    const visitorId = getVisitorId();
    const stored = loadConsentState();

    if (stored && stored.consentVersion === config.consentVersion) {
      setState({ ...stored, visitorId });
      setIsBannerVisible(false);
      previousCategoriesRef.current = stored.categories;

      loadConsentedScripts(stored.categories);
    } else {
      setState((prev) => ({ ...prev, visitorId }));
      setIsBannerVisible(true);
    }

    setIsInitialized(true);

    if (config.traceability?.enabled) {
      retryFailedRecords(config.traceability);
    }
  }, [config.consentVersion, config.traceability]);

  // Check for existing Google scripts on mount
  React.useEffect(() => {
    // Check if any already registered scripts are Google scripts
    if (checkHasGoogleScripts()) {
      setHasGoogleScripts(true);
    }
  }, []);

  const saveAndTrack = React.useCallback(
    async (
      categories: ConsentCategories,
      action: "accept_all" | "reject_all" | "custom" | "update"
    ) => {
      const expirationDays = config.expirationDays ?? 365;
      const expiresAt = calculateExpirationDate(expirationDays);
      const visitorId = getVisitorId();

      const previousCategories = previousCategoriesRef.current;

      const newState: ConsentState = {
        hasConsented: true,
        categories,
        lastUpdated: new Date().toISOString(),
        consentVersion: config.consentVersion,
        visitorId,
      };

      setState(newState);
      saveConsentState(newState);
      setIsBannerVisible(false);

      const revokedCategories = unloadRevokedScripts(
        previousCategories,
        categories
      );
      loadConsentedScripts(categories);

      // Update Google Consent Mode v2
      updateGoogleConsentMode(categories);

      const grantedCategories: ConsentCategory[] = [];
      (Object.keys(categories) as ConsentCategory[]).forEach((category) => {
        if (!previousCategories[category] && categories[category]) {
          grantedCategories.push(category);
        }
      });

      if (config.onConsentChange) {
        const event: ConsentChangeEvent = {
          previousCategories,
          currentCategories: categories,
          action,
          revokedCategories,
          grantedCategories,
        };
        config.onConsentChange(event);
      }

      // Update previous categories ref
      previousCategoriesRef.current = categories;

      // Track consent if traceability is enabled
      if (config.traceability?.enabled) {
        const userId = await config.consentScope?.getUserId?.();
        await trackConsent({
          categories,
          action,
          consentVersion: config.consentVersion,
          expiresAt,
          config: config.traceability,
          userId: userId ?? undefined,
          scope: config.consentScope?.mode === "global" ? "global" : "device",
        });
      }
    },
    [config, updateGoogleConsentMode]
  );

  const acceptAll = React.useCallback(async () => {
    await saveAndTrack(getAllAcceptedCategories(), "accept_all");
  }, [saveAndTrack]);

  const rejectAll = React.useCallback(async () => {
    await saveAndTrack(getDefaultCategories(), "reject_all");
  }, [saveAndTrack]);

  const updateConsent = React.useCallback(
    async (categories: Partial<ConsentCategories>) => {
      const newCategories: ConsentCategories = {
        ...state.categories,
        ...categories,
        necessary: true,
      };
      const action = state.hasConsented ? "update" : "custom";
      await saveAndTrack(newCategories, action);
    },
    [state.categories, state.hasConsented, saveAndTrack]
  );

  const openSettings = React.useCallback(() => {
    setIsSettingsOpen(true);
  }, []);

  const closeSettings = React.useCallback(() => {
    setIsSettingsOpen(false);
  }, []);

  const hideBanner = React.useCallback(() => {
    setIsBannerVisible(false);
  }, []);

  const resetConsent = React.useCallback(() => {
    const defaultCats = getDefaultCategories();
    unloadRevokedScripts(state.categories, defaultCats);

    clearConsentState();
    setState({
      hasConsented: false,
      categories: defaultCats,
      lastUpdated: null,
      consentVersion: config.consentVersion,
      visitorId: getVisitorId(),
    });
    previousCategoriesRef.current = defaultCats;
    setIsBannerVisible(true);
  }, [config.consentVersion, state.categories]);

  const hasConsent = React.useCallback(
    (category: "necessary" | "analytics" | "marketing" | "preferences") => {
      return state.categories[category] ?? false;
    },
    [state.categories]
  );

  const registerScript = React.useCallback((script: ScriptConfig) => {
    registerScriptInternal(script);

    // Auto-detect Google scripts and enable Google Consent Mode
    if (isGoogleScript(script)) {
      setHasGoogleScripts(true);
    }
  }, []);

  const unregisterScript = React.useCallback((id: string) => {
    unregisterScriptInternal(id);
  }, []);

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
    ]
  );

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
      {/* Automatically render GoogleConsentMode when Google scripts are detected */}
      {hasGoogleScripts && effectiveGoogleConsentMode?.enabled && (
        <GoogleConsentMode
          defaults={{
            analytics_storage: "denied",
            ad_storage: "denied",
            ad_user_data: "denied",
            ad_personalization: "denied",
          }}
          regions={effectiveGoogleConsentMode?.regions}
        />
      )}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const context = React.useContext(CookieConsentContext);
  if (!context) {
    throw new Error(
      "useCookieConsent must be used within a CookieConsentProvider"
    );
  }
  return context;
}

export { CookieConsentContext };
