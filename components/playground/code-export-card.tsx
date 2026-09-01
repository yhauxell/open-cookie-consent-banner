"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Code2, Sparkles, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import type { BannerPosition, BannerSize } from "@/components/cookie-consent/types";

interface CodeExportCardProps {
  position: BannerPosition;
  size: BannerSize;
  radiusClass: string;
  hasBackdrop: boolean;
}

export function CodeExportCard({ position, size, radiusClass, hasBackdrop }: CodeExportCardProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const cliCommand = "npx shadcn@latest add https://openconsent.dev/r/cookie-consent.json";

  const handleCopyCli = async () => {
    await navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  // Generate dynamic banner props string
  const bannerPropsList: string[] = [];
  if (position !== "bottom") bannerPropsList.push(`position="${position}"`);
  if (size !== "default") bannerPropsList.push(`size="${size}"`);
  if (radiusClass !== "rounded-lg") bannerPropsList.push(`className="${radiusClass}"`);

  const bannerPropsStr = bannerPropsList.length > 0 ? ` ${bannerPropsList.join(" ")}` : "";

  const generatedLayoutSnippet = `import {
  CookieConsentProvider,
  CookieBanner,${hasBackdrop ? "\n  CookieBannerBackdrop," : ""}
  CookieSettings,
  CookieTrigger,
} from "@/components/cookie-consent"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <CookieConsentProvider
          config={{
            consentVersion: "1.0.0",
            privacyPolicyUrl: "/privacy",
            position: "${position}",
            size: "${size}",
            traceability: {
              enabled: true,
              endpoint: "/api/consent",
            },
          }}
        >
          {children}
          ${hasBackdrop ? "<CookieBannerBackdrop />\n          " : ""}<CookieBanner${bannerPropsStr} />
          <CookieSettings className="${radiusClass}" />
        </CookieConsentProvider>
      </body>
    </html>
  )
}`;

  const generatedComponentSnippet = `<CookieConsentProvider
  config={{
    consentVersion: "1.0.0",
    privacyPolicyUrl: "/privacy",
    position: "${position}",
    size: "${size}",
  }}
>
  {/* Your Application Content */}
  {children}

  {/* Cookie Banner & Settings portaled components */}${hasBackdrop ? "\n  <CookieBannerBackdrop />" : ""}
  <CookieBanner${bannerPropsStr} />
  <CookieSettings className="${radiusClass}" />
  <CookieTrigger variant="text" />
</CookieConsentProvider>`;

  const handleCopySnippet = async () => {
    await navigator.clipboard.writeText(generatedLayoutSnippet);
    setCopiedSnippet(true);
    setTimeout(() => setCopiedSnippet(false), 2000);
  };

  return (
    <div className="space-y-4">
      {/* Top Banner: CLI Command */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-muted/70 border border-border/80 p-3 rounded-xl font-mono text-xs sm:text-sm">
        <div className="flex items-center gap-2 overflow-x-auto select-all">
          <Terminal className="h-4 w-4 text-primary shrink-0" />
          <span className="text-muted-foreground">$</span>
          <span className="text-foreground font-semibold">{cliCommand}</span>
        </div>
        <Button
          size="sm"
          variant={copiedCli ? "default" : "secondary"}
          onClick={handleCopyCli}
          className="shrink-0 gap-1.5 h-8 text-xs font-sans"
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

      {/* Dynamic Code Tabs */}
      <Card className="border-border/80 shadow-sm bg-card/90 overflow-hidden">
        <CardHeader className="pb-3 border-b border-border/40 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Code2 className="h-4 w-4 text-primary" />
              Tailored Code Integration
            </CardTitle>
            <CardDescription className="text-xs">
              Live snippet generated from your custom position ({position}), size ({size}), and radius ({radiusClass.replace("rounded-", "")})
            </CardDescription>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopySnippet}
            className="h-7 text-xs gap-1.5 border-border/80"
          >
            {copiedSnippet ? (
              <>
                <Check className="h-3 w-3 text-emerald-500" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy Code
              </>
            )}
          </Button>
        </CardHeader>

        <CardContent className="p-4 space-y-4">
          <Tabs defaultValue="layout" className="w-full">
            <TabsList className="h-8 mb-3 bg-muted/60 p-0.5">
              <TabsTrigger value="layout" className="text-xs px-3 h-7">
                app/layout.tsx
              </TabsTrigger>
              <TabsTrigger value="component" className="text-xs px-3 h-7">
                Component JSX
              </TabsTrigger>
              <TabsTrigger value="cli" className="text-xs px-3 h-7">
                shadcn CLI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="layout" className="mt-0 focus-visible:outline-none">
              <CodeBlock
                code={generatedLayoutSnippet}
                language="tsx"
                filename="app/layout.tsx"
              />
            </TabsContent>

            <TabsContent value="component" className="mt-0 focus-visible:outline-none">
              <CodeBlock
                code={generatedComponentSnippet}
                language="tsx"
                filename="components/providers.tsx"
              />
            </TabsContent>

            <TabsContent value="cli" className="mt-0 focus-visible:outline-none">
              <CodeBlock
                code={`# 1. Install component via shadcn registry\n${cliCommand}\n\n# 2. Required shadcn dependencies (installed automatically)\nnpx shadcn@latest add button dialog switch card label accordion`}
                language="bash"
              />
            </TabsContent>
          </Tabs>

          {/* Active Configuration Summary Chips */}
          <div className="pt-3 border-t border-border/40 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">Active Props:</span>
            <Badge variant="secondary" className="font-mono text-[11px]">
              position="{position}"
            </Badge>
            <Badge variant="secondary" className="font-mono text-[11px]">
              size="{size}"
            </Badge>
            <Badge variant="secondary" className="font-mono text-[11px]">
              radius="{radiusClass}"
            </Badge>
            {hasBackdrop && (
              <Badge variant="secondary" className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                backdrop=true
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
