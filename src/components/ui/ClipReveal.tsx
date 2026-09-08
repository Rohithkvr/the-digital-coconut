"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Wipes content into view behind a moving clip edge, with a slight scale
 * settle so the image comes to rest rather than snapping.
 * Effect adapted from jaydickinson/free-gsap-effects (MIT).
 *
 * The observed element and the clipped element are deliberately separate:
 * `inset(0 0 100% 0)` collapses the target's visible box to nothing, and an
 * IntersectionObserver on that element then never reports it as visible, so
 * the reveal would never fire. The outer div stays unclipped and does the
 * watching; the inner one does the moving.
 */
export function ClipReveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const inView = useInView(ref, { once: true, amount: 0.2 });

  if (reduceMotion) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div
        className="relative h-full w-full"
        initial={{ clipPath: "inset(0% 0% 100% 0%)", scale: 1.06 }}
        animate={
          inView
            ? { clipPath: "inset(0% 0% 0% 0%)", scale: 1 }
            : { clipPath: "inset(0% 0% 100% 0%)", scale: 1.06 }
        }
        transition={{ duration: 0.9, delay, ease: EASE }}
      >
        {children}
      </motion.div>
    </div>
  );
}
