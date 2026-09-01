"use client";

import React from "react";
import {
  Sliders,
  Sparkles,
  Layers,
  Maximize2,
  Square,
  Shield,
  RotateCcw,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { BannerPosition, BannerSize } from "@/components/cookie-consent/types";

export interface PlaygroundOptions {
  position: BannerPosition;
  size: BannerSize;
  radiusClass: string;
  hasBackdrop: boolean;
  forceVisible: boolean;
}

interface CustomizationSidebarProps {
  options: PlaygroundOptions;
  setOptions: React.Dispatch<React.SetStateAction<PlaygroundOptions>>;
  onReset: () => void;
}

const POSITION_OPTIONS: { value: BannerPosition; label: string; desc: string }[] = [
  { value: "bottom-right", label: "Bottom Right", desc: "Floating card at bottom right" },
  { value: "bottom-left", label: "Bottom Left", desc: "Floating card at bottom left" },
  { value: "bottom", label: "Bottom Bar", desc: "Full-width dock at screen bottom" },
  { value: "top", label: "Top Bar", desc: "Full-width announcement bar at top" },
];

const SIZE_OPTIONS: { value: BannerSize; label: string; desc: string }[] = [
  { value: "sm", label: "Compact", desc: "Small text & tight padding" },
  { value: "default", label: "Standard", desc: "Balanced proportions" },
  { value: "lg", label: "Spacious", desc: "Large text & extra padding" },
];

const RADIUS_OPTIONS: { value: string; label: string }[] = [
  { value: "rounded-none", label: "Sharp" },
  { value: "rounded-md", label: "Subtle" },
  { value: "rounded-lg", label: "Standard" },
  { value: "rounded-2xl", label: "Curved" },
  { value: "rounded-full", label: "Pill" },
];

export function CustomizationSidebar({
  options,
  setOptions,
  onReset,
}: CustomizationSidebarProps) {
  return (
    <Card className="border-border/80 shadow-md bg-card/90 backdrop-blur-xs">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Sliders className="h-4 w-4 text-primary" />
            Customization
          </CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={onReset}
            className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
            title="Reset options to default"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
        </div>
        <CardDescription className="text-xs">
          Changes update live in Design and generate custom Code in real-time.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-4 space-y-5">
        {/* Control 1: Position */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5" />
              Position
            </Label>
            <Badge variant="outline" className="text-[10px] font-mono capitalize">
              {options.position.replace("-", " ")}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {POSITION_OPTIONS.map((pos) => {
              const active = options.position === pos.value;
              return (
                <button
                  key={pos.value}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, position: pos.value }))}
                  className={cn(
                    "flex flex-col items-start text-left p-2 rounded-lg border text-xs transition-all relative",
                    active
                      ? "border-primary bg-primary/10 text-foreground font-medium shadow-xs"
                      : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground"
                  )}
                >
                  <span className="font-semibold text-[11px] text-foreground">{pos.label}</span>
                  <span className="text-[10px] text-muted-foreground line-clamp-1 leading-tight">{pos.desc}</span>
                  {active && (
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 2: Size & Density */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Maximize2 className="h-3.5 w-3.5" />
              Size & Density
            </Label>
            <Badge variant="outline" className="text-[10px] font-mono uppercase">
              {options.size}
            </Badge>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {SIZE_OPTIONS.map((sz) => {
              const active = options.size === sz.value;
              return (
                <button
                  key={sz.value}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, size: sz.value }))}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg border text-xs transition-all",
                    active
                      ? "border-primary bg-primary/10 text-foreground font-medium shadow-xs"
                      : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground"
                  )}
                >
                  <span className="text-xs font-semibold text-foreground">{sz.label}</span>
                  <span className="text-[10px] text-muted-foreground text-center mt-0.5">{sz.desc.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 3: Corner Radius */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Square className="h-3.5 w-3.5" />
              Corner Radius
            </Label>
            <Badge variant="outline" className="text-[10px] font-mono">
              {options.radiusClass.replace("rounded-", "")}
            </Badge>
          </div>
          <div className="grid grid-cols-5 gap-1">
            {RADIUS_OPTIONS.map((rad) => {
              const active = options.radiusClass === rad.value;
              return (
                <button
                  key={rad.value}
                  type="button"
                  onClick={() => setOptions((prev) => ({ ...prev, radiusClass: rad.value }))}
                  className={cn(
                    "flex flex-col items-center justify-center py-2 px-1 border text-[11px] transition-all",
                    rad.value,
                    active
                      ? "border-primary bg-primary/10 text-foreground font-medium shadow-xs ring-1 ring-primary"
                      : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground"
                  )}
                >
                  <span>{rad.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Control 4: Behavior & Overlays */}
        <div className="space-y-2 pt-2 border-t border-border/40">
          <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Shield className="h-3.5 w-3.5" />
            Behavior & Overlays
          </Label>
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="sidebar-backdrop" className="text-xs font-medium cursor-pointer">
                  Backdrop Overlay
                </Label>
                <p className="text-[11px] text-muted-foreground">Blocks page clicks until consent is given</p>
              </div>
              <Switch
                id="sidebar-backdrop"
                checked={options.hasBackdrop}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, hasBackdrop: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20">
              <div className="space-y-0.5">
                <Label htmlFor="sidebar-force" className="text-xs font-medium cursor-pointer">
                  Always Visible (Preview)
                </Label>
                <p className="text-[11px] text-muted-foreground">Keeps banner open for easy styling</p>
              </div>
              <Switch
                id="sidebar-force"
                checked={options.forceVisible}
                onCheckedChange={(checked) =>
                  setOptions((prev) => ({ ...prev, forceVisible: checked }))
                }
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
