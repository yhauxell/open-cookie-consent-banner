# Google Consent Mode v2

OpenConsent includes built-in support for Google Consent Mode v2, which is **required** for all sites using Google Analytics, Google Ads, or other Google marketing products in the EU/EEA/UK as of March 2024.

> **⚠️ Important**: Only use Google Consent Mode if you're actually using Google Analytics, Google Ads, or other Google services. If your site doesn't use Google services, you don't need this feature.

## When Do You Need This?

**You need Google Consent Mode v2 if:**
- ✅ You use Google Analytics (GA4)
- ✅ You use Google Ads
- ✅ You use Google Tag Manager
- ✅ You use any Google marketing/analytics products

**You don't need Google Consent Mode v2 if:**
- ❌ You don't use any Google services
- ❌ You only use non-Google analytics (Plausible, PostHog, etc.)
- ❌ You don't have any tracking scripts

## Why You Need This

Without Google Consent Mode v2 (if using Google services):

- ❌ Google Ads loses remarketing data
- ❌ GA4 can't model conversions for non-consenting users
- ❌ Your Google Ads account may be suspended
- ❌ You're not compliant with Google's requirements

With OpenConsent's built-in Consent Mode v2:

- ✅ Automatic consent state updates
- ✅ Cookieless pings for non-consenting users
- ✅ Full conversion modeling
- ✅ GDPR compliant by default

## Quick Start

> **Note**: Skip this section if you don't use Google services. OpenConsent works perfectly fine without Google Consent Mode for sites that don't use Google Analytics or Google Ads.

### Step 1: Add GoogleConsentMode to Your Layout

**Only if you're using Google Analytics/Ads**, add `<GoogleConsentMode />` to your root layout (`app/layout.tsx` for Next.js App Router) **before** your gtag.js script:

```tsx
import { GoogleConsentMode } from "@/components/cookie-consent"

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        {/* This MUST be before gtag.js */}
        <GoogleConsentMode />
        
        {/* Your GA4 script */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-XXXXXX');
            `,
          }}
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
```

### Step 2: Enable in Provider Config

Enable Google Consent Mode in your `CookieConsentProvider`:

```tsx
import {
  CookieConsentProvider,
  CookieBanner,
} from "@/components/cookie-consent"

export default function App({ children }) {
  return (
    <CookieConsentProvider
      config={{
        consentVersion: "1.0.0",
        googleConsentMode: {
          enabled: true,
        },
      }}
    >
      {children}
      <CookieBanner />
    </CookieConsentProvider>
  )
}
```

That's it! OpenConsent will automatically update Google Consent Mode when users grant or revoke consent.

## How It Works

1. **Smart Detection**: `<GoogleConsentMode />` automatically detects if Google services are being used. If no Google scripts are found, it does nothing (no unnecessary initialization).
2. **Default State**: If Google services are detected, it sets all consent types to `"denied"` before gtag.js loads
3. **User Grants Consent**: When a user accepts cookies, OpenConsent automatically calls `gtag('consent', 'update', {...})` (only if `googleConsentMode.enabled: true` in config)
4. **User Revokes Consent**: If consent is revoked, OpenConsent updates the consent state back to `"denied"`

## Custom Category Mapping

By default, OpenConsent maps consent categories to Google consent types:

- `analytics` → `analytics_storage`
- `marketing` → `ad_storage`, `ad_user_data`, `ad_personalization`
- `preferences` → `functionality_storage`, `personalization_storage`
- `necessary` → `security_storage`

You can customize this mapping:

```tsx
<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    googleConsentMode: {
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
    },
  }}
