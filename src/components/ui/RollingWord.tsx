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
 * Both words are stacked in ONE grid cell and centred in it, rather than
 * the leaving word being popped out of layout. That keeps the roll centred
 * on a centred line: the cell's width follows whichever word is widest at
 * that moment, but every word sits on the cell's centre line, and the cell
 * sits on the line's — so neither word ever jumps sideways as the widths
 * change (Perform → Grow shrinks the cell by a third).
 *
 * The mask clips vertically only (`overflow-y: clip`), so a wider outgoing
 * word is never cut off at the sides while the cell narrows around it.
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
 * Transform and opacity only — no animated `filter: blur()`. Measured with a
 * GPU, blurring each letter mid-roll (plus a filter glow around the word)
 * halved the frame rate during every change; transform and opacity stay on
 * the compositor.
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
        "relative inline-grid overflow-y-clip pb-[0.18em] -mb-[0.18em] align-bottom",
        className,
      )}
    >
      <AnimatePresence initial={false}>
        <motion.span
          key={word}
          className="inline-flex justify-self-center whitespace-pre [grid-area:1/1]"
        >
          {Array.from(word).map((char, k) => (
            <motion.span
              key={k}
              className={cn("inline-block pb-[0.18em] -mb-[0.18em]", letterClassName)}
              initial={{ y: "105%", opacity: 0 }}
              animate={{
                y: "0%",
                opacity: 1,
                transition: { duration: 0.75, ease: EASE_OUT, delay: 0.08 + k * 0.035 },
              }}
              exit={{
                y: "-105%",
                opacity: 0,
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
