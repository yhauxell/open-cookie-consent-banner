"use client";
import {
  ConsentScript,
  CookieBanner,
  CookieConsentProvider,
  CookieSettings,
  CookieTrigger,
  useConsentScript,
  useCookieConsent,
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
import {
  AlertCircle,
  Code,
  Cookie,
  Database,
  RefreshCw,
  Shield,
  Zap,
} from "lucide-react";
import { useState } from "react";

const config: CookieConsentConfig = {
  consentVersion: "1.0.0",
  expirationDays: 365,
  privacyPolicyUrl: "/privacy",
  position: "bottom",
  traceability: {
    enabled: true,
    endpoint: "/api/consent",
    includeUserAgent: true,
    includeUrl: true,
    retryOnFailure: true,
    maxRetries: 3,
    onSuccess: (record) => {
      console.log("[Demo] Consent tracked successfully:", record.consentId);
    },
    onError: (error, record) => {
      console.error("[Demo] Failed to track consent:", error, record);
    },
  },
  onConsentChange: (event) => {
    console.log("[Demo] Consent changed:", {
      action: event.action,
      granted: event.grantedCategories,
      revoked: event.revokedCategories,
    });

    // Example: React to specific category changes
    if (event.revokedCategories.includes("analytics")) {
      console.log("[Demo] Analytics was revoked - scripts will be unloaded");
    }
    if (event.grantedCategories.includes("analytics")) {
      console.log("[Demo] Analytics was granted - scripts will be loaded");
    }
  },
};

function DemoContent() {
  const { state, resetConsent, openSettings, getLoadedScripts } =
    useCookieConsent();
  const [_consentEvents, _setConsentEvents] = useState<ConsentChangeEvent[]>(
    []
  );

  const analyticsScript = useConsentScript("analytics", "demo-analytics", {
    content: `console.log("[Demo] Analytics script loaded via useConsentScript hook");`,
    onRevoke: () => {
      console.log("[Demo] Analytics script revoked - cleaning up...");
    },
  });

  const categories = [
    { key: "necessary" as const, label: "Necessary", icon: Shield },
    { key: "analytics" as const, label: "Analytics", icon: Database },
    { key: "marketing" as const, label: "Marketing", icon: Zap },
    { key: "preferences" as const, label: "Preferences", icon: Cookie },
  ];

  const loadedScripts = getLoadedScripts();

  return (
    <div className="bg-background">
      <ConsentScript
        id="google-analytics"
        category="analytics"
        onLoad={() => console.log("[Demo] GA loaded")}
        onRevoke={() => console.log("[Demo] GA revoked and cleaned up")}
      >
        {`console.log("[Demo Script] Analytics initialized");`}
      </ConsentScript>

      <ConsentScript
        id="marketing-pixel"
        category="marketing"
        onLoad={() => console.log("[Demo] Marketing pixel loaded")}
        onRevoke={() => console.log("[Demo] Marketing pixel revoked")}
      >
        {`console.log("[Demo Script] Marketing pixel initialized");`}
      </ConsentScript>

      <div className="container max-w-4xl mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Cookie className="h-6 w-6 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground mb-3">
            Open Cookie Consent Banner
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto text-pretty">
            A full-featured, GDPR-compliant cookie consent solution with
            traceability support. Compatible with shadcn/ui registry.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consent Status</CardTitle>
              <CardDescription>
                Current consent state and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Has Consented
                  </span>
                  <Badge variant={state.hasConsented ? "default" : "secondary"}>
                    {state.hasConsented ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Version</span>
                  <code className="text-sm bg-muted px-2 py-0.5 rounded">
                    {state.consentVersion}
                  </code>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Visitor ID
                  </span>
                  <code className="text-xs bg-muted px-2 py-0.5 rounded truncate max-w-32">
                    {state.visitorId.slice(0, 8)}...
                  </code>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Categories</CardTitle>
              <CardDescription>Active cookie categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {categories.map(({ key, label, icon: Icon }) => (
                  <div
                    key={key}
                    className={`flex items-center gap-2 rounded-md border p-2 transition-colors ${
                      state.categories[key]
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-muted/30"
                    }`}
                  >
                    <Icon
                      className={`h-4 w-4 ${
                        state.categories[key]
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    <span className="text-sm">{label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Code className="h-5 w-5" />
              Script Management
            </CardTitle>
            <CardDescription>
              Third-party scripts are loaded/unloaded based on consent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Loaded Scripts</p>
                {loadedScripts.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {loadedScripts.map((id) => (
                      <Badge
                        key={id}
                        variant="outline"
                        className="font-mono text-xs"
                      >
                        {id}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    No scripts loaded - grant consent to load scripts
                  </p>
                )}
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">
                  Hook Example: useConsentScript
                </p>
                <div className="bg-muted rounded-md p-3 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">
                      demo-analytics
                    </span>
                    <div className="flex gap-2">
                      <Badge
                        variant={
                          analyticsScript.hasConsent ? "default" : "secondary"
                        }
                        className="text-xs"
                      >
                        {analyticsScript.hasConsent
                          ? "Consent ✓"
                          : "No Consent"}
                      </Badge>
                      <Badge
                        variant={
                          analyticsScript.isLoaded ? "default" : "outline"
                        }
                        className="text-xs"
                      >
                        {analyticsScript.isLoading
                          ? "Loading..."
                          : analyticsScript.isLoaded
                          ? "Loaded"
                          : "Not Loaded"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Open browser console to see script load/unload events. Try
                  accepting then rejecting cookies to see scripts being cleaned
                  up.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-lg">Actions</CardTitle>
            <CardDescription>
              Test the cookie consent functionality
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={resetConsent}
                className="gap-2 bg-transparent"
              >
                <RefreshCw className="h-4 w-4" />
                Reset Consent
              </Button>
              <Button
                variant="outline"
                onClick={openSettings}
                className="gap-2 bg-transparent"
              >
                <Cookie className="h-4 w-4" />
                Open Settings
              </Button>
              <CookieTrigger variant="full" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Features</CardTitle>
            <CardDescription>What this component provides</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="grid gap-2 sm:grid-cols-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                GDPR compliant consent management
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Granular category control
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Traceability with API endpoint
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Device and global consent modes
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Persistent localStorage storage
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Retry logic for failed API calls
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Consent-aware script loading
              </li>
              <li className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                Automatic script cleanup on revoke
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Cookie settings link */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <CookieTrigger variant="text" />
        </div>
      </div>
    </div>
  );
}

export function CookieConsentDemo() {
  return (
    <CookieConsentProvider config={config}>
      <DemoContent />
      <CookieBanner />
      <CookieSettings />
    </CookieConsentProvider>
  );
}
