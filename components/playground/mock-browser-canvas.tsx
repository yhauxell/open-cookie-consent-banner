"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, RotateCcw, ShieldCheck, Sparkles, Zap, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/components/cookie-consent";

interface MockBrowserCanvasProps {
  children?: React.ReactNode;
  themeClass?: string;
}

export function MockBrowserCanvas({ children, themeClass }: MockBrowserCanvasProps) {
  const [viewMode, setViewMode] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [reloadKey, setReloadKey] = useState(0);
  const { isBannerVisible, resetConsent } = useCookieConsent();

  const handleReload = () => {
    resetConsent();
    setReloadKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-3">
      {/* Top toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs font-mono">
            {viewMode === "desktop" && "Desktop (100%)"}
            {viewMode === "tablet" && "Tablet (768px)"}
            {viewMode === "mobile" && "Mobile (390px)"}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {!isBannerVisible && (
            <Button
              size="sm"
              variant="outline"
              onClick={resetConsent}
              className="h-7 px-2.5 text-xs gap-1.5 border-primary/40 text-primary hover:bg-primary/10"
            >
              <RotateCcw className="h-3 w-3" />
              Re-open Banner
            </Button>
          )}

          <div className="flex items-center gap-0.5 bg-muted/60 p-0.5 rounded-lg border border-border/80">
            <Button
              size="sm"
              variant={viewMode === "desktop" ? "secondary" : "ghost"}
              className="h-7 px-2 text-xs gap-1"
              onClick={() => setViewMode("desktop")}
            >
              <Monitor className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Desktop</span>
            </Button>
            <Button
              size="sm"
              variant={viewMode === "tablet" ? "secondary" : "ghost"}
              className="h-7 px-2 text-xs gap-1"
              onClick={() => setViewMode("tablet")}
            >
              <Tablet className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tablet</span>
            </Button>
            <Button
              size="sm"
              variant={viewMode === "mobile" ? "secondary" : "ghost"}
              className="h-7 px-2 text-xs gap-1"
              onClick={() => setViewMode("mobile")}
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Mobile</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Simulated Browser Frame */}
      <div
        className={cn(
          "mx-auto transition-all duration-300 ease-in-out border border-border/80 rounded-xl shadow-lg bg-card overflow-hidden",
          viewMode === "desktop" && "w-full",
          viewMode === "tablet" && "w-full max-w-[768px]",
          viewMode === "mobile" && "w-full max-w-[390px] border-4 border-muted-foreground/30 rounded-[2rem]"
        )}
      >
        {/* Browser Header / URL bar */}
        <div className="bg-muted/70 border-b border-border px-3.5 py-2 flex items-center justify-between gap-3 select-none">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80" />
            <div className="h-2.5 w-2.5 rounded-full bg-green-500/80" />
          </div>

          <div className="flex items-center gap-1.5 flex-1 max-w-xs mx-auto bg-background/90 border border-border/80 px-2.5 py-0.5 rounded text-xs font-mono text-muted-foreground justify-center">
            <Lock className="h-3 w-3 text-emerald-500" />
            <span className="truncate text-[11px]">https://my-app.com</span>
          </div>

          <button
            onClick={handleReload}
            className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded"
            title="Reload preview & reset consent"
          >
            <RotateCcw className="h-3 w-3" />
          </button>
        </div>

        {/* Mock Site Body */}
        <div key={reloadKey} className={cn("relative min-h-[500px] max-h-[620px] overflow-y-auto bg-background p-6", themeClass)}>
          {/* Re-open Banner overlay pill if dismissed */}
          {!isBannerVisible && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 bg-card/95 backdrop-blur border border-primary/40 shadow-md px-3 py-1.5 rounded-full flex items-center gap-2 text-xs animate-in fade-in zoom-in-95">
              <span className="text-muted-foreground font-medium text-[11px]">Consent Saved</span>
              <Button
                size="sm"
                variant="default"
                className="h-5 text-[10px] px-2 gap-1 rounded-full"
                onClick={resetConsent}
              >
                <RotateCcw className="h-2.5 w-2.5" />
                Reset
              </Button>
            </div>
          )}

          {/* Mock Navbar */}
          <nav className="flex items-center justify-between pb-4 mb-4 border-b border-border/40">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">
                ⚡
              </div>
              <span className="font-semibold text-xs">Acme Inc</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="hover:text-foreground cursor-pointer">Product</span>
              <span className="hover:text-foreground cursor-pointer hidden sm:inline">Pricing</span>
              <Button size="sm" variant="outline" className="h-6 text-[11px] px-2">Sign In</Button>
            </div>
          </nav>

          {/* Mock Hero Content */}
          <div className="space-y-3 text-center max-w-lg mx-auto py-4">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[11px] font-medium border border-primary/20">
              <Sparkles className="h-3 w-3" />
              v2.0 with Google Consent Mode
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Modern Privacy & Cloud Architecture
            </h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Scale your edge functions and privacy telemetry seamlessly with zero proprietary lock-in.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              <Button size="sm" className="h-7 text-xs px-3">Get Started Free</Button>
              <Button size="sm" variant="outline" className="h-7 text-xs px-3">Live Demo</Button>
            </div>
          </div>

          {/* Mock Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 max-w-2xl mx-auto">
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
              <div className="h-6 w-6 rounded bg-blue-500/10 text-blue-500 flex items-center justify-center mb-1">
                <Zap className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">Sub-ms Latency</h3>
              <p className="text-[10px] text-muted-foreground leading-tight">Instant script blocking and activation.</p>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
              <div className="h-6 w-6 rounded bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1">
                <ShieldCheck className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">GDPR & CCPA</h3>
              <p className="text-[10px] text-muted-foreground leading-tight">Granular consent categories and audit trail.</p>
            </div>
            <div className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1">
              <div className="h-6 w-6 rounded bg-purple-500/10 text-purple-500 flex items-center justify-center mb-1">
                <Sparkles className="h-3.5 w-3.5" />
              </div>
              <h3 className="font-semibold text-xs text-foreground">GCM v2 Ready</h3>
              <p className="text-[10px] text-muted-foreground leading-tight">Auto-detects Google scripts for EU traffic.</p>
            </div>
          </div>

          {/* Children: any backdrop or banner overlay */}
          {children}
        </div>
      </div>
    </div>
  );
}
