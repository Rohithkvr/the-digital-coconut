"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";
import { noCaseStudies } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
const WARN = "#D98C7A";

/*
 * The exhibit plays in beats, each named after the sentence it acts out:
 *   1  the usual case study appears and its chart draws
 *   2  "Screenshots crop." — the frame closes in on the spike
 *   3  "Numbers round up." — every stat snaps to a rounder, bigger one
 *   4  the verdict stamp, then what we do instead
 */
const BEAT_AT = [500, 2200, 3700, 5200];

/*
 * The numbers in the exhibit belong to the kind of case study the copy is
 * criticising — it's labelled "The usual case study" on the card. They are
 * not claims about our work; the point is watching them get rounded.
 */
const STATS = [
  { label: "ROAS", exact: "2.64×", rounded: "3×" },
  { label: "Leads", exact: "4,812", rounded: "5K+" },
  { label: "Growth", exact: "+18.7%", rounded: "+20%" },
] as const;

/** The headline's three sentences: the accusation, then the two tricks. */
function splitSentences(text: string) {
  return text.match(/[^.]+\.\s*/g)?.map((s) => s.trim()) ?? [text];
}

/**
 * "No case studies here" — the page's boldest claim, acted out.
 *
 * A typical agency results card is caught in the act: the crop closes in
 * on the flattering part of the chart, the stats round themselves up, and
 * a stamp calls it — while the matching sentence in the headline is marked
 * as each trick plays. Then what we offer instead lights up: real accounts
 * shown live, and references you can phone, next to "Ask us to."
 *
 * Plays once, when the exhibit is properly on screen. Under reduced motion
 * it's shown at the end: cropped, rounded, stamped.
 */
