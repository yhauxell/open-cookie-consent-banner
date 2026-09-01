"use client";

import React, { useState } from "react";
import { Terminal, Trash2, ChevronDown, ChevronRight, Activity, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ConsentChangeEvent } from "@/components/cookie-consent/types";

interface EventStreamConsoleProps {
  events: ConsentChangeEvent[];
  onClearEvents?: () => void;
}

export function EventStreamConsole({ events, onClearEvents }: EventStreamConsoleProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-3 flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary animate-pulse" />
            Live Consent Event Stream
          </CardTitle>
          <CardDescription>
            Real-time <code className="text-xs font-mono">onConsentChange</code> event dispatcher audit log
          </CardDescription>
        </div>
        {events.length > 0 && onClearEvents && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearEvents}
            className="h-8 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Clear Log
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center border border-dashed rounded-lg border-border/80 bg-muted/20">
            <Terminal className="h-8 w-8 text-muted-foreground/60 mb-2" />
            <p className="text-sm font-medium text-foreground">Awaiting consent events...</p>
            <p className="text-xs text-muted-foreground mt-1 max-w-sm">
              Interact with the banner buttons or trigger quick actions above to capture real-time dispatch payloads.
            </p>
          </div>
        ) : (
          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {[...events].reverse().map((evt, idx) => {
              const actualIndex = events.length - 1 - idx;
              const isExpanded = expandedIndex === actualIndex;
              return (
                <div
                  key={actualIndex}
                  className="border border-border/70 rounded-lg bg-card/60 overflow-hidden text-xs transition-colors"
                >
                  <button
                    onClick={() => toggleExpand(actualIndex)}
                    className="w-full p-2.5 flex items-center justify-between text-left hover:bg-muted/40 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      {isExpanded ? (
                        <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                      )}
                      <span className="font-mono font-semibold text-foreground">
                        Event #{actualIndex + 1}
                      </span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[10px] font-mono",
                          evt.action === "accept_all"
                            ? "border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10"
                            : evt.action === "reject_all"
                            ? "border-destructive/30 text-destructive bg-destructive/10"
                            : "border-primary/30 text-primary bg-primary/10"
                        )}
                      >
                        action: {evt.action}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-muted-foreground font-mono hidden sm:inline">
                        granted: {evt.grantedCategories.join(", ") || "none"}
                      </span>
                      <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3" />
                        just now
                      </span>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-3 bg-muted/40 border-t border-border/60">
                      <pre className="text-[11px] font-mono text-foreground/90 overflow-x-auto whitespace-pre-wrap">
                        {JSON.stringify(evt, null, 2)}
                      </pre>
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
