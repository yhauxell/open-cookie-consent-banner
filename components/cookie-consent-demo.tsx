"use client";

import React, { useState } from "react";
import {
  ConsentScript,
  CookieBanner,
  CookieBannerBackdrop,
  CookieConsentProvider,
  CookieSettings,
  CookieTrigger,
  useConsentScript,
  type BannerPosition,
  type BannerSize,
  type ConsentChangeEvent,
  type CookieConsentConfig,
} from "@/components/cookie-consent";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Layout,
  Palette,
  Sparkles,
  Sliders,
  ShieldCheck,
  Terminal,
  Activity,
  Maximize2,
} from "lucide-react";
import { MockBrowserCanvas } from "@/components/playground/mock-browser-canvas";
import { CodeExportCard } from "@/components/playground/code-export-card";
import { TelemetryInspector } from "@/components/playground/telemetry-inspector";
import { QuickstartGuide } from "@/components/playground/quickstart-guide";
import { SpotlightBackground } from "@/components/spotlight-background";

interface PlaygroundOptions {
  position: BannerPosition;
  size: BannerSize;
  radiusClass: string;
  hasBackdrop: boolean;
  forceVisible: boolean;
}

const SIZE_OPTIONS: { label: string; value: BannerSize }[] = [
  { label: "Compact (sm)", value: "sm" },
  { label: "Default (md)", value: "default" },
  { label: "Spacious (lg)", value: "lg" },
];

const RADIUS_OPTIONS = [
  { label: "Sharp (0px)", value: "rounded-none" },
  { label: "Subtle (6px)", value: "rounded-md" },
  { label: "Default (8px)", value: "rounded-lg" },
  { label: "Modern (16px)", value: "rounded-2xl" },
  { label: "Pill (Full)", value: "rounded-full" },
];

