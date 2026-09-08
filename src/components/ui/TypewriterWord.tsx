"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { cn } from "@/lib/cn";

const TYPE_MS = 115;  // per character, typing
const DELETE_MS = 55; // per character, deleting — always faster than typing
const HOLD_MS = 2200; // dwell on the finished word
const GAP_MS = 500;   // beat before the next word starts

/**
 * A word typed inline, character by character, with the caret trailing the
 * last character.
 *
 * Accessibility: the field is aria-hidden and the heading carries a static
 * sr-only sentence containing every word. Otherwise the accessible name of
 * the page's only <h1> would mutate on every keystroke. Under
 * prefers-reduced-motion the animation never starts and the first word is
 * shown complete.
 */
export function TypewriterWord({
  words,
  className,
}: {
  words: readonly string[];
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reduceMotion) return;

    const word = words[index];
    let timer: ReturnType<typeof setTimeout>;

    if (!deleting) {
      timer =
        text.length < word.length
          ? setTimeout(() => setText(word.slice(0, text.length + 1)), TYPE_MS)
          : setTimeout(() => setDeleting(true), HOLD_MS);
    } else {
      timer =
        text.length > 0
          ? setTimeout(() => setText(word.slice(0, text.length - 1)), DELETE_MS)
          : setTimeout(() => {
              setDeleting(false);
              setIndex((i) => (i + 1) % words.length);
            }, GAP_MS);
    }

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, reduceMotion]);

  const shown = reduceMotion ? words[0] : text;
  // A real caret sits solid while keys are being pressed and blinks at rest.
  const atRest = reduceMotion || shown === words[index] || shown === "";

  return (
    <span
      aria-hidden="true"
      className={cn("relative inline-flex items-center gap-[0.06em] align-middle", className)}
    >
      {/* min-width keeps the caret from jumping against the left edge between words */}
      <span className="text-gradient-accent min-w-[0.4em] whitespace-pre">{shown}</span>
      <span
        className={cn(
          "h-[0.85em] w-[0.05em] min-w-0.5 shrink-0 rounded-[1px] bg-accent-mint",
          atRest && !reduceMotion && "animate-[caret_1.1s_steps(1)_infinite]",
          reduceMotion && "opacity-70",
        )}
      />
    </span>
  );
}
