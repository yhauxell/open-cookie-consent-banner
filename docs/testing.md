# Testing with OpenConsent

OpenConsent provides comprehensive test utilities to make it easy to test consent-dependent code in your application.

## Quick Start

### Installation

Test utilities are included with OpenConsent. You'll need to install testing dependencies:

```bash
pnpm add -D vitest @testing-library/react @testing-library/jest-dom @vitejs/plugin-react jsdom
```

### Setup

Create `vitest.config.ts`:

```ts
import { defineConfig } from "vitest/config"
import react from "@vitejs/plugin-react"
import path from "path"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
})
```

Create `vitest.setup.ts`:

```ts
import { expect, afterEach } from "vitest"
import { cleanup } from "@testing-library/react"
import * as matchers from "@testing-library/jest-dom/matchers"

expect.extend(matchers)

afterEach(() => {
  cleanup()
  localStorage.clear()
})
```

## Basic Usage

### Rendering with Consent

Use `renderWithConsent` to render components with OpenConsent provider:

```tsx
import { renderWithConsent } from "@/components/cookie-consent/test-utils"
import { useConsentValue } from "@/components/cookie-consent"

function AnalyticsComponent() {
  const hasAnalytics = useConsentValue("analytics")
  
  if (!hasAnalytics) {
    return <div>Analytics disabled</div>
  }
  
  return <div>Analytics enabled</div>
}

test("analytics component respects consent", () => {
  const { rerender } = renderWithConsent(<AnalyticsComponent />, {
    initialConsent: {
      categories: { analytics: false },
    },
  })
  
  expect(screen.getByText("Analytics disabled")).toBeInTheDocument()
  
  // Update consent
  mockConsentState({ categories: { analytics: true } })
  rerender(<AnalyticsComponent />)
  
  expect(screen.getByText("Analytics enabled")).toBeInTheDocument()
})
```

## Test Utilities

### `renderWithConsent`

Render a component with OpenConsent provider:

```tsx
renderWithConsent(<MyComponent />, {
  initialConsent: {
    hasConsented: true,
    categories: { analytics: true },
  },
  consentConfig: {
    consentVersion: "1.0.0",
  },
})
```

### `mockConsentState`

Mock consent state in localStorage:

```tsx
import { mockConsentState } from "@/components/cookie-consent/test-utils"

mockConsentState({
  hasConsented: true,
  categories: {
    analytics: true,
    marketing: false,
  },
})
```

### `clearMockConsentState`

Clear consent state from localStorage:

```tsx
import { clearMockConsentState } from "@/components/cookie-consent/test-utils"

afterEach(() => {
  clearMockConsentState()
})
```

### `mockConsentCategories`

Pre-defined consent category helpers:

```tsx
import { mockConsentCategories } from "@/components/cookie-consent/test-utils"

// No consent (only necessary)
mockConsentCategories.none()

// All categories granted
mockConsentCategories.all()

// Only analytics
mockConsentCategories.analyticsOnly()

// Only marketing
mockConsentCategories.marketingOnly()

// Only preferences
mockConsentCategories.preferencesOnly()
```

### `consentTestHelpers`

Convenience helpers for common scenarios:

```tsx
import { consentTestHelpers } from "@/components/cookie-consent/test-utils"

// Accept all categories
consentTestHelpers.acceptAll()

// Reject all optional categories
consentTestHelpers.rejectAll()

// Grant specific category
consentTestHelpers.grantCategory("analytics")

// Revoke specific category
consentTestHelpers.revokeCategory("analytics")
```

## Testing Google Consent Mode

### Mock Google Consent Mode

```tsx
import {
  mockGoogleConsentMode,
  clearGoogleConsentModeMock,
  getConsentEvents,
} from "@/components/cookie-consent/test-utils"

test("updates Google Consent Mode on consent change", () => {
  mockGoogleConsentMode()
  
  // Your component that updates consent
  renderWithConsent(<MyComponent />)
  
  // Trigger consent update
  consentTestHelpers.acceptAll()
  
  // Check consent events
  const events = getConsentEvents()
  expect(events).toHaveLength(2) // default + update
  expect(events[1][2]).toMatchObject({
    analytics_storage: "granted",
  })
  
  clearGoogleConsentModeMock()
})
```

## Complete Example