const POSITION_OPTIONS: { label: string; value: BannerPosition }[] = [
  { label: "Bottom Bar", value: "bottom" },
  { label: "Top Bar", value: "top" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Bottom Left", value: "bottom-left" },
];

function WorkbenchContent({
  options,
  setOptions,
  events,
  setEvents,
}: {
  options: PlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<PlaygroundOptions>>;
  events: ConsentChangeEvent[];
  setEvents: React.Dispatch<React.SetStateAction<ConsentChangeEvent[]>>;
}) {
  const [activeTab, setActiveTab] = useState<"visual" | "telemetry" | "quickstart">("visual");

  // Sample third-party script hooks for real-time engine telemetry
  useConsentScript("analytics", "demo-analytics", {
    content: `console.log("[Demo] Analytics script active");`,
    onRevoke: () => {
      console.log("[Demo] Analytics script cleaned up");
    },
  });

  return (
    <div className="bg-background min-h-screen relative isolate overflow-hidden">
      {/* Dynamic GPU-accelerated mouse follow spotlight */}
      <SpotlightBackground size={750} showGrid={true} />
      {/* Subtle background grid pattern with top radial mask */}
      <div className="absolute inset-0 -z-10 h-full w-full bg-grid-pattern mask-radial-top opacity-50 pointer-events-none" />
      {/* Top ambient spotlight glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[600px] h-[300px] bg-gradient-to-b from-primary/10 via-primary/5 to-transparent blur-3xl pointer-events-none" />

      {/* Declarative Scripts for Live Capabilities Showcase */}
      <ConsentScript
        id="google-analytics"
        category="analytics"
        onLoad={() => console.log("[Demo Script] Google Analytics initialized")}
        onRevoke={() => console.log("[Demo Script] Google Analytics revoked and cleaned up")}
      >
        {`console.log("[Demo Script] GA active");`}
      </ConsentScript>

      <ConsentScript
        id="marketing-pixel"
        category="marketing"
        onLoad={() => console.log("[Demo Script] Marketing pixel initialized")}
        onRevoke={() => console.log("[Demo Script] Marketing pixel revoked and cleaned up")}
      >
        {`console.log("[Demo Script] Meta Pixel active");`}
      </ConsentScript>

      <div className="container relative z-10 max-w-6xl mx-auto py-10 px-4 space-y-8">
        {/* Studio Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Badge variant="outline" className="text-xs px-3 py-1 gap-1.5 border-primary/30 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              OpenConsent Developer Studio
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Interactive Playground & Workbench
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Design banner positions, densities, and corner radii in real-time, inspect Google Consent Mode v2 signals, or copy the production-ready code.
          </p>
        </div>

        {/* Primary Workbench Tab Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(val) => setActiveTab(val as "visual" | "telemetry" | "quickstart")}
          className="space-y-6"
        >
          <div className="flex justify-center">
            <TabsList className="h-11 p-1 bg-muted/80 border border-border/70 rounded-xl gap-1">
              <TabsTrigger
                value="visual"
                className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
              >
                <Layout className="h-4 w-4 text-primary" />
                <span>Visual Studio</span>
              </TabsTrigger>
              <TabsTrigger
                value="telemetry"
                className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
              >
                <Activity className="h-4 w-4 text-primary" />
                <span>Compliance & Telemetry</span>
                {events.length > 0 && (
                  <Badge variant="secondary" className="h-4 px-1.5 text-[10px] ml-0.5">
                    {events.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger
                value="quickstart"
                className="gap-2 px-4 py-2 text-xs sm:text-sm font-medium rounded-lg data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
              >
                <Terminal className="h-4 w-4 text-primary" />
                <span>Quickstart Guide</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Visual Studio & Viewport Preview */}
          <TabsContent value="visual" className="space-y-8 focus-visible:outline-none">
            {/* Live Theme & Layout Controls */}
            <Card className="border-border shadow-sm">
              <CardHeader className="pb-4">
                <CardTitle className="text-base sm:text-lg flex items-center gap-2">
                  <Sliders className="h-5 w-5 text-primary" />
                  Live Theme & Layout Controls
                </CardTitle>
                <CardDescription>
                  Tune position, corner curvature, and typography density to preview immediate layout reflow
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {/* Control 1: Position */}
                  <div className="space-y-2.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Banner Position
                    </Label>
                    <div className="grid grid-cols-2 gap-1.5">
                      {POSITION_OPTIONS.map((pos) => (
                        <Button
                          key={pos.value}
                          size="sm"
                          variant={options.position === pos.value ? "default" : "outline"}
                          onClick={() => setOptions((prev) => ({ ...prev, position: pos.value }))}
                          className="text-xs h-8 px-2 font-normal justify-center"
                        >
                          {pos.label}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Control 2: Size & Density */}
                  <div className="space-y-2.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Size & Density
                    </Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {SIZE_OPTIONS.map((sz) => (
                        <Button
                          key={sz.value}
                          size="sm"
                          variant={options.size === sz.value ? "default" : "outline"}
                          onClick={() => setOptions((prev) => ({ ...prev, size: sz.value }))}
                          className="text-xs h-8 px-1.5 font-normal justify-center"
                        >
                          {sz.label.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Control 3: Border Radius */}
                  <div className="space-y-2.5">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Corner Radius
                    </Label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {RADIUS_OPTIONS.map((rad) => (
                        <Button
                          key={rad.value}
                          size="sm"
                          variant={options.radiusClass === rad.value ? "default" : "outline"}
                          onClick={() => setOptions((prev) => ({ ...prev, radiusClass: rad.value }))}
                          className={cn("text-xs h-8 px-1.5 font-normal justify-center", rad.value)}
                        >
                          {rad.label.split(" ")[0]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Control 4: Backdrop & Preview Controls */}
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Behavior & Overlay
                    </Label>
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/30">
                        <Label htmlFor="backdrop-toggle" className="text-xs font-medium cursor-pointer">
                          Backdrop Blocker
                        </Label>
                        <Switch
                          id="backdrop-toggle"
                          checked={options.hasBackdrop}
                          onCheckedChange={(checked) =>
                            setOptions((prev) => ({ ...prev, hasBackdrop: checked }))
                          }
                        />
                      </div>
                      <div className="flex items-center justify-between p-2 rounded-lg border border-border bg-muted/30">
                        <Label htmlFor="force-visible-toggle" className="text-xs font-medium cursor-pointer">
                          Always Preview Banner
                        </Label>
                        <Switch
                          id="force-visible-toggle"
                          checked={options.forceVisible}
                          onCheckedChange={(checked) =>
                            setOptions((prev) => ({ ...prev, forceVisible: checked }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* 🖥️ Mock Viewport Canvas with Embedded Banner */}
            <MockBrowserCanvas>
              {options.hasBackdrop && (
                <CookieBannerBackdrop isEmbedded forceVisible={options.forceVisible} />
              )}
              <CookieBanner
                isEmbedded
                forceVisible={options.forceVisible}
                position={options.position}
                size={options.size}
                className={cn(options.radiusClass, "shadow-2xl")}
              />
            </MockBrowserCanvas>

            {/* 📦 Installation & Code Export Card */}
            <CodeExportCard
              position={options.position}
              size={options.size}
              radiusClass={options.radiusClass}
              hasBackdrop={options.hasBackdrop}
            />
          </TabsContent>

          {/* TAB 2: Compliance & Telemetry Inspector */}
          <TabsContent value="telemetry" className="focus-visible:outline-none">
            <TelemetryInspector
              events={events}
              onClearEvents={() => setEvents([])}
            />
          </TabsContent>

          {/* TAB 3: Quickstart Guide */}
          <TabsContent value="quickstart" className="focus-visible:outline-none">
            <QuickstartGuide />
          </TabsContent>
        </Tabs>

        {/* Footer trigger demo */}
        <div className="text-center pt-6 border-t border-border/40">
          <CookieTrigger variant="text" />
        </div>
      </div>
    </div>
  );
}

export function CookieConsentDemo() {
  const [options, setOptions] = useState<PlaygroundOptions>({
    position: "bottom",
    size: "default",
    radiusClass: "rounded-lg",
    hasBackdrop: false,
    forceVisible: true,
  });
  const [events, setEvents] = useState<ConsentChangeEvent[]>([]);

  const config: CookieConsentConfig = {
    consentVersion: "1.0.0",
    expirationDays: 365,
    privacyPolicyUrl: "/privacy",
    position: options.position,
    size: options.size,
    traceability: {
      enabled: true,
      endpoint: "/api/consent",
      includeUserAgent: true,
      includeUrl: true,
      retryOnFailure: true,
      maxRetries: 3,
    },
    onConsentChange: (event) => {
      setEvents((prev) => [...prev, event]);
      console.log("[Demo] onConsentChange:", event);
    },
  };

  return (
    <CookieConsentProvider config={config}>
      <WorkbenchContent
        options={options}
        setOptions={setOptions}
        events={events}
        setEvents={setEvents}
      />
      <CookieSettings className={options.radiusClass} />
    </CookieConsentProvider>
  );
}
