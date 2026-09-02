"use client";

import React, { useState } from "react";
import {
  Terminal,
  Trash2,
  ChevronDown,
  ChevronRight,
  Activity,
  Clock,
  CheckCircle2,
  XCircle,
  Database,
  Server,
  Radio,
  FileCode2,
  ExternalLink,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import type { ConsentChangeEvent, ConsentRecord } from "@/components/cookie-consent/types";

export interface TelemetryLogEntry {
  id: string;
  timestamp: string;
  timeString: string;
  changeEvent: ConsentChangeEvent;
  backendRecord?: ConsentRecord;
  backendStatus?: "delivered" | "failed" | "pending" | "disabled";
  backendEndpoint?: string;
  backendResponse?: {
    status: number;
    statusText: string;
    data?: any;
  };
  error?: string;
}

interface EventStreamConsoleProps {
  events: TelemetryLogEntry[];
  onClearEvents?: () => void;
}

export function EventStreamConsole({ events, onClearEvents }: EventStreamConsoleProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0); // expand latest by default

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Card className="border-border/80 shadow-md bg-card/90">
      <CardHeader className="pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 space-y-0 border-b border-border/40">
        <div>
          <div className="flex items-center gap-2">
            <CardTitle className="text-base font-bold flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary animate-pulse" />
              Live Consent & Traceability Audit Log
            </CardTitle>
            <Badge variant="outline" className="text-xs font-mono">
              {events.length} {events.length === 1 ? "event" : "events"}
            </Badge>
          </div>
          <CardDescription className="text-xs mt-0.5">
            Real-time client <code className="text-[11px] font-mono">onConsentChange</code> dispatches & verified backend API transmission receipts
          </CardDescription>
        </div>
        {events.length > 0 && onClearEvents && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearEvents}
            className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground border border-border/60"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Log
          </Button>
        )}
      </CardHeader>

      <CardContent className="p-4">
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-xl border-border/80 bg-muted/20">
            <Terminal className="h-9 w-9 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-semibold text-foreground">Awaiting consent telemetry...</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-md">
              Interact with the banner in Design or use the simulation buttons in the left sidebar. Client events and backend audit receipts will stream here live.
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {[...events].reverse().map((evt, idx) => {
              const actualIndex = events.length - 1 - idx;
              const isExpanded = expandedIndex === actualIndex;
              const action = evt.changeEvent.action;

              return (
                <div
                  key={evt.id || actualIndex}
                  className={cn(
                    "border rounded-xl bg-card transition-all overflow-hidden shadow-xs",
                    isExpanded ? "border-primary/50 ring-1 ring-primary/20" : "border-border/70 hover:border-border"
                  )}
                >
                  {/* Summary Bar */}
                  <button
                    onClick={() => toggleExpand(actualIndex)}
                    className="w-full p-3 flex flex-wrap items-center justify-between gap-3 text-left hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex flex-wrap items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-primary shrink-0" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0" />
                      )}

                      <span className="font-mono font-bold text-xs text-foreground">
                        #{actualIndex + 1}
                      </span>

                      {/* Action Badge */}
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[11px] font-mono capitalize px-2 py-0.5",
                          action === "accept_all" && "border-emerald-500/40 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
                          action === "reject_all" && "border-rose-500/40 text-rose-600 dark:text-rose-400 bg-rose-500/10",
                          action === "custom" && "border-blue-500/40 text-blue-600 dark:text-blue-400 bg-blue-500/10",
                          action === "update" && "border-amber-500/40 text-amber-600 dark:text-amber-400 bg-amber-500/10"
                        )}
                      >
                        {action.replace("_", " ")}
                      </Badge>

                      {/* Backend Transmission Status Receipt Badge */}
                      {evt.backendStatus === "delivered" && (
                        <Badge
                          variant="secondary"
                          className="text-[11px] font-mono border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 gap-1"
                        >
                          <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                          Backend 200 OK ({evt.backendEndpoint || "/api/consent"})
                        </Badge>
                      )}

                      {evt.backendStatus === "failed" && (
                        <Badge
                          variant="destructive"
                          className="text-[11px] font-mono gap-1"
                        >
                          <XCircle className="h-3 w-3" />
                          Backend Delivery Failed
                        </Badge>
                      )}

                      {evt.backendStatus === "disabled" && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-mono text-muted-foreground"
                        >
                          Traceability Disabled
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {/* Granted categories pills */}
                      <div className="hidden md:flex items-center gap-1">
                        {Object.entries(evt.changeEvent.currentCategories).map(([cat, granted]) => (
                          <span
                            key={cat}
                            className={cn(
                              "text-[10px] font-mono px-1.5 py-0.5 rounded",
                              granted
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-medium"
                                : "bg-muted text-muted-foreground/70"
                            )}
                          >
                            {cat.slice(0, 4)}: {granted ? "✓" : "✕"}
                          </span>
                        ))}
                      </div>

                      <span className="text-[11px] text-muted-foreground flex items-center gap-1 font-mono shrink-0">
                        <Clock className="h-3 w-3" />
                        {evt.timeString || "just now"}
                      </span>
                    </div>
                  </button>

                  {/* Expanded Breakdown & JSON Viewer */}
                  {isExpanded && (
                    <div className="p-4 bg-muted/30 border-t border-border/60 space-y-4">
                      {/* Overview Metadata Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                        <div className="p-2.5 rounded-lg border border-border/80 bg-background/80 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                            Visitor & Session
                          </span>
                          <p className="font-mono font-medium text-foreground truncate text-[11px]" title={evt.backendRecord?.visitorId || "Anonymous Session"}>
                            {evt.backendRecord?.visitorId || "Client Session"}
                          </p>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            Consent ID: {evt.backendRecord?.consentId?.slice(0, 16) || "client-local"}...
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-border/80 bg-background/80 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                            Backend Traceability
                          </span>
                          <div className="flex items-center gap-1 font-medium text-[11px]">
                            <Server className="h-3 w-3 text-primary" />
                            <span>POST {evt.backendEndpoint || "/api/consent"}</span>
                          </div>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium block">
                            {evt.backendStatus === "delivered" ? "✓ Stored in API memory record" : evt.error || "Client dispatched"}
                          </span>
                        </div>

                        <div className="p-2.5 rounded-lg border border-border/80 bg-background/80 space-y-1">
                          <span className="text-[10px] font-mono uppercase text-muted-foreground block">
                            Policy Expiration
                          </span>
                          <p className="font-mono text-foreground text-[11px] truncate">
                            {evt.backendRecord?.expiresAt ? new Date(evt.backendRecord.expiresAt).toLocaleDateString() : "365 Days"}
                          </p>
                          <span className="text-[10px] text-muted-foreground block">
                            Version: {evt.backendRecord?.consentVersion || "1.0.0"}
                          </span>
                        </div>
                      </div>

                      {/* Payload Tabs */}
                      <Tabs defaultValue="backend" className="w-full">
                        <TabsList className="h-7 p-0.5 bg-muted/80 border border-border/70 rounded-md">
                          <TabsTrigger value="backend" className="text-[11px] px-2.5 h-6 gap-1">
                            <Database className="h-3 w-3 text-primary" />
                            Backend Audit Record ({evt.backendStatus === "delivered" ? "Receipt" : "Sent"})
                          </TabsTrigger>
                          <TabsTrigger value="client" className="text-[11px] px-2.5 h-6 gap-1">
                            <Radio className="h-3 w-3 text-primary" />
                            Client Event Payload
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="backend" className="mt-2 focus-visible:outline-none">
                          <div className="relative rounded-lg bg-zinc-950 p-3 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-border/60 max-h-[220px]">
                            <div className="absolute top-2 right-2 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                              POST /api/consent payload
                            </div>
                            <pre className="whitespace-pre">
                              {JSON.stringify(
                                evt.backendRecord || {
                                  note: "Traceability record format sent to backend endpoint",
                                  visitorId: "vis_12345678",
                                  consentId: "csnt_uuid4",
                                  action: evt.changeEvent.action,
                                  categories: evt.changeEvent.currentCategories,
                                  timestamp: evt.timestamp,
                                  url: "https://openconsent.dev/playground",
                                },
                                null,
                                2
                              )}
                            </pre>
                          </div>
                        </TabsContent>

                        <TabsContent value="client" className="mt-2 focus-visible:outline-none">
                          <div className="relative rounded-lg bg-zinc-950 p-3 text-zinc-100 font-mono text-[11px] overflow-x-auto border border-border/60 max-h-[220px]">
                            <div className="absolute top-2 right-2 text-[10px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded">
                              onConsentChange event
                            </div>
                            <pre className="whitespace-pre">
                              {JSON.stringify(evt.changeEvent, null, 2)}
                            </pre>
                          </div>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
