"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, BookOpen, Layers, ShieldCheck, Database, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CodeBlock } from "@/components/code-block";
import Link from "next/link";

export function QuickstartGuide() {
  const [copied, setCopied] = useState(false);
  const cliCommand = "npx shadcn@latest add https://openconsent.dev/r/cookie-consent.json";

  const handleCopy = async () => {
    await navigator.clipboard.writeText(cliCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const basicUsageSnippet = `import {
  CookieConsentProvider,
  CookieBanner,
  CookieSettings,
  CookieTrigger,
} from "@/components/cookie-consent"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            privacyPolicyUrl: "/privacy",
            position: "bottom",
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
      </body>
    </html>
  )
}`;

  const scriptManagerSnippet = `import { ConsentScript, useConsentScript } from "@/components/cookie-consent"

// 1. Declarative Script Component (Auto loads when Analytics is accepted)
<ConsentScript id="google-analytics" category="analytics">
  {\`window.dataLayer = window.dataLayer || []; ...\`}
</ConsentScript>

// 2. React Hook with Lifecycle Cleanup
const analytics = useConsentScript("analytics", "custom-tracker", {
  content: \`console.log("Tracker active");\`,
  onRevoke: () => {
    console.log("Cleanup on user revocation");
  },
});`;

  return (
    <div className="space-y-8">
      {/* Primary shadcn install card */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Terminal className="h-5 w-5 text-primary" />
            1. Install Component via shadcn Registry
          </CardTitle>
          <CardDescription>
            Runs against the official OpenConsent registry schema. Adds full source code into your repository.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between gap-3 bg-muted/70 border border-border p-3.5 rounded-lg font-mono text-sm">
            <div className="flex items-center gap-2 overflow-x-auto select-all">
              <span className="text-muted-foreground">$</span>
              <span className="text-foreground">{cliCommand}</span>
            </div>
            <Button
              size="sm"
              variant={copied ? "default" : "secondary"}
              onClick={handleCopy}
              className="shrink-0 gap-1.5 h-8"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  Copy Command
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Step 2: Basic Setup */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Layers className="h-5 w-5 text-primary" />
            2. Wrap Your Root Layout
          </CardTitle>
          <CardDescription>
            Add CookieConsentProvider, CookieBanner, CookieSettings, and CookieTrigger to your Next.js layout
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={basicUsageSnippet} language="tsx" />
        </CardContent>
      </Card>

      {/* Step 3: Script Management */}
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary" />
            3. Guard Third-Party Analytics & Pixels
          </CardTitle>
          <CardDescription>
            Prevent scripts from executing until user grants explicit GDPR/CCPA category permission
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock code={scriptManagerSnippet} language="tsx" />
        </CardContent>
      </Card>

      {/* Docs Footer navigation links */}
      <div className="grid gap-4 sm:grid-cols-2 pt-2">
        <Link
          href="/docs"
          className="group p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-primary" />
              Full Documentation & API Reference
            </h4>
            <p className="text-xs text-muted-foreground">Detailed guide on callbacks, hooks, and Google Consent Mode v2.</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
        </Link>

        <a
          href="https://github.com/yhauxell/open-cookie-consent-banner"
          target="_blank"
          rel="noopener noreferrer"
          className="group p-4 rounded-xl border border-border bg-card/60 hover:bg-muted/40 transition-colors flex items-center justify-between"
        >
          <div className="space-y-1">
            <h4 className="font-semibold text-sm group-hover:text-primary transition-colors flex items-center gap-1.5">
              <Database className="h-4 w-4 text-primary" />
              Database Traceability Schema
            </h4>
            <p className="text-xs text-muted-foreground">Supabase & PostgreSQL migrations for tamper-proof audit trails.</p>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}
