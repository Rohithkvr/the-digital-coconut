"use client";

import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  type Variants,
} from "framer-motion";
import { useEffect, useRef, useState, type ComponentType } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { howWeWork } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const DESKTOP = "(min-width: 1024px)";

/** Where along the path (0-1) each step's node sits — four evenly spaced. */
const NODE_AT = [0.001, 1 / 3, 2 / 3, 0.985];

/**
 * "How we work", shown in order.
 *
 * A path runs through the four steps and draws itself as the section
 * scrolls; each step lights when the line reaches it and plays a small
 * demonstration of what happens there — the audit finding the broken
 * tracking, the plan being written, the build assembling, the dashboard
 * going live. Scrolling back up un-draws it, so it follows the reader.
 *
 * Desktop: four columns on a horizontal line. Phones: a vertical timeline.
 * Either way a step lights at the moment the line's tip reaches its node:
 * on desktop the nodes are evenly spaced; on phones card heights vary, so
 * the nodes' real positions are measured and the line ends at the last one.
 *
 * Reduced motion: the path is drawn and every step shown finished.
 */
export function HowWeWork() {
  const listRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start 0.78", "end 0.6"] });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24, mass: 0.4 });

  // Where each node sits along the line (0-1), and — on phones — where the
  // line ends: at the last node, not the bottom of the last card.
  const [nodesAt, setNodesAt] = useState<readonly number[]>(NODE_AT);
  const [trackEnd, setTrackEnd] = useState<number | null>(null);
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    // Runs from the observer's callback (which also fires on observe), so
    // state is only ever set from an event.
    const measure = () => {
      if (window.matchMedia(DESKTOP).matches) {
        setNodesAt(NODE_AT);
        setTrackEnd(null);
        return;
      }
      const items = [...list.querySelectorAll<HTMLElement>("ol > li")];
      const last = items.at(-1)?.offsetTop ?? 0;
      if (last <= 0) return;
      setNodesAt(items.map((li, i) => (i === 0 ? NODE_AT[0] : Math.min(NODE_AT[3], li.offsetTop / last))));
      setTrackEnd(list.clientHeight - (last + 20));
    };
    const ro = new ResizeObserver(measure);
    ro.observe(list);
    return () => ro.disconnect();
  }, []);

  // Steps reached, from the same progress that draws the line.
  const [reached, setReached] = useState(0);
  useMotionValueEvent(fill, "change", (p) => {
    const n = nodesAt.filter((at) => p >= at).length;
    if (n !== reached) setReached(n);
  });

  return (
    <Section id="how-we-work">
      <SectionHeading
        eyebrow="How we work"
        title="Four steps, in order, every time"
        lede="The sequence matters more than the tactics. Skipping the first step is why most budgets get wasted."
      />

      <div ref={listRef} className="relative mt-14 lg:mt-20">
        {/* The path — horizontal through the nodes on desktop … */}
        <div aria-hidden="true" className="absolute top-5 right-[12.5%] left-[12.5%] hidden h-px bg-white/10 lg:block">
          <motion.div
            className="h-full origin-left bg-gradient-to-r from-accent-mint/60 via-accent-mint to-accent-mint"
            style={{ scaleX: reduceMotion ? 1 : fill }}
          />
        </div>
        {/* … vertical down the left on phones */}
        <div
          aria-hidden="true"
          className="absolute top-5 bottom-5 left-5 w-px bg-white/10 lg:hidden"
          style={trackEnd === null ? undefined : { bottom: trackEnd }}
        >
          <motion.div
            className="h-full w-full origin-top bg-accent-mint"
            style={{ scaleY: reduceMotion ? 1 : fill }}
          />
        </div>

        <ol className="grid gap-10 lg:grid-cols-4 lg:gap-0">
          {howWeWork.map((step, i) => (
            <Step
              key={step.step}
              index={i}
              number={step.step}
              title={step.title}
              body={step.body}
              lit={reduceMotion || i < reached}
              reduceMotion={reduceMotion}
            />
          ))}
        </ol>
      </div>
    </Section>
  );
}