```tsx
import { describe, it, expect, beforeEach, afterEach } from "vitest"
import { renderWithConsent, screen } from "@/components/cookie-consent/test-utils"
import { useConsentValue } from "@/components/cookie-consent"
import {
  mockConsentState,
  clearMockConsentState,
  consentTestHelpers,
} from "@/components/cookie-consent/test-utils"

function AnalyticsDashboard() {
  const hasAnalytics = useConsentValue("analytics")
  const hasMarketing = useConsentValue("marketing")
  
  return (
    <div>
      {hasAnalytics && <div data-testid="analytics">Analytics</div>}
      {hasMarketing && <div data-testid="marketing">Marketing</div>}
      {!hasAnalytics && !hasMarketing && (
        <div data-testid="no-tracking">No tracking enabled</div>
      )}
    </div>
  )
}

describe("AnalyticsDashboard", () => {
  beforeEach(() => {
    clearMockConsentState()
  })
  
  afterEach(() => {
    clearMockConsentState()
  })
  
  it("shows no tracking when consent not granted", () => {
    renderWithConsent(<AnalyticsDashboard />, {
      initialConsent: {
        categories: {
          analytics: false,
          marketing: false,
        },
      },
    })
    
    expect(screen.getByTestId("no-tracking")).toBeInTheDocument()
    expect(screen.queryByTestId("analytics")).not.toBeInTheDocument()
  })
  
  it("shows analytics when consent granted", () => {
    consentTestHelpers.grantCategory("analytics")
    
    renderWithConsent(<AnalyticsDashboard />)
    
    expect(screen.getByTestId("analytics")).toBeInTheDocument()
    expect(screen.queryByTestId("marketing")).not.toBeInTheDocument()
  })
  
  it("shows all features when all consent granted", () => {
    consentTestHelpers.acceptAll()
    
    renderWithConsent(<AnalyticsDashboard />)
    
    expect(screen.getByTestId("analytics")).toBeInTheDocument()
    expect(screen.getByTestId("marketing")).toBeInTheDocument()
  })
})
```

## Testing Consent Changes

Test components that react to consent changes:

```tsx
import { waitFor } from "@testing-library/react"

test("updates when consent changes", async () => {
  const { rerender } = renderWithConsent(<MyComponent />, {
    initialConsent: {
      categories: { analytics: false },
    },
  })
  
  expect(screen.getByText("Analytics disabled")).toBeInTheDocument()
  
  // Update consent
  mockConsentState({
    categories: { analytics: true },
  })
  
  // Re-render to pick up new state
  rerender(<MyComponent />)
  
  await waitFor(() => {
    expect(screen.getByText("Analytics enabled")).toBeInTheDocument()
  })
})
```

## Testing Script Loading

Test components that conditionally load scripts:

```tsx
import { ConsentScript } from "@/components/cookie-consent"

function AnalyticsLoader() {
  return (
    <ConsentScript
      id="ga4"
      src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"
      category="analytics"
      onLoad={() => {
        window.gtag?.("config", "G-XXXXX")
      }}
    />
  )
}

test("loads script when consent granted", () => {
  mockConsentState({
    categories: { analytics: true },
  })
  
  renderWithConsent(<AnalyticsLoader />)
  
  // Check that script was loaded
  const script = document.querySelector('script[src*="gtag"]')
  expect(script).toBeInTheDocument()
})
```

## Best Practices

1. **Always clear state between tests**
   ```tsx
   afterEach(() => {
     clearMockConsentState()
   })
   ```

2. **Use pre-defined category helpers**
   ```tsx
   // Good
   mockConsentState({ categories: mockConsentCategories.all() })
   
   // Avoid
   mockConsentState({ categories: { necessary: true, analytics: true, ... } })
   ```

3. **Test consent changes, not just initial state**
   ```tsx
   test("handles consent revocation", async () => {
     consentTestHelpers.acceptAll()
     const { rerender } = renderWithConsent(<MyComponent />)
     
     consentTestHelpers.revokeCategory("analytics")
     rerender(<MyComponent />)
     
     // Assert analytics is disabled
   })
   ```

4. **Mock Google Consent Mode when testing GA4 integration**
   ```tsx
   beforeEach(() => {
     mockGoogleConsentMode()
   })
   
   afterEach(() => {
     clearGoogleConsentModeMock()
   })
   ```

## Running Tests

```bash
# Run tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode
pnpm test:ui

# Coverage
pnpm test:coverage
```

## Troubleshooting

### Tests failing due to localStorage

Make sure to clear localStorage in `afterEach`:

```tsx
afterEach(() => {
  localStorage.clear()
})
```

### Components not updating after consent change

You need to re-render after updating consent:

```tsx
const { rerender } = renderWithConsent(<MyComponent />)
mockConsentState({ categories: { analytics: true } })
rerender(<MyComponent />)
```

### Google Consent Mode not working in tests

Make sure to mock it:

```tsx
beforeEach(() => {
  mockGoogleConsentMode()
})
```
