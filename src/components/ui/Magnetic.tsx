"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useCallback, useRef, useSyncExternalStore, type ReactNode } from "react";
import { cn } from "@/lib/cn";

const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

/**
 * Leans its child toward the cursor on hover, then springs back on leave.
 * Framer Motion springs rather than a GSAP tween, to stay on the one
 * animation runtime already in the bundle (see README "Motion").
 *
 * Travel is capped at `strength` instead of tracking the pointer 1:1, so the
 * control leans toward the cursor rather than chasing it.
 *
 * Deliberately inert without a hovering cursor: on touch there is no hover to
 * respond to, so the listeners would cost work for an effect nobody can see.
 * The capability is read through `useSyncExternalStore` so the server
 * snapshot is a definite `false` and the first client render agrees with the
 * markup it is hydrating.
 *
 * The wrapper is inline-block on purpose — as a block it would stretch the
 * full row and the pull would be measured from the centre of the row rather
 * than the centre of the button.
 */
export function Magnetic({
  children,
  strength = 14,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const subscribe = useCallback((onChange: () => void) => {
    const mql = window.matchMedia(HOVER_QUERY);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  const canHover = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(HOVER_QUERY).matches,
    () => false,
  );

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 22, mass: 0.5 });
  const springY = useSpring(y, { stiffness: 260, damping: 22, mass: 0.5 });

  if (reduceMotion || !canHover) {
    return <span className={cn("inline-block", className)}>{children}</span>;
  }

  const clamp = (v: number) => Math.max(-1, Math.min(1, v));

  return (
    <motion.span
      ref={ref}
      className={cn("inline-block", className)}
      style={{ x: springX, y: springY }}
      onPointerMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        // Offset from the element's own centre, normalised to -1..1.
        x.set(clamp((e.clientX - (r.left + r.width / 2)) / (r.width / 2)) * strength);
        y.set(clamp((e.clientY - (r.top + r.height / 2)) / (r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.span>
  );
}
