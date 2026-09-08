"use client";

import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

/**
 * The four-layer canvas: base radial → noise → floating light pools → grid.
 * Fixed to the viewport so light travels with the reader rather than
 * scrolling off, which is what makes long dark pages feel lit.
 */
export function AmbientBackground({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 overflow-hidden",
        className,
      )}
    >
      {/* Layer 1 — base radial depth from top-centre */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,#0d2018_0%,#060B08_52%,#030605_100%)]" />

      {/* Layer 2 — noise, kills gradient banding and adds tactility */}
      <div
        className="absolute inset-0 opacity-[0.018] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Layer 3 — floating light pools */}
      <div
        className={cn(
          "absolute -top-56 left-1/2 h-[900px] w-[1200px] -translate-x-1/2 rounded-full blur-[150px]",
          "bg-[radial-gradient(circle,rgba(46,126,80,0.28)_0%,rgba(30,91,58,0.14)_45%,transparent_70%)]",
          !reduceMotion && "animate-float-slow",
        )}
      />
      <div
        className={cn(
          "absolute top-[28%] -left-64 h-[800px] w-[700px] rounded-full blur-[130px]",
          "bg-[radial-gradient(circle,rgba(140,167,122,0.14)_0%,rgba(30,91,58,0.10)_50%,transparent_72%)]",
          !reduceMotion && "animate-float-reverse",
        )}
      />
      <div
        className={cn(
          "absolute top-[55%] -right-56 h-[700px] w-[640px] rounded-full blur-[120px]",
          "bg-[radial-gradient(circle,rgba(96,185,126,0.13)_0%,rgba(46,126,80,0.08)_50%,transparent_72%)]",
          !reduceMotion && "animate-float-slow",
        )}
      />
      <div
        className={cn(
          "absolute bottom-[-12%] left-1/2 h-[520px] w-[1100px] -translate-x-1/2 rounded-full blur-[150px]",
          "bg-[radial-gradient(ellipse,rgba(30,91,58,0.16)_0%,transparent_70%)]",
          !reduceMotion && "animate-pulse-glow",
        )}
      />

      {/* Layer 4 — 64px technical grid, masked so it never reaches the edges */}
      <div className="grid-overlay absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_70%_60%_at_50%_20%,#000_35%,transparent_100%)]" />
    </div>
  );
}