function Step({
  index,
  number,
  title,
  body,
  lit,
  reduceMotion,
}: {
  index: number;
  number: string;
  title: string;
  body: string;
  lit: boolean;
  reduceMotion: boolean;
}) {
  const Visual = VISUALS[index];

  return (
    <li className="relative pl-14 lg:px-3 lg:pl-3">
      {/* Node on the path */}
      <span
        className={cn(
          "absolute top-0 left-0 z-10 flex h-10 w-10 items-center justify-center rounded-full border font-mono text-xs tabular-nums transition-[background-color,border-color,color,box-shadow] duration-500 ease-expo lg:relative lg:mx-auto",
          lit
            ? "border-accent-mint bg-[#0f2a1b] text-accent-mint shadow-[0_0_0_4px_rgba(96,185,126,0.12)]"
            : "border-line bg-canvas-base text-fg-subtle",
        )}
      >
        {number}
      </span>

      <article
        className={cn(
          "relative overflow-hidden rounded-2xl border bg-surface-glass shadow-[var(--shadow-card)] transition-[border-color] duration-500 ease-expo lg:mt-6",
          lit ? "border-line-accent" : "border-line",
        )}
      >
        {/* Wider on tablets: a single full-width column there made each
            demonstration ~400px tall for content that needs about half. 5:2 fits it at 640-1023px.
            Nothing dims while a step is unlit: fading the card (or its
            demonstration) took text down to 2.4-2.9:1. An unlit step is just
            still, and the border marks the current one. The demonstration
            illustrates the text below it, so it's hidden from assistive tech. */}
        <div
          aria-hidden="true"
          className="relative aspect-[16/10] overflow-hidden border-b border-white/5 bg-[#08110c] sm:aspect-[5/2] lg:aspect-[16/10]"
        >
          {Visual && <Visual on={lit} reduceMotion={reduceMotion} />}
        </div>

        <div className="p-5 lg:p-6">
          <div className="flex items-center gap-2.5">
            <h3 className="font-display text-xl font-semibold tracking-tight text-fg">{title}</h3>
            {index === 0 && (
              <span className="rounded-full border border-line-accent bg-accent-mint/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-accent-mint uppercase">
                Start here
              </span>
            )}
          </div>
          <p className="mt-2.5 text-sm leading-relaxed text-fg-muted">{body}</p>
        </div>
      </article>
    </li>
  );
}

/* ── The four demonstrations ─────────────────────────────────────────
 * Each takes `on`: false is the quiet, unlit state; true plays the step.
 * Variants carry both directions, so scrolling back up resets them.
 * No figures anywhere — these show what happens, not results.
 */

type VisualProps = { on: boolean; reduceMotion: boolean };

/** Motion props for a demonstration root: plays with `on`, starts finished under reduced motion. */
function rootMotion(on: boolean, reduceMotion: boolean) {
  return {
    initial: reduceMotion ? ("on" as const) : ("off" as const),
    animate: on ? ("on" as const) : ("off" as const),
  };
}

const fadeUp = (delay: number): Variants => ({
  off: { opacity: 0, y: 6, transition: { duration: 0.2 } },
  on: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE, delay } },
});

const AUDIT = ["Tracking", "Landing page", "Creative", "Targeting"] as const;

