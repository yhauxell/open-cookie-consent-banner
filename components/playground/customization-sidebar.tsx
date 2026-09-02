"use client";

import React, { useState } from "react";
import {
  Sliders,
  Sparkles,
  Layers,
  Maximize2,
  Square,
  Shield,
  RotateCcw,
  Activity,
  Zap,
  CheckCircle2,
  XCircle,
  Settings,
  Database,
  Calendar,
  Link as LinkIcon,
  FileText,
  Plus,
  Trash2,
  Lock,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useCookieConsent } from "@/components/cookie-consent";
import type { BannerPosition, BannerSize, CategoryConfig, ConsentCategory } from "@/components/cookie-consent/types";

export const DEFAULT_PLAYGROUND_CATEGORIES: CategoryConfig[] = [
  {
    key: "necessary",
    title: "Necessary",
    description: "Essential cookies required for the website to function properly. These cannot be disabled.",
    required: true,
  },
  {
    key: "analytics",
    title: "Analytics",
    description: "Cookies that help us understand how visitors interact with our website.",
  },
  {
    key: "marketing",
    title: "Marketing",
    description: "Cookies used for advertising and tracking across websites.",
  },
  {
    key: "preferences",
    title: "Preferences",
    description: "Cookies that remember your settings and preferences.",
  },
];

export interface PlaygroundOptions {
  // Styling
  position: BannerPosition;
  size: BannerSize;
  radiusClass: string;
  hasBackdrop: boolean;
  forceVisible: boolean;

  // Banner Copy
  bannerTitle: string;
  bannerDescription: string;
  bannerAcceptText: string;
  bannerRejectText: string;
  bannerCustomizeText: string;
  bannerLearnMoreText: string;

  // Content & Modal
  modalTitle: string;
  modalDescription: string;
  categories: CategoryConfig[];

