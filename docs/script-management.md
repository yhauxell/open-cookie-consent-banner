# Script Management

The cookie consent library provides multiple ways to manage third-party scripts based on user consent.

## Overview

When a user grants or revokes consent, scripts are automatically:

- **Loaded** when consent is granted
- **Unloaded** when consent is revoked (including cleanup of cookies/globals)

## Method 1: ConsentScript Component

The simplest approach - declare scripts in your JSX:

\`\`\`tsx
import { ConsentScript } from "@/components/cookie-consent"

export default function Layout({ children }) {
  return (
    <>
      {children}

      {/* Google Analytics */}
      <ConsentScript
        id="gtag"
        src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"
        category="analytics"
        onLoad={() => {
          window.dataLayer = window.dataLayer || []
          function gtag(...args) {
            window.dataLayer.push(args)
          }
          gtag("js", new Date())
          gtag("config", "G-XXXXXX")
        }}
      />

      {/* Facebook Pixel */}
      <ConsentScript
        id="facebook-pixel"
        category="marketing"
        content={`
          !function(f,b,e,v,n,t,s){...}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', 'PIXEL_ID');
          fbq('track', 'PageView');
        `}
        onRevoke={() => {
          // Clean up FB cookies
          document.cookie.split(";").forEach((c) => {
            if (c.trim().startsWith("_fb")) {
              document.cookie = c.split("=")[0] + 
                "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=." + 
                window.location.hostname
            }
          })
        }}
      />
    </>
  )
}
\`\`\`

## Method 2: useConsentScript Hook

For more control over the loading process:

\`\`\`tsx
import { useConsentScript } from "@/components/cookie-consent"

function HotjarWidget() {
  const { isLoaded, isLoading, hasConsent, error } = useConsentScript({
    id: "hotjar",
    category: "analytics",
    content: `
      (function(h,o,t,j,a,r){
        h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
        h._hjSettings={hjid:SITE_ID,hjsv:6};
        // ...
      })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
    `,
    onRevoke: () => {
      delete window.hj
      delete window._hjSettings
    },
  })

  if (error) {
    console.error("Failed to load Hotjar:", error)
  }

  return null // Script loads in background
}
\`\`\`

## Method 3: onConsentChange Callback

Handle consent changes globally:

\`\`\`tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    onConsentChange: ({ grantedCategories, revokedCategories }) => {
      // Handle granted categories
      if (grantedCategories.includes("analytics")) {
        loadGoogleAnalytics()
      }

      // Handle revoked categories
      if (revokedCategories.includes("analytics")) {
        disableGoogleAnalytics()
        clearAnalyticsCookies()
      }

      if (revokedCategories.includes("marketing")) {
        disableFacebookPixel()
        clearMarketingCookies()
      }
    },
  }}
>
\`\`\`

## Method 4: Manual Consent Checks

Check consent in your own logic:

\`\`\`tsx
import { useCookieConsent } from "@/components/cookie-consent"

function AnalyticsProvider({ children }) {
  const { hasConsent } = useCookieConsent()

  useEffect(() => {
    if (hasConsent("analytics")) {
      // Initialize your analytics
      analytics.init()
    } else {
      // Disable analytics
      analytics.disable()
    }
  }, [hasConsent])

  return <>{children}</>
}
\`\`\`

## Built-in Cleanup Helpers

The library provides cleanup helpers for common scripts:

\`\`\`tsx
import { scriptCleanupHelpers } from "@/components/cookie-consent"

// Use in onRevoke callbacks
<ConsentScript
  id="google-analytics"
  src="..."
  category="analytics"
  onRevoke={scriptCleanupHelpers.googleAnalytics}
/>

<ConsentScript
  id="facebook-pixel"
  content="..."
  category="marketing"
  onRevoke={scriptCleanupHelpers.facebookPixel}
/>
\`\`\`

### Available Helpers

| Helper | Description |
|--------|-------------|
| `googleAnalytics()` | Clears `_ga*` cookies, removes `gtag` and `dataLayer` |
| `facebookPixel()` | Clears `_fb*` cookies, removes `fbq` |

## Common Third-Party Scripts

### Google Tag Manager

\`\`\`tsx
<ConsentScript
  id="gtm"
  category="analytics"
  content={`
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','GTM-XXXXX');
  `}
/>
\`\`\`

### Intercom

\`\`\`tsx
<ConsentScript
  id="intercom"
  src="https://widget.intercom.io/widget/APP_ID"
  category="preferences"
  onLoad={() => {
    window.Intercom("boot", {
      app_id: "APP_ID",
      // user data...
    })
  }}
  onRevoke={() => {
    window.Intercom?.("shutdown")
    delete window.Intercom
    delete window.intercomSettings
  }}
/>
\`\`\`

### HubSpot

\`\`\`tsx
<ConsentScript
  id="hubspot"
  src="//js.hs-scripts.com/PORTAL_ID.js"
  category="marketing"
  attributes={{ id: "hs-script-loader", defer: "true" }}
  onRevoke={() => {
    delete window.HubSpotConversations
    delete window._hsq
  }}
/>
```

### PostHog

For dual-mode cookieless vs persistent telemetry, see the dedicated [PostHog Integration Guide](./posthog-integration.md).

### Meta (Facebook) Pixel (React / Next.js Component)

For Next.js App Router applications, you can gate the Meta Pixel behind `hasConsent("marketing")`:

```tsx
"use client";

import { useCookieConsent } from "@/components/cookie-consent";
import Script from "next/script";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

export function MetaPixelProvider() {
  const { hasConsent } = useCookieConsent();
  const marketingConsent = hasConsent("marketing");

  if (!META_PIXEL_ID || !marketingConsent) {
    return null;
  }

  return (
    <>
      <Script
        id="meta-pixel"
        strategy="lazyOnload"
        dangerouslySetInnerHTML={{
          __html: `
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${META_PIXEL_ID}');
            fbq('track', 'PageView');
          `,
        }}
      />
      <noscript>
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
```

## Best Practices

1. **Always provide `onRevoke`** - Clean up cookies, globals, and event listeners
2. **Use unique `id`s** - Prevents duplicate script loading
3. **Test revocation** - Verify cleanup works correctly
4. **Consider loading strategy** - Use `lazyOnload` for non-critical scripts
5. **Handle errors** - Provide `onError` callbacks for critical scripts
