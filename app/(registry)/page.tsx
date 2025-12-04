import { CopyButton } from "@/components/copy-button";
import { Logo } from "@/components/logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Database,
  FileCode,
  Globe,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title:
    "Open Cookie Consent Banner - GDPR Compliant Cookie Consent for React & Next.js",
  description:
    "Install a full-featured, GDPR-compliant cookie consent solution for React and Next.js via shadcn/ui registry. Includes automatic script management, traceability, and granular consent control.",
  keywords: [
    "cookie consent",
    "GDPR compliance",
    "cookie banner",
    "shadcn ui registry",
    "React cookie consent",
    "Next.js cookie consent",
    "install cookie consent",
    "cookie consent component",
  ],
  openGraph: {
    title: "Open Cookie Consent Banner - Component Registry",
    description:
      "Install a GDPR-compliant cookie consent solution via shadcn/ui registry",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Open Cookie Consent Banner - GDPR Compliant Cookie Consent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Cookie Consent Banner - Component Registry",
    description:
      "Install a GDPR-compliant cookie consent solution via shadcn/ui registry",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/",
  },
};

const features = [
  {
    icon: Shield,
    title: "GDPR & CCPA Compliant",
    description:
      "Granular consent categories with easy withdrawal and consent versioning.",
  },
  {
    icon: Database,
    title: "Full Traceability",
    description:
      "Complete audit trail with configurable API endpoint for compliance records.",
  },
  {
    icon: FileCode,
    title: "Script Management",
    description:
      "Automatic loading and unloading of third-party scripts based on consent.",
  },
  {
    icon: Sparkles,
    title: "shadcn/ui Compatible",
    description:
      "Built with shadcn/ui primitives - Button, Dialog, Switch, Card, and more.",
  },
  {
    icon: Code2,
    title: "TypeScript First",
    description:
      "Fully typed with exported types for a great developer experience.",
  },
  {
    icon: Globe,
    title: "Hybrid Consent Scope",
    description:
      "Device-level for anonymous users, global sync for authenticated users.",
  },
];

const codeExample = `import {
  CookieConsentProvider,
  CookieBanner,
} from "@/components/cookie-consent"

export default function App({ children }) {
  return (
    <CookieConsentProvider
      config={{
        consentVersion: "1.0.0",
        privacyPolicyUrl: "/privacy",
      }}
    >
      {children}
      <CookieBanner />
    </CookieConsentProvider>
  )
}`;

export default function HomePage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const registryUrl = `${baseUrl}/r/cookie-consent.json`;
  const githubUrl = "https://github.com/yhauxell/open-cookie-consent-banner";

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]" />
        <div className="container max-w-screen-xl mx-auto px-4 py-24 md:py-32 lg:py-40">
          <div className="flex flex-col items-center text-center space-y-8">
            <Badge variant="secondary" className="px-4 py-1.5 text-sm">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              shadcn/ui Registry Compatible
            </Badge>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl">
              Cookie Consent
              <br />
              <span className="bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
                Done Right
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl">
              A full-featured, GDPR-compliant cookie consent solution for React
              and Next.js. Install via shadcn/ui registry in seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button asChild size="lg" className="gap-2">
                <Link href="/docs">
                  <BookOpen className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2">
                <Link href="/demo">
                  <Play className="h-4 w-4" />
                  View Demo
                </Link>
              </Button>
            </div>

            {/* Install Command */}
            <div className="w-full max-w-2xl mt-8">
              <div className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-zinc-600 to-zinc-400 rounded-lg blur opacity-20 group-hover:opacity-30 transition" />
                <div className="relative bg-zinc-950 text-zinc-50 rounded-lg p-4 font-mono text-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto">
                    <Terminal className="h-4 w-4 text-zinc-500 shrink-0" />
                    <code className="whitespace-nowrap">
                      npx shadcn@latest add {registryUrl}
                    </code>
                  </div>
                  <CopyButton
                    text={`npx shadcn@latest add ${registryUrl}`}
                    className="text-zinc-400 hover:text-zinc-50 shrink-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="border-t bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4 py-24">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Built for developers who care about privacy compliance and user
              experience.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-background rounded-xl border p-6 hover:border-foreground/20 transition-colors"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2.5 rounded-lg bg-muted group-hover:bg-foreground/5 transition-colors">
                    <feature.icon className="h-5 w-5 text-foreground" />
                  </div>
                  <h3 className="font-semibold">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section */}
      <section className="border-t">
        <div className="container max-w-screen-xl mx-auto px-4 py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple to integrate
              </h2>
              <p className="text-lg text-muted-foreground">
                Wrap your app with the provider, add the banner component, and
                you&apos;re done. No complex configuration needed.
              </p>
              <ul className="space-y-3">
                {[
                  "One command installation via shadcn CLI",
                  "Uses your existing shadcn/ui components",
                  "Automatic localStorage persistence",
                  "TypeScript support out of the box",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div className="p-1 rounded-full bg-green-500/10">
                      <Check className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="/docs#installation">
                    Installation Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-zinc-200 to-zinc-100 dark:from-zinc-800 dark:to-zinc-900 rounded-xl blur-xl opacity-50" />
              <div className="relative bg-zinc-950 rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                    <div className="w-3 h-3 rounded-full bg-zinc-700" />
                  </div>
                  <span className="text-xs text-zinc-500 ml-2">layout.tsx</span>
                </div>
                <pre className="p-4 text-sm text-zinc-300 overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dependencies Section */}
      <section className="border-t bg-muted/30">
        <div className="container max-w-screen-xl mx-auto px-4 py-24">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Built on shadcn/ui
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Uses the components you already have. No additional dependencies
              required.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {["button", "dialog", "switch", "card", "label", "accordion"].map(
              (dep) => (
                <Badge
                  key={dep}
                  variant="secondary"
                  className="px-4 py-2 text-sm"
                >
                  {dep}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t">
        <div className="container max-w-screen-xl mx-auto px-4 py-24">
          <div className="relative overflow-hidden rounded-2xl bg-zinc-950 text-zinc-50 p-8 md:p-12 lg:p-16">
            <div className="absolute inset-0 pointer-events-none">
              {/* vibrant blurred gradient blob */}
              <div className="absolute -top-32 -left-32 w-[480px] h-[480px] rounded-full bg-gradient-to-br from-[#fbff00] via-[#00ffe7] to-[#057aff] opacity-30 blur-3xl" />
              {/* subtle grid overlay */}
              <div className="absolute inset-0 bg-[linear-gradient(to_right,#fff1_1px,transparent_1px),linear-gradient(to_bottom,#fff1_1px,transparent_1px)] bg-[size:28px_50px]" />
            </div>
            <div className="relative flex flex-col items-center text-center space-y-6">
              <Logo className="h-12 w-12 text-zinc-400" />
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl max-w-2xl">
                Ready to add cookie consent to your app?
              </h2>
              <p className="text-zinc-400 max-w-xl">
                Get started in seconds with the shadcn CLI. Full documentation
                available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-white text-zinc-950 hover:bg-zinc-200"
                >
                  <Link href="/docs">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read the Docs
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="bg-background text-foreground hover:bg-foreground/80"
                >
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <svg
                      role="img"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 fill-foreground"
                    >
                      <title>GitHub</title>
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                    View on GitHub
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
