import { CodeBlock } from "@/components/code-block";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  BookOpen,
  Code,
  Database,
  ExternalLink,
  FileCode,
  GitBranch,
  Hash,
  Layout,
  Play,
  Settings,
  Shield,
  Terminal,
  Zap,
} from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

// Code examples
const quickInstallCode = (url: string) => `npx shadcn@latest add ${url}`;

const basicSetupCode = `import {
  CookieConsentProvider,
  CookieBanner,
  CookieSettings,
  CookieTrigger,
} from "@/components/cookie-consent"

export default function App({ children }) {
  return (
    <CookieConsentProvider
      config={{
        consentVersion: "1.0.0",
        privacyPolicyUrl: "/privacy",
        traceability: {
          enabled: true,
          endpoint: "/api/consent",
        },
      }}
    >
      {children}
      <CookieBanner />
      <CookieSettings />
      <CookieTrigger />
    </CookieConsentProvider>
  )
}`;

const providerCode = `<CookieConsentProvider config={config}>
  {children}
</CookieConsentProvider>`;

const bannerCode = `<CookieBanner className="custom-class" />`;

const settingsCode = `<CookieSettings className="custom-class" />`;

const triggerCode = `// Default
<CookieTrigger />

// Custom text
<CookieTrigger>Manage Cookies</CookieTrigger>

// As a link
<CookieTrigger asChild>
  <a href="#">Cookie Preferences</a>
</CookieTrigger>`;

const consentScriptCode = `<ConsentScript
  id="google-analytics"
  src="https://www.googletagmanager.com/gtag/js?id=GA_ID"
  category="analytics"
  onLoad={() => console.log("GA loaded")}
  onRevoke={() => {
    // Clean up GA cookies
  }}
/>`;

const useCookieConsentCode = `const {
  state,
  isBannerVisible,
  isSettingsOpen,
  acceptAll,
  rejectAll,
  updateConsent,
  openSettings,
  closeSettings,
  hasConsent,
  resetConsent,
} = useCookieConsent()`;

const useConsentValueCode = `const hasAnalyticsConsent = useConsentValue("analytics")

useEffect(() => {
  if (hasAnalyticsConsent) {
    initializeGA()
  }
}, [hasAnalyticsConsent])`;

const useConsentScriptCode = `const { isLoaded, isLoading, hasConsent, error } = 
  useConsentScript({
    id: "intercom",
    src: "https://widget.intercom.io/widget/APP_ID",
    category: "preferences",
  })`;

const googleAnalyticsCode = `<ConsentScript
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
/>`;

const facebookPixelCode = `<ConsentScript
  id="facebook-pixel"
  category="marketing"
  content={\`
    fbq('init', 'PIXEL_ID');
    fbq('track', 'PageView');
  \`}
  onRevoke={() => {
    // Clean up FB cookies
  }}
/>`;

const traceabilityCode = `<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    traceability: {
      enabled: true,
      endpoint: "/api/consent",
      headers: {
        "X-API-Key": process.env.NEXT_PUBLIC_API_KEY,
      },
      retryOnFailure: true,
      maxRetries: 3,
      onSuccess: (record) => {
        console.log("Consent recorded:", record.consentId)
      },
    },
  }}
>`;

const migrationsCode = `# With Supabase CLI
supabase db push

# Or run directly in SQL editor
# Copy contents of migrations/*.sql`;

const fileStructureCode = `cookie-consent-banner/
├── app/                    # Next.js app directory
│   ├── (registry)/         # Registry UI page
│   ├── demo/               # Demo page
│   ├── docs/               # Documentation page
│   └── r/                  # Registry API routes
├── components/
│   ├── cookie-consent/     # Main component library
│   │   ├── cookie-banner.tsx
│   │   ├── cookie-provider.tsx
│   │   ├── cookie-settings.tsx
│   │   ├── cookie-trigger.tsx
│   │   ├── consent-script.tsx
│   │   ├── use-cookie-consent.ts
│   │   └── types.ts
│   └── ui/                 # shadcn/ui components
├── docs/                   # Markdown documentation
├── migrations/             # Database migrations
├── public/
│   └── r/                  # Generated registry files
└── scripts/                # Build scripts`;

export const metadata: Metadata = {
  title: "Documentation - Open Cookie Consent Banner",
  description:
    "Complete documentation for the Open Cookie Consent Banner. Learn how to install, configure, and customize the GDPR-compliant cookie consent solution for React and Next.js.",
  keywords: [
    "cookie consent documentation",
    "GDPR cookie banner docs",
    "React cookie consent guide",
    "Next.js cookie consent tutorial",
    "shadcn cookie consent",
  ],
  openGraph: {
    title: "Documentation - Open Cookie Consent Banner",
    description:
      "Complete documentation for the GDPR-compliant cookie consent solution",
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Open Cookie Consent Banner Documentation",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Documentation - Open Cookie Consent Banner",
    description:
      "Complete documentation for the GDPR-compliant cookie consent solution",
    images: ["/twitter-image"],
  },
  alternates: {
    canonical: "/docs",
  },
};

