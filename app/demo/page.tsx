import { CookieConsentDemo } from "@/components/cookie-consent-demo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Open Cookie Consent Banner - Interactive Demo",
  description:
    "Try the cookie consent banner component with live examples. See how it handles consent management, script loading, and user preferences in real-time.",
  keywords: [
    "cookie consent demo",
    "cookie banner demo",
    "GDPR consent example",
    "cookie consent preview",
    "try cookie consent",
  ],
  openGraph: {
    title: "Open Cookie Consent Banner - Interactive Demo",
    description: "Try the cookie consent banner component with live examples",
    type: "website",
  },
  alternates: {
    canonical: "/demo",
  },
};

export default function DemoPage() {
  return <CookieConsentDemo />;
}
