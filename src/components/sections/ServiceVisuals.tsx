"use client";

import Image from "next/image";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useTime,
  useTransform,
  type MotionValue,
  type TargetAndTransition,
} from "framer-motion";
import { useEffect, useState, type ComponentType } from "react";
import { featuredFilm, films, type Film } from "@/content/studio";
import { cn } from "@/lib/cn";

/*
 * One small, looping demonstration per service — the work acted out rather
 * than described. They illustrate what the service does; there are no
 * figures in them, and the example names ("yourbusiness.in", a dentist
 * search) are plainly examples.
 *
 * Every visual takes `play`. When false (off-screen, hidden, or reduced
 * motion) it renders its finished frame and runs nothing: no intervals, no
 * repeating tweens.
 */

const EASE = [0.16, 1, 0.3, 1] as const;

type VisualProps = { play: boolean };

/**
 * Bumps a counter every `ms` while `play`. Keying a subtree on it re-mounts
 * that subtree, which replays a one-shot entrance sequence as a loop.
 */
function useCycle(play: boolean, ms: number) {
  const [cycle, setCycle] = useState(0);
  useEffect(() => {
    if (!play) return;
    const id = window.setInterval(() => setCycle((c) => c + 1), ms);
    return () => window.clearInterval(id);
  }, [play, ms]);
  return cycle;
}

/** Entrance props: animated when playing, the finished state when not. */
function appear(play: boolean, delay: number, from: TargetAndTransition = { opacity: 0, y: 8 }) {
  if (!play) return { initial: false as const };
  return {
    initial: from,
    animate: { opacity: 1, x: 0, y: 0, scale: 1 },
    transition: { duration: 0.6, ease: EASE, delay },
  };
}

/* ── 01 · Web development: a page builds itself and converts ────────── */