  // Telemetry Configuration
  enableTraceability: boolean;
  traceabilityEndpoint: string;
  enableGcm: boolean;
  expirationDays: number;
  privacyPolicyUrl: string;
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

const EXPIRATION_OPTIONS = [
  { label: "6 Mo", value: 180 },
  { label: "1 Yr", value: 365 },
  { label: "2 Yrs", value: 730 },
];

export function CustomizationSidebar({
  options,
  setOptions,
  onReset,
}: CustomizationSidebarProps) {
  const [sidebarTab, setSidebarTab] = useState<"styling" | "content" | "telemetry">("styling");
  const [contentSubTab, setContentSubTab] = useState<"banner" | "modal" | "categories">("banner");
  const [newCatKey, setNewCatKey] = useState("");
  const [newCatTitle, setNewCatTitle] = useState("");
  const [newCatDesc, setNewCatDesc] = useState("");
  const [isAddingCategory, setIsAddingCategory] = useState(false);

  const { state, acceptAll, rejectAll, openSettings } = useCookieConsent();

  const handleResetAll = () => {
    setSidebarTab("styling");
    onReset();
  };

  const handleUpdateCategory = (index: number, field: "title" | "description", value: string) => {
    setOptions((prev) => {
      const updated = [...prev.categories];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return { ...prev, categories: updated };
    });
  };

  const handleRemoveCategory = (key: string) => {
    if (key === "necessary") return;
    setOptions((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.key !== key),
    }));
  };

  const handleAddCustomCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatKey.trim() || !newCatTitle.trim()) return;

    const formattedKey = newCatKey.toLowerCase().trim().replace(/[^a-z0-9_]/g, "_") as ConsentCategory;

    // Avoid duplicates
    if (options.categories.some((c) => c.key === formattedKey)) {
      return;
    }

    const newCategory: CategoryConfig = {
      key: formattedKey,
      title: newCatTitle.trim(),
      description: newCatDesc.trim() || "Custom cookie category description.",
    };

    setOptions((prev) => ({
      ...prev,
      categories: [...prev.categories, newCategory],
    }));

    setNewCatKey("");
    setNewCatTitle("");
    setNewCatDesc("");
    setIsAddingCategory(false);
  };

  const handleResetCategories = () => {
    setOptions((prev) => ({
      ...prev,
      categories: DEFAULT_PLAYGROUND_CATEGORIES,
      modalTitle: "Cookie Settings",
      modalDescription: "Manage your cookie preferences below.",
      bannerTitle: "Cookie Preferences",
      bannerDescription: "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
      bannerAcceptText: "Accept All",
      bannerRejectText: "Reject All",
      bannerCustomizeText: "Customize",
      bannerLearnMoreText: "Learn more",
    }));
  };

  return (
    <Card className="border-border/80 shadow-md bg-card/90 backdrop-blur-xs">
      <CardHeader className="p-3 pb-2 border-b border-border/40">
        <div className="flex items-center justify-between">
          <Tabs
            value={sidebarTab}
            onValueChange={(val) => setSidebarTab(val as "styling" | "content" | "telemetry")}
            className="w-full"
          >
            <div className="flex items-center justify-between gap-1">
              <TabsList className="h-8 p-0.5 bg-muted/80 border border-border/70 rounded-lg">
                <TabsTrigger
                  value="styling"
                  className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-background"
                >
                  <Sliders className="h-3 w-3 text-primary" />
                  Styling
                </TabsTrigger>
                <TabsTrigger
                  value="content"
                  className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-background"
                >
                  <FileText className="h-3 w-3 text-primary" />
                  Content
                </TabsTrigger>
                <TabsTrigger
                  value="telemetry"
                  className="text-xs px-2 h-7 gap-1 data-[state=active]:bg-background"
                >
                  <Activity className="h-3 w-3 text-primary" />
                  Telemetry
                </TabsTrigger>
              </TabsList>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetAll}
                className="h-7 px-2 text-xs gap-1 text-muted-foreground hover:text-foreground"
                title="Reset all customizations, modal, telemetry, and view back to design"
              >
                <RotateCcw className="h-3 w-3" />
                Reset
              </Button>
            </div>
          </Tabs>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {sidebarTab === "styling" && (
          <div className="space-y-5">
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
                    <p className="text-[11px] text-muted-foreground">Blocks clicks until consent</p>
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
                      Always Visible
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Keeps preview open for styling</p>
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
          </div>
        )}

        {/* CONTENT TAB */}
        {sidebarTab === "content" && (
          <div className="space-y-4">
            {/* Sub-tabs: Banner / Modal / Categories */}
            <div className="flex items-center justify-between pb-1 border-b border-border/40">
              <div className="flex items-center gap-1 bg-muted/70 p-0.5 rounded-md text-[11px]">
                <button
                  type="button"
                  onClick={() => setContentSubTab("banner")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition-all",
                    contentSubTab === "banner" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Banner
                </button>
                <button
                  type="button"
                  onClick={() => setContentSubTab("modal")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition-all",
                    contentSubTab === "modal" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Modal
                </button>
                <button
                  type="button"
                  onClick={() => setContentSubTab("categories")}
                  className={cn(
                    "px-2.5 py-1 rounded font-medium transition-all",
                    contentSubTab === "categories" ? "bg-background text-foreground shadow-xs" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Categories ({options.categories.length})
                </button>
              </div>

              <Button
                size="sm"
                variant="ghost"
                onClick={handleResetCategories}
                className="h-6 text-[10px] px-1.5 text-muted-foreground hover:text-foreground"
                title="Reset copy to defaults"
              >
                Reset Copy
              </Button>
            </div>

            {/* SUBTAB 1: BANNER COPY */}
            {contentSubTab === "banner" && (
              <div className="space-y-3 animate-in fade-in-50 duration-150">
                <div className="space-y-1">
                  <Label htmlFor="banner-title" className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                    <MessageSquare className="h-3.5 w-3.5 text-primary" />
                    Banner Title
                  </Label>
                  <input
                    id="banner-title"
                    type="text"
                    value={options.bannerTitle}
                    onChange={(e) => setOptions((prev) => ({ ...prev, bannerTitle: e.target.value }))}
                    className="w-full bg-background border border-border/80 px-2.5 py-1.5 rounded-md text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Cookie Preferences"
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="banner-desc" className="text-xs font-semibold text-foreground">
                    Banner Message
                  </Label>
                  <textarea
                    id="banner-desc"
                    rows={3}
                    value={options.bannerDescription}
                    onChange={(e) => setOptions((prev) => ({ ...prev, bannerDescription: e.target.value }))}
                    className="w-full bg-background border border-border/80 px-2.5 py-1.5 rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                    placeholder="We use cookies to enhance your experience..."
                  />
                </div>

                <div className="space-y-2 pt-2 border-t border-border/40">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Button & Link Labels
                  </Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Primary (Accept)</span>
                      <input
                        type="text"
                        value={options.bannerAcceptText}
                        onChange={(e) => setOptions((prev) => ({ ...prev, bannerAcceptText: e.target.value }))}
                        className="w-full bg-background border border-border/80 px-2 py-1 rounded text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Secondary (Reject)</span>
                      <input
                        type="text"
                        value={options.bannerRejectText}
                        onChange={(e) => setOptions((prev) => ({ ...prev, bannerRejectText: e.target.value }))}
                        className="w-full bg-background border border-border/80 px-2 py-1 rounded text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Customize Button</span>
                      <input
                        type="text"
                        value={options.bannerCustomizeText}
                        onChange={(e) => setOptions((prev) => ({ ...prev, bannerCustomizeText: e.target.value }))}
                        className="w-full bg-background border border-border/80 px-2 py-1 rounded text-xs text-foreground"
                      />
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-muted-foreground block">Policy Link Text</span>
                      <input
                        type="text"
                        value={options.bannerLearnMoreText}
                        onChange={(e) => setOptions((prev) => ({ ...prev, bannerLearnMoreText: e.target.value }))}
                        className="w-full bg-background border border-border/80 px-2 py-1 rounded text-xs text-foreground"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 2: MODAL COPY */}
            {contentSubTab === "modal" && (
              <div className="space-y-3 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <FileText className="h-3.5 w-3.5 text-primary" />
                    Dialog Header
                  </Label>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={openSettings}
                    className="h-6 text-[11px] px-2 gap-1 border-primary/40 text-primary"
                  >
                    <ExternalLink className="h-2.5 w-2.5" />
                    Preview Modal
                  </Button>
                </div>

                <div className="space-y-2 bg-muted/20 p-2.5 rounded-lg border border-border/70">
                  <div className="space-y-1">
                    <Label htmlFor="modal-title" className="text-[11px] text-muted-foreground">
                      Dialog Title
                    </Label>
                    <input
                      id="modal-title"
                      type="text"
                      value={options.modalTitle}
                      onChange={(e) => setOptions((prev) => ({ ...prev, modalTitle: e.target.value }))}
                      className="w-full bg-background border border-border/80 px-2.5 py-1.5 rounded-md text-xs font-medium text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                      placeholder="Cookie Settings"
                    />
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="modal-desc" className="text-[11px] text-muted-foreground">
                      Dialog Description
                    </Label>
                    <textarea
                      id="modal-desc"
                      rows={2}
                      value={options.modalDescription}
                      onChange={(e) => setOptions((prev) => ({ ...prev, modalDescription: e.target.value }))}
                      className="w-full bg-background border border-border/80 px-2.5 py-1.5 rounded-md text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                      placeholder="Manage your cookie preferences below."
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SUBTAB 3: CATEGORIES */}
            {contentSubTab === "categories" && (
              <div className="space-y-3 animate-in fade-in-50 duration-150">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <Shield className="h-3.5 w-3.5 text-primary" />
                    Cookie Categories ({options.categories.length})
                  </Label>
                </div>

                {/* Active Category Cards */}
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  {options.categories.map((category, index) => {
                    const isNecessary = category.key === "necessary";
                    return (
                      <div
                        key={category.key}
                        className={cn(
                          "p-2.5 rounded-lg border text-xs space-y-2 transition-colors",
                          isNecessary ? "bg-muted/40 border-border/90" : "bg-card border-border/70"
                        )}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            {isNecessary && <Lock className="h-3 w-3 text-muted-foreground shrink-0" />}
                            <span className="font-mono text-[10px] text-muted-foreground uppercase">
                              {category.key}
                            </span>
                            {category.required && (
                              <Badge variant="secondary" className="text-[9px] h-3.5 px-1 font-mono">
                                Required
                              </Badge>
                            )}
                          </div>

                          {!isNecessary && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleRemoveCategory(category.key)}
                              className="h-5 w-5 p-0 text-muted-foreground hover:text-destructive"
                              title="Remove category"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="space-y-1.5">
                          <input
                            type="text"
                            value={category.title}
                            onChange={(e) => handleUpdateCategory(index, "title", e.target.value)}
                            className="w-full bg-background/80 border border-border/60 px-2 py-1 rounded text-xs font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Category Title"
                          />
                          <input
                            type="text"
                            value={category.description}
                            onChange={(e) => handleUpdateCategory(index, "description", e.target.value)}
                            className="w-full bg-background/80 border border-border/60 px-2 py-1 rounded text-[11px] text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            placeholder="Category Description"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Add Custom Category Button / Form */}
                {!isAddingCategory ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsAddingCategory(true)}
                    className="w-full h-7 text-xs gap-1.5 border-dashed border-border hover:border-primary"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add Custom Category
                  </Button>
                ) : (
                  <form onSubmit={handleAddCustomCategory} className="p-2.5 rounded-lg border border-primary/30 bg-primary/5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-foreground">New Category</span>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsAddingCategory(false)}
                        className="h-5 px-1.5 text-[10px]"
                      >
                        Cancel
                      </Button>
                    </div>
                    <input
                      type="text"
                      value={newCatKey}
                      onChange={(e) => setNewCatKey(e.target.value)}
                      placeholder="Key (e.g. personalization)"
                      className="w-full bg-background border border-border/80 px-2 py-1 rounded text-xs font-mono"
                      required
                    />
                    <input
                      type="text"
                      value={newCatTitle}
                      onChange={(e) => setNewCatTitle(e.target.value)}
                      placeholder="Title (e.g. Personalization)"
                      className="w-full bg-background border border-border/80 px-2 py-1 rounded text-xs"
                      required
                    />
                    <input
                      type="text"
                      value={newCatDesc}
                      onChange={(e) => setNewCatDesc(e.target.value)}
                      placeholder="Description..."
                      className="w-full bg-background border border-border/80 px-2 py-1 rounded text-[11px]"
                    />
                    <Button type="submit" size="sm" className="w-full h-7 text-xs">
                      Save Category
                    </Button>
                  </form>
                )}
              </div>
            )}
          </div>
        )}

        {/* TELEMETRY SIDEBAR TAB */}
        {sidebarTab === "telemetry" && (
          <div className="space-y-5">
            {/* Live Engine State Identity Ribbon */}
            <div className="p-3 rounded-lg border border-border/80 bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Activity className="h-3.5 w-3.5 text-primary" />
                  Live Engine State
                </span>
                <Badge
                  variant={state.hasConsented ? "default" : "outline"}
                  className="text-[10px] font-mono capitalize"
                >
                  {state.hasConsented ? "Consented" : "Pending"}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-1.5 text-[11px] text-muted-foreground pt-1 border-t border-border/40">
                <div>
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">Version</span>
                  <span className="font-mono text-foreground">{state.consentVersion}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-mono text-muted-foreground block">GCM Signals</span>
                  <span className="font-mono text-foreground">{options.enableGcm ? "Active" : "Disabled"}</span>
                </div>
              </div>
            </div>

            {/* Simulation Actions */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5" />
                Live State Simulation
              </Label>
              <div className="grid grid-cols-2 gap-1.5">
                <Button
                  size="sm"
                  variant="default"
                  onClick={acceptAll}
                  className="h-8 text-xs gap-1"
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  Accept All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={rejectAll}
                  className="h-8 text-xs gap-1"
                >
                  <XCircle className="h-3.5 w-3.5" />
                  Reject All
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={openSettings}
                  className="h-8 text-xs gap-1"
                >
                  <Settings className="h-3.5 w-3.5" />
                  Modal
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleResetAll}
                  className="h-8 text-xs gap-1 border border-border/80"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Reset All
                </Button>
              </div>
            </div>

            {/* Config 1: Google Consent Mode v2 */}
            <div className="space-y-2 pt-2 border-t border-border/40">
              <div className="flex items-center justify-between p-2.5 rounded-lg border border-border/80 bg-muted/20">
                <div className="space-y-0.5">
                  <Label htmlFor="sidebar-gcm" className="text-xs font-medium cursor-pointer flex items-center gap-1.5">
                    <Zap className="h-3 w-3 text-amber-500" />
                    Google Consent Mode v2
                  </Label>
                  <p className="text-[11px] text-muted-foreground">Auto-maps consent to gtag signals</p>
                </div>
                <Switch
                  id="sidebar-gcm"
                  checked={options.enableGcm}
                  onCheckedChange={(checked) =>
                    setOptions((prev) => ({ ...prev, enableGcm: checked }))
                  }
                />
              </div>

              {/* Config 2: Traceability Endpoint */}
              <div className="p-2.5 rounded-lg border border-border/80 bg-muted/20 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sidebar-trace" className="text-xs font-medium cursor-pointer flex items-center gap-1.5">
                      <Database className="h-3 w-3 text-blue-500" />
                      Traceability Audit API
                    </Label>
                    <p className="text-[11px] text-muted-foreground">Server-side audit logging</p>
                  </div>
                  <Switch
                    id="sidebar-trace"
                    checked={options.enableTraceability}
                    onCheckedChange={(checked) =>
                      setOptions((prev) => ({ ...prev, enableTraceability: checked }))
                    }
                  />
                </div>
                {options.enableTraceability && (
                  <div className="pt-1.5">
                    <div className="flex items-center gap-1.5 bg-background border border-border/80 px-2 py-1 rounded text-xs font-mono">
                      <span className="text-muted-foreground text-[10px]">POST</span>
                      <input
                        type="text"
                        value={options.traceabilityEndpoint}
                        onChange={(e) =>
                          setOptions((prev) => ({ ...prev, traceabilityEndpoint: e.target.value }))
                        }
                        className="bg-transparent text-xs text-foreground focus:outline-none w-full font-mono"
                        placeholder="/api/consent"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Config 3: Expiration Days */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <Calendar className="h-3 w-3" />
                  Consent Expiration
                </Label>
                <div className="grid grid-cols-3 gap-1">
                  {EXPIRATION_OPTIONS.map((exp) => {
                    const active = options.expirationDays === exp.value;
                    return (
                      <button
                        key={exp.value}
                        type="button"
                        onClick={() => setOptions((prev) => ({ ...prev, expirationDays: exp.value }))}
                        className={cn(
                          "py-1.5 px-2 rounded-md border text-xs text-center transition-all",
                          active
                            ? "border-primary bg-primary/10 text-foreground font-semibold"
                            : "border-border/70 hover:border-border hover:bg-muted/40 text-muted-foreground"
                        )}
                      >
                        {exp.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Config 4: Privacy Policy URL */}
              <div className="space-y-1.5 pt-1">
                <Label className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
                  <LinkIcon className="h-3 w-3" />
                  Privacy Policy Link
                </Label>
                <input
                  type="text"
                  value={options.privacyPolicyUrl}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, privacyPolicyUrl: e.target.value }))
                  }
                  className="w-full bg-background border border-border/80 px-2.5 py-1.5 rounded-lg text-xs font-mono text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="/privacy"
                />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
