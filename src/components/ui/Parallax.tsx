"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useEffect, useState, type ReactNode, type RefObject } from "react";

/**
 * Multi-depth parallax scene, adapted from the pointer + scroll parallax
 * pattern in jaydickinson/free-gsap-effects' "Parallax Hero" (MIT) —
 * reimplemented on Framer Motion rather than GSAP/ScrollTrigger (see the
 * README's Motion section for why).
 *
 * Two independent drivers, exactly like the source:
 *  - scroll: layers travel vertically at a fraction of the scene's own
 *    scroll progress. A layer travelling LESS than the foreground content
 *    reads as further back; travelling MORE reads as closer than everything
 *    else — the same "recede vs. advance" idea as the original's
 *    depth = speed - 1.
 *  - pointer: on fine-pointer, hover-capable devices only, layers drift with
 *    the cursor, each by its own range, so the scene tilts slightly toward
 *    wherever the reader is looking.
 *
 * Both drivers are transform-only (translate/rotate), so nothing here ever
 * affects layout — safe to use around content that must not reflow.
 */

/** True only on devices that can meaningfully hover with a precise pointer. */
function useFinePointer(): boolean {
  // Lazy initializer runs during render, not after — so the first client
  // render already reflects reality instead of forcing a second render via
  // setState in an effect. SSR always yields false since window is absent.
  const [fine, setFine] = useState(() =>
    typeof window === "undefined"
      ? false
      : window.matchMedia("(hover: hover) and (pointer: fine)").matches,
  );
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const onChange = (e: MediaQueryListEvent) => setFine(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return fine;
}

/**
 * Tracks the pointer's position within `ref` as spring-smoothed values in
 * roughly [-0.5, 0.5] (0 = centre). Disabled — and left at rest — under
 * reduced motion or on touch/coarse-pointer devices, matching the source
 * effect's own gating.
 */
export function useParallaxPointer(ref: RefObject<HTMLElement | null>) {
  const reduceMotion = useReducedMotion();
  const finePointer = useFinePointer();
  const active = finePointer && !reduceMotion;

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 100, damping: 22, mass: 0.4 });
  const y = useSpring(rawY, { stiffness: 100, damping: 22, mass: 0.4 });

  useEffect(() => {
    const el = ref.current;
    if (!el || !active) return;

    const handleMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      rawX.set((e.clientX - rect.left) / rect.width - 0.5);
      rawY.set((e.clientY - rect.top) / rect.height - 0.5);
    };
    const handleLeave = () => {
      rawX.set(0);
      rawY.set(0);
    };

    el.addEventListener("pointermove", handleMove);
    el.addEventListener("pointerleave", handleLeave);
    return () => {
      el.removeEventListener("pointermove", handleMove);
      el.removeEventListener("pointerleave", handleLeave);
    };
  }, [ref, active, rawX, rawY]);

  return { x, y, active };
}

export function ParallaxLayer({
  children,
  className,
  scrollYProgress,
  scrollRange = 0,
  pointerX,
  pointerY,
  pointerRange = 0,
  rotateRange = 0,
}: {
  children: ReactNode;
  className?: string;
  /** 0→1 progress of the scene the layer sits in. */
  scrollYProgress: MotionValue<number>;
  /** Vertical travel (px) across the full scroll range. Smaller than the
   *  foreground's own travel reads as "behind"; larger reads as "in front". */
  scrollRange?: number;
  pointerX: MotionValue<number>;
  pointerY: MotionValue<number>;
  /** Max drift (px) at the pointer's extreme. 0 disables pointer drift. */
  pointerRange?: number;
  /** Max rotation (deg) at the pointer's extreme. */
  rotateRange?: number;
}) {
  const scrollY = useTransform(scrollYProgress, [0, 1], [0, scrollRange]);
  const driftX = useTransform(pointerX, [-0.5, 0.5], [-pointerRange, pointerRange]);
  const driftY = useTransform(pointerY, [-0.5, 0.5], [-pointerRange, pointerRange]);
  const rotate = useTransform(pointerX, [-0.5, 0.5], [-rotateRange, rotateRange]);

  const combinedY = useTransform([scrollY, driftY], ([s, d]: number[]) => s + d);

  return (
    <motion.div
      style={{ y: combinedY, x: driftX, rotate }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