function BuildVisual({ play }: VisualProps) {
  const cycle = useCycle(play, 6500);

  return (
    <div className="absolute inset-0 p-[6%]">
      <div
        key={cycle}
        className="relative flex h-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0B1410] shadow-[0_20px_50px_rgba(0,0,0,0.45)]"
      >
        {/* Browser chrome */}
        <div className="flex items-center gap-1.5 border-b border-white/5 px-3 py-2.5">
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="h-2 w-2 rounded-full bg-white/15" />
          <span className="ml-3 flex-1 truncate rounded-md bg-white/[0.05] px-2.5 py-1 font-mono text-[10px] text-fg-subtle">
            yourbusiness.in
          </span>
        </div>

        <div className="relative flex flex-1 flex-col gap-[7%] p-[6%]">
          <motion.div {...appear(play, 0.1)} className="flex items-center justify-between">
            <span className="h-2.5 w-12 rounded-sm bg-accent-mint/60" />
            <span className="flex gap-2">
              <span className="h-1.5 w-6 rounded-sm bg-white/15" />
              <span className="h-1.5 w-6 rounded-sm bg-white/15" />
              <span className="h-1.5 w-6 rounded-sm bg-white/15" />
            </span>
          </motion.div>

          <div className="grid flex-1 grid-cols-[1.25fr_1fr] gap-[7%]">
            <div className="flex flex-col justify-center gap-2">
              <motion.span {...appear(play, 0.3)} className="h-3 w-[92%] rounded-sm bg-white/75" />
              <motion.span {...appear(play, 0.4)} className="h-3 w-[68%] rounded-sm bg-white/75" />
              <motion.span {...appear(play, 0.5)} className="mt-1 h-1.5 w-[84%] rounded-sm bg-white/15" />
              <motion.span {...appear(play, 0.55)} className="h-1.5 w-[60%] rounded-sm bg-white/15" />

              {/* CTA — the cursor lives inside it, so it always lands on it */}
              <motion.span {...appear(play, 0.7)} className="relative mt-3 w-fit">
                <motion.span
                  className="block rounded-md bg-accent px-4 py-2 font-mono text-[10px] tracking-[0.14em] text-white uppercase shadow-[var(--shadow-accent)]"
                  animate={play ? { scale: [1, 1, 0.92, 1] } : undefined}
                  transition={{ duration: 0.5, times: [0, 0.3, 0.55, 1], delay: 2.35 }}
                >
                  Book a visit
                </motion.span>
                {play && (
                  <>
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-0 rounded-md border-2 border-accent-mint"
                      initial={{ opacity: 0, scale: 1 }}
                      animate={{ opacity: [0, 0.9, 0], scale: [1, 1.05, 1.7] }}
                      transition={{ duration: 0.8, delay: 2.5, ease: "easeOut" }}
                    />
                    <motion.svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="absolute top-1/2 left-1/2 z-10 h-5 w-5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
                      initial={{ x: 140, y: 80, opacity: 0 }}
                      animate={{ x: [140, 140, 4, 4], y: [80, 80, 2, 2], opacity: [0, 1, 1, 1] }}
                      transition={{ duration: 2.1, times: [0, 0.35, 0.85, 1], ease: EASE, delay: 0.3 }}
                    >
                      <path d="M5 3l14 7-6 2-2 6z" fill="#fff" stroke="#060B08" strokeWidth="1.2" strokeLinejoin="round" />
                    </motion.svg>
                  </>
                )}
              </motion.span>
            </div>

            <motion.div
              {...appear(play, 0.55, { opacity: 0, scale: 0.94 })}
              className="rounded-lg border border-white/5 bg-[linear-gradient(140deg,#2E7E50_0%,#1E5B3A_45%,#0B1410_100%)]"
            />
          </div>

          <div className="grid grid-cols-3 gap-[5%]">
            {[0, 1, 2].map((k) => (
              <motion.div
                key={k}
                {...appear(play, 0.85 + k * 0.1)}
                className="flex h-9 flex-col justify-center gap-1.5 rounded-md border border-white/5 bg-white/[0.03] px-2"
              >
                <span className="h-1 w-[70%] rounded-sm bg-white/20" />
                <span className="h-1 w-[45%] rounded-sm bg-white/10" />
              </motion.div>
            ))}
          </div>

          {/* The conversion */}
          <motion.div
            {...appear(play, 2.75, { opacity: 0, y: -8, scale: 0.95 })}
            className="absolute top-[6%] right-[5%] flex items-center gap-2 rounded-lg border border-line-accent bg-[#0B1410]/95 px-2.5 py-1.5 shadow-[var(--shadow-card)]"
          >
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-accent-mint/20 text-accent-mint">
              <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth={3.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
              </svg>
            </span>
            <span className="font-mono text-[10px] tracking-[0.12em] text-fg uppercase">New enquiry</span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ── 02 · Performance marketing: impressions in, customers out ──────── */

// Deterministic, so server and client render the same particles.
const PARTICLES = Array.from({ length: 16 }, (_, i) => ({
  x: 14 + ((i * 37) % 72),
  delay: i * 0.19,
  converts: i % 5 === 2,
}));

function FunnelVisual({ play }: VisualProps) {
  return (
    <div className="absolute inset-0 flex flex-col p-[6%]">
      <div className="grid grid-cols-3 gap-[5%]">
        {["Reel ad", "Search ad", "Story ad"].map((label, k) => (
          <motion.div
            key={label}
            {...appear(play, 0.1 + k * 0.1)}
            className="rounded-lg border border-white/10 bg-[#0B1410] p-2"
          >
            <span className="block aspect-[16/9] rounded-sm bg-[linear-gradient(135deg,rgba(96,185,126,0.25),rgba(255,255,255,0.03))]" />
            <span className="mt-1.5 block font-mono text-[10px] tracking-[0.12em] text-fg-subtle uppercase">
              {label}
            </span>
          </motion.div>
        ))}
      </div>

      <div className="relative mt-[4%] flex-1">
        <span className="absolute top-0 left-0 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase">
          Impressions
        </span>
        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <path
            d="M8 6 L92 6 L58 64 L58 94 L42 94 L42 64 Z"
            fill="rgba(96,185,126,0.05)"
            stroke="rgba(255,255,255,0.14)"
            strokeWidth="0.5"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {play
          ? PARTICLES.map((p, i) => (
              <motion.span
                key={i}
                className={cn("absolute h-2 w-2 rounded-[1px]", p.converts && "z-10")}
                // Centred through Framer's `x`, not a CSS translate: Framer
                // writes `transform` to animate scale, which would wipe a
                // translate class and knock the particle off-centre.
                style={{ left: `${p.x}%`, top: "6%", x: "-50%" }}
                initial={{ opacity: 0 }}
                animate={
                  p.converts
                    ? {
                        left: [`${p.x}%`, "50%", "50%"],
                        top: ["6%", "62%", "92%"],
                        opacity: [0, 1, 1, 0],
                        scale: [1, 1, 1.5],
                        backgroundColor: ["#5c8c56", "#5c8c56", "#60B97E"],
                      }
                    : {
                        left: [`${p.x}%`, `${48 + (i % 3) * 2}%`],
                        top: ["6%", "58%"],
                        opacity: [0, 0.9, 0],
                        backgroundColor: ["#396b4c", "#5c8c56"],
                      }
                }
                transition={{
                  duration: p.converts ? 2.6 : 1.9,
                  delay: p.delay,
                  repeat: Infinity,
                  repeatDelay: 0.9,
                  ease: "easeIn",
                }}
              />
            ))
          : [20, 42, 66, 80, 34, 58].map((x, i) => (
              <span
                key={x}
                className="absolute h-2 w-2 rounded-[1px] bg-[#5c8c56]"
                style={{ left: `${x}%`, top: `${14 + i * 7}%`, opacity: 0.7 }}
              />
            ))}
      </div>

      <motion.div
        {...appear(play, 0.5)}
        className="mt-[3%] flex items-center justify-between rounded-lg border border-line-accent bg-accent-mint/[0.06] px-3 py-2"
      >
        <span className="font-mono text-[10px] tracking-[0.16em] text-accent-mint uppercase">Customers</span>
        <span className="flex gap-1.5">
          {[0, 1, 2].map((k) => (
            <motion.span
              key={k}
              className="flex h-5 w-5 items-center justify-center rounded-full bg-accent-mint/15 text-accent-mint"
              animate={play ? { scale: [1, 1.18, 1] } : undefined}
              transition={{ duration: 0.5, delay: 2.3 + k * 0.95, repeat: Infinity, repeatDelay: 2.4 }}
            >
              <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" />
              </svg>
            </motion.span>
          ))}
        </span>
      </motion.div>
    </div>
  );
}

/* ── 03 · SEO & AI search: found on Google, cited by the answer ─────── */

const QUERY = "best dentist in kochi";

function SearchVisual({ play }: VisualProps) {
  const cycle = useCycle(play, 7000);

  return (
    <div key={cycle} className="absolute inset-0 flex flex-col gap-[4%] p-[6%]">
      <motion.div
        {...appear(play, 0.05)}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0B1410] px-3.5 py-2.5"
      >
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 shrink-0 text-fg-subtle" fill="none" stroke="currentColor" strokeWidth={2.2}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M20 20l-3.5-3.5" />
        </svg>
        <span className="truncate font-mono text-[11px] text-fg">
          {Array.from(QUERY).map((ch, k) => (
            <motion.span
              key={k}
              initial={play ? { opacity: 0 } : false}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.01, delay: 0.35 + k * 0.045 }}
            >
              {ch}
            </motion.span>
          ))}
          <span className="ml-px inline-block h-3 w-px translate-y-0.5 bg-accent-mint motion-safe:animate-[caret_1.1s_steps(1)_infinite]" />
        </span>
      </motion.div>

      {/* The AI answer, citing the site */}
      <motion.div
        {...appear(play, 1.5)}
        className="rounded-xl border border-white/10 bg-[linear-gradient(160deg,rgba(96,185,126,0.08),rgba(11,20,16,0.9))] p-3"
      >
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.16em] text-accent-mint uppercase">
          <svg viewBox="0 0 24 24" className="h-3 w-3" fill="currentColor">
            <path d="M12 2l2.2 6.3L20 10l-5.8 1.7L12 18l-2.2-6.3L4 10l5.8-1.7z" />
          </svg>
          AI Overview
        </span>
        <span className="mt-2 block h-1.5 w-[94%] rounded-sm bg-white/20" />
        <span className="mt-1.5 block h-1.5 w-[86%] rounded-sm bg-white/15" />
        <span className="mt-1.5 flex items-center gap-2">
          <span className="block h-1.5 w-[42%] rounded-sm bg-white/15" />
          <motion.span
            {...appear(play, 2.3, { opacity: 0, scale: 0.8 })}
            className="inline-flex items-center gap-1 rounded-full border border-line-accent bg-accent-mint/10 px-1.5 py-0.5 font-mono text-[10px] text-accent-mint"
          >
            <span className="h-1 w-1 rounded-full bg-accent-mint" />
            yourbusiness.in
          </motion.span>
        </span>
      </motion.div>

      {/* Organic results */}
      <div className="flex flex-1 flex-col justify-end gap-[6%]">
        {[0, 1, 2].map((k) => (
          <motion.div
            key={k}
            {...appear(play, 1.9 + k * 0.12)}
            className={cn(
              "relative rounded-lg border px-3 py-2",
              k === 0 ? "border-transparent" : "border-white/5 bg-white/[0.02]",
            )}
          >
            {k === 0 && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-lg border border-line-accent bg-accent-mint/[0.06]"
                initial={play ? { opacity: 0 } : false}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 2.8 }}
              />
            )}
            <span className="relative flex items-center justify-between">
              <span className={cn("font-mono text-[10px]", k === 0 ? "text-accent-mint" : "text-fg-subtle")}>
                {k === 0 ? "yourbusiness.in" : "example.com"}
              </span>
              {k === 0 && (
                <motion.span
                  {...appear(play, 2.9, { opacity: 0, scale: 0.8 })}
                  className="rounded-full bg-accent-mint/15 px-1.5 py-px font-mono text-[10px] tracking-[0.12em] text-accent-mint uppercase"
                >
                  Cited
                </motion.span>
              )}
            </span>
            <span className={cn("relative mt-1.5 block h-1.5 rounded-sm", k === 0 ? "w-[62%] bg-white/60" : "w-[55%] bg-white/25")} />
            <span className="relative mt-1 block h-1 w-[80%] rounded-sm bg-white/10" />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 04 · Video production: the studio's own cut on a timeline ──────── */

const REEL_SLUGS = ["consent", "marco-teaser-recreation", "njanaam-nilavu"] as const;
const REEL = REEL_SLUGS.map((slug) => [featuredFilm, ...films].find((f) => f.slug === slug)).filter(
  (f): f is Film => Boolean(f),
);
/** Clip widths on the timeline, as fractions — also where the cut points fall. */
const CLIPS = [0.36, 0.28, 0.36];
const CUTS = CLIPS.map((_, i) => CLIPS.slice(0, i + 1).reduce((a, b) => a + b, 0));
const LOOP_MS = 6000;
// Waveform bar heights, as whole percentages. Rounded on purpose: the raw
// trig result can differ in its last float digits between the server and the
// browser, and a style string that differs by 1e-15 is a hydration mismatch.
const WAVE = Array.from({ length: 44 }, (_, i) =>
  Math.round(25 + 75 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))),
);

