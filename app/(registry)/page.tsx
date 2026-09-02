import { CopyButton } from "@/components/copy-button";
import { Logo } from "@/components/logo";
import { SpotlightBackground } from "@/components/spotlight-background";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  BookOpen,
  Check,
  Code2,
  Database,
  FileCode,
  Play,
  Shield,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

// Google icon component
function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <title>Google Tag Manager</title>
      <path d="M12.003 0a3 3 0 0 0-2.121 5.121l6.865 6.865-4.446 4.541 1.745 1.836a3.432 3.432 0 0 1 .7.739l.012.011-.001.002a3.432 3.432 0 0 1 .609 1.953 3.432 3.432 0 0 1-.09.78l7.75-7.647c.031-.029.067-.05.098-.08.023-.023.038-.052.06-.076a2.994 2.994 0 0 0-.06-4.166l-9-9A2.99 2.99 0 0 0 12.003 0zM8.63 2.133L.88 9.809a2.998 2.998 0 0 0 0 4.238l7.7 7.75a3.432 3.432 0 0 1-.077-.729 3.432 3.432 0 0 1 3.431-3.431 3.432 3.432 0 0 1 .826.101l-5.523-5.81 4.371-4.373-2.08-2.08c-.903-.904-1.193-2.183-.898-3.342zm3.304 16.004a2.932 2.932 0 0 0-2.931 2.931A2.932 2.932 0 0 0 11.934 24a2.932 2.932 0 0 0 2.932-2.932 2.932 2.932 0 0 0-2.932-2.931z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Open Consent - GDPR Compliant Cookie Consent for React & Next.js",
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
    title: "Open Consent - Component Registry",
    description:
      "Install a GDPR-compliant cookie consent solution via shadcn/ui registry",
    type: "website",
    url: "/",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Open Consent - GDPR Compliant Cookie Consent",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Open Consent - Component Registry",
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
    icon: GoogleIcon,
    title: "Google Consent Mode v2",
    description:
      "Built-in Google Consent Mode v2 support. Required for EU/EEA/UK traffic as of March 2024.",
  },
  {
    icon: FileCode,
    title: "Script Management",
    description:
      "Automatic loading and unloading of third-party scripts based on consent.",
  },
  {
    icon: Sparkles,
    title: "shadcn/ui Native",
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
    icon: Database,
    title: "Full Traceability",
    description:
      "Complete audit trail with configurable API endpoint for compliance records.",
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
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://openconsent.dev";
  const registryUrl = `${baseUrl}/r/cookie-consent.json`;
  const githubUrl = "https://github.com/yhauxell/open-cookie-consent-banner";

  return (
    <div className="bg-background">
      {/* Hero Section with Grid Pattern & Ambient Ray */}
      <section className="relative isolate overflow-hidden border-b border-border/40">
        {/* Dynamic GPU-accelerated mouse follow spotlight */}
        <SpotlightBackground size={750} showGrid={true} />

        {/* Subtle grid pattern with radial top mask */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-grid-pattern mask-radial-top opacity-60 pointer-events-none" />
        
        {/* Top ambient spotlight glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[350px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none" />

        <div className="container relative z-10 max-w-screen-xl mx-auto px-4 py-24 md:py-32 lg:py-36">
          <div className="flex flex-col items-center text-center space-y-8 max-w-4xl mx-auto">
            <Badge variant="secondary" className="px-4 py-1.5 text-xs sm:text-sm border border-border/80 shadow-xs bg-muted/60 backdrop-blur-xs">
              <Zap className="h-3.5 w-3.5 mr-1.5 text-amber-500" />
              shadcn/ui Registry Compatible
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Open Consent
              <br />
              <span className="bg-gradient-to-r from-amber-400 via-pink-500 to-violet-600 bg-clip-text text-transparent animate-gradient-shift">
                Free forever. Zero lock-in.
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl text-pretty leading-relaxed">
              Consent management, open and simple. GDPR-compliant cookie consent
              with Google Consent Mode v2 built-in. Install via shadcn/ui in
              seconds.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              <Button asChild size="lg" className="gap-2 shadow-xs">
                <Link href="/docs">
                  <BookOpen className="h-4 w-4" />
                  Get Started
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="gap-2 bg-background/80 backdrop-blur-xs border-border/80">
                <Link href="/playground">
                  <Play className="h-4 w-4 text-primary" />
                  Live Playground
                </Link>
              </Button>
            </div>

            {/* Install Command Box with Precision Sheen */}
            <div className="w-full max-w-2xl mt-6">
              <div className="glow-border">
                <div className="glow-border-inner bg-zinc-950 text-zinc-50 rounded-lg p-3.5 sm:p-4 font-mono text-xs sm:text-sm flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 overflow-x-auto select-all">
                    <Terminal className="h-4 w-4 text-zinc-500 shrink-0" />
                    <code className="whitespace-nowrap font-mono">
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

      {/* Features Grid with Dot Pattern & Sheen Cards */}
      <section className="relative isolate overflow-hidden py-24 bg-muted/20 border-b border-border/40">
        <SpotlightBackground size={650} showGrid={false} />
        {/* Subtle dot matrix pattern */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-dot-pattern mask-radial-faded opacity-50 pointer-events-none" />

        <div className="container relative z-10 max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-16 space-y-3">
            <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground border-primary/20 bg-background/60">
              Architecture
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
              Everything you need
            </h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
              Built for developers who care about privacy compliance, zero vendor lock-in, and great user experience.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-sheen card-highlight group relative bg-card/80 backdrop-blur-xs rounded-xl border border-border/80 p-6 transition-all"
              >
                <div className="flex items-center gap-3.5 mb-3.5">
                  <div className="p-2.5 rounded-lg bg-muted/80 border border-border/60 group-hover:border-primary/30 group-hover:bg-primary/5 transition-colors">
                    <feature.icon className="h-5 w-5 text-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-base text-foreground">{feature.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Preview Section with IDE Window */}
      <section className="relative overflow-hidden py-24 border-b border-border/40">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-xs uppercase tracking-wider text-muted-foreground border-primary/20">
                DX First
              </Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Simple to integrate
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
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
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="p-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                      <Check className="h-3.5 w-3.5" />
                    </div>
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-4 pt-2">
                <Button asChild>
                  <Link href="/docs#installation">
                    Installation Guide
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-blue-500/10 rounded-2xl blur-xl opacity-60" />
              <div className="card-sheen relative bg-zinc-950 rounded-xl border border-zinc-800 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800/80 bg-zinc-900/60">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-500/70" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
                      <div className="w-3 h-3 rounded-full bg-green-500/70" />
                    </div>
                    <span className="text-xs font-mono text-zinc-400 ml-2">app/layout.tsx</span>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-mono text-zinc-400 border-zinc-700">
                    Next.js 16
                  </Badge>
                </div>
                <pre className="p-4 text-xs sm:text-sm font-mono text-zinc-300 overflow-x-auto leading-relaxed">
                  <code>{codeExample}</code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dependencies Section */}
      <section className="py-20 bg-muted/20 border-b border-border/40">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="text-center mb-10 space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Built on shadcn/ui
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
              Uses the components you already have. Zero proprietary runtime lock-in.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2.5 max-w-2xl mx-auto">
            {["button", "dialog", "switch", "card", "label", "accordion", "tabs", "badge"].map(
              (dep) => (
                <Badge
                  key={dep}
                  variant="secondary"
                  className="px-3.5 py-1.5 text-xs font-mono border border-border/60 bg-card/80"
                >
                  components/ui/{dep}
                </Badge>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA Section with Ambient Glow & Precision Border */}
      <section className="py-24">
        <div className="container max-w-screen-xl mx-auto px-4">
          <div className="card-sheen relative isolate overflow-hidden rounded-2xl border border-border/80 bg-card p-8 md:p-14 lg:p-16 text-center shadow-lg">
            <SpotlightBackground size={550} showGrid={true} />
            {/* Grid Pattern inside CTA */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-grid-pattern mask-radial-faded opacity-40 pointer-events-none" />
            
            {/* Dual Ambient Glow Orbs */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-6 max-w-2xl mx-auto">
              <div className="h-12 w-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                <Logo className="h-7 w-7 text-primary" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl text-foreground">
                Ready to add cookie consent to your app?
              </h2>
              <p className="text-base text-muted-foreground leading-relaxed">
                Get started in seconds with the shadcn CLI. Full documentation and customization guide available.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                <Button asChild size="lg" className="gap-2 shadow-xs">
                  <Link href="/docs">
                    <BookOpen className="h-4 w-4" />
                    Read the Docs
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="gap-2 bg-background/80 border-border/80">
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