export function NoCaseStudies() {
  const reduceMotion = useReducedMotion();
  const exhibitRef = useRef<HTMLDivElement>(null);
  const inView = useInView(exhibitRef, { amount: 0.5, once: true });
  const [beat, setBeat] = useState(0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const timers = BEAT_AT.map((ms, i) => window.setTimeout(() => setBeat(i + 1), ms));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [inView, reduceMotion]);

  const shown = reduceMotion ? BEAT_AT.length : beat;
  const [accusation, ...tricks] = splitSentences(noCaseStudies.lines[0]);

  return (
    <Section id="no-case-studies">
      <Reveal className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-6 sm:p-10 lg:p-14">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
        />

        <div className="relative grid gap-10 lg:grid-cols-[1fr_1.05fr] lg:items-center lg:gap-14">
          {/* ── The claim ─────────────────────────────────────────── */}
          <div>
            <Eyebrow className="mb-5">{noCaseStudies.eyebrow}</Eyebrow>
            <h2 className="font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-[2.25rem] lg:leading-[1.15]">
              <span className="text-gradient">{accusation}</span>{" "}
              {tricks.map((sentence, i) => (
                // Each trick is underlined as the exhibit plays it. A text
                // decoration, not a background: the gradient already owns
                // this span's background (background-clip: text).
                <span key={sentence}>
                  <span
                    className="text-gradient underline decoration-2 underline-offset-[0.22em] transition-[text-decoration-color] duration-700 ease-expo"
                    style={{ textDecorationColor: shown >= i + 2 ? WARN : "transparent" }}
                  >
                    {sentence}
                  </span>{" "}
                </span>
              ))}
            </h2>

            <ScrollHighlightText text={noCaseStudies.lines[1]} className="mt-6 leading-relaxed sm:text-lg" />

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <ButtonLink href="#contact" variant="secondary">
                {noCaseStudies.close}
              </ButtonLink>
              <span className="font-mono text-[11px] tracking-[0.16em] text-fg-subtle uppercase">
                Real accounts · Real references
              </span>
            </div>
          </div>

          {/* ── The exhibit ───────────────────────────────────────── */}
          <div ref={exhibitRef}>
            <div
              role="img"
              aria-label="A typical agency case study: the chart is cropped to its best moment, the numbers are rounded up, and it's stamped as impossible to check."
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0B1410] shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/5 px-4 py-3">
                <span className="text-sm font-semibold whitespace-nowrap text-fg">Campaign results</span>
                <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] whitespace-nowrap text-fg-subtle uppercase">
                  The usual case study
                </span>
              </div>

              {/* Chart, and the crop */}
              <div className="relative mx-4 mt-4 aspect-[2/1] overflow-hidden rounded-lg border border-white/5 bg-white/[0.02]">
                <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <motion.path
                    d="M0 30 C 8 30, 14 36, 24 40 S 40 44, 50 38 S 64 22, 74 13 S 90 5, 100 3 L 100 50 L 0 50 Z"
                    fill="rgba(96,185,126,0.10)"
                    initial={false}
                    animate={{ opacity: shown >= 1 ? 1 : 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                  />
                  <motion.path
                    d="M0 30 C 8 30, 14 36, 24 40 S 40 44, 50 38 S 64 22, 74 13 S 90 5, 100 3"
                    fill="none"
                    stroke="#60B97E"
                    strokeWidth="1.3"
                    vectorEffect="non-scaling-stroke"
                    initial={false}
                    animate={{ pathLength: shown >= 1 ? 1 : 0 }}
                    transition={{ duration: reduceMotion ? 0 : 1.3, ease: EASE }}
                  />
                </svg>

                {/* What the crop hides — the dip before the spike */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-0 left-0 bg-[#060B08]/80 [background-image:repeating-linear-gradient(135deg,transparent_0_6px,rgba(255,255,255,0.04)_6px_7px)]"
                  initial={false}
                  animate={{ width: shown >= 2 ? "56%" : "0%" }}
                  transition={{ duration: reduceMotion ? 0 : 1, ease: EASE }}
                />
                {/* The crop frame, closing in */}
                <motion.div
                  aria-hidden="true"
                  className="absolute inset-y-[6%] right-[2%] rounded-sm border border-dashed border-white/60"
                  initial={false}
                  animate={{ left: shown >= 2 ? "57%" : "2%", opacity: shown >= 2 ? 1 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 1, ease: EASE }}
                >
                  {["-top-1 -left-1 border-t-2 border-l-2", "-top-1 -right-1 border-t-2 border-r-2", "-bottom-1 -left-1 border-b-2 border-l-2", "-right-1 -bottom-1 border-r-2 border-b-2"].map((c) => (
                    <span key={c} className={cn("absolute h-2.5 w-2.5 border-white", c)} />
                  ))}
                </motion.div>
                <Callout on={shown >= 2} className="top-2 left-2">
                  Screenshots crop.
                </Callout>
              </div>

              {/* Stats, and the rounding */}
              <div className="relative grid grid-cols-3 gap-2 p-4">
                {STATS.map((s, i) => (
                  <div key={s.label} className="rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2.5">
                    <span className="block font-mono text-[10px] tracking-[0.14em] text-fg-subtle uppercase">{s.label}</span>
                    <span className="relative mt-1 block h-7 overflow-hidden font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">
                      <AnimatePresence initial={false} mode="popLayout">
                        <motion.span
                          key={shown >= 3 ? "rounded" : "exact"}
                          className={cn("block", shown >= 3 && "text-[#E3A596]")}
                          initial={reduceMotion ? false : { y: "100%", opacity: 0 }}
                          animate={{ y: "0%", opacity: 1 }}
                          exit={{ y: "-100%", opacity: 0 }}
                          transition={{ duration: 0.45, ease: EASE, delay: shown >= 3 ? i * 0.15 : 0 }}
                        >
                          {shown >= 3 ? s.rounded : s.exact}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                  </div>
                ))}
                <Callout on={shown >= 3} className="-top-3 right-4">
                  Numbers round up.
                </Callout>
              </div>

              {/* The verdict */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute top-[42%] left-1/2 z-20 rounded-md border-[3px] px-4 py-1.5 font-mono text-sm font-bold tracking-[0.18em] whitespace-nowrap uppercase sm:text-base"
                style={{ borderColor: WARN, color: WARN, x: "-50%", y: "-50%", rotate: -11 }}
                initial={false}
                animate={
                  shown >= 4
                    ? { opacity: 0.95, scale: 1 }
                    : { opacity: 0, scale: reduceMotion ? 1 : 1.8 }
                }
                transition={{ type: "spring", stiffness: 520, damping: 22 }}
              >
                <span className="bg-[#0B1410]/70 px-1">Can&apos;t be checked</span>
              </motion.div>
            </div>

            {/* ── What we do instead ──────────────────────────────── */}
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Instead on={shown >= 4} delay={0.35} title="Real accounts, live on a call">
                <span className="relative flex h-9 w-9 items-center justify-center rounded-lg bg-accent-mint/12 text-accent-mint">
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="3" y="4" width="18" height="12" rx="2" />
                    <path d="M8 20h8M12 16v4" />
                  </svg>
                  <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                    <span className={cn("absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-70")} />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
                  </span>
                </span>
              </Instead>
              <Instead on={shown >= 4} delay={0.5} title="References you can phone">
                <motion.span
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-mint/12 text-accent-mint"
                  animate={shown >= 4 && !reduceMotion ? { rotate: [0, -14, 12, -10, 8, 0] } : undefined}
                  transition={{ duration: 0.7, delay: 0.9, repeat: 2, repeatDelay: 1.6 }}
                >
                  <svg viewBox="0 0 24 24" className="h-4.5 w-4.5" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2" />
                  </svg>
                </motion.span>
              </Instead>
            </div>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

/** A small warning label that pops in when its trick plays. */
function Callout({ on, className, children }: { on: boolean; className?: string; children: string }) {
  return (
    <motion.span
      aria-hidden="true"
      className={cn(
        "absolute z-10 rounded-full border border-[#D98C7A]/40 bg-[#1a0f0c]/90 px-2 py-0.5 font-mono text-[10px] tracking-[0.12em] whitespace-nowrap text-[#E3A596] uppercase",
        className,
      )}
      initial={false}
      animate={on ? { opacity: 1, y: 0 } : { opacity: 0, y: 4 }}
      transition={{ duration: 0.4, ease: EASE, delay: on ? 0.5 : 0 }}
    >
      {children}
    </motion.span>
  );
}

/** One of the two things we offer instead of case studies. */
function Instead({
  on,
  delay,
  title,
  children,
}: {
  on: boolean;
  delay: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <motion.div
      className="flex items-center gap-3 rounded-xl border px-4 py-3"
      initial={false}
      animate={
        on
          ? { opacity: 1, borderColor: "rgba(96,185,126,0.35)", backgroundColor: "rgba(96,185,126,0.06)" }
          : { opacity: 0.4, borderColor: "rgba(255,255,255,0.06)", backgroundColor: "rgba(255,255,255,0.02)" }
      }
      transition={{ duration: 0.6, ease: EASE, delay: on ? delay : 0 }}
    >
      {children}
      <span className="text-sm font-medium text-fg">{title}</span>
    </motion.div>
  );
}
