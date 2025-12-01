import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

const baseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ||
  "https://cookie-consent-banner-sandy.vercel.app";
const siteName = "Open Cookie Consent Banner";
const description =
  "A full-featured, GDPR-compliant cookie consent solution for React and Next.js. Install via shadcn/ui registry with automatic script management, traceability, and granular consent control.";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${siteName} - GDPR Compliant Cookie Consent for React & Next.js`,
    template: `%s | ${siteName}`,
  },
  description,
  keywords: [
    "cookie consent",
    "GDPR compliance",
    "CCPA compliance",
    "cookie banner",
    "privacy consent",
    "consent management",
    "React cookie consent",
    "Next.js cookie consent",
    "shadcn ui",
    "cookie consent component",
    "privacy policy",
    "cookie banner React",
    "GDPR cookie banner",
    "consent tracking",
    "script management",
    "cookie consent library",
    "TypeScript cookie consent",
    "Tailwind CSS cookie consent",
  ],
  authors: [{ name: "Open Cookie Consent Banner Team" }],
  creator: "Open Cookie Consent Banner",
  publisher: "Open Cookie Consent Banner",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl,
    siteName,
    title: `${siteName} - GDPR Compliant Cookie Consent`,
    description,
    images: [
      {
        url: `${baseUrl}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteName} - GDPR Compliant Cookie Consent`,
    description,
    creator: "@cookieconsent",
    images: [`${baseUrl}/twitter-image`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  category: "technology",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  verification: {
    // Add your verification codes here when available
    // google: 'your-google-verification-code',
    // yandex: 'your-yandex-verification-code',
    // bing: 'your-bing-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL ||
    "https://cookie-consent-banner-sandy.vercel.app";

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Open Cookie Consent Banner",
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    description,
    url: baseUrl,
    author: {
      "@type": "Organization",
      name: "Open Cookie Consent Banner",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "5",
      ratingCount: "1",
    },
    keywords: "cookie consent, GDPR, CCPA, privacy, React, Next.js, shadcn ui",
    softwareVersion: "0.1.0",
    license: "https://opensource.org/licenses/MIT",
  };

  return (
    <html lang="en">
      <body className={`font-sans antialiased`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
