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
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  Code,
  Cookie,
  Database,
  Eye,
  Layout,
  Palette,
  RefreshCw,
  Settings,
  Shield,
  Sliders,
  Sparkles,
  Terminal,
  Zap,
} from "lucide-react";
import { MockBrowserCanvas } from "@/components/playground/mock-browser-canvas";
import { CodeExportCard } from "@/components/playground/code-export-card";

interface PlaygroundOptions {
  position: BannerPosition;
  radiusClass: string;
  hasBackdrop: boolean;
  theme: "default" | "violet" | "emerald" | "blue" | "rose";
}

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

const THEME_OPTIONS: { label: string; value: PlaygroundOptions["theme"]; colorClass: string }[] = [
  { label: "Default", value: "default", colorClass: "bg-zinc-900 border-zinc-700" },
  { label: "Violet", value: "violet", colorClass: "bg-violet-600 border-violet-500" },
  { label: "Emerald", value: "emerald", colorClass: "bg-emerald-600 border-emerald-500" },
  { label: "Blue", value: "blue", colorClass: "bg-blue-600 border-blue-500" },
  { label: "Rose", value: "rose", colorClass: "bg-rose-600 border-rose-500" },
];

function DemoContent({
  options,
  setOptions,
  events,
}: {
  options: PlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<PlaygroundOptions>>;
  events: ConsentChangeEvent[];
}) {
  const { state, resetConsent, openSettings, acceptAll, rejectAll, getLoadedScripts } =
    useCookieConsent();

  const analyticsScript = useConsentScript("analytics", "demo-analytics", {
    content: `console.log("[Demo] Analytics script loaded via useConsentScript hook");`,
    onRevoke: () => {
      console.log("[Demo] Analytics script revoked - cleaning up...");
    },
  });

  const categories = [
    { key: "necessary" as const, label: "Necessary", icon: Shield, description: "Core site functions" },
    { key: "analytics" as const, label: "Analytics", icon: Database, description: "GA4, PostHog, telemetry" },
    { key: "marketing" as const, label: "Marketing", icon: Zap, description: "Meta Pixel, ads, conversion" },
    { key: "preferences" as const, label: "Preferences", icon: Cookie, description: "Saved themes and state" },
  ];

  const loadedScripts = getLoadedScripts();

  // Computed Google Consent Mode v2 live state
  const gcmSignals = {
    analytics_storage: state.categories.analytics ? "granted" : "denied",
    ad_storage: state.categories.marketing ? "granted" : "denied",
    ad_user_data: state.categories.marketing ? "granted" : "denied",
    ad_personalization: state.categories.marketing ? "granted" : "denied",
  };

  return (
    <div className="bg-background min-h-screen">
      {/* Interactive Scripts for Capabilities Demo */}
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

      <div className="container max-w-6xl mx-auto py-10 px-4 space-y-10">
        {/* Header section */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs px-3 py-1 gap-1.5 border-primary/30 text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              Interactive Playground & Capabilities Showcase
            </Badge>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground">
            Customize & Test in Real-Time
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            Tweak banner positions, corner radii, and backdrops. Test real-time script blocking and Google Consent Mode v2 signals, then copy the shadcn CLI install command.
          </p>

          {/* Quick Action Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Button
              variant="default"
              size="sm"
              onClick={resetConsent}
              className="gap-2 shadow-sm"
            >
              <RefreshCw className="h-4 w-4" />
              Reset Consent & Re-show Banner
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openSettings}
              className="gap-2"
            >
              <Sliders className="h-4 w-4" />
              Open Cookie Settings Modal
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={acceptAll}
              className="gap-2"
            >
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectAll}
              className="gap-2 text-muted-foreground"
            >
              Reject Optional
            </Button>
          </div>
        </div>

        {/* 🎛️ Playground Controls Grid */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Layout className="h-5 w-5 text-primary" />
                  Live Theme & Layout Controls
                </CardTitle>
                <CardDescription>
                  Modify properties below to see immediate updates in the preview viewport
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
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
                      className="text-xs h-8 px-2.5 font-normal justify-center"
                    >
                      {pos.label}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Control 2: Border Radius */}
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
                      className={cn("text-xs h-8 px-2 font-normal justify-center", rad.value)}
                    >
                      {rad.label.split(" ")[0]}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Control 3: Backdrop & Options */}
              <div className="space-y-3.5">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Behavior & Overlay
                </Label>
                <div className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-muted/30">
                  <div className="space-y-0.5">
                    <Label htmlFor="backdrop-toggle" className="text-xs font-medium cursor-pointer">
                      Backdrop Blocker
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Dims background until decision</p>
                  </div>
                  <Switch
                    id="backdrop-toggle"
                    checked={options.hasBackdrop}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, hasBackdrop: checked }))
                    }
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 🖥️ Mock Viewport Canvas */}
        <MockBrowserCanvas>
          {/* Note: The CookieBanner will appear over this page via the CookieConsentProvider */}
        </MockBrowserCanvas>

        {/* 📦 Installation & Code Export Card */}
        <CodeExportCard
          position={options.position}
          radiusClass={options.radiusClass}
          hasBackdrop={options.hasBackdrop}
        />

        {/* 📊 Capabilities & Telemetry Showcase Section */}
        <div className="space-y-4 pt-4">
          <div className="border-t border-border pt-6">
            <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              Consent Engine & Telemetry Showcase
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Live audit inspection of consent states, category permissions, script unload triggers, and Google Consent Mode v2 signals.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Live Consent Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Cookie className="h-4 w-4 text-primary" />
                  Consent State & Identity
                </CardTitle>
                <CardDescription>Device-level consent session attributes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Consent Given</span>
                  <Badge variant={state.hasConsented ? "default" : "secondary"}>
                    {state.hasConsented ? "Consented ✓" : "Pending Decision"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Consent Version</span>
                  <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                    v{state.consentVersion}
                  </code>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-border/50">
                  <span className="text-sm text-muted-foreground">Visitor Device ID</span>
                  <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono truncate max-w-[180px]">
                    {state.visitorId}
                  </code>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="text-sm text-muted-foreground">Last Recorded</span>
                  <span className="text-xs text-muted-foreground font-mono">
                    {state.lastUpdated ? new Date(state.lastUpdated).toLocaleTimeString() : "None"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Categories Status */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Sliders className="h-4 w-4 text-primary" />
                  Granular Category Permissions
                </CardTitle>
                <CardDescription>Current permissions per data processing category</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2.5">
                  {categories.map(({ key, label, icon: Icon, description }) => (
                    <div
                      key={key}
                      className={cn(
                        "rounded-lg border p-2.5 transition-all flex flex-col justify-between",
                        state.categories[key]
                          ? "border-primary/40 bg-primary/5"
                          : "border-border/60 bg-muted/20 opacity-75"
                      )}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-1.5">
                          <Icon
                            className={cn(
                              "h-3.5 w-3.5",
                              state.categories[key] ? "text-primary" : "text-muted-foreground"
                            )}
                          />
                          <span className="text-xs font-semibold">{label}</span>
                        </div>
                        <Badge
                          variant={state.categories[key] ? "default" : "secondary"}
                          className="text-[10px] h-4 px-1.5 font-normal"
                        >
                          {state.categories[key] ? "Granted" : "Denied"}
                        </Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground">{description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Script Management Telemetry */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Code className="h-4 w-4 text-primary" />
                  Script Manager Live Telemetry
                </CardTitle>
                <CardDescription>
                  Scripts load when consent is granted and automatically unload when revoked
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Tracked Scripts Status
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/60 text-xs">
                      <div className="flex items-center gap-2">
                        <Database className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono">google-analytics</span>
                        <span className="text-muted-foreground">(analytics)</span>
                      </div>
                      <Badge
                        variant={loadedScripts.includes("google-analytics") ? "default" : "outline"}
                        className={cn(
                          "text-[10px] h-5",
                          loadedScripts.includes("google-analytics")
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "text-muted-foreground"
                        )}
                      >
                        {loadedScripts.includes("google-analytics") ? "Loaded ✓" : "Blocked ✕"}
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/60 text-xs">
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono">marketing-pixel</span>
                        <span className="text-muted-foreground">(marketing)</span>
                      </div>
                      <Badge
                        variant={loadedScripts.includes("marketing-pixel") ? "default" : "outline"}
                        className={cn(
                          "text-[10px] h-5",
                          loadedScripts.includes("marketing-pixel")
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "text-muted-foreground"
                        )}
                      >
                        {loadedScripts.includes("marketing-pixel") ? "Loaded ✓" : "Blocked ✕"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border/60 pt-3">
                  <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                    Hook Demo: useConsentScript("analytics")
                  </p>
                  <div className="flex items-center justify-between p-2 rounded-md bg-muted/40 border border-border/60 text-xs">
                    <span className="font-mono text-muted-foreground">demo-analytics hook</span>
                    <Badge
                      variant={analyticsScript.hasConsent ? "default" : "secondary"}
                      className="text-[10px] h-5"
                    >
                      {analyticsScript.hasConsent ? "Active ✓" : "Halted ✕"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Google Consent Mode v2 Signals */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="h-4 w-4 text-primary" />
                  Google Consent Mode v2 Signals
                </CardTitle>
                <CardDescription>
                  Live values dispatched to window.dataLayer / gtag("consent", "update")
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2 font-mono text-xs">
                  {Object.entries(gcmSignals).map(([signal, value]) => (
                    <div
                      key={signal}
                      className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex flex-col justify-between gap-1"
                    >
                      <span className="text-muted-foreground text-[11px] truncate">{signal}</span>
                      <Badge
                        variant={value === "granted" ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] w-fit",
                          value === "granted"
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        "{value}"
                      </Badge>
                    </div>
                  ))}
                </div>

                {/* Consent event stream snippet */}
                <div className="border-t border-border/60 pt-3 mt-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1.5 uppercase tracking-wider">
                    Recent Consent Events ({events.length})
                  </p>
                  {events.length > 0 ? (
                    <div className="space-y-1 max-h-24 overflow-y-auto font-mono text-[11px] text-muted-foreground">
                      {events.slice(-3).map((evt, idx) => (
                        <div key={idx} className="flex justify-between py-0.5 border-b border-border/30">
                          <span>action: {evt.action}</span>
                          <span>granted: {evt.grantedCategories.join(",") || "none"}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground italic">
                      Interact with the banner buttons above to stream events.
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer trigger demo */}
        <div className="text-center pt-4">
          <CookieTrigger variant="text" />
        </div>
      </div>
    </div>
  );
}

export function CookieConsentDemo() {
  const [options, setOptions] = useState<PlaygroundOptions>({
    position: "bottom",
    radiusClass: "rounded-lg",
    hasBackdrop: false,
    theme: "default",
  });
  const [events, setEvents] = useState<ConsentChangeEvent[]>([]);

  const config: CookieConsentConfig = {
    consentVersion: "1.0.0",
    expirationDays: 365,
    privacyPolicyUrl: "/privacy",
    position: options.position,
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
      <DemoContent options={options} setOptions={setOptions} events={events} />
      {options.hasBackdrop && <CookieBannerBackdrop />}
      <CookieBanner
        position={options.position}
        className={cn(options.radiusClass, "shadow-2xl")}
      />
      <CookieSettings />
    </CookieConsentProvider>
  );
}
