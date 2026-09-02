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
  useCookieConsent,
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
import type { TelemetryLogEntry } from "@/components/playground/event-stream-console";
import {
  CustomizationSidebar,
  DEFAULT_PLAYGROUND_CATEGORIES,
  type PlaygroundOptions,
} from "@/components/playground/customization-sidebar";

const DEFAULT_OPTIONS: PlaygroundOptions = {
  position: "bottom",
  size: "default",
  radiusClass: "rounded-lg",
  hasBackdrop: false,
  forceVisible: true,
  bannerTitle: "Cookie Preferences",
  bannerDescription: "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
  bannerAcceptText: "Accept All",
  bannerRejectText: "Reject All",
  bannerCustomizeText: "Customize",
  bannerLearnMoreText: "Learn more",
  modalTitle: "Cookie Settings",
  modalDescription: "Manage your cookie preferences below.",
  categories: DEFAULT_PLAYGROUND_CATEGORIES,
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
}: {
  options: PlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<PlaygroundOptions>>;
  events: TelemetryLogEntry[];
  setEvents: React.Dispatch<React.SetStateAction<TelemetryLogEntry[]>>;
}) {
  const [sidebarTab, setSidebarTab] = useState<"styling" | "content" | "telemetry">("styling");
  const [activeTab, setActiveTab] = useState<"design" | "code" | "events">("design");
  const { resetConsent, closeSettings } = useCookieConsent();

  const handleSidebarTabChange = (tab: "styling" | "content" | "telemetry") => {
    setSidebarTab(tab);
    if (tab === "telemetry") {
      setActiveTab("events");
    } else if (activeTab === "events") {
      setActiveTab("design");
    }
  };

  const handleFullReset = () => {
    // 1. Reset all customization, content & telemetry options to defaults
    setOptions(DEFAULT_OPTIONS);
    // 2. Clear all telemetry events from stream
    setEvents([]);
    // 3. Close settings modal if open
    closeSettings();
    // 4. Reset consent state & storage
    resetConsent();
    // 5. Keep user in their current view: if in telemetry, stay in telemetry & events; otherwise design
    if (sidebarTab === "telemetry") {
      setActiveTab("events");
    } else {
      setActiveTab("design");
    }
  };

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
              {sidebarTab === "telemetry"
                ? "Live Telemetry Cockpit: Inspect real-time audit logs, GCM v2 signals, and verified backend transmission receipts."
                : "Tune styling, banner copy & categories on the left, and preview live in Design or inspect code on the right."}
            </p>
          </div>
        </div>

        {/* 2-Column Full-Width Studio Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[340px_1fr] xl:grid-cols-[360px_1fr] gap-6 items-start">
          {/* LEFT COLUMN: Customization Sidebar (Styling, Content, Telemetry Tabs) */}
          <aside className="w-full lg:sticky lg:top-20">
            <CustomizationSidebar
              options={options}
              setOptions={setOptions}
              onReset={handleFullReset}
              sidebarTab={sidebarTab}
              onSidebarTabChange={handleSidebarTabChange}
            />
          </aside>

          {/* RIGHT COLUMN: Stage */}
          <main className="min-w-0 space-y-4">
            {sidebarTab === "telemetry" ? (
              /* Dedicated Focused Telemetry & Events View */
              <div className="space-y-4 animate-in fade-in-50 duration-200">
                <div className="flex items-center justify-between pb-2 border-b border-border/40">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs px-2.5 py-0.5 gap-1.5 font-mono">
                      <Terminal className="h-3.5 w-3.5" />
                      Live Telemetry & Events Cockpit
                    </Badge>
                    {events.length > 0 && (
                      <Badge variant="secondary" className="h-5 px-2 text-xs font-mono">
                        {events.length} {events.length === 1 ? "Event Logged" : "Events Logged"}
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground hidden sm:inline font-mono text-[11px]">
                    POST {options.traceabilityEndpoint}
                  </span>
                </div>

                <TelemetryInspector
                  events={events}
                  onClearEvents={() => setEvents([])}
                  backendEndpoint={options.traceabilityEndpoint}
                  traceabilityEnabled={options.enableTraceability}
                />
              </div>
            ) : (
              /* Standard Workbench (Design / Code / Events) */
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
                      title={options.bannerTitle}
                      description={options.bannerDescription}
                      acceptAllText={options.bannerAcceptText}
                      rejectAllText={options.bannerRejectText}
                      customizeText={options.bannerCustomizeText}
                      learnMoreText={options.bannerLearnMoreText}
                      className={cn(options.radiusClass, "shadow-2xl")}
                    />
                  </MockBrowserCanvas>
                </TabsContent>

                {/* TAB 2: CODE (Dynamic Live Generated Snippet & CLI) */}
                <TabsContent value="code" className="mt-0 focus-visible:outline-none">
                  <CodeExportCard options={options} />
                </TabsContent>
              </Tabs>
            )}
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
  const [events, setEvents] = useState<TelemetryLogEntry[]>([]);

  const config: CookieConsentConfig = {
    consentVersion: "1.0.0",
    expirationDays: options.expirationDays,
    privacyPolicyUrl: options.privacyPolicyUrl,
    position: options.position,
    size: options.size,
    categories: options.categories,
    googleConsentMode: { enabled: options.enableGcm },
    traceability: {
      enabled: options.enableTraceability,
      endpoint: options.traceabilityEndpoint,
      includeUserAgent: true,
      includeUrl: true,
      retryOnFailure: true,
      maxRetries: 3,
      onSuccess: (record) => {
        const time = new Date().toLocaleTimeString();
        setEvents((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            ...updated[lastIdx],
            backendRecord: record,
            backendStatus: "delivered",
            backendEndpoint: options.traceabilityEndpoint,
            timeString: time,
          };
          return updated;
        });
        console.log("[Demo] Traceability onSuccess - Backend confirmed:", record);
      },
      onError: (err, record) => {
        setEvents((prev) => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          updated[lastIdx] = {
            ...updated[lastIdx],
            backendRecord: record,
            backendStatus: "failed",
            error: err.message,
          };
          return updated;
        });
        console.error("[Demo] Traceability onError:", err);
      },
    },
    onConsentChange: (changeEvent) => {
      const now = new Date();
      const entry: TelemetryLogEntry = {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        timestamp: now.toISOString(),
        timeString: now.toLocaleTimeString(),
        changeEvent,
        backendStatus: options.enableTraceability ? "delivered" : "disabled",
        backendEndpoint: options.traceabilityEndpoint,
      };
      setEvents((prev) => [...prev, entry]);
      console.log("[Demo] onConsentChange:", changeEvent);
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
      <CookieSettings
        className={options.radiusClass}
        title={options.modalTitle}
        description={options.modalDescription}
      />
    </CookieConsentProvider>
  );
}
