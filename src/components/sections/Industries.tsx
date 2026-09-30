"use client";

import { AnimatePresence, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/layout/icons";
import { industries, industryItems } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;
/** How long each sector holds while the index is advancing on its own. */
const HOLD_MS = 4800;

/*
 * One pixel-art glyph per sector, drawn in the logo's own square pixels
 * ("#" = a pixel). Order matches industryItems.
 */
const GLYPHS: Record<string, readonly string[]> = {
  Education: [
    ".....#.....",
    "...#####...",
    ".#########.",
    "###########",
    ".#########.",
    "...#####.#.",
    "...#####.#.",
    "...#####.#.",
    "........##.",
  ],
  "Real Estate": [
    "....#....",
    "...###...",
    "..#####..",
    ".#######.",
    "..#####..",
    "..#####..",
    "..##.##..",
    "..##.##..",
  ],
  "Retail & eCommerce": [
    "...###...",
    "..#...#..",
    "..#...#..",
    ".#######.",
    ".#######.",
    ".#######.",
    ".#######.",
    ".#######.",
  ],
  Healthcare: [
    "..###..",
    "..###..",
    "#######",
    "#######",
    "#######",
    "..###..",
    "..###..",
  ],
  Hospitality: [
    "....#....",
    "...###...",
    "#########",
    ".#######.",
    "..#####..",
    "..#####..",
    ".###.###.",
    ".##...##.",
  ],
};

/** The mark's greens, lightest first — glyphs shade top to bottom like the logo. */
const GREENS = ["#94aa7b", "#7d9367", "#5c8c56", "#3e7852", "#396b4c", "#275a3a"];

/**
 * Every hook is "the outcome, not the vanity metric". Splitting on ", not "
 * lets the two halves be set differently: the outcome stays, the foil gets
 * struck through. A hook without that shape is shown whole.
 */
function splitHook(hook: string): [string, string | null] {
  const at = hook.indexOf(", not ");
  return at === -1 ? [hook, null] : [hook.slice(0, at + 1), hook.slice(at + 2)];
}

/**
 * Industries as an interactive index.
 *
 * Desktop: the five sectors as a large editorial list beside a glass panel.
 * The active sector's glyph assembles from scattered pixels — the way the
 * logo's trail dissolves, run backwards — and its hook plays out: the
 * outcome rises, the "not …" half is struck through. It's a real tab list:
 * hover, click or arrow keys choose a sector.
 *
 * While on screen and untouched, the index advances on its own so the
 * section reads without interaction; the first hover, click or keypress
 * stops that for good (auto-advancing content must be stoppable — WCAG
 * 2.2.2), and it never runs under reduced motion.
 *
 * Phones: five stacked cards, each playing once as it scrolls in. Nothing
 * there changes height by itself, so nothing moves under a reader's thumb.
 */
export function Industries() {
  const [active, setActive] = useState(0);
  const [touched, setTouched] = useState(false);
  const reduceMotion = useReducedMotion();
  const indexRef = useRef<HTMLDivElement>(null);
  const inView = useInView(indexRef, { amount: 0.45 });
  const tabs = useRef<Array<HTMLButtonElement | null>>([]);

  const autoplay = inView && !touched && !reduceMotion;

  useEffect(() => {
    if (!autoplay) return;
    const id = window.setTimeout(() => setActive((a) => (a + 1) % industryItems.length), HOLD_MS);
    return () => window.clearTimeout(id);
  }, [autoplay, active]);

  const choose = (i: number) => {
    setTouched(true);
    setActive(i);
  };

  // Arrows move from the tab that has focus. With a roving tabindex that's
  // normally the selected one, but a hover can select a different tab while
  // focus stays put — counting from `active` would then skip or stall.
  const onKeyDown = (from: number, e: KeyboardEvent<HTMLButtonElement>) => {
    const last = industryItems.length - 1;
    const next =
      e.key === "ArrowDown" || e.key === "ArrowRight"
        ? (from === last ? 0 : from + 1)
        : e.key === "ArrowUp" || e.key === "ArrowLeft"
          ? (from === 0 ? last : from - 1)
          : e.key === "Home"
            ? 0
            : e.key === "End"
              ? last
              : null;
    if (next === null) return;
    e.preventDefault();
    choose(next);
    tabs.current[next]?.focus();
  };

  const current = industryItems[active];

  return (
    <Section id="industries">
      <SectionHeading eyebrow={industries.eyebrow} title={industries.heading} lede={industries.lede} />

      {/* ── Desktop: index + panel ──────────────────────────────── */}
      <div ref={indexRef} className="mt-16 hidden gap-14 lg:grid lg:grid-cols-12">
        <div
          role="tablist"
          aria-label="Industries"
          aria-orientation="vertical"
          className="lg:col-span-7"
        >
          {industryItems.map((item, i) => {
            const selected = i === active;
            return (
              <button
                key={item.label}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                id={`industry-tab-${i}`}
                role="tab"
                type="button"
                aria-selected={selected}
                aria-controls="industry-panel"
                tabIndex={selected ? 0 : -1}
                onClick={() => choose(i)}
                onMouseEnter={() => choose(i)}
                onFocus={() => setTouched(true)}
                onKeyDown={(e) => onKeyDown(i, e)}
                className="group relative flex w-full items-center gap-6 border-t border-line py-6 text-left last:border-b focus-visible:outline-offset-4"
              >
                <span
                  className={cn(
                    "font-mono text-[11px] tracking-[0.18em] transition-colors duration-500",
                    selected ? "text-accent-mint" : "text-fg-subtle",
                  )}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span
                  className={cn(
                    "font-display text-4xl leading-none font-semibold tracking-[-0.035em] transition-[color,opacity,transform] duration-500 ease-expo xl:text-5xl",
                    selected
                      ? "translate-x-2 text-gradient-accent"
                      : "text-white/30 group-hover:text-white/60",
                  )}
                >
                  {item.label}
                </span>
                <ArrowIcon
                  className={cn(
                    "ml-auto h-5 w-5 shrink-0 transition-[color,transform,opacity] duration-500 ease-expo",
                    selected ? "text-accent-mint opacity-100" : "-translate-x-2 text-fg-subtle opacity-0",
                  )}
                />
                {/* Countdown to the next sector, only while advancing on its own */}
                {selected && autoplay && (
                  <motion.span
                    key={`progress-${active}`}
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-px w-full origin-left bg-accent-mint/70"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="lg:col-span-5">
          <div
            id="industry-panel"
            role="tabpanel"
            aria-labelledby={`industry-tab-${active}`}
            className="relative h-full min-h-[26rem] overflow-hidden rounded-3xl border border-line bg-surface-glass p-8 shadow-[var(--shadow-card)] backdrop-blur-xl xl:p-10"
          >
            <div
              aria-hidden="true"
              className="grid-overlay pointer-events-none absolute inset-0 opacity-40 [background-size:32px_32px] [mask-image:radial-gradient(ellipse_75%_60%_at_50%_35%,#000_25%,transparent_100%)]"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-10 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(96,185,126,0.18)_0%,transparent_70%)] blur-2xl"
            />
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.label}
                className="relative flex h-full flex-col"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduceMotion ? undefined : { opacity: 0, transition: { duration: 0.2 } }}
              >
                <span className="flex items-center justify-between font-mono text-[10px] tracking-[0.18em] text-fg-subtle uppercase">
                  <span>
                    <span className="text-accent-mint">{String(active + 1).padStart(2, "0")}</span>
                    <span className="mx-2 text-white/20">/</span>
                    {String(industryItems.length).padStart(2, "0")}
                  </span>
                  <span>{current.label}</span>
                </span>

                <div className="my-8 flex flex-1 items-center justify-center">
                  <PixelGlyph rows={GLYPHS[current.label]} play={!reduceMotion} className="h-40 xl:h-48" />
                </div>

                <Hook text={current.hook} play={!reduceMotion} trigger="mount" className="text-xl xl:text-2xl" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Phones and tablets: stacked cards ───────────────────── */}
      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:hidden">
        {industryItems.map((item, i) => (
          <Reveal
            key={item.label}
            as="li"
            delay={(i % 2) * 0.06}
            y={16}
            className={cn("h-full", i === 0 && "sm:col-span-2")}
          >
            <article className="relative h-full overflow-hidden rounded-2xl border border-line bg-surface-glass p-6 shadow-[var(--shadow-card)]">
              <div className="flex items-start justify-between">
                <PixelGlyph rows={GLYPHS[item.label]} play={!reduceMotion} trigger="view" className="h-14" />
                <span className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">
                <span className="text-gradient">{item.label}</span>
              </h3>
              <Hook text={item.hook} play={!reduceMotion} trigger="view" className="mt-3 text-base" />
            </article>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.1} className="mt-12 flex justify-center lg:mt-14">
        <ButtonLink href={industries.cta.href} variant="secondary" size="lg">
          {industries.cta.label}
          <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
        </ButtonLink>
      </Reveal>
    </Section>
  );
}

/**
 * A sector glyph in the logo's pixels. Each pixel flies in from a scattered
 * offset and settles into place — the logo's dissolving trail, run
 * backwards. Offsets and shades are derived from the pixel's position, so
 * server and client render identical markup.
 *
 * `trigger`: "mount" plays when the glyph appears (the desktop panel re-mounts
 * it per sector); "view" plays once when scrolled into view (phone cards).
 */
function PixelGlyph({
  rows,
  play,
  trigger = "mount",
  className,
}: {
  rows: readonly string[] | undefined;
  play: boolean;
  trigger?: "mount" | "view";
  className?: string;
}) {
  if (!rows) return null;
  const cols = rows[0].length;
  const pixels = rows.flatMap((row, r) =>
    Array.from(row).flatMap((ch, c) => (ch === "#" ? [{ r, c }] : [])),
  );

  return (
    <svg
      viewBox={`-0.5 -0.5 ${cols + 1} ${rows.length + 1}`}
      aria-hidden="true"
      className={cn("w-auto overflow-visible", className)}
    >
      {pixels.map(({ r, c }, i) => {
        const shade = GREENS[Math.min(GREENS.length - 1, Math.floor((r / rows.length) * GREENS.length + (c % 2) * 0.4))];
        const dx = (((i * 37) % 9) - 4) * 0.9;
        const dy = (((i * 53) % 9) - 4) * 0.9;
        const delay = 0.05 + (r + c) * 0.025;
        const from = { opacity: 0, x: dx, y: dy, scale: 0.3 };
        const to = { opacity: 1, x: 0, y: 0, scale: 1 };
        const transition = { duration: 0.7, ease: EASE, delay };
        const motionProps = !play
          ? { initial: false as const }
          : trigger === "view"
            ? { initial: from, whileInView: to, viewport: { once: true, amount: 0.6 }, transition }
            : { initial: from, animate: to, transition };
        return (
          <motion.rect
            key={`${r}-${c}`}
            x={c + 0.06}
            y={r + 0.06}
            width={0.88}
            height={0.88}
            fill={shade}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            {...motionProps}
          />
        );
      })}
    </svg>
  );
}

/**
 * The hook, played out: the outcome rises in, then the "not …" half fades
 * up and is struck through. The strike is an animated background on an
 * inline span, so it draws continuously across a line break instead of
 * needing one line per wrapped row.
 */
function Hook({
  text,
  play,
  trigger,
  className,
}: {
  text: string;
  play: boolean;
  trigger: "mount" | "view";
  className?: string;
}) {
  const [outcome, foil] = splitHook(text);
  const when = (to: Record<string, string | number>) =>
    trigger === "view" ? { whileInView: to, viewport: { once: true, amount: 0.7 } } : { animate: to };

  return (
    <p className={cn("font-display leading-snug font-medium tracking-tight", className)}>
      <motion.span
        className="text-fg"
        initial={play ? { opacity: 0, y: 10 } : false}
        {...when({ opacity: 1, y: 0 })}
        transition={{ duration: 0.6, ease: EASE, delay: 0.15 }}
        style={{ display: "inline-block" }}
      >
        {outcome}
      </motion.span>{" "}
      {foil && (
        <motion.span
          className="text-fg-subtle [box-decoration-break:slice] bg-[linear-gradient(var(--accent-mint),var(--accent-mint))] bg-no-repeat [background-position:0_58%]"
          initial={play ? { opacity: 0, backgroundSize: "0% 2px" } : { opacity: 1, backgroundSize: "100% 2px" }}
          {...when({ opacity: 1, backgroundSize: "100% 2px" })}
          transition={{
            opacity: { duration: 0.5, delay: 0.45 },
            backgroundSize: { duration: 0.8, ease: EASE, delay: 1.0 },
          }}
        >
          {foil}
        </motion.span>
      )}
    </p>
  );
}
