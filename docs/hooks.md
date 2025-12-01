# Hooks

## useCookieConsent

The main hook for accessing consent state and actions.

\`\`\`tsx
import { useCookieConsent } from "@/components/cookie-consent"

function MyComponent() {
  const {
    state,
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
  } = useCookieConsent()

  return (
    <div>
      <p>Analytics enabled: {state.categories.analytics ? "Yes" : "No"}</p>
      <button onClick={openSettings}>Manage Preferences</button>
    </div>
  )
}
\`\`\`

### Return Value

| Property | Type | Description |
|----------|------|-------------|
| `state` | `ConsentState` | Current consent state |
| `isBannerVisible` | `boolean` | Whether banner is shown |
| `isSettingsOpen` | `boolean` | Whether settings dialog is open |
| `acceptAll` | `() => Promise<void>` | Accept all categories |
| `rejectAll` | `() => Promise<void>` | Reject non-essential categories |
| `updateConsent` | `(categories: Partial<ConsentCategories>) => Promise<void>` | Update specific categories |
| `openSettings` | `() => void` | Open settings dialog |
| `closeSettings` | `() => void` | Close settings dialog |
| `hideBanner` | `() => void` | Hide banner without consent |
| `resetConsent` | `() => void` | Clear all consent (for testing) |
| `hasConsent` | `(category: ConsentCategory) => boolean` | Check category consent |
| `config` | `CookieConsentConfig` | Current configuration |

### ConsentState

\`\`\`tsx
interface ConsentState {
  hasConsented: boolean
  categories: ConsentCategories
  lastUpdated: string | null
  consentVersion: string
  visitorId: string
}
\`\`\`

---

## useConsentValue

Check if a specific category has consent.

\`\`\`tsx
import { useConsentValue } from "@/components/cookie-consent"

function AnalyticsLoader() {
  const hasAnalyticsConsent = useConsentValue("analytics")

  useEffect(() => {
    if (hasAnalyticsConsent) {
      // Initialize analytics
      initializeGA()
    }
  }, [hasAnalyticsConsent])

  return null
}
\`\`\`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | `ConsentCategory` | Category to check |

### Returns

`boolean` - Whether the category has consent

---

## useConsentGate

Conditionally render content based on consent.

\`\`\`tsx
import { useConsentGate } from "@/components/cookie-consent"

function MarketingBanner() {
  const { hasConsent, isLoading } = useConsentGate("marketing")

  if (isLoading) return null
  if (!hasConsent) return null

  return <PersonalizedBanner />
}
\`\`\`

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `category` | `ConsentCategory` | Category to check |

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `hasConsent` | `boolean` | Whether category has consent |
| `isLoading` | `boolean` | Whether consent state is loading |

---

## useConsentScript

Programmatically manage script loading based on consent.

\`\`\`tsx
import { useConsentScript } from "@/components/cookie-consent"

function ChatWidget() {
  const { isLoaded, isLoading, hasConsent, error, load, unload } = useConsentScript({
    id: "intercom",
    src: "https://widget.intercom.io/widget/APP_ID",
    category: "preferences",
    onLoad: () => {
      window.Intercom("boot", { app_id: "APP_ID" })
    },
    onRevoke: () => {
      window.Intercom?.("shutdown")
    },
  })

  if (!hasConsent) {
    return <p>Enable preference cookies to use chat support.</p>
  }

  if (isLoading) {
    return <p>Loading chat...</p>
  }

  return <button onClick={() => window.Intercom("show")}>Open Chat</button>
}
\`\`\`

### Parameters

`ScriptConfig` object (see Components > ConsentScript)

### Returns

| Property | Type | Description |
|----------|------|-------------|
| `isLoaded` | `boolean` | Whether script is loaded |
| `isLoading` | `boolean` | Whether script is loading |
| `hasConsent` | `boolean` | Whether category has consent |
| `error` | `Error \| null` | Load error if any |
| `load` | `() => Promise<void>` | Manually trigger load |
| `unload` | `() => void` | Manually unload script |
