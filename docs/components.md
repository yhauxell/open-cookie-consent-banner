# Components

## CookieConsentProvider

The context provider that manages consent state. Must wrap your application.

\`\`\`tsx
import { CookieConsentProvider } from "@/components/cookie-consent"

<CookieConsentProvider config={config}>
  {children}
</CookieConsentProvider>
\`\`\`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `config` | `CookieConsentConfig` | Yes | Configuration object |
| `children` | `ReactNode` | Yes | Child components |

---

## CookieBanner

The main consent banner displayed to users who haven't consented.

\`\`\`tsx
import { CookieBanner } from "@/components/cookie-consent"

<CookieBanner />
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### Features

- Animated entrance/exit
- Accept All / Reject All / Customize buttons
- Privacy policy link
- Responsive design
- Accessible (ARIA labels, keyboard navigation)

---

## CookieBannerBackdrop

Optional backdrop overlay that appears behind the cookie banner.

\`\`\`tsx
import { CookieBanner, CookieBannerBackdrop } from "@/components/cookie-consent"

// Place backdrop as sibling before the banner
<CookieBannerBackdrop />
<CookieBanner />
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `closeOnClick` | `boolean` | `false` | Click backdrop to reject all & close |
| `blur` | `string` | `"4px"` | Backdrop blur amount |
| `opacity` | `number` | `0.5` | Backdrop opacity (0-1) |

### Features

- Smooth fade in/out animation
- Configurable blur and opacity
- Optional click-to-dismiss behavior
- z-index layered behind banner (z-40 vs z-50)

### Examples

\`\`\`tsx
// Basic usage
<CookieBannerBackdrop />
<CookieBanner />

// With stronger blur and click to close
<CookieBannerBackdrop 
  blur="8px" 
  opacity={0.6} 
  closeOnClick 
/>
<CookieBanner />

// Minimal subtle backdrop
<CookieBannerBackdrop 
  blur="2px" 
  opacity={0.3} 
/>
<CookieBanner />
\`\`\`

---

## CookieSettings

Modal dialog for granular consent preferences.

\`\`\`tsx
import { CookieSettings } from "@/components/cookie-consent"

<CookieSettings />
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |

### Features

- Per-category toggles
- Required categories disabled
- Save / Accept All / Reject All actions
- Accessible dialog

---

## CookieTrigger

Button/link to reopen settings after consent has been given.

\`\`\`tsx
import { CookieTrigger } from "@/components/cookie-consent"

// In your footer
<footer>
  <CookieTrigger />
</footer>
\`\`\`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `className` | `string` | - | Additional CSS classes |
| `children` | `ReactNode` | "Cookie Settings" | Custom content |
| `asChild` | `boolean` | `false` | Merge with child element |
| `variant` | `string` | "ghost" | Button variant |
| `size` | `string` | "sm" | Button size |

### Examples

\`\`\`tsx
// Default
<CookieTrigger />

// Custom text
<CookieTrigger>Manage Cookies</CookieTrigger>

// As a link
<CookieTrigger asChild>
  <a href="#">Cookie Preferences</a>
</CookieTrigger>
\`\`\`

---

## ConsentScript

Declarative component for loading scripts based on consent.

\`\`\`tsx
import { ConsentScript } from "@/components/cookie-consent"

<ConsentScript
  id="google-analytics"
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  category="analytics"
  onLoad={() => console.log("GA loaded")}
  onRevoke={() => {
    // Clean up GA cookies
    document.cookie.split(";").forEach((c) => {
      if (c.trim().startsWith("_ga")) {
        document.cookie = c.split("=")[0] + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      }
    })
  }}
/>
\`\`\`

### Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `id` | `string` | Yes | Unique script identifier |
| `src` | `string` | No* | External script URL |
| `content` | `string` | No* | Inline script content |
| `category` | `ConsentCategory` | Yes | Required consent category |
| `strategy` | `string` | No | Loading strategy |
| `attributes` | `Record<string, string>` | No | Additional script attributes |
| `onLoad` | `() => void` | No | Called when script loads |
| `onError` | `(error: Error) => void` | No | Called on load error |
| `onRevoke` | `() => void` | No | Called when consent revoked |

*Either `src` or `content` is required.

### Loading Strategies

- `afterInteractive` (default) - Load after page is interactive
- `lazyOnload` - Load during idle time
- `beforeInteractive` - Load before page is interactive
