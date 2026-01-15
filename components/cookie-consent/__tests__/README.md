# OpenConsent Test Examples

This directory contains example tests demonstrating how to use OpenConsent test utilities.

## Running Tests

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# UI mode (interactive)
pnpm test:ui

# Coverage report
pnpm test:coverage
```

## Test Files

- `test-utils.test.tsx` - Examples of using test utilities

## Quick Reference

### Basic Test

```tsx
import { renderWithConsent, screen } from "@/components/cookie-consent/test-utils"
import { useConsentValue } from "@/components/cookie-consent"

function MyComponent() {
  const hasAnalytics = useConsentValue("analytics")
  return <div>{hasAnalytics ? "Enabled" : "Disabled"}</div>
}

test("respects consent", () => {
  renderWithConsent(<MyComponent />, {
    initialConsent: { categories: { analytics: true } },
  })
  
  expect(screen.getByText("Enabled")).toBeInTheDocument()
})
```

### Mock Consent State

```tsx
import { mockConsentState, consentTestHelpers } from "@/components/cookie-consent/test-utils"

// Manual
mockConsentState({ categories: { analytics: true } })

// Or use helpers
consentTestHelpers.acceptAll()
consentTestHelpers.grantCategory("analytics")
```

### Test Google Consent Mode

```tsx
import {
  mockGoogleConsentMode,
  getConsentEvents,
} from "@/components/cookie-consent/test-utils"

beforeEach(() => {
  mockGoogleConsentMode()
})

test("updates consent mode", () => {
  // Your test code
  const events = getConsentEvents()
  expect(events).toHaveLength(2)
})
```

For more examples, see [testing.md](../../../docs/testing.md).
