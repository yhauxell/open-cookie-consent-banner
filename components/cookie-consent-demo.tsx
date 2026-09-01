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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  Eye,
  Code2,
  Activity,
  Sparkles,
  Terminal,
} from "lucide-react";
import { MockBrowserCanvas } from "@/components/playground/mock-browser-canvas";
import { CodeExportCard } from "@/components/playground/code-export-card";
import { TelemetryInspector } from "@/components/playground/telemetry-inspector";
import {
  CustomizationSidebar,
  type PlaygroundOptions,
} from "@/components/playground/customization-sidebar";

const DEFAULT_OPTIONS: PlaygroundOptions = {
  position: "bottom",
  size: "default",
  radiusClass: "rounded-lg",
  hasBackdrop: false,
  forceVisible: true,
  enableTraceability: true,
  traceabilityEndpoint: "/api/consent",
  enableGcm: true,
  expirationDays: 365,
  privacyPolicyUrl: "/privacy",
};

function WorkbenchContent({
  options,
  setOptions,
  events,
  setEvents,
  onReset,
}: {
  options: PlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<PlaygroundOptions>>;
  events: ConsentChangeEvent[];
  setEvents: React.Dispatch<React.SetStateAction<ConsentChangeEvent[]>>;
  onReset: () => void;
}) {
  const [activeTab, setActiveTab] = useState<"design" | "code" | "events">("design");

  // Sample third-party script hooks for real-time telemetry testing
  useConsentScript("analytics", "demo-analytics", {
    content: `console.log("[Demo] Analytics script active");`,
    onRevoke: () => {
      console.log("[Demo] Analytics script cleaned up");
    },
  });

  return (
    <div className="bg-background min-h-screen relative isolate overflow-hidden">
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

      <div className="w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Studio Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-border/40">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="outline" className="text-xs px-2.5 py-0.5 gap-1.5 border-primary/30 text-primary">
                <Sparkles className="h-3.5 w-3.5" />
                OpenConsent Studio
              </Badge>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              Interactive Component Workbench
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Tune styling & telemetry on the left, preview live in Design, inspect real-time Code, and track Events.
            </p>
          </div>
        </div>

        {/* 2-Column Full-Width Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr] gap-6 items-start">
          {/* LEFT COLUMN: Customization Sidebar (Styling + Telemetry Tabs) */}
          <aside className="w-full lg:sticky lg:top-20">
            <CustomizationSidebar
              options={options}
              setOptions={setOptions}
              onReset={onReset}
            />
          </aside>

          {/* RIGHT COLUMN: Stage (Design / Code / Events) */}
          <main className="min-w-0 space-y-4">
            <Tabs
              value={activeTab}
              onValueChange={(val) => setActiveTab(val as "design" | "code" | "events")}
              className="w-full"
            >
              <div className="flex items-center justify-between pb-3">
                <TabsList className="h-9 p-0.5 bg-muted/80 border border-border/70 rounded-lg gap-0.5">
                  <TabsTrigger
                    value="design"
                    className="gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
                  >
                    <Eye className="h-3.5 w-3.5 text-primary" />
                    <span>Design</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="code"
                    className="gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
                  >
                    <Code2 className="h-3.5 w-3.5 text-primary" />
                    <span>Code</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="events"
                    className="gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md data-[state=active]:bg-background data-[state=active]:shadow-xs transition-all"
                  >
                    <Terminal className="h-3.5 w-3.5 text-primary" />
                    <span>Events</span>
                    {events.length > 0 && (
                      <Badge variant="secondary" className="h-4 px-1.5 text-[10px] ml-0.5">
                        {events.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* TAB 1: DESIGN (Mock Viewport Canvas with embedded banner) */}
              <TabsContent value="design" className="mt-0 focus-visible:outline-none space-y-4">
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
              </TabsContent>

              {/* TAB 2: CODE (Dynamic Live Generated Snippet & CLI) */}
              <TabsContent value="code" className="mt-0 focus-visible:outline-none">
                <CodeExportCard options={options} />
              </TabsContent>

              {/* TAB 3: EVENTS (Compliance Matrix & Live Event Stream Console) */}
              <TabsContent value="events" className="mt-0 focus-visible:outline-none">
                <TelemetryInspector
                  events={events}
                  onClearEvents={() => setEvents([])}
                />
              </TabsContent>
            </Tabs>
          </main>
        </div>

        {/* Footer trigger demo */}
        <div className="text-center pt-6 border-t border-border/40">
          <CookieTrigger variant="text" />
        </div>
      </div>
    </div>
  );
}

export function CookieConsentDemo() {
  const [options, setOptions] = useState<PlaygroundOptions>(DEFAULT_OPTIONS);
  const [events, setEvents] = useState<ConsentChangeEvent[]>([]);

  const handleReset = () => {
    setOptions(DEFAULT_OPTIONS);
  };

  const config: CookieConsentConfig = {
    consentVersion: "1.0.0",
    expirationDays: options.expirationDays,
    privacyPolicyUrl: options.privacyPolicyUrl,
    position: options.position,
    size: options.size,
    googleConsentMode: { enabled: options.enableGcm },
    traceability: {
      enabled: options.enableTraceability,
      endpoint: options.traceabilityEndpoint,
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
        onReset={handleReset}
      />
      <CookieSettings className={options.radiusClass} />
    </CookieConsentProvider>
  );
}
