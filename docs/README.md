# Open Cookie Consent Banner

A full-featured, GDPR-compliant cookie consent solution compatible with shadcn/ui registry.

## Features

- **GDPR & CCPA Compliant** - Granular consent categories, easy withdrawal, consent versioning
- **Traceability** - Full audit trail with configurable API endpoint
- **Script Management** - Automatic loading/unloading of third-party scripts based on consent
- **shadcn/ui Compatible** - Uses existing primitives (Button, Dialog, Switch, Card)
- **TypeScript** - Fully typed with exported types
- **Hybrid Consent Scope** - Device-level for anonymous users, global sync for authenticated users

## Quick Start

\`\`\`tsx
import {
CookieConsentProvider,
CookieBanner,
CookieSettings,
CookieTrigger,
} from "@/components/cookie-consent"

export default function App({ children }) {
return (
<CookieConsentProvider
config={{
        consentVersion: "1.0.0",
        privacyPolicyUrl: "/privacy",
        traceability: {
          enabled: true,
          endpoint: "/api/consent",
        },
      }} >
{children}
<CookieBanner />
<CookieSettings />
<CookieTrigger />
</CookieConsentProvider>
)
}
\`\`\`

## Documentation

- [Configuration](./configuration.md) - Full configuration options
- [Components](./components.md) - Component API reference
- [Hooks](./hooks.md) - React hooks API
- [Script Management](./script-management.md) - Managing third-party scripts
- [Traceability](./traceability.md) - Consent audit trail setup
- [Database Schema](./database.md) - Supabase/PostgreSQL schema

## Installation

### Using shadcn CLI (Recommended)

\`\`\`bash
npx shadcn@latest add https://your-registry/cookie-consent
\`\`\`

### Manual Installation

1. Copy the `components/cookie-consent` directory to your project
2. Ensure you have the required shadcn/ui components installed:
   - `button`, `dialog`, `switch`, `card`, `label`
3. Run Supabase migrations (see [Database Schema](./database.md))

## License

MIT
