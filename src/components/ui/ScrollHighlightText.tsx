"use client";

import {
  motion,
  useScroll,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef } from "react";
import { cn } from "@/lib/cn";

/**
 * Paragraph that lights up word by word as it scrolls through the viewport,
 * each word passing through the accent colour before settling on foreground.
 * Effect adapted from jaydickinson/free-gsap-effects (MIT) — its GSAP version
 * uses SplitText + ScrollTrigger scrub; this is the same idea driven by the
 * scroll progress of the paragraph itself.
 *
 * Scroll-linked, not autoplaying, so it tracks the reader rather than running
 * at them. Under reduced motion it renders as plain, fully-lit text.
 */
export function ScrollHighlightText({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.55"],
  });

  const words = text.split(" ");

  if (reduceMotion) {
    // The ref stays attached even though nothing here animates: `useScroll`
    // above is called unconditionally (hooks can't be skipped) and looks its
    // target up on every frame, so a plain <p> without the ref made Framer
    // throw "Target ref is defined but not hydrated" from inside its frame
    // loop for every reduced-motion visitor.
    return (
      <p ref={ref} className={cn("text-fg", className)}>
        {text}
      </p>
    );
  }

  return (
    <p ref={ref} className={cn("text-fg-muted", className)}>
      {words.map((word, i) => (
        <Word
          key={`${word}-${i}`}
          progress={scrollYProgress}
          // Each word owns a slice of the paragraph's scroll range; slices
          // overlap slightly so the light travels rather than stepping.
          range={[i / words.length, (i + 1.6) / words.length]}
        >
          {word}
        </Word>
      ))}
    </p>
  );
}

/** Own component so the per-word hooks are not called inside a loop callback. */
function Word({
  children,
  progress,
  range,
}: {
  children: string;
  progress: MotionValue<number>;
  range: [number, number];
}) {
  const [start, end] = range;
  const mid = start + (end - start) * 0.55;

  const opacity = useTransform(progress, [start, end], [0.28, 1]);
  const color = useTransform(
    progress,
    [start, mid, end],
    ["#8FA499", "#60B97E", "#EDEDEF"],
  );

  return (
    <motion.span style={{ opacity, color }} className="inline-block">
      {children}
      {/* real space, so selection and wrapping behave normally */}
      <span>&nbsp;</span>
    </motion.span>
  );
}