const sections = [
  { id: "getting-started", label: "Getting Started", icon: Play },
  { id: "installation", label: "Installation", icon: Terminal },
  { id: "configuration", label: "Configuration", icon: Settings },
  { id: "components", label: "Components", icon: Layout },
  { id: "hooks", label: "Hooks", icon: Code },
  { id: "script-management", label: "Script Management", icon: FileCode },
  { id: "traceability", label: "Traceability", icon: Shield },
  { id: "database", label: "Database Schema", icon: Database },
  { id: "file-structure", label: "File Structure", icon: GitBranch },
];

export default function DocsPage() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const registryUrl = `${baseUrl}/r/cookie-consent.json`;
  const githubUrl = "https://github.com/yhauxell/open-cookie-consent-banner";

  return (
    <div className="bg-background">
      <div className="container max-w-screen-2xl px-4">
        <div className="flex-1 md:grid md:grid-cols-[220px_1fr] md:gap-6 lg:grid-cols-[240px_1fr] lg:gap-10">
          {/* Sidebar */}
          <aside className="fixed top-16 z-30 hidden h-[calc(100vh-4rem)] w-full shrink-0 overflow-y-auto border-r py-6 pr-2 md:sticky md:block lg:py-8">
            <nav className="grid items-start gap-2">
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
                >
                  <section.icon className="h-4 w-4" />
                  {section.label}
                </a>
              ))}
              <Separator className="my-4" />
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                <ExternalLink className="h-4 w-4" />
                GitHub
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="relative py-6 lg:gap-10 lg:py-8">
            <div className="mx-auto w-full min-w-0 max-w-3xl">
              {/* Hero */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="secondary">v0.1.0</Badge>
                  <Badge variant="outline">MIT License</Badge>
                </div>
                <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
                  Documentation
                </h1>
                <p className="mt-4 text-xl text-muted-foreground">
                  A full-featured, GDPR-compliant cookie consent solution with
                  traceability support, distributed via{" "}
                  <a
                    href="https://ui.shadcn.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-foreground underline underline-offset-4"
                  >
                    shadcn/ui
                  </a>{" "}
                  registry.
                </p>
              </div>

              {/* Quick Links */}
              <div className="grid gap-4 md:grid-cols-3 mb-12">
                <Card className="group cursor-pointer transition-colors hover:border-foreground/20">
                  <Link href="/demo">
                    <CardHeader className="pb-2">
                      <Play className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <CardTitle className="text-lg">Try Demo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Interactive demo of the cookie consent banner
                      </p>
                    </CardContent>
                  </Link>
                </Card>
                <Card className="group cursor-pointer transition-colors hover:border-foreground/20">
                  <a
                    href={registryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <CardHeader className="pb-2">
                      <BookOpen className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <CardTitle className="text-lg">Registry JSON</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        View the component registry file
                      </p>
                    </CardContent>
                  </a>
                </Card>
                <Card className="group cursor-pointer transition-colors hover:border-foreground/20">
                  <a href={githubUrl} target="_blank" rel="noopener noreferrer">
                    <CardHeader className="pb-2">
                      <Code className="h-8 w-8 mb-2 text-muted-foreground group-hover:text-foreground transition-colors" />
                      <CardTitle className="text-lg">Source Code</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        Browse the source on GitHub
                      </p>
                    </CardContent>
                  </a>
                </Card>
              </div>

              {/* Getting Started */}
              <section id="getting-started" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Getting Started
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Get up and running with the Open Cookie Consent Banner in
                  minutes. This component is distributed via the shadcn/ui
                  registry system for easy installation.
                </p>
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      Quick Install
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CodeBlock
                      code={quickInstallCode(registryUrl)}
                      language="bash"
                      filename="terminal"
                    />
                    <p className="text-sm text-muted-foreground mt-3">
                      This command will install all necessary files and
                      dependencies automatically.
                    </p>
                  </CardContent>
                </Card>
                <div className="bg-muted/50 border rounded-lg p-4">
                  <p className="text-sm">
                    <strong>Note:</strong> This project is open source for
                    transparency and community contributions. The primary way to
                    use this component is through the shadcn/ui registry.
                  </p>
                </div>
              </section>

              {/* Installation */}
              <section id="installation" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Installation
                  </h2>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Via Registry (Recommended)
                </h3>
                <div className="mb-4">
                  <CodeBlock
                    code={quickInstallCode(registryUrl)}
                    language="bash"
                    filename="terminal"
                  />
                </div>
                <p className="text-muted-foreground mb-8">
                  The registry automatically includes all necessary files and
                  dependencies.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Manual Installation
                </h3>
                <p className="text-muted-foreground mb-4">
                  If you want to fork, customize, or contribute to the project:
                </p>
                <ol className="list-decimal list-inside space-y-3 text-muted-foreground">
                  <li>Clone the repository from GitHub</li>
                  <li>
                    Copy the{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm">
                      components/cookie-consent
                    </code>{" "}
                    directory to your project
                  </li>
                  <li>Install required shadcn/ui components:</li>
                </ol>
                <div className="mt-4">
                  <CodeBlock
                    code="npx shadcn@latest add button dialog switch card label accordion"
                    language="bash"
                    filename="terminal"
                  />
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Dependencies
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "button",
                    "dialog",
                    "switch",
                    "card",
                    "label",
                    "accordion",
                  ].map((dep) => (
                    <Badge key={dep} variant="outline">
                      {dep}
                    </Badge>
                  ))}
                </div>
              </section>

              {/* Configuration */}
              <section id="configuration" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Configuration
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Wrap your app with{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm">
                    CookieConsentProvider
                  </code>{" "}
                  and configure the banner behavior.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Basic Setup</h3>
                <CodeBlock
                  code={basicSetupCode}
                  language="tsx"
                  filename="app/layout.tsx"
                  showLineNumbers
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Configuration Options
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-semibold">
                          Option
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Type
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Default
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">
                            consentVersion
                          </code>
                        </td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">Required</td>
                        <td className="py-3 px-4">
                          Version of your privacy policy
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">
                            expirationDays
                          </code>
                        </td>
                        <td className="py-3 px-4">number</td>
                        <td className="py-3 px-4">365</td>
                        <td className="py-3 px-4">
                          Days until consent expires
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">
                            privacyPolicyUrl
                          </code>
                        </td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">-</td>
                        <td className="py-3 px-4">Link to privacy policy</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">position</code>
                        </td>
                        <td className="py-3 px-4">string</td>
                        <td className="py-3 px-4">&quot;bottom&quot;</td>
                        <td className="py-3 px-4">Banner position</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">traceability</code>
                        </td>
                        <td className="py-3 px-4">object</td>
                        <td className="py-3 px-4">-</td>
                        <td className="py-3 px-4">Audit trail configuration</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Banner Positions
                </h3>
                <div className="flex flex-wrap gap-2">
                  {["bottom", "top", "bottom-left", "bottom-right"].map(
                    (pos) => (
                      <Badge key={pos} variant="secondary">
                        {pos}
                      </Badge>
                    )
                  )}
                </div>
              </section>

              {/* Components */}
              <section id="components" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Components
                  </h2>
                </div>

                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>CookieConsentProvider</CardTitle>
                      <CardDescription>
                        Context provider that manages consent state. Must wrap
                        your application.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={providerCode} language="tsx" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>CookieBanner</CardTitle>
                      <CardDescription>
                        The main consent banner displayed to users who
                        haven&apos;t consented.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={bannerCode} language="tsx" />
                      <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                        <p>
                          ✓ Animated entrance/exit • ✓ Accept All / Reject All /
                          Customize
                        </p>
                        <p>
                          ✓ Privacy policy link • ✓ Responsive design • ✓
                          Accessible
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>CookieSettings</CardTitle>
                      <CardDescription>
                        Modal dialog for granular consent preferences.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock code={settingsCode} language="tsx" />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>CookieTrigger</CardTitle>
                      <CardDescription>
                        Button/link to reopen settings after consent has been
                        given.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        code={triggerCode}
                        language="tsx"
                        showLineNumbers
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>ConsentScript</CardTitle>
                      <CardDescription>
                        Declarative component for loading scripts based on
                        consent.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        code={consentScriptCode}
                        language="tsx"
                        showLineNumbers
                      />
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Hooks */}
              <section id="hooks" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">Hooks</h2>
                </div>

                <div className="space-y-8">
                  <Card>
                    <CardHeader>
                      <CardTitle>useCookieConsent</CardTitle>
                      <CardDescription>
                        Main hook for accessing consent state and actions.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        code={useCookieConsentCode}
                        language="tsx"
                        filename="use-cookie-consent.ts"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>useConsentValue</CardTitle>
                      <CardDescription>
                        Check if a specific category has consent.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        code={useConsentValueCode}
                        language="tsx"
                        showLineNumbers
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>useConsentScript</CardTitle>
                      <CardDescription>
                        Programmatically manage script loading based on consent.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <CodeBlock
                        code={useConsentScriptCode}
                        language="tsx"
                        showLineNumbers
                      />
                    </CardContent>
                  </Card>
                </div>
              </section>

              {/* Script Management */}
              <section id="script-management" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Script Management
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Automatically load and unload third-party scripts based on
                  user consent.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Google Analytics
                </h3>
                <CodeBlock
                  code={googleAnalyticsCode}
                  language="tsx"
                  filename="analytics.tsx"
                  showLineNumbers
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Facebook Pixel
                </h3>
                <CodeBlock
                  code={facebookPixelCode}
                  language="tsx"
                  filename="marketing.tsx"
                  showLineNumbers
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Best Practices
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Always provide{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm">
                      onRevoke
                    </code>{" "}
                    - Clean up cookies, globals, and event listeners
                  </li>
                  <li>
                    Use unique{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm">
                      id
                    </code>
                    s - Prevents duplicate script loading
                  </li>
                  <li>Test revocation - Verify cleanup works correctly</li>
                  <li>
                    Use{" "}
                    <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm">
                      lazyOnload
                    </code>{" "}
                    for non-critical scripts
                  </li>
                </ul>
              </section>

              {/* Traceability */}
              <section id="traceability" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Traceability
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  Consent traceability is essential for GDPR compliance. Every
                  consent action generates a record that can be sent to your
                  backend API.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">Setup</h3>
                <CodeBlock
                  code={traceabilityCode}
                  language="tsx"
                  filename="app/layout.tsx"
                  showLineNumbers
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Consent Record Structure
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-semibold">
                          Field
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">visitorId</code>
                        </td>
                        <td className="py-3 px-4">
                          Device-level unique identifier
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">consentId</code>
                        </td>
                        <td className="py-3 px-4">
                          Unique ID for this consent action
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">categories</code>
                        </td>
                        <td className="py-3 px-4">
                          Object with category consent states
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">action</code>
                        </td>
                        <td className="py-3 px-4">
                          accept_all | reject_all | custom | update
                        </td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">timestamp</code>
                        </td>
                        <td className="py-3 px-4">
                          ISO 8601 when consent was given
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  GDPR Compliance Checklist
                </h3>
                <div className="space-y-2 text-muted-foreground">
                  <p>✓ Record timestamp of consent</p>
                  <p>✓ Record what was consented to (categories)</p>
                  <p>✓ Record consent version (policy version)</p>
                  <p>✓ Unique identifier per consent action</p>
                  <p>✓ Link to device/user for withdrawal requests</p>
                  <p>✓ Store page URL where consent was given</p>
                </div>
              </section>

              {/* Database */}
              <section id="database" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    Database Schema
                  </h2>
                </div>
                <p className="text-muted-foreground mb-6">
                  The migrations are located in the{" "}
                  <code className="bg-muted px-1.5 py-0.5 rounded text-foreground text-sm">
                    migrations/
                  </code>{" "}
                  directory and are compatible with Supabase CLI.
                </p>

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  Running Migrations
                </h3>
                <CodeBlock
                  code={migrationsCode}
                  language="bash"
                  filename="terminal"
                />

                <h3 className="text-xl font-semibold mt-8 mb-4">
                  consent_records Table
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="py-3 px-4 text-left font-semibold">
                          Column
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Type
                        </th>
                        <th className="py-3 px-4 text-left font-semibold">
                          Description
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">id</code>
                        </td>
                        <td className="py-3 px-4">uuid</td>
                        <td className="py-3 px-4">Primary key</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">visitor_id</code>
                        </td>
                        <td className="py-3 px-4">text</td>
                        <td className="py-3 px-4">Device-level identifier</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">consent_id</code>
                        </td>
                        <td className="py-3 px-4">uuid</td>
                        <td className="py-3 px-4">Unique consent action ID</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">categories</code>
                        </td>
                        <td className="py-3 px-4">jsonb</td>
                        <td className="py-3 px-4">Consent categories object</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-3 px-4">
                          <code className="text-foreground">timestamp</code>
                        </td>
                        <td className="py-3 px-4">timestamptz</td>
                        <td className="py-3 px-4">When consent was given</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </section>

              {/* File Structure */}
              <section id="file-structure" className="mb-16 scroll-mt-20">
                <div className="flex items-center gap-2 mb-4">
                  <Hash className="h-5 w-5 text-muted-foreground" />
                  <h2 className="text-2xl font-bold tracking-tight">
                    File Structure
                  </h2>
                </div>
                <CodeBlock
                  code={fileStructureCode}
                  language="text"
                  filename="project structure"
                />
              </section>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
