import { Metadata } from "next"
import { CookieConsentDemo } from "@/components/cookie-consent-demo"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ExternalLink, Code } from "lucide-react"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Cookie Consent Banner - Component Registry",
  description: "Install a full-featured, GDPR-compliant cookie consent solution for React and Next.js via shadcn/ui registry. Includes automatic script management, traceability, and granular consent control.",
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
    title: "Cookie Consent Banner - Component Registry",
    description: "Install a GDPR-compliant cookie consent solution via shadcn/ui registry",
    type: "website",
  },
  alternates: {
    canonical: "/",
  },
}

export default function RegistryPage() {
  // In production, this should be your actual domain
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const registryUrl = `${baseUrl}/r/cookie-consent.json`

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl mx-auto py-12 px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Cookie Consent Banner</h1>
          <p className="text-lg text-muted-foreground">
            A full-featured, GDPR-compliant cookie consent solution with traceability support
          </p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Installation</CardTitle>
              <CardDescription>Add this component to your project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Using shadcn CLI</p>
                <div className="bg-muted rounded-md p-3 font-mono text-sm">
                  <code>npx shadcn@latest add {registryUrl}</code>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium mb-2">Registry URL</p>
                <div className="bg-muted rounded-md p-3 font-mono text-sm break-all">
                  <code>{registryUrl}</code>
                </div>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <a href={registryUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Registry JSON
                  </a>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href="/demo">
                    <Code className="h-4 w-4 mr-2" />
                    View Demo
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
              <CardDescription>What this component provides</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">GDPR</Badge>
                  <span>GDPR & CCPA compliant</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">Traceability</Badge>
                  <span>Full audit trail with API endpoint</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">Scripts</Badge>
                  <span>Automatic script loading/unloading</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">Categories</Badge>
                  <span>Granular category control</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">Storage</Badge>
                  <span>Persistent localStorage</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Badge variant="secondary" className="text-xs">Scope</Badge>
                  <span>Device and global consent modes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Component Preview</CardTitle>
            <CardDescription>Interactive demo of the cookie consent banner</CardDescription>
          </CardHeader>
          <CardContent>
            <CookieConsentDemo />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dependencies</CardTitle>
            <CardDescription>Required shadcn/ui components</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {["button", "dialog", "switch", "card", "label", "accordion"].map((dep) => (
                <Badge key={dep} variant="outline">
                  {dep}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

