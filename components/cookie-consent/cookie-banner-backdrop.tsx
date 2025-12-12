"use client";

import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { useCookieConsent } from "./cookie-provider";

export interface CookieBannerBackdropProps {
  /** Custom class name for the backdrop */
  className?: string;
  /** Whether clicking the backdrop should close the banner by rejecting all cookies */
  closeOnClick?: boolean;
  /** Custom blur amount (e.g., "4px", "8px"). Defaults to "4px" */
  blur?: string;
  /** Custom opacity for the backdrop (0-1). Defaults to 0.5 */
  opacity?: number;
}

export function CookieBannerBackdrop({
  className,
  closeOnClick = false,
  blur = "4px",
  opacity = 0.5,
}: CookieBannerBackdropProps) {
  const { isBannerVisible, rejectAll } = useCookieConsent();

  const handleClick = () => {
    if (closeOnClick) {
      rejectAll();
    }
  };

  return (
    <AnimatePresence>
      {isBannerVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          onClick={handleClick}
          className={cn(
            "fixed inset-0 z-40 bg-black/50",
            closeOnClick && "cursor-pointer",
            className
          )}
          style={{
            backgroundColor: `rgba(0, 0, 0, ${opacity})`,
            backdropFilter: `blur(${blur})`,
            WebkitBackdropFilter: `blur(${blur})`,
          }}
          aria-hidden="true"
        />
      )}
    </AnimatePresence>
  );
}
