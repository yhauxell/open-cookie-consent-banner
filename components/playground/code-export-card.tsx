"use client";

import { useState } from "react";
import { Check, Copy, Terminal, Code2, Sparkles, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CodeBlock } from "@/components/code-block";
import type { PlaygroundOptions } from "./customization-sidebar";
import { DEFAULT_PLAYGROUND_CATEGORIES } from "./customization-sidebar";

interface CodeExportCardProps {
  options: PlaygroundOptions;
}

export function CodeExportCard({ options }: CodeExportCardProps) {
  const [copiedCli, setCopiedCli] = useState(false);
  const [copiedSnippet, setCopiedSnippet] = useState(false);
  const cliCommand = "npx shadcn@latest add https://openconsent.dev/r/cookie-consent.json";

  const handleCopyCli = async () => {
    await navigator.clipboard.writeText(cliCommand);
    setCopiedCli(true);
    setTimeout(() => setCopiedCli(false), 2000);
  };

  // Generate dynamic banner props
  const bannerPropsList: string[] = [];
  if (options.position !== "bottom") bannerPropsList.push(`position="${options.position}"`);
  if (options.size !== "default") bannerPropsList.push(`size="${options.size}"`);
  if (options.radiusClass !== "rounded-lg") bannerPropsList.push(`className="${options.radiusClass}"`);
  if (options.bannerTitle && options.bannerTitle !== "Cookie Preferences") {
    bannerPropsList.push(`title="${options.bannerTitle}"`);
  }
  if (
    options.bannerDescription &&
    options.bannerDescription !==
      "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies."
  ) {
    bannerPropsList.push(`description="${options.bannerDescription}"`);
  }
  if (options.bannerAcceptText && options.bannerAcceptText !== "Accept All") {
    bannerPropsList.push(`acceptAllText="${options.bannerAcceptText}"`);
  }
  if (options.bannerRejectText && options.bannerRejectText !== "Reject All") {
    bannerPropsList.push(`rejectAllText="${options.bannerRejectText}"`);
  }
  if (options.bannerCustomizeText && options.bannerCustomizeText !== "Customize") {
    bannerPropsList.push(`customizeText="${options.bannerCustomizeText}"`);
  }

  const bannerPropsStr = bannerPropsList.length > 0 ? ` ${bannerPropsList.join(" ")}` : "";

  // Check if categories were customized
  const isCategoriesCustomized =
    JSON.stringify(options.categories) !== JSON.stringify(DEFAULT_PLAYGROUND_CATEGORIES);

  const formattedCategoriesCode = isCategoriesCustomized
    ? `categories: [\n${options.categories
        .map(
          (c) =>
            `              {\n                key: "${c.key}",\n                title: "${c.title}",\n                description: "${c.description}",${
              c.required ? "\n                required: true," : ""
            }\n              }`
        )
        .join(",\n")}\n            ]`
    : "";

  // Dynamic config lines
  const configEntries: string[] = [
    `consentVersion: "1.0.0"`,
    `privacyPolicyUrl: "${options.privacyPolicyUrl}"`,
    options.position !== "bottom" ? `position: "${options.position}"` : "",
    options.size !== "default" ? `size: "${options.size}"` : "",
    options.expirationDays !== 365 ? `expirationDays: ${options.expirationDays}` : "",
    options.enableGcm ? `googleConsentMode: {\n              enabled: true,\n            }` : "",
    options.enableTraceability
      ? `traceability: {\n              enabled: true,\n              endpoint: "${options.traceabilityEndpoint}",\n            }`
      : "",
    formattedCategoriesCode,
  ].filter(Boolean);

  const configFormatted = configEntries.map((line) => `            ${line},`).join("\n");

  // Dynamic CookieSettings props
  const settingsPropsList: string[] = [];
  if (options.radiusClass !== "rounded-lg") settingsPropsList.push(`className="${options.radiusClass}"`);
  if (options.modalTitle && options.modalTitle !== "Cookie Settings") {
    settingsPropsList.push(`title="${options.modalTitle}"`);
  }
  if (options.modalDescription && options.modalDescription !== "Manage your cookie preferences below.") {
    settingsPropsList.push(`description="${options.modalDescription}"`);
  }
  const settingsPropsStr = settingsPropsList.length > 0 ? ` ${settingsPropsList.join(" ")}` : "";

  const generatedLayoutSnippet = `import {
  CookieConsentProvider,
  CookieBanner,${options.hasBackdrop ? "\n  CookieBannerBackdrop," : ""}
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
${configFormatted}
          }}
        >
          {children}
          ${options.hasBackdrop ? "<CookieBannerBackdrop />\n          " : ""}<CookieBanner${bannerPropsStr} />
          <CookieSettings${settingsPropsStr} />
        </CookieConsentProvider>
      </body>
    </html>
  )
}`;

  const generatedComponentSnippet = `<CookieConsentProvider
  config={{
${configFormatted}
  }}
>
  {/* Your Application Content */}
  {children}

  {/* Cookie Banner & Settings portaled components */}${options.hasBackdrop ? "\n  <CookieBannerBackdrop />" : ""}
  <CookieBanner${bannerPropsStr} />
  <CookieSettings${settingsPropsStr} />
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
              Dynamically generated config reflecting banner copy ({options.bannerTitle}), modal content ({options.modalTitle}), and {options.categories.length} categories
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
            <span className="text-muted-foreground text-[11px] font-medium uppercase tracking-wider">Active Config:</span>
            <Badge variant="secondary" className="font-mono text-[11px]">
              position="{options.position}"
            </Badge>
            <Badge variant="secondary" className="font-mono text-[11px]">
              size="{options.size}"
            </Badge>
            <Badge variant="secondary" className="font-mono text-[11px]">
              radius="{options.radiusClass}"
            </Badge>
            <Badge variant="secondary" className="font-mono text-[11px] text-purple-600 dark:text-purple-400">
              categories: {options.categories.length}
            </Badge>
            {options.bannerTitle !== "Cookie Preferences" && (
              <Badge variant="secondary" className="font-mono text-[11px]">
                bannerTitle="{options.bannerTitle}"
              </Badge>
            )}
            {options.modalTitle !== "Cookie Settings" && (
              <Badge variant="secondary" className="font-mono text-[11px]">
                modalTitle="{options.modalTitle}"
              </Badge>
            )}
            {options.hasBackdrop && (
              <Badge variant="secondary" className="font-mono text-[11px] text-amber-600 dark:text-amber-400">
                backdrop=true
              </Badge>
            )}
            {options.enableGcm && (
              <Badge variant="secondary" className="font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                GCM v2=active
              </Badge>
            )}
            {options.enableTraceability && (
              <Badge variant="secondary" className="font-mono text-[11px] text-blue-600 dark:text-blue-400">
                auditEndpoint="{options.traceabilityEndpoint}"
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
