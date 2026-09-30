"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useState } from "react";
import type { Film } from "@/content/studio";
import { cn } from "@/lib/cn";

/** How long each film holds, in ms. The progress bar runs on the same clock. */
const HOLD = 3600;

/**
 * A "now showing" card that cycles through the studio's own films: each
 * still cross-fades in with a slow push, a hairline fills beneath it as the
 * countdown to the next, and the title rolls over. The whole card is one
 * link to the studio section.
 *
 * A compact row at every size (thumbnail + text), so it reads as a widget
 * rather than a second hero image. A stacked card was tried on desktop and
 * dropped: at ~250px tall it sat on top of the logo mark and hid the last
 * tiles to assemble.
 *
 * `paused` freezes the cycle while the hero is off-screen. Under reduced
 * motion the first film is shown still: no cycling, no push, no bar.
 */
export function ShowreelCard({
  films,
  href,
  label,
  paused = false,
  className,
}: {
  films: readonly Film[];
  href: string;
  /** Studio name, shown in the card's header. */
  label: string;
  paused?: boolean;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const cycling = !reduceMotion && !paused && films.length > 1;

  useEffect(() => {
    if (!cycling) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % films.length), HOLD);
    return () => window.clearInterval(id);
  }, [cycling, films.length]);

  const film = films[index];
  if (!film) return null;

  // The card is a glance, not a caption: "Marco — Teaser Recreation" won't
  // fit beside the thumbnail without an ellipsis, and the part after the dash
  // is what the kind label already says. So the name leads and the kind
  // moves down to the meta line.
  const name = film.title.split(" — ")[0];

  return (
    <a
      href={href}
      // A fixed name, deliberately: the visible title changes every few
      // seconds, and a name that mutated with it would make a focused
      // screen reader re-announce the link on every cycle. It leads with
      // "Reel", the card's most prominent visible word, so a voice-control
      // user saying "click Reel" still lands on it (WCAG 2.5.3).
      aria-label={`Reel: watch films by ${label}`}
      className={cn(
        "group flex items-center gap-3.5 rounded-2xl border border-line bg-surface-glass p-2.5 shadow-[var(--shadow-card)] backdrop-blur-xl transition-[border-color,box-shadow] duration-300 ease-expo hover:border-line-accent hover:shadow-[var(--shadow-card-hover)]",
        className,
      )}
    >
      {/* Still */}
      <div className="relative aspect-video w-32 shrink-0 overflow-hidden rounded-xl bg-canvas-deep sm:w-36">
        <AnimatePresence initial={false}>
          <motion.div
            key={film.youtubeId}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <motion.div
              className="absolute inset-0"
              initial={reduceMotion ? false : { scale: 1.14 }}
              animate={{ scale: 1 }}
              transition={{ duration: HOLD / 1000 + 1, ease: "linear" }}
            >
              <Image
                src={`https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`}
                alt=""
                fill
                sizes="144px"
                className="object-cover"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>

        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent"
        />
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white transition-transform duration-300 ease-expo group-hover:scale-110"
        >
          <svg viewBox="0 0 24 24" className="ml-0.5 h-3.5 w-3.5 fill-current">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>

        {/* Countdown to the next film, on the same clock as the cycle */}
        {cycling && (
          <motion.span
            key={`bar-${index}`}
            aria-hidden="true"
            className="absolute bottom-0 left-0 h-0.5 w-full origin-left bg-accent-mint"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: HOLD / 1000, ease: "linear" }}
          />
        )}
      </div>

      {/* Caption */}
      <div className="min-w-0 flex-1">
        <span className="mb-1 flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] text-fg-muted uppercase">
          <RecDot />
          Reel · {label}
        </span>
        <span className="relative block h-[1.4em] overflow-hidden font-display text-base font-semibold tracking-tight text-fg">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={film.slug}
              className="block truncate"
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: "0%", opacity: 1 }}
              exit={{ y: "-100%", opacity: 0 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              {name}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="mt-0.5 block truncate font-mono text-[10px] tracking-[0.14em] text-fg-subtle uppercase">
          <span className="max-[380px]:hidden">{film.kind} · </span>
          {film.views} views
        </span>
      </div>
    </a>
  );
}

function RecDot() {
  return (
    <span aria-hidden="true" className="relative flex h-1.5 w-1.5">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500/70 motion-reduce:hidden" />
      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
    </span>
  );
}
