"use client"
import { Cookie } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCookieConsent } from "./cookie-provider"
import { cn } from "@/lib/utils"

export interface CookieTriggerProps {
  className?: string
  variant?: "icon" | "text" | "full"
}

/**
 * A trigger button to reopen cookie settings after initial consent
 */
export function CookieTrigger({ className, variant = "text" }: CookieTriggerProps) {
  const { openSettings, state } = useCookieConsent()

  if (!state.hasConsented) {
    return null
  }

  if (variant === "icon") {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={openSettings}
        className={cn("h-8 w-8", className)}
        aria-label="Cookie settings"
      >
        <Cookie className="h-4 w-4" />
      </Button>
    )
  }

  if (variant === "full") {
    return (
      <Button variant="outline" size="sm" onClick={openSettings} className={cn("gap-2", className)}>
        <Cookie className="h-4 w-4" />
        Cookie Settings
      </Button>
    )
  }

  return (
    <button
      onClick={openSettings}
      className={cn(
        "text-sm text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors",
        className,
      )}
    >
      Cookie Settings
    </button>
  )
}
