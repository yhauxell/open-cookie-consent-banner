"use client";

import React, { useEffect, useState } from "react";
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
  Server,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/components/cookie-consent";
import { EventStreamConsole, type TelemetryLogEntry } from "./event-stream-console";

interface TelemetryInspectorProps {
  events: TelemetryLogEntry[];
  onClearEvents?: () => void;
  backendEndpoint?: string;
  traceabilityEnabled?: boolean;
}

export function TelemetryInspector({
  events,
  onClearEvents,
  backendEndpoint = "/api/consent",
  traceabilityEnabled = true,
}: TelemetryInspectorProps) {
  const { state, resetConsent, openSettings, acceptAll, rejectAll, getLoadedScripts } =
    useCookieConsent();

  const [backendRecordsCount, setBackendRecordsCount] = useState<number | null>(null);

  // Poll or fetch stored backend records to confirm end-to-end receipt
  useEffect(() => {
    const fetchBackendCount = async () => {
      try {
        const res = await fetch(backendEndpoint);
        if (res.ok) {
          const data = await res.json();
          setBackendRecordsCount(data.total ?? (Array.isArray(data.records) ? data.records.length : null));
        }
      } catch {
        // Backend route may not be reached or custom endpoint
      }
    };

    fetchBackendCount();
  }, [events, backendEndpoint]);

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
    <div className="space-y-6">
      {/* Top action ribbon */}
      <Card className="border-primary/20 bg-primary/5 shadow-xs">
        <CardContent className="p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
              ⚡
            </div>
            <div>
              <p className="text-xs font-bold text-foreground">Interactive Simulation Bar</p>
              <p className="text-[11px] text-muted-foreground">Trigger consent transitions and observe immediate engine dispatches & backend sync</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <Button
              variant="default"
              size="sm"
              onClick={acceptAll}
              className="gap-1 h-7 text-xs px-2.5 shadow-xs"
            >
              <CheckCircle2 className="h-3 w-3" />
              Accept All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={rejectAll}
              className="gap-1 h-7 text-xs px-2.5 bg-background"
            >
              <XCircle className="h-3 w-3" />
              Reject Optional
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={openSettings}
              className="gap-1 h-7 text-xs px-2.5 bg-background"
            >
              <SlidersHorizontal className="h-3 w-3" />
              Open Modal
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetConsent}
              className="gap-1 h-7 text-xs px-2 text-muted-foreground hover:text-foreground"
            >
              <RefreshCw className="h-3 w-3" />
              Reset State
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Grid Row 1: Consent State & Backend Delivery Status */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Consent Identity Card */}
        <Card className="border-border/80 shadow-xs bg-card/90">
          <CardHeader className="pb-2.5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Cookie className="h-4 w-4 text-primary" />
                Consent State & Identity
              </CardTitle>
              <Badge
                variant={state.hasConsented ? "default" : "outline"}
                className={cn(
                  "text-[10px] font-mono",
                  state.hasConsented
                    ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {state.hasConsented ? "Consented" : "Pending"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Client storage & visitor session tracking
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Visitor ID</span>
              <span className="font-mono text-foreground text-[11px] truncate max-w-[200px]" title={state.visitorId || "Pending consent"}>
                {state.visitorId || "Pending consent"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Policy Version</span>
              <span className="font-mono text-foreground">{state.consentVersion}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Last Updated</span>
              <span className="font-mono text-foreground text-[11px]">
                {state.lastUpdated ? new Date(state.lastUpdated).toLocaleTimeString() : "Never"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Expiration Date</span>
              <span className="font-mono text-foreground text-[11px]">
                {state.expiresAt ? new Date(state.expiresAt).toLocaleDateString() : "365 Days"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Backend Traceability Delivery Status Card */}
        <Card className="border-border/80 shadow-xs bg-card/90">
          <CardHeader className="pb-2.5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold flex items-center gap-2">
                <Server className="h-4 w-4 text-primary" />
                Backend Traceability API
              </CardTitle>
              <Badge
                variant={traceabilityEnabled ? "default" : "outline"}
                className={cn(
                  "text-[10px] font-mono",
                  traceabilityEnabled
                    ? "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 font-medium"
                    : "text-muted-foreground"
                )}
              >
                {traceabilityEnabled ? "Active (200 OK)" : "Disabled"}
              </Badge>
            </div>
            <CardDescription className="text-xs">
              Server-side audit logging & regulatory compliance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Endpoint</span>
              <span className="font-mono text-foreground text-[11px]">POST {backendEndpoint}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Audit Database</span>
              <span className="font-mono text-foreground text-[11px]">
                {backendRecordsCount !== null ? `${backendRecordsCount} records stored` : "Connected"}
              </span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Delivery Protocol</span>
              <span className="font-mono text-foreground text-[11px]">fetch + automatic retry</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-muted-foreground">Client Metadata</span>
              <span className="font-mono text-foreground text-[11px]">UserAgent, URL, Language</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Grid Row 2: Category Permissions & GCM v2 Signals */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Category Permissions */}
        <Card className="border-border/80 shadow-xs bg-card/90">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              Category Permissions
            </CardTitle>
            <CardDescription className="text-xs">
              Live permission matrix for cookie categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((cat) => {
                const isGranted = state.categories[cat.key];
                return (
                  <div
                    key={cat.key}
                    className="p-2.5 rounded-lg border border-border/60 bg-muted/20 flex flex-col justify-between gap-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-xs text-foreground">{cat.label}</span>
                      <Badge
                        variant={isGranted ? "default" : "secondary"}
                        className={cn(
                          "text-[10px] h-4 px-1.5 font-mono",
                          isGranted
                            ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                            : "text-muted-foreground"
                        )}
                      >
                        {isGranted ? "Allowed ✓" : "Blocked ✕"}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground line-clamp-1">{cat.description}</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Google Consent Mode v2 Signals Matrix */}
        <Card className="border-border/80 shadow-xs bg-card/90">
          <CardHeader className="pb-2.5">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
              <Zap className="h-4 w-4 text-amber-500" />
              Google Consent Mode v2 Signals
            </CardTitle>
            <CardDescription className="text-xs">
              Signals dispatched to <code className="text-[11px] font-mono">gtag("consent", "update")</code>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-1.5 font-mono text-xs">
              {Object.entries(gcmSignals).slice(0, 6).map(([signal, info]) => (
                <div
                  key={signal}
                  className="p-2 rounded-lg border border-border/60 bg-muted/20 flex items-center justify-between gap-1"
                >
                  <span className="text-foreground text-[10px] truncate">{signal}</span>
                  <Badge
                    variant={info.value === "granted" ? "default" : "secondary"}
                    className={cn(
                      "text-[9px] h-3.5 px-1",
                      info.value === "granted"
                        ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                        : "text-muted-foreground"
                    )}
                  >
                    {info.value}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Row 3: Event Stream Console with Backend Audit Logs */}
      <EventStreamConsole events={events} onClearEvents={onClearEvents} />
    </div>
  );
}
