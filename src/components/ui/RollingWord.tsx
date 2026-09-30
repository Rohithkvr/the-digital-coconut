"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN = [0.7, 0, 0.84, 0] as const;

/**
 * Cycles through `words` like a split-flap board: the outgoing word's
 * letters flip up and away while the next word's letters rise into the
 * same slot, each letter a few milliseconds behind the last.
 *
 * `popLayout` is what makes it a roll rather than a queue — the leaving
 * word is lifted out of layout the moment it starts to exit, so both words
 * occupy the slot at once instead of one waiting for the other.
 *
 * Styling notes, both load-bearing:
 * - `letterClassName` is where a gradient goes. A clipped text background
 *   only paints inside the element that owns it, and every letter here is
 *   its own transformed box.
 * - Letters carry bottom padding (cancelled by a negative margin) so the
 *   gradient's paint area reaches the descender of a "p" — at tight leading
 *   the glyph hangs below its own line box, and the part outside the box
 *   would otherwise render invisible.
 *
 * `paused` holds the current word (used while the hero is off-screen).
 * Under reduced motion the first word is shown and nothing cycles. The
 * accessible sentence lives with the caller — this is decoration.
 */
export function RollingWord({
  words,
  interval = 2800,
  startDelay = 1.8,
  paused = false,
  className,
  letterClassName,
}: {
  words: readonly string[];
  /** Milliseconds each word holds. */
  interval?: number;
  /** Seconds before the first change — lets the entrance finish first. */
  startDelay?: number;
  paused?: boolean;
  className?: string;
  letterClassName?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const hasStarted = useRef(false);

  useEffect(() => {
    if (reduceMotion || paused || words.length < 2) return;
    let repeat: number | undefined;
    const advance = () => setIndex((i) => (i + 1) % words.length);
    // First change waits out the entrance; after a pause it just resumes.
    const first = window.setTimeout(
      () => {
        hasStarted.current = true;
        advance();
        repeat = window.setInterval(advance, interval);
      },
      hasStarted.current ? interval : startDelay * 1000,
    );
    return () => {
      window.clearTimeout(first);
      if (repeat !== undefined) window.clearInterval(repeat);
    };
  }, [reduceMotion, paused, interval, startDelay, words.length]);

  const word = words[index];

  return (
    <span
      className={cn(
        "relative inline-flex overflow-hidden pb-[0.18em] -mb-[0.18em] align-bottom",
        className,
      )}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span key={word} className="inline-flex whitespace-pre">
          {Array.from(word).map((char, k) => (
            <motion.span
              key={k}
              className={cn("inline-block pb-[0.18em] -mb-[0.18em]", letterClassName)}
              initial={{ y: "105%", opacity: 0, filter: "blur(8px)" }}
              animate={{
                y: "0%",
                opacity: 1,
                filter: "blur(0px)",
                transition: { duration: 0.75, ease: EASE_OUT, delay: 0.08 + k * 0.035 },
              }}
              exit={{
                y: "-105%",
                opacity: 0,
                filter: "blur(8px)",
                transition: { duration: 0.42, ease: EASE_IN, delay: k * 0.025 },
              }}
            >
              {char}
            </motion.span>
          ))}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
