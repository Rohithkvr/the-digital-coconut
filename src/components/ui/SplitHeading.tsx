"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Headline that rises into view a word at a time, each word lifting out of
 * its own overflow mask. Framer Motion, to stay on the one animation runtime
 * already in the bundle (see README "Motion").
 *
 * Two things here are load-bearing, not styling preference:
 *
 * - `wordClassName` exists so a gradient can be set on the WORD. Our
 *   `text-gradient` utility is `background-clip: text` + transparent colour,
 *   and a clipped background is painted only by the element that owns it —
 *   it cannot reach into descendants that establish their own painting
 *   context, which these masks do. Put `text-gradient` on an ancestor of the
 *   masks instead and the heading renders completely invisible.
 * - The masks carry bottom padding with a matching negative margin, or
 *   `overflow: hidden` shears the descenders off a "g" or "y".
 *
 * Under `prefers-reduced-motion` the words are rendered plainly, no masks
 * and no transforms.
 */
export function SplitHeading({
  text,
  className,
  wordClassName,
  delay = 0,
}: {
  text: string;
  className?: string;
  /** Classes for each word — put `text-gradient` here, never on an ancestor. */
  wordClassName?: string;
  delay?: number;
}) {
  const reduceMotion = useReducedMotion();
  const words = text.split(" ");

  if (reduceMotion) {
    return <span className={cn(wordClassName, className)}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, amount: 0.3 }}
      transition={{ staggerChildren: 0.055, delayChildren: delay }}
    >
      {words.map((word, i) => (
        // The space sits between masks, never inside one: trailing
        // whitespace in an inline-block collapses and the words would run
        // together.
        <span key={`${word}-${i}`}>
          <span className="inline-block overflow-hidden pb-[0.14em] align-bottom [margin-bottom:-0.14em]">
            <motion.span
              className={cn("inline-block", wordClassName)}
              variants={{
                hidden: { y: "110%", opacity: 0 },
                shown: { y: "0%", opacity: 1 },
              }}
              transition={{ duration: 0.75, ease: EASE }}
            >
              {word}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </span>
      ))}
    </motion.span>
  );
}
