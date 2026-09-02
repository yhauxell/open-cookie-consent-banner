"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, Settings } from "lucide-react";
import { useCookieConsent } from "./cookie-provider";
import type { BannerPosition, BannerSize } from "./types";

export interface CookieBannerProps {
  className?: string;
  position?: BannerPosition;
  size?: BannerSize;
  buttonClassName?: string;
  isEmbedded?: boolean;
  forceVisible?: boolean;
  title?: string;
  description?: string;
  acceptAllText?: string;
  rejectAllText?: string;
  customizeText?: string;
  learnMoreText?: string;
}

export function CookieBanner({
  className,
  position: propPosition,
  size: propSize,
  buttonClassName,
  isEmbedded = false,
  forceVisible = false,
  title = "Cookie Preferences",
  description = "We use cookies to enhance your experience. By continuing to visit this site you agree to our use of cookies.",
  acceptAllText = "Accept All",
  rejectAllText = "Reject All",
  customizeText = "Customize",
  learnMoreText = "Learn more",
}: CookieBannerProps) {
  const { isBannerVisible, acceptAll, rejectAll, openSettings, config } =
    useCookieConsent();

  const showBanner = forceVisible || isBannerVisible;

  const positionClasses = {
    bottom: "inset-x-0 bottom-0",
    top: "inset-x-0 top-0",
    "bottom-left": "bottom-4 left-4 max-w-md",
    "bottom-right": "bottom-4 right-4 max-w-md",
  };

  const position = propPosition ?? config.position ?? "bottom";
  const isFloating = position === "bottom-left" || position === "bottom-right";
  const size = propSize ?? config.size ?? "default";

  // Prevent rounded-full from collapsing floating cards into distorted ovals
  const safeCardClassName = isFloating && className?.includes("rounded-full")
    ? className.replace(/\brounded-full\b/g, "rounded-3xl")
    : className;

  // Derive matching button radius from banner className or explicit buttonClassName
  const detectedRadius = className?.match(/\brounded-(none|xs|sm|md|lg|xl|2xl|3xl|full)\b/)?.[0];
  const buttonRadiusClass = buttonClassName ?? detectedRadius ?? "";

  const sizeStyles = {
    sm: {
      title: "text-xs font-semibold",
      description: "text-[11px] leading-relaxed",
      iconBox: "h-7 w-7",
      icon: "h-3.5 w-3.5",
      floatingPadding: "p-3.5 space-y-2.5",
      barPadding: "p-3.5 sm:px-6 sm:py-3.5",
      button: "h-7 text-[11px] px-2.5",
    },
    default: {
      title: "text-sm font-semibold",
      description: "text-xs sm:text-sm leading-relaxed",
      iconBox: "h-9 w-9 sm:h-10 sm:w-10",
      icon: "h-4 w-4 sm:h-5 sm:w-5",
      floatingPadding: "p-5 space-y-4",
      barPadding: "p-5 sm:px-8 sm:py-5",
      button: "h-8 text-xs px-3",
    },
    lg: {
      title: "text-base font-bold",
      description: "text-sm sm:text-base leading-relaxed",
      iconBox: "h-11 w-11 sm:h-12 sm:w-12",
      icon: "h-5 w-5 sm:h-6 sm:w-6",
      floatingPadding: "p-6 space-y-5",
      barPadding: "p-6 sm:px-10 sm:py-6",
      button: "h-9 text-sm px-4",
    },
  }[size];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: position.includes("top") ? -100 : 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: position.includes("top") ? -100 : 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={cn(
            isEmbedded ? "absolute z-30" : "fixed z-50",
            "p-3 sm:p-4",
            positionClasses[position]
          )}
        >
          <div
            className={cn(
              "@container bg-card border border-border rounded-lg shadow-lg overflow-hidden",
              !isFloating ? "mx-auto max-w-5xl" : "w-full",
              safeCardClassName
            )}
          >
            {isFloating ? (
              /* Floating Card Layout (bottom-left / bottom-right) */
              <div className={sizeStyles.floatingPadding}>
                <div className="flex items-center gap-3">
                  <div className={cn("shrink-0 flex items-center justify-center rounded-full bg-muted", sizeStyles.iconBox)}>
                    <Cookie className={cn("text-muted-foreground", sizeStyles.icon)} />
                  </div>
                  <h3 className={cn("text-foreground", sizeStyles.title)}>
                    {title}
                  </h3>
                </div>

                <p className={cn("text-muted-foreground", sizeStyles.description)}>
                  {description}{" "}
                  {config.privacyPolicyUrl && (
                    <a
                      href={config.privacyPolicyUrl}
                      className="underline underline-offset-4 hover:text-foreground transition-colors"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {learnMoreText}
                    </a>
                  )}
                </p>

                <div className="flex flex-col gap-2 pt-1">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openSettings}
                      className={cn("gap-1.5 bg-transparent w-full", sizeStyles.button, buttonRadiusClass)}
                    >
                      <Settings className={cn("shrink-0", sizeStyles.icon)} />
                      {customizeText}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={rejectAll}
                      className={cn("bg-transparent w-full", sizeStyles.button, buttonRadiusClass)}
                    >
                      {rejectAllText}
                    </Button>
                  </div>
                  <Button
                    size="sm"
                    onClick={acceptAll}
                    className={cn("w-full font-medium", sizeStyles.button, buttonRadiusClass)}
                  >
                    {acceptAllText}
                  </Button>
                </div>
              </div>
            ) : (
              /* Full-Width Bar Layout (bottom / top) */
              <div className={sizeStyles.barPadding}>
                <div className="flex flex-col gap-3.5 @3xl:flex-row @3xl:items-center @3xl:justify-between">
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={cn("shrink-0 flex items-center justify-center rounded-full bg-muted mt-0.5", sizeStyles.iconBox)}>
                      <Cookie className={cn("text-muted-foreground", sizeStyles.icon)} />
                    </div>
                    <div className="space-y-1">
                      <h3 className={cn("text-foreground", sizeStyles.title)}>
                        {title}
                      </h3>
                      <p className={cn("max-w-xl text-muted-foreground", sizeStyles.description)}>
                        {description}{" "}
                        {config.privacyPolicyUrl && (
                          <a
                            href={config.privacyPolicyUrl}
                            className="underline underline-offset-4 hover:text-foreground transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {learnMoreText}
                          </a>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Button cluster with container-aware responsive wrap */}
                  <div className="grid grid-cols-2 gap-2 @sm:flex @sm:items-center @sm:flex-wrap @sm:justify-end shrink-0 pt-1 @3xl:pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={openSettings}
                      className={cn("gap-1.5 bg-transparent col-span-1 @sm:w-auto", sizeStyles.button, buttonRadiusClass)}
                    >
                      <Settings className={cn("shrink-0", sizeStyles.icon)} />
                      {customizeText}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={rejectAll}
                      className={cn("bg-transparent col-span-1 @sm:w-auto", sizeStyles.button, buttonRadiusClass)}
                    >
                      {rejectAllText}
                    </Button>
                    <Button
                      size="sm"
                      onClick={acceptAll}
                      className={cn("font-medium col-span-2 @sm:w-auto", sizeStyles.button, buttonRadiusClass)}
                    >
                      {acceptAllText}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