/** 01 · Diagnose — a scan down the audit; tracking is what's broken. */
function DiagnoseVisual({ on, reduceMotion }: VisualProps) {
  return (
    <motion.div className="absolute inset-0 flex flex-col justify-center gap-1.5 p-4" {...rootMotion(on, reduceMotion)}>
      {!reduceMotion && (
        <motion.span
          aria-hidden="true"
          className="pointer-events-none absolute right-3 left-3 h-[22%] rounded-md border-y border-accent-mint/40 bg-accent-mint/10"
          variants={{
            off: { opacity: 0, top: "12%", transition: { duration: 0.15 } },
            on: {
              top: ["12%", "66%"],
              opacity: [1, 1, 0],
              transition: { duration: 1.5, ease: "easeInOut", times: [0, 0.85, 1] },
            },
          }}
        />
      )}
      {AUDIT.map((row, i) => {
        const broken = i === 0;
        return (
          <div
            key={row}
            className={cn(
              "relative flex items-center justify-between rounded-md border px-2.5 py-1.5",
              broken ? "border-transparent" : "border-white/5 bg-white/[0.02]",
            )}
          >
            {broken && (
              <motion.span
                aria-hidden="true"
                className="absolute inset-0 rounded-md border border-[#D98C7A]/50 bg-[#D98C7A]/10"
                variants={fadeUp(1.55)}
              />
            )}
            <span className="relative font-mono text-[10px] tracking-[0.1em] text-fg-muted uppercase">{row}</span>
            <motion.span
              className={cn(
                "relative flex items-center gap-1 rounded-full px-1.5 py-px font-mono text-[10px] tracking-[0.12em] uppercase",
                broken ? "bg-[#D98C7A]/15 text-[#E3A596]" : "bg-accent-mint/10 text-accent-mint",
              )}
              variants={{
                off: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } },
                on: { opacity: 1, scale: 1, transition: { duration: 0.35, ease: EASE, delay: 0.35 + i * 0.32 } },
              }}
            >
              <span className={cn("h-1 w-1 rounded-full", broken ? "bg-[#E3A596]" : "bg-accent-mint")} />
              {broken ? "Broken" : "OK"}
            </motion.span>
          </div>
        );
      })}
    </motion.div>
  );
}

const PLAN = [
  { label: "Channels", width: "78%" },
  { label: "Budget", width: "56%" },
  { label: "Targets", width: "68%" },
] as const;

