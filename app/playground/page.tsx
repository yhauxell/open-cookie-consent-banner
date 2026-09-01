import { CookieConsentDemo } from "@/components/cookie-consent-demo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Interactive Playground & Studio - OpenConsent",
  description:
    "Customize cookie consent banner layout, styling, and behavior in real-time. Test script blocking, Google Consent Mode v2 signals, and copy the shadcn CLI install command.",
  keywords: [
    "cookie consent playground",
    "cookie banner configurator",
    "shadcn cookie consent",
    "GDPR consent playground",
    "Google Consent Mode v2 preview",
  ],
  openGraph: {
    title: "Open Cookie Consent Banner - Interactive Playground",
    description: "Try the cookie consent banner component with live examples and real-time telemetry",
    type: "website",
    url: "/playground",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Open Cookie Consent Banner Playground",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Cookie Consent Banner - Interactive Playground",
    description: "Try the cookie consent banner component with live examples and real-time telemetry",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/playground",
  },
};

export default function PlaygroundPage() {
  return <CookieConsentDemo />;
}
