# OpenConsent

<div align="center">

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![React](https://img.shields.io/badge/React-19.2-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-compatible-green)

**Consent management, open and simple.**

A full-featured, GDPR-compliant cookie consent solution with Google Consent Mode v2 built-in, distributed via [shadcn/ui](https://ui.shadcn.com) registry.

**[openconsent.dev](https://openconsent.dev)** • [Documentation](./docs/README.md) • [Demo](./app/demo) • [Install](#-installation)

**📦 Install via Registry** • [Features](#-features) • [Usage](#-usage) • [Documentation](#-documentation) • [Contributing](#-contributing)

</div>

> **Note**: This project is open source for transparency and community contributions. The primary way to use this component is through the [shadcn/ui registry](#-installation-via-registry). The source code is available for inspection, customization, and contributions.

## ✨ Features

- 🛡️ **GDPR & CCPA Compliant** - Granular consent categories, easy withdrawal, consent versioning
- ⚡ **Google Consent Mode v2** - Built-in support for Google's required consent framework (EU/EEA/UK) - *Only initializes if Google services are detected*
- 🔧 **Script Management** - Automatic loading/unloading of third-party scripts based on consent
- 🎨 **shadcn/ui Native** - Uses existing primitives (Button, Dialog, Switch, Card)
- 📝 **TypeScript First** - Fully typed with exported types for great DX
- 📊 **Full Traceability** - Complete audit trail with configurable API endpoint
- 🌐 **Hybrid Consent Scope** - Device-level for anonymous users, global sync for authenticated users
- 🎯 **Zero Dependencies** - Only uses shadcn/ui components you already have
- 🧪 **Test Utilities** - Comprehensive testing helpers for consent-dependent code
- ♿ **Accessible** - Built with accessibility in mind
- 🎭 **Fully Customizable** - Own your code, customize everything

## 📦 Installation

### Via Registry (Recommended)

The easiest way to use OpenConsent is through the shadcn/ui registry:

```bash
npx shadcn@latest add https://openconsent.dev/r/cookie-consent.json
```

The registry automatically includes all necessary files and dependencies.

### Manual Installation (For Development/Contributors)

If you want to fork, customize, or contribute to the project:

1. Clone this repository
2. Copy the `components/cookie-consent` directory to your project
3. Ensure you have the required shadcn/ui components installed:
   ```bash
   npx shadcn@latest add button dialog switch card label accordion
   ```
4. (Optional) Run Supabase migrations for traceability (see [Database Schema](./docs/database.md))

## 🚀 Quick Start

```tsx
import {
  CookieConsentProvider,
  CookieBanner,
  CookieSettings,
  CookieTrigger,
} from "@/components/cookie-consent";

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
      }}
    >
      {children}
      <CookieBanner />
      <CookieSettings />
      <CookieTrigger />
    </CookieConsentProvider>
  );
}
```

## 📖 Usage

### Basic Setup

Wrap your app with `CookieConsentProvider` and add the banner:

```tsx
import {
  CookieConsentProvider,
  CookieBanner,
} from "@/components/cookie-consent";

function App() {
  return (
    <CookieConsentProvider
      config={{
        consentVersion: "1.0.0",
        privacyPolicyUrl: "/privacy",
      }}
    >
      <YourApp />
      <CookieBanner />
    </CookieConsentProvider>
  );
}
```

### Script Management

Load third-party scripts conditionally based on consent:

```tsx
import { ConsentScript } from "@/components/cookie-consent";

function Analytics() {
  return (
    <ConsentScript
      id="google-analytics"
      src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
      category="analytics"
      onRevoke={() => {
        // Cleanup GA cookies and global
        window.gtag = undefined;
      }}
    />
  );
}
```

### Using Hooks

Check consent status programmatically:

```tsx
import { useCookieConsent, useConsentValue } from "@/components/cookie-consent";

function MyComponent() {
  const { hasConsent, state } = useCookieConsent();
  const hasAnalytics = useConsentValue("analytics");

  if (hasAnalytics) {
    // Load analytics
  }
}
```

## 📚 Documentation

- [Quick Start Guide](./docs/README.md) - Get started in 5 minutes
- [Google Consent Mode v2](./docs/google-consent-mode.md) - **Required for EU/EEA/UK traffic**
- [Testing Guide](./docs/testing.md) - Test utilities for consent-dependent code
- [Roadmap](./ROADMAP.md) - Feature roadmap and vision
- [Configuration Guide](./docs/configuration.md) - Full configuration options
- [Component API](./docs/components.md) - Component API reference
- [Hooks API](./docs/hooks.md) - React hooks documentation
- [Script Management](./docs/script-management.md) - Managing third-party scripts
- [Traceability](./docs/traceability.md) - Consent audit trail setup
- [Database Schema](./docs/database.md) - Supabase/PostgreSQL schema

## 🛠️ Development & Registry Setup

This repository serves as both:

1. **The source code** for the cookie consent component
2. **The registry server** that distributes the component via shadcn/ui

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Running the Registry Locally

```bash
# Clone the repository
git clone https://github.com/yourusername/cookie-consent-banner.git
cd cookie-consent-banner

# Install dependencies
pnpm install

# Build registry files
pnpm run registry:build

# Run development server (includes registry UI)
pnpm dev
```

The registry will be available at:

- `http://localhost:3000/registry` - Registry UI page
- `http://localhost:3000/r/cookie-consent.json` - Registry JSON endpoint
- `http://localhost:3000/demo` - Component demo

### Deploying the Registry

To make the registry publicly available:

1. Deploy this Next.js application to Vercel, Netlify, or your preferred hosting
2. Update the `NEXT_PUBLIC_BASE_URL` environment variable with your domain
3. Users can then install via: `npx shadcn@latest add https://your-domain.com/r/cookie-consent.json`

### Building for Production

```bash
# Build registry and Next.js app
pnpm build

# Start production server
pnpm start
```

### Project Structure

```
cookie-consent-banner/
├── app/                    # Next.js app directory
│   ├── registry/          # Registry UI page
│   ├── demo/              # Demo page
│   └── r/                 # Registry API routes
├── components/
│   ├── cookie-consent/    # Main component library
│   └── ui/                # shadcn/ui components
├── docs/                  # Documentation
├── migrations/            # Database migrations
├── public/
│   └── r/                 # Generated registry files
└── scripts/              # Build scripts
```

## 🤝 Contributing

This project is open source to enable:

- **Transparency** - Users can inspect the code they're installing
- **Community contributions** - Improvements and bug fixes from the community
- **Customization** - Fork and adapt for specific needs
- **Security** - Open code can be audited for security issues

Contributions are welcome! Please read our [Contributing Guide](./CONTRIBUTING.md) for details.

### Why Open Source?

Even though the registry is the primary distribution method, open source provides:

- ✅ **Trust** - Users can verify what code they're installing
- ✅ **Security** - Community can audit and report vulnerabilities
- ✅ **Improvements** - Community contributions make it better for everyone
- ✅ **Flexibility** - Advanced users can fork and customize

### How to Contribute

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

All contributions will be included in future registry updates.

## 📋 Requirements

- React 19.2+
- Next.js 16.0+
- TypeScript 5.0+
- Tailwind CSS 4.0+
- Required shadcn/ui components: `button`, `dialog`, `switch`, `card`, `label`, `accordion`

## 🧪 Testing

```bash
# Run linter
pnpm lint

# Type check
pnpm type-check
```

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [shadcn/ui](https://ui.shadcn.com)
- Inspired by modern privacy-first consent management solutions
- Uses [Radix UI](https://www.radix-ui.com) primitives

## 📞 Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Report a Bug](https://github.com/yourusername/cookie-consent-banner/issues)
- 💬 [Discussions](https://github.com/yourusername/cookie-consent-banner/discussions)
- 📧 [Email Support](mailto:your.email@example.com)

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

<div align="center">

Made with ❤️ by the community

[Report Bug](https://github.com/yourusername/cookie-consent-banner/issues) • [Request Feature](https://github.com/yourusername/cookie-consent-banner/issues) • [Contribute](./CONTRIBUTING.md)

</div>