/** 02 · Prescribe — the plan gets written, section by named section. */
function PrescribeVisual({ on, reduceMotion }: VisualProps) {
  return (
    <motion.div className="absolute inset-0 flex items-center justify-center p-4" {...rootMotion(on, reduceMotion)}>
      <div className="relative w-full max-w-[88%] rounded-lg border border-white/10 bg-[#0B1410] p-3 shadow-[0_12px_30px_rgba(0,0,0,0.4)]">
        <div className="flex items-center justify-between border-b border-white/5 pb-2">
          <span className="font-mono text-[10px] tracking-[0.14em] text-fg uppercase">The plan</span>
          <motion.span
            className="flex items-center gap-1 rounded-full bg-accent-mint/15 px-1.5 py-px font-mono text-[10px] tracking-[0.12em] text-accent-mint uppercase"
            variants={{
              off: { opacity: 0, scale: 0.6, transition: { duration: 0.15 } },
              on: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 380, damping: 18, delay: 1.35 } },
            }}
          >
            <svg viewBox="0 0 24 24" className="h-2 w-2" fill="none" stroke="currentColor" strokeWidth={4}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 12l5 5L20 7" />
            </svg>
            Written
          </motion.span>
        </div>
        <div className="mt-2.5 space-y-2">
          {PLAN.map((row, i) => (
            <motion.div key={row.label} className="flex items-center gap-2" variants={fadeUp(0.15 + i * 0.3)}>
              <span className="w-14 shrink-0 font-mono text-[10px] tracking-[0.1em] text-fg-subtle uppercase">{row.label}</span>
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/5">
                <motion.span
                  className="block h-full origin-left rounded-full bg-gradient-to-r from-accent-mint/50 to-accent-mint"
                  style={{ width: row.width }}
                  variants={{
                    off: { scaleX: 0, transition: { duration: 0.15 } },
                    on: { scaleX: 1, transition: { duration: 0.6, ease: EASE, delay: 0.3 + i * 0.3 } },
                  }}
                />
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

/** A 5x4 block in the mark's greens, shaded light to dark down the rows. */
const BLOCK = Array.from({ length: 20 }, (_, i) => {
  const r = Math.floor(i / 5);
  const c = i % 5;
  return {
    key: i,
    fill: ["#94aa7b", "#5c8c56", "#3e7852", "#275a3a"][r],
    dx: ((i * 37) % 9) - 4,
    dy: ((i * 53) % 9) - 4,
    delay: 0.1 + (r + c) * 0.05,
  };
});

/** 03 · Build — the pieces assemble, by the same team. */
function BuildVisual({ on, reduceMotion }: VisualProps) {
  return (
    <motion.div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4" {...rootMotion(on, reduceMotion)}>
      <div className="grid grid-cols-5 gap-1">
        {BLOCK.map((b) => (
          <motion.span
            key={b.key}
            className="block h-3.5 w-3.5 rounded-[2px] sm:h-4 sm:w-4"
            style={{ backgroundColor: b.fill }}
            variants={{
              off: { opacity: 0.12, x: b.dx * 3, y: b.dy * 3, scale: 0.5, transition: { duration: 0.2 } },
              on: { opacity: 1, x: 0, y: 0, scale: 1, transition: { duration: 0.6, ease: EASE, delay: b.delay } },
            }}
          />
        ))}
      </div>
      <motion.span
        className="rounded-full border border-line-accent bg-accent-mint/10 px-2 py-0.5 font-mono text-[10px] tracking-[0.14em] text-accent-mint uppercase"
        variants={fadeUp(0.95)}
      >
        Same team
      </motion.span>
    </motion.div>
  );
}

const BARS = [0.35, 0.5, 0.42, 0.62, 0.7, 0.86];

/** 04 · Measure — the dashboard goes live in week one. */
function MeasureVisual({ on, reduceMotion }: VisualProps) {
  return (
    <motion.div className="absolute inset-0 flex flex-col p-4" {...rootMotion(on, reduceMotion)}>
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.14em] text-accent-mint uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span
              className={cn(
                "absolute inline-flex h-full w-full rounded-full bg-accent-mint opacity-70",
                on && !reduceMotion && "animate-ping",
              )}
            />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-mint" />
          </span>
          Live
        </span>
        <span className="font-mono text-[10px] tracking-[0.14em] text-fg-subtle uppercase">Week 1</span>
      </div>

      <div className="relative mt-2 flex-1">
        <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <motion.path
            d="M0 34 L0 34 C 12 32, 18 26, 28 27 S 44 20, 54 21 S 72 12, 82 11 S 94 6, 100 4 L100 40 L0 40 Z"
            fill="rgba(96,185,126,0.10)"
            variants={{ off: { opacity: 0, transition: { duration: 0.15 } }, on: { opacity: 1, transition: { duration: 0.6, delay: 0.9 } } }}
          />
          <motion.path
            d="M0 34 C 12 32, 18 26, 28 27 S 44 20, 54 21 S 72 12, 82 11 S 94 6, 100 4"
            fill="none"
            stroke="#60B97E"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            variants={{
              off: { pathLength: 0, transition: { duration: 0.15 } },
              on: { pathLength: 1, transition: { duration: 1.1, ease: EASE, delay: 0.2 } },
            }}
          />
        </svg>
      </div>

      <div className="mt-2 flex h-5 items-end gap-1">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className="flex-1 origin-bottom rounded-sm bg-accent-mint/30"
            style={{ height: `${Math.round(h * 100)}%` }}
            variants={{
              off: { scaleY: 0.15, transition: { duration: 0.15 } },
              on: { scaleY: 1, transition: { duration: 0.5, ease: EASE, delay: 0.3 + i * 0.08 } },
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

const VISUALS: ComponentType<VisualProps>[] = [DiagnoseVisual, PrescribeVisual, BuildVisual, MeasureVisual];
