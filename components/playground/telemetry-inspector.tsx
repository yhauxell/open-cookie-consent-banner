"use client";

import React from "react";
import {
  Shield,
  Cookie,
  Sliders,
  Code,
  Database,
  Zap,
  RefreshCw,
  SlidersHorizontal,
  CheckCircle2,
  XCircle,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/components/cookie-consent";
import type { ConsentChangeEvent } from "@/components/cookie-consent/types";
import { EventStreamConsole } from "./event-stream-console";

interface TelemetryInspectorProps {
  events: ConsentChangeEvent[];
  onClearEvents?: () => void;
}

export function TelemetryInspector({ events, onClearEvents }: TelemetryInspectorProps) {
  const { state, resetConsent, openSettings, acceptAll, rejectAll, getLoadedScripts } =
    useCookieConsent();

  const loadedScripts = getLoadedScripts();

  const categories = [
    { key: "necessary" as const, label: "Necessary", icon: Shield, description: "Core site functions & session security" },
    { key: "analytics" as const, label: "Analytics", icon: Database, description: "GA4, PostHog telemetry, and performance" },
    { key: "marketing" as const, label: "Marketing", icon: Zap, description: "Meta Pixel, retargeting & conversion tracking" },
    { key: "preferences" as const, label: "Preferences", icon: Cookie, description: "Saved themes and personalized options" },
  ];

  // Computed Google Consent Mode v2 live state signals
  const gcmSignals: Record<string, { category: string; value: "granted" | "denied"; description: string }> = {
    analytics_storage: {
      category: "Analytics",
      value: state.categories.analytics ? "granted" : "denied",
      description: "Enables storage (such as cookies) related to analytics e.g. visit duration",
    },
    ad_storage: {
      category: "Marketing",
      value: state.categories.marketing ? "granted" : "denied",
      description: "Enables storage (such as cookies) related to advertising",
    },
    ad_user_data: {
      category: "Marketing",
      value: state.categories.marketing ? "granted" : "denied",
      description: "Sets consent for sending user data to Google for advertising purposes",
    },
    ad_personalization: {
      category: "Marketing",
      value: state.categories.marketing ? "granted" : "denied",
      description: "Sets consent for personalized advertising (remarketing)",
    },
    functionality_storage: {
      category: "Preferences",
      value: state.categories.preferences ? "granted" : "denied",
      description: "Enables storage that supports functionality of the site",
    },
    personalization_storage: {
      category: "Preferences",
      value: state.categories.preferences ? "granted" : "denied",
      description: "Enables storage related to personalization e.g. video recommendations",
    },
    security_storage: {
      category: "Necessary",
      value: state.categories.necessary ? "granted" : "denied",
      description: "Enables storage related to security such as authentication",
    },
  };

  return (
    <div className="space-y-8">
      {/* Top action ribbon */}
      <Card className="border-primary/20 bg-primary/5 shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Interactive Simulation Bar</p>
              <p className="text-xs text-muted-foreground">Trigger consent state transitions and observe immediate engine reactions</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="default"
              size="sm"
              onClick={resetConsent}
              className="gap-1.5 h-8 text-xs shadow-xs"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset Consent State
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openSettings}
              className="gap-1.5 h-8 text-xs bg-background"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Open Settings Modal
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={acceptAll}
              className="gap-1.5 h-8 text-xs"
            >
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
              Accept All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={rejectAll}
              className="gap-1.5 h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject Optional
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid Row 1: Consent State & Category Permissions */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Consent Identity Card */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Cookie className="h-4 w-4 text-primary" />
              Consent State & Identity
            </CardTitle>
            <CardDescription>Device-level consent session attributes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Consent Decision</span>
              <Badge
                variant={state.hasConsented ? "default" : "secondary"}
                className={cn(
                  "font-normal text-xs",
                  state.hasConsented
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                    : "text-muted-foreground"
                )}
              >
                {state.hasConsented ? "Consented ✓" : "Pending Decision"}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Policy Version</span>
              <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono">
                v{state.consentVersion}
              </code>
            </div>
            <div className="flex items-center justify-between py-1.5 border-b border-border/50">
              <span className="text-sm text-muted-foreground">Visitor Device ID</span>
              <code className="text-xs bg-muted px-2 py-0.5 rounded font-mono truncate max-w-[200px]">
                {state.visitorId || "Generating..."}
              </code>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-sm text-muted-foreground">Last Timestamp</span>
              <span className="text-xs text-muted-foreground font-mono">
                {state.lastUpdated ? new Date(state.lastUpdated).toLocaleTimeString() : "None"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Granular Category Permissions */}
        <Card className="border-border shadow-sm">
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
                  <p className="text-[11px] text-muted-foreground leading-tight">{description}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Row 2: Script Management & Google Consent Mode v2 */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Script Manager Live Telemetry */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Code className="h-4 w-4 text-primary" />
              Script Manager Live Telemetry
            </CardTitle>
            <CardDescription>
              Third-party tags dynamically execute when consent is granted and automatically unload on revocation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                Tracked Third-Party Scripts
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/30 border border-border/70 text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono font-medium">google-analytics</span>
                    <span className="text-muted-foreground text-[11px]">(analytics)</span>
                  </div>
                  <Badge
                    variant={loadedScripts.includes("google-analytics") ? "default" : "outline"}
                    className={cn(
                      "text-[10px] h-5",
                      loadedScripts.includes("google-analytics")
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {loadedScripts.includes("google-analytics") ? "Active & Executing ✓" : "Blocked ✕"}
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/30 border border-border/70 text-xs">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="font-mono font-medium">marketing-pixel</span>
                    <span className="text-muted-foreground text-[11px]">(marketing)</span>
                  </div>
                  <Badge
                    variant={loadedScripts.includes("marketing-pixel") ? "default" : "outline"}
                    className={cn(
                      "text-[10px] h-5",
                      loadedScripts.includes("marketing-pixel")
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
                        : "text-muted-foreground"
                    )}
                  >
                    {loadedScripts.includes("marketing-pixel") ? "Active & Executing ✓" : "Blocked ✕"}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="border-t border-border/60 pt-3">
              <p className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wider">
                React Hook: useConsentScript("analytics")
              </p>
              <div className="flex items-center justify-between p-2.5 rounded-md bg-muted/30 border border-border/70 text-xs">
                <span className="font-mono text-muted-foreground">demo-analytics hook instance</span>
                <Badge
                  variant={state.categories.analytics ? "default" : "secondary"}
                  className={cn(
                    "text-[10px] h-5",
                    state.categories.analytics
                      ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                      : "text-muted-foreground"
                  )}
                >
                  {state.categories.analytics ? "Mounted & Active ✓" : "Dismounted ✕"}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Google Consent Mode v2 Signals Matrix */}
        <Card className="border-border shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Google Consent Mode v2 Signals
            </CardTitle>
            <CardDescription>
              Signals dispatched to <code className="text-xs font-mono">window.gtag("consent", "update", &#123;...&#125;)</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 font-mono text-xs">
              {Object.entries(gcmSignals).map(([signal, info]) => (
                <div
                  key={signal}
                  className="p-2 rounded-lg border border-border/60 bg-muted/20 flex flex-col justify-between gap-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-foreground font-medium text-[11px] truncate">{signal}</span>
                    <Badge
                      variant={info.value === "granted" ? "default" : "secondary"}
                      className={cn(
                        "text-[10px] h-4 px-1.5",
                        info.value === "granted"
                          ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      "{info.value}"
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted-foreground truncate font-sans">
                    Category: {info.category}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Event Stream Console */}
      <EventStreamConsole events={events} onClearEvents={onClearEvents} />
    </div>
  );
}
