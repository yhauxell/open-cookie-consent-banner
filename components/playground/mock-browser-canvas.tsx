"use client";

import { useState } from "react";
import { Monitor, Smartphone, RotateCcw, ExternalLink, ShieldCheck, Sparkles, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface MockBrowserCanvasProps {
  children?: React.ReactNode;
  themeClass?: string;
}

export function MockBrowserCanvas({ children, themeClass }: MockBrowserCanvasProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "mobile">("desktop");
  const [reloadKey, setReloadKey] = useState(0);

  const handleReload = () => {
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-3">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Live Viewport Preview
          </span>
          <Badge variant="outline" className="text-xs font-mono">
            {viewMode === "desktop" ? "Desktop (100%)" : "Mobile (390px)"}
          </Badge>
        </div>

        <div className="flex items-center gap-1.5 bg-muted/60 p-1 rounded-lg border border-border">
          <Button
            size="sm"
            variant={viewMode === "desktop" ? "secondary" : "ghost"}
            className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setViewMode("desktop")}
          >
            <Monitor className="h-3.5 w-3.5" />
            Desktop
          </Button>
          <Button
            size="sm"
            variant={viewMode === "mobile" ? "secondary" : "ghost"}
            className="h-7 px-2.5 text-xs gap-1.5"
            onClick={() => setViewMode("mobile")}
          >
            <Smartphone className="h-3.5 w-3.5" />
            Mobile
          </Button>
        </div>
      </div>

      {/* Simulated Browser Frame */}
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out border border-border rounded-xl shadow-lg bg-card overflow-hidden",
          viewMode === "desktop" ? "w-full max-w-5xl" : "w-full max-w-[390px] border-4 border-muted-foreground/30 rounded-[2.5rem]"
        )}
      >
        {/* Browser Header / URL bar */}
        <div className="bg-muted/70 border-b border-border px-4 py-2.5 flex items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-1.5">
            <div className="h-3 w-3 rounded-full bg-red-500/80" />
            <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
            <div className="h-3 w-3 rounded-full bg-green-500/80" />
          </div>

          <div className="flex items-center gap-2 flex-1 max-w-sm mx-auto bg-background/90 border border-border/80 px-3 py-1 rounded-md text-xs font-mono text-muted-foreground justify-center">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span className="truncate">https://my-awesome-app.com</span>
          </div>

          <button
            onClick={handleReload}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            title="Reload preview"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Mock Site Body */}
        <div key={reloadKey} className={cn("relative min-h-[460px] max-h-[560px] overflow-y-auto bg-background p-6", themeClass)}>
          {/* Mock Navbar */}
          <nav className="flex items-center justify-between pb-6 mb-6 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                ⚡
              </div>
              <span className="font-semibold text-sm">Acme Corp</span>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer">Products</span>
              <span className="hover:text-foreground cursor-pointer hidden sm:inline">Docs</span>
              <span className="hover:text-foreground cursor-pointer hidden sm:inline">Pricing</span>
              <Button size="sm" variant="outline" className="h-7 text-xs">Sign In</Button>
            </div>
          </nav>

          {/* Mock Hero Content */}
          <div className="space-y-4 text-center max-w-xl mx-auto py-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
              <Sparkles className="h-3.5 w-3.5" />
              v2.0 Released with Google Consent Mode
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Modern Cloud Architecture for High-Growth Startups
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Scale your databases, edge functions, and telemetry seamlessly with zero cold starts and instant global distribution.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <Button size="sm" className="h-8 text-xs">Start 14-Day Free Trial</Button>
              <Button size="sm" variant="outline" className="h-8 text-xs">Book Demo</Button>
            </div>
          </div>

          {/* Mock Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 max-w-3xl mx-auto">
            <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
              <div className="h-7 w-7 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center mb-2">
                <Zap className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Sub-millisecond Latency</h3>
              <p className="text-[11px] text-muted-foreground">Global edge clusters deliver instant responses to your visitors.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
              <div className="h-7 w-7 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-2">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Zero-Trust Security</h3>
              <p className="text-[11px] text-muted-foreground">SOC2 and GDPR compliance with end-to-end data encryption.</p>
            </div>
            <div className="p-3.5 rounded-lg border border-border/60 bg-muted/20 space-y-1.5">
              <div className="h-7 w-7 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center mb-2">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Automated Telemetry</h3>
              <p className="text-[11px] text-muted-foreground">Consent-aware tracking for Google Analytics, PostHog, and Meta.</p>
            </div>
          </div>

          {/* Children: any backdrop or banner overlay */}
          {children}
        </div>
      </div>
    </div>
  );
}
