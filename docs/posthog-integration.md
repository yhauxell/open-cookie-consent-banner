# PostHog Integration Guide

This guide explains how to integrate **PostHog** with **Open Cookie Consent Banner** in a GDPR-compliant way using a hybrid, dual-mode privacy architecture.

## Overview

When building analytics for EU/EEA/GDPR compliance:

1. **Before consent is given (or if analytics consent is rejected):**
   - Use in-memory persistence (`persistence: "memory"`), meaning no cookies or `localStorage` identifiers are saved to the user's device across sessions.
   - Enforce strict session recording privacy controls (mask all inputs and text selectors).
   - Cookieless telemetry still functions for baseline aggregated event counts without violating user privacy.

2. **After analytics consent is granted:**
   - Dynamically reconfigure PostHog persistence to `localStorage+cookie`.
   - Enable full session recording and persistent cross-session user journey analytics.

---

## Next.js Implementation

### 1. Install Dependencies

```bash
pnpm add posthog-js
```

### 2. Create the PostHog Provider (`cs-posthog-provider.tsx`)

Create a client component that listens to `useCookieConsent()` from Open Cookie Consent Banner:

```tsx
"use client";

import { useEffect } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useCookieConsent } from "@/components/cookie-consent";

if (typeof window !== "undefined") {
  const host =
    process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";
  
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
    api_host: host,
    ui_host: host,
    person_profiles: "identified_only",
    persistence: "memory", // Start in memory (cookieless) by default
    opt_out_capturing_by_default: false,
    session_recording: {
      maskAllInputs: true,
      maskTextSelector: "*",
    },
  });
}

export function CSPostHogProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user?: { id: string; email?: string; name?: string } | null;
}) {
  const { hasConsent } = useCookieConsent();
  const analyticsConsent = hasConsent("analytics");

  // React dynamically to consent changes
  useEffect(() => {
    if (analyticsConsent) {
      // User consented to persistent analytics cookies
      posthog.set_config({
        persistence: "localStorage+cookie",
        session_recording: {
          maskAllInputs: true,
        },
      });
      posthog.opt_in_capturing();
      posthog.startSessionRecording();
    } else {
      // User declined or hasn't accepted cookies: fall back to in-memory mode
      posthog.set_config({
        persistence: "memory",
        session_recording: {
          maskAllInputs: true,
          maskTextSelector: "*",
        },
      });
      posthog.opt_in_capturing();
      posthog.startSessionRecording();
    }
  }, [analyticsConsent]);

  // Sync user identification
  useEffect(() => {
    if (user?.id) {
      posthog.identify(user.id, {
        email: user.email,
        name: user.name,
      });
    } else {
      posthog.reset();
    }
  }, [user]);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

### 3. Add to Root Layout

Wrap your application inside `<CookieConsentProvider>`:

```tsx
import {
  CookieConsentProvider,
  CookieBanner,
  CookieSettings,
} from "@/components/cookie-consent";
import { CSPostHogProvider } from "@/providers/cs-posthog-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            privacyPolicyUrl: "/privacy",
          }}
        >
          <CSPostHogProvider>
            {children}
          </CSPostHogProvider>
          <CookieBanner />
          <CookieSettings />
        </CookieConsentProvider>
      </body>
    </html>
  );
}
```

---

## Best Practices

1. **Never persist cookies before consent:** Always initialize with `persistence: "memory"`.
2. **Mask sensitive inputs:** Ensure `maskAllInputs: true` in your `session_recording` config.
3. **Listen to consent events:** Use `hasConsent("analytics")` so when the user updates preferences via the `CookieSettings` modal, PostHog dynamically switches storage modes in real-time.