>
```

## Verification

### Check Consent Mode in Browser Console

Open Chrome DevTools → Console and run:

```js
// View all consent events
dataLayer.filter(x => x[0] === 'consent')
```

You should see:
1. `['consent', 'default', {...}]` - Initial default state (all denied)
2. `['consent', 'update', {...}]` - Updated state when user grants consent

### Check in Google Tag Assistant

1. Install [Google Tag Assistant](https://tagassistant.google.com/)
2. Navigate to your site
3. Check that Consent Mode is active
4. Verify consent states update when you accept/reject cookies

## Advanced Configuration

### Custom Defaults

You can customize the default consent state:

```tsx
<GoogleConsentMode
  defaults={{
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    functionality_storage: "granted", // Always granted
    personalization_storage: "denied",
    security_storage: "granted", // Always granted
  }}
  waitForUpdate={500}
/>
```

### Region-Specific Consent

Apply consent mode only to specific regions:

```tsx
<GoogleConsentMode
  regions={["AT", "BE", "BG", "HR", "CY", "CZ", "DK", "EE", "FI", "FR", "DE", "GR", "HU", "IE", "IT", "LV", "LT", "LU", "MT", "NL", "PL", "PT", "RO", "SK", "SI", "ES", "SE"]}
/>
```

## Integration with Google Tag Manager

If you're using Google Tag Manager instead of gtag.js:

```tsx
<head>
  <GoogleConsentMode />
  <script
    dangerouslySetInnerHTML={{
      __html: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('consent', 'default', {
          'analytics_storage': 'denied',
          'ad_storage': 'denied',
          'ad_user_data': 'denied',
          'ad_personalization': 'denied',
          'wait_for_update': 500
        });
      `,
    }}
  />
  <script
    async
    src="https://www.googletagmanager.com/gtm.js?id=GTM-XXXXX"
  />
</head>
```

## Troubleshooting

### Consent Mode Not Updating

**Problem**: Consent state doesn't update when user grants consent.

**Solution**: 
1. Ensure `googleConsentMode.enabled: true` in your config
2. Check that `window.gtag` exists (gtag.js must be loaded)
3. Verify `<GoogleConsentMode />` is in `<head>` before gtag.js

### Default State Not Set

**Problem**: Default consent state isn't being set.

**Solution**:
1. Ensure `<GoogleConsentMode />` is rendered before gtag.js
2. Check browser console for errors
3. Verify the component is in `<head>`, not `<body>`

### Scripts Loading Before Consent

**Problem**: GA4 scripts load even when consent is denied.

**Solution**:
1. Use `ConsentScript` component to conditionally load gtag.js
2. Or manually check consent before initializing GA4

## Best Practices

1. **Always set defaults to "denied"** - This ensures GDPR compliance
2. **Place GoogleConsentMode before gtag.js** - Order matters!
3. **Test consent revocation** - Verify scripts unload correctly
4. **Monitor in Google Analytics** - Check that conversion modeling is working
5. **Use ConsentScript for GA4** - Let OpenConsent manage script loading

## Example: Complete GA4 Integration

```tsx
// app/layout.tsx
import {
  CookieConsentProvider,
  CookieBanner,
  GoogleConsentMode,
  ConsentScript,
} from "@/components/cookie-consent"

export default function RootLayout({ children }) {
  return (
    <html>
      <head>
        <GoogleConsentMode />
      </head>
      <body>
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            googleConsentMode: {
              enabled: true,
            },
          }}
        >
          {children}
          <CookieBanner />
          
          {/* GA4 - only loads with analytics consent */}
          <ConsentScript
            id="ga4"
            src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXX"
            category="analytics"
            onLoad={() => {
              window.dataLayer = window.dataLayer || []
              function gtag(...args: unknown[]) {
                window.dataLayer.push(args)
              }
              gtag("js", new Date())
              gtag("config", "G-XXXXXX")
            }}
            onRevoke={() => {
              // Cleanup handled automatically by OpenConsent
            }}
          />
        </CookieConsentProvider>
      </body>
    </html>
  )
}
```

## Resources

- [Google Consent Mode v2 Documentation](https://developers.google.com/tag-platform/security/guides/consent)
- [Google Consent Mode Overview](https://support.google.com/analytics/answer/9976101)
- [GDPR Compliance Guide](./README.md)
