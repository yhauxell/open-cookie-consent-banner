"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Code2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import type { BannerPosition } from "@/components/cookie-consent/types";

interface CodeExportCardProps {
  position: BannerPosition;
  radiusClass: string;
  hasBackdrop: boolean;
}

export function CodeExportCard({ position, radiusClass, hasBackdrop }: CodeExportCardProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  const cliCommand = "npx shadcn@latest add https://openconsent.dev/r/cookie-consent.json";

  const handleCopyCli = async () => {
    await navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  const generatedSnippet = `import {
  CookieConsentProvider,
  CookieBanner,${hasBackdrop ? "\n  CookieBannerBackdrop," : ""}
  CookieSettings,
  CookieTrigger,
} from "@/components/cookie-consent"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <CookieConsentProvider
      config={{
        consentVersion: "1.0.0",
        position: "${position}",
        privacyPolicyUrl: "/privacy",
        traceability: {
          enabled: true,
          endpoint: "/api/consent",
        },
      }}
    >
      {children}${hasBackdrop ? "\n      <CookieBannerBackdrop />" : ""}
      <CookieBanner${radiusClass !== "rounded-lg" ? ` className="${radiusClass}"` : ""} />
      <CookieSettings />
      <CookieTrigger />
    </CookieConsentProvider>
  )
}`;

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <Terminal className="h-5 w-5 text-primary" />
              Installation & Code Export
            </CardTitle>
            <CardDescription>
              Install directly via shadcn CLI or copy the customized component configuration
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Primary shadcn CLI command highlight */}
        <div className="flex items-center justify-between gap-3 bg-muted/70 border border-border p-3 rounded-lg font-mono text-sm">
          <div className="flex items-center gap-2 overflow-x-auto select-all">
            <span className="text-muted-foreground">$</span>
            <span className="text-foreground">{cliCommand}</span>
          </div>
          <Button
            size="sm"
            variant={copiedCli ? "default" : "secondary"}
            onClick={handleCopyCli}
            className="shrink-0 gap-1.5 h-8"
          >
            {copiedCli ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Copy CLI
              </>
            )}
          </Button>
        </div>

        {/* Code tabs */}
        <Tabs defaultValue="snippet" className="w-full">
          <div className="flex items-center justify-between mb-2">
            <TabsList className="h-8">
              <TabsTrigger value="snippet" className="text-xs gap-1.5 px-3">
                <Code2 className="h-3.5 w-3.5" />
                React Component
              </TabsTrigger>
              <TabsTrigger value="cli" className="text-xs gap-1.5 px-3">
                <Terminal className="h-3.5 w-3.5" />
                Manual Command
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="snippet" className="mt-0">
            <CodeBlock
              code={generatedSnippet}
              language="tsx"
              filename="app/layout.tsx"
            />
          </TabsContent>

          <TabsContent value="cli" className="mt-0">
            <CodeBlock
              code={`# Install via shadcn CLI\n${cliCommand}\n\n# Or install via shorthand if configured in components.json\nnpx shadcn add cookie-consent`}
              language="bash"
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