const thumb = (f: Film) => `https://i.ytimg.com/vi/${f.youtubeId}/hqdefault.jpg`;

function ReelVisual({ play }: VisualProps) {
  return play ? <ReelLive /> : <ReelFrame clip={0} playhead="30%" timecode="00:00:12:08" />;
}

/**
 * The live cut: one clock (`useTime`) drives the playhead, the timecode and
 * which clip the monitor shows, so they can't drift apart. The playhead and
 * timecode update through motion values — no React re-render per frame; only
 * crossing a cut point sets state.
 */
function ReelLive() {
  const time = useTime();
  const progress = useTransform(time, (t) => (t % LOOP_MS) / LOOP_MS);
  const playhead = useTransform(progress, (p) => `${p * 100}%`);
  const timecode = useTransform(time, (t) => {
    const s = Math.floor(t / 1000) % 60;
    const f = Math.floor((t % 1000) / 40); // 25 fps
    return `00:00:${String(s).padStart(2, "0")}:${String(f).padStart(2, "0")}`;
  });
  const [clip, setClip] = useState(0);
  useMotionValueEvent(progress, "change", (p) => {
    const next = CUTS.findIndex((c) => p < c);
    if (next !== -1 && next !== clip) setClip(next);
  });

  return <ReelFrame clip={clip} playhead={playhead} timecode={timecode} live />;
}

