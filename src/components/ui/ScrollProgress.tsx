"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Reading-progress hairline across the very top of the viewport.
 * Effect adapted from jaydickinson/free-gsap-effects (MIT).
 *
 * Driven by scroll position rather than by a timer, so it is exempt from the
 * reduced-motion rule — it reflects an action the reader is taking. The spring
 * is heavily damped (no overshoot) to smooth wheel jitter without bouncing.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 260,
    damping: 40,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-gradient-to-r from-accent-deep via-accent to-accent-mint shadow-[0_0_12px_rgba(96,185,126,0.5)]"
    />
  );
}
