# OpenConsent Roadmap

This roadmap outlines our vision and planned features for OpenConsent. We believe in transparency and welcome community input on priorities.

## 🎯 Vision

**OpenConsent** aims to be the go-to consent management solution for modern React applications—free, open-source, and developer-first.

## ✅ Completed

- ✅ Google Consent Mode v2 integration
- ✅ shadcn/ui registry distribution
- ✅ TypeScript-first with full type safety
- ✅ Automatic script management (`ConsentScript` & `useConsentScript`)
- ✅ Full traceability and consent audit log support
- ✅ Comprehensive documentation & integration guides
- ✅ Testing utilities for consent-dependent code (`renderWithConsent`, mock helpers)
- ✅ GA4 & Google Analytics integration recipe
- ✅ Meta Pixel (Facebook) integration recipe
- ✅ PostHog hybrid cookieless & persistent telemetry integration
- ✅ Next.js App Router reference implementation & demo
- ✅ Automated releases & changelog generation (Release Please)
- ✅ Production deployment to [openconsent.dev](https://openconsent.dev) (DNS & production domain)

## 🚧 In Progress

- 🔄 Interactive playground & theme customizer
- 🔄 Framework adapters (Remix, Astro, Vite)

## 📋 Prioritized Backlog

Features are prioritized by product impact across **Reach** (target audience size), **Impact** (adoption & compliance lift), and **Confidence** (certainty of solution and user demand), paired with clear strategic rationale.

### 🥇 Tier 1: Core Drivers & Compliance Table Stakes (Immediate Priority)

- **Interactive Playground & Visual Theme Configurator**
  - **Weights**: Reach: 9/10 • Impact: Massive (3.0) • Confidence: 90%
  - **Rationale**: Primary conversion driver for developers and designers evaluating OpenConsent. Provides real-time preview of layout variants, dark/light modes, radius/styling, and instant copy-paste code without requiring a local sandbox.

- **i18n Multi-Language Support (10+ Languages & Auto-Detection)**
  - **Weights**: Reach: 8/10 • Impact: Massive (3.0) • Confidence: 95%
  - **Rationale**: Essential legal compliance requirement under EU GDPR and ePrivacy directives for non-English and multi-lingual web applications. Unlocks the primary European market without requiring developers to maintain custom dictionary forks.

### 🥈 Tier 2: Ecosystem & Developer Experience (High Value)

- **Standalone `@openconsent/test-utils` Package**
  - **Weights**: Reach: 5/10 • Impact: Medium–High (1.5) • Confidence: 90%
  - **Rationale**: Signals enterprise reliability and enables automated CI testing of consent-gated components without requiring teams to copy-paste test helper files into their local codebases.

- **Framework Adapters (Astro, Remix, Vite)**
  - **Weights**: Reach: 6/10 • Impact: High (2.0) • Confidence: 80%
  - **Rationale**: Expands adoption beyond Next.js by providing official zero-config wrappers and SSR-hydration patterns for the broader modern web stack.

- **Analytics Dashboard Template**
  - **Weights**: Reach: 4/10 • Impact: High (2.0) • Confidence: 80%
  - **Rationale**: Provides marketing and privacy teams with a visual UI to inspect opt-in rates and category conversion trends powered by the built-in traceability audit backend.

### 🥉 Tier 3: Tooling & Exploratory (Future Enhancements)

- **Browser DevTools Extension**
  - **Weights**: Reach: 5/10 • Impact: High (2.0) • Confidence: 65%
  - **Rationale**: Accelerates developer testing by allowing one-click consent toggling and script-blocking simulation directly from the browser inspection panel without manually clearing cookies.

- **AI-Powered Privacy Policy Generator (`npx openconsent generate-policy`)**
  - **Weights**: Reach: 6/10 • Impact: Medium (1.5) • Confidence: 50%
  - **Rationale**: Developer CLI utility to scan loaded third-party scripts and output a starter privacy policy draft, though requires manual legal review.

- **VS Code Extension (Snippets & Validation)**
  - **Weights**: Reach: 4/10 • Impact: Low (0.5) • Confidence: 70%
  - **Rationale**: Provides editor snippets and schema validation (lower priority as TypeScript types and JSDocs already provide extensive in-editor guidance).

## 🤝 Contributing

We welcome contributions! See our [Contributing Guide](./CONTRIBUTING.md) for details.

### How to Propose Features

1. Open a [GitHub Discussion](https://github.com/yhauxell/open-cookie-consent-banner/discussions) with your idea
2. Get community feedback
3. Create an issue if there's consensus
4. Submit a PR when ready

### Priority Areas

We're particularly interested in contributions for:

- Framework adapters
- Integration recipes (analytics tools, marketing platforms)
- Accessibility improvements
- Documentation improvements
- Testing utilities

## 📊 Community Goals

- **GitHub Stars**: 2,000+ (6 months)
- **Weekly Installs**: 1,000+ (6 months)
- **Active Contributors**: 50+ (6 months)

## 🔄 Updates

This roadmap is regularly updated as features are shipped. Last updated: August 2026.