function ReelFrame({
  clip,
  playhead,
  timecode,
  live = false,
}: {
  clip: number;
  playhead: string | MotionValue<string>;
  timecode: string | MotionValue<string>;
  live?: boolean;
}) {
  const film = REEL[clip] ?? REEL[0];

  return (
    <div className="absolute inset-0 flex flex-col gap-[4%] p-[6%]">
      {/* Monitor */}
      <div className="relative flex-1 overflow-hidden rounded-lg border border-white/10 bg-black">
        {film && (
          <AnimatePresence initial={false}>
            <motion.div
              key={film.youtubeId}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
            >
              <Image src={thumb(film)} alt="" fill sizes="(min-width: 1024px) 560px, 90vw" className="object-cover" />
            </motion.div>
          </AnimatePresence>
        )}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/30" />
        {/* Viewfinder corners */}
        {["top-2 left-2 border-t border-l", "top-2 right-2 border-t border-r", "bottom-2 left-2 border-b border-l", "bottom-2 right-2 border-b border-r"].map((pos) => (
          <span key={pos} aria-hidden="true" className={cn("absolute h-3 w-3 border-white/70", pos)} />
        ))}
        <span className="absolute top-3 left-5 flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-white uppercase">
          <span className={cn("h-1.5 w-1.5 rounded-full bg-red-500", live && "motion-safe:animate-pulse")} />
          Rec
        </span>
        <motion.span className="absolute top-3 right-5 font-mono text-[10px] tracking-[0.1em] text-white/85 tabular-nums">
          {timecode}
        </motion.span>
        {film && (
          <span className="absolute bottom-3 left-5 font-mono text-[10px] tracking-[0.14em] text-white/70 uppercase">
            {film.title.split(" — ")[0]}
          </span>
        )}
      </div>

      {/* Timeline */}
      <div className="relative rounded-lg border border-white/10 bg-[#0B1410] p-2">
        <div className="flex h-7 gap-0.5">
          {REEL.map((f, i) => (
            <span
              key={f.youtubeId}
              className={cn(
                "relative overflow-hidden rounded-sm border",
                i === clip ? "border-accent-mint/70" : "border-white/10",
              )}
              style={{ width: `${(CLIPS[i] ?? 0.33) * 100}%` }}
            >
              <Image src={thumb(f)} alt="" fill sizes="120px" className="object-cover opacity-70" />
            </span>
          ))}
        </div>
        <div className="mt-1 flex h-5 items-center gap-[2px]">
          {WAVE.map((h, i) => (
            <span key={i} className="flex-1 rounded-full bg-accent-mint/35" style={{ height: `${h}%` }} />
          ))}
        </div>
        {/* Playhead, inside the track padding */}
        <span className="pointer-events-none absolute inset-y-1 right-2 left-2">
          <motion.span className="absolute inset-y-0 w-px bg-accent-mint" style={{ left: playhead }}>
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rotate-45 bg-accent-mint" />
          </motion.span>
        </span>
      </div>
    </div>
  );
}

/** Service slug → its visual. */
export const SERVICE_VISUALS: Record<string, ComponentType<VisualProps>> = {
  "web-development": BuildVisual,
  "performance-marketing": FunnelVisual,
  "seo-ai-search": SearchVisual,
  "video-production": ReelVisual,
};
