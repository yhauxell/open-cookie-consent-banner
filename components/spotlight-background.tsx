"use client";

import React, { useEffect, useRef } from "react";

interface SpotlightBackgroundProps {
  className?: string;
  size?: number;
  showGrid?: boolean;
}

/**
 * High-performance GPU-accelerated mouse-follow ambient spotlight and grid illuminator.
 * Dynamically updates CSS variables via requestAnimationFrame with 0 React re-renders.
 */
export function SpotlightBackground({
  className = "",
  size = 650,
  showGrid = true,
}: SpotlightBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const targetPos = useRef({ x: -1000, y: -1000 });
  const currentPos = useRef({ x: -1000, y: -1000 });
  const isInside = useRef(false);
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    // Disable on mobile/touch devices
    if (typeof window === "undefined" || window.matchMedia("(pointer: coarse)").matches) {
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    const handlePointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      if (
        e.clientX >= rect.left - 50 &&
        e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 50 &&
        e.clientY <= rect.bottom + 50
      ) {
        targetPos.current = { x, y };
        if (!isInside.current) {
          isInside.current = true;
          currentPos.current = { x, y };
        }
      } else {
        isInside.current = false;
      }
    };

    const handleMouseLeave = () => {
      isInside.current = false;
    };

    // Smooth RAF physics loop
    const animate = () => {
      const ease = 0.12;
      currentPos.current.x += (targetPos.current.x - currentPos.current.x) * ease;
      currentPos.current.y += (targetPos.current.y - currentPos.current.y) * ease;

      const posX = currentPos.current.x;
      const posY = currentPos.current.y;

      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${posX - size / 2}px, ${
          posY - size / 2
        }px, 0)`;
        glowRef.current.style.opacity = isInside.current ? "1" : "0";
      }

      if (gridRef.current) {
        gridRef.current.style.setProperty("--mouse-x", `${posX}px`);
        gridRef.current.style.setProperty("--mouse-y", `${posY}px`);
        gridRef.current.style.opacity = isInside.current ? "1" : "0";
      }

      rafId.current = requestAnimationFrame(animate);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, [size]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 overflow-hidden z-0 ${className}`}
      aria-hidden="true"
    >
      {/* 1. Base Subtle Ambient Glow Follower */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 rounded-full blur-[90px] will-change-transform transition-opacity duration-300 pointer-events-none"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          background: `radial-gradient(circle at center, rgba(251, 191, 36, 0.35) 0%, rgba(236, 72, 153, 0.28) 35%, rgba(168, 85, 247, 0.22) 55%, transparent 75%)`,
          opacity: 0,
        }}
      />

      {/* 2. Interactive High-Contrast Grid Reveal Layer */}
      {showGrid && (
        <div
          ref={gridRef}
          className="absolute inset-0 bg-grid-pattern transition-opacity duration-300 pointer-events-none opacity-0"
          style={{
            maskImage:
              "radial-gradient(380px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 10%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(380px circle at var(--mouse-x, -1000px) var(--mouse-y, -1000px), black 10%, transparent 85%)",
            filter: "brightness(2.2) contrast(1.4)",
          }}
        />
      )}
    </div>
  );
}
