"use client";

import { useRef, useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Card that tracks the cursor with a soft radial glow.
 * Position is written to CSS custom properties so the moving part never
 * triggers a React re-render on mousemove.
 */
export function SpotlightCard({
  children,
  className,
  spotlightSize = 320,
  lift = true,
  as: Tag = "div",
  decoration,
}: {
  children: ReactNode;
  className?: string;
  spotlightSize?: number;
  lift?: boolean;
  as?: "div" | "article" | "li";
  /** Artwork anchored to the card box, painted under the content. */
  decoration?: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  const handleMove = (e: MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <Tag
      ref={ref as never}
      onMouseMove={handleMove}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line",
        "bg-gradient-to-b from-white/[0.07] to-white/[0.02] backdrop-blur-[2px]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_20px_rgba(0,0,0,0.45)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-expo",
        "hover:border-line-hover hover:shadow-[0_0_0_1px_rgba(96,185,126,0.22),0_8px_40px_rgba(0,0,0,0.55),0_0_70px_rgba(96,185,126,0.08)]",
        lift && "hover:-translate-y-1 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {/* top-edge hairline */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
      />
      {/* cursor spotlight */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-px transition-opacity duration-300 ease-expo"
        style={{
          opacity: active ? 1 : 0,
          background: `radial-gradient(${spotlightSize}px circle at var(--mx, 50%) var(--my, 50%), rgba(96,185,126,0.14), transparent 78%)`,
        }}
      />
      {decoration}
      {/* Fills the card and inherits the column so callers' flex-1 /
          mt-auto on children actually take effect. */}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Tag>
  );
}
