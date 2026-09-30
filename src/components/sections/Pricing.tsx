"use client";

import { AnimatePresence, inView, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { pricing, pricingPlans } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const [retainer, sprint] = pricingPlans;
type Service = (typeof retainer.services)[number];

/** Indian digit grouping (20,000 · 1,20,000), done by hand so server and client agree. */
function inr(n: number) {
  const s = String(Math.round(n));
  if (s.length <= 3) return s;
  return `${s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${s.slice(-3)}`;
}

/**
 * Pricing, shown working rather than listed.
 *
 * - The retainer is priced per service, so you build one: pick services and
 *   an invoice prints them, one line each, the total rolling over like an
 *   odometer. It's the "one invoice" the plan promises, made literal.
 * - The sprint's promise is a timeline that fits your deadline, so a sprint
 *   plays on a track whose deadline flag moves: the build stretches or
 *   squeezes to meet it, and ships a different artefact each time.
 * - Websites, sold per project outside both plans, get their own tile
 *   with a page assembling itself.
 */
export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading eyebrow={pricing.eyebrow} title={pricing.heading} lede={pricing.lede} />

      <ul className="mt-12 grid grid-cols-1 gap-5 lg:mt-16 lg:grid-cols-12">
        <Reveal as="li" y={16} className="lg:col-span-12">
          <RetainerCard />
        </Reveal>
        <Reveal as="li" y={16} delay={0.08} className="lg:col-span-8">
          <SprintCard />
        </Reveal>
        <Reveal as="li" y={16} delay={0.16} className="lg:col-span-4">
          <WebsiteCard />
        </Reveal>
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------ */
/* Shared plan parts                                                   */
/* ------------------------------------------------------------------ */

function PlanHeader({ name, tagline, badge }: { name: string; tagline: string; badge?: string }) {
  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <h3 className="font-display text-xl font-semibold tracking-tight text-fg sm:text-2xl">{name}</h3>
        {badge && (
          <span className="shrink-0 rounded-full border border-line-accent bg-[rgba(46,126,80,0.14)] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-accent-mint uppercase">
            {badge}
          </span>
        )}
      </div>
      <p className="mt-2 text-sm leading-relaxed text-fg-muted sm:text-base">{tagline}</p>
    </>
  );
}

function Price({ value, suffix, detail }: { value: string; suffix?: string; detail: string }) {
  return (
    <>
      <div className="mt-6 flex items-baseline gap-1.5">
        <span className="font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">{value}</span>
        {suffix && <span className="text-sm text-fg-subtle">{suffix}</span>}
      </div>
      <p className="mt-1.5 font-mono text-[11px] tracking-[0.1em] text-fg-subtle uppercase">{detail}</p>
    </>
  );
}

function Bullets({ items, className }: { items: readonly string[]; className?: string }) {
  return (
    <ul className={cn("space-y-3", className)}>
      {items.map((bullet) => (
        <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
          <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent-mint" />
          <span>{bullet}</span>
        </li>
      ))}
    </ul>
  );
}

const DIGITS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

/** A number whose digits roll to their new value. Columns are keyed from the right, so they persist as it changes. */
function Odometer({ value, instant }: { value: string; instant: boolean }) {
  const chars = [...value];
  return (
    <span className="inline-flex tabular-nums">
      {chars.map((c, i) => {
        const place = chars.length - i;
        if (!/\d/.test(c)) return <span key={`sep-${place}`}>{c}</span>;
        return (
          <span key={`d-${place}`} className="relative inline-block h-[1em] overflow-hidden leading-none">
            <motion.span
              className="flex flex-col"
              initial={false}
              animate={{ y: `${-Number(c) * 10}%` }}
              transition={instant ? { duration: 0 } : { type: "spring", stiffness: 120, damping: 18, mass: 0.9 }}
            >
              {DIGITS.map((d) => (
                <span key={d} className="block h-[1em]">
                  {d}
                </span>
              ))}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Retainer: build it, and the invoice prints                          */
/* ------------------------------------------------------------------ */

function RetainerCard() {
  const reduceMotion = useReducedMotion();
  const [picked, setPicked] = useState<readonly Service[]>([retainer.services[0]]);

  // Kept in the plan's order, and never empty: a retainer starts with one.
  const toggle = (service: Service) =>
    setPicked((cur) => {
      if (cur.includes(service)) return cur.length > 1 ? cur.filter((s) => s !== service) : cur;
      return retainer.services.filter((s) => s === service || cur.includes(s));
    });

  const count = picked.length;
  const total = count * retainer.perService;

  return (
    <SpotlightCard
      lift={false}
      className="border-line-accent p-5 sm:p-8 lg:p-10"
      decoration={
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-32 right-[10%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(96,185,126,0.16)_0%,transparent_72%)] blur-2xl"
        />
      }
    >
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,24rem)] lg:gap-x-16 lg:gap-y-8">
        <div className="lg:col-start-1">
          <PlanHeader name={retainer.name} tagline={retainer.tagline} badge="Most picked" />
          <Price value={retainer.price} suffix={retainer.priceSuffix} detail={retainer.priceDetail} />

          <fieldset className="mt-8">
            <legend className="font-mono text-[11px] tracking-[0.14em] text-fg-subtle uppercase">
              Build yours <span className="text-fg-muted normal-case">· tap to add a service</span>
            </legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {retainer.services.map((service) => {
                const on = picked.includes(service);
                const locked = on && count === 1;
                return (
                  <button
                    key={service}
                    type="button"
                    aria-pressed={on}
                    aria-disabled={locked || undefined}
                    title={locked ? "A retainer starts with one service" : undefined}
                    onClick={() => toggle(service)}
                    className={cn(
                      "group/chip inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm",
                      "transition-[background-color,border-color,color] duration-200 ease-expo",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-mint",
                      on
                        ? "border-accent-mint/60 bg-[rgba(46,126,80,0.24)] text-fg"
                        : "border-white/10 bg-white/[0.03] text-fg-muted hover:border-white/25 hover:text-fg",
                      locked && "cursor-default",
                    )}
                  >
                    <span
                      aria-hidden="true"
                      className={cn(
                        "flex h-4 w-4 items-center justify-center rounded-[5px] border transition-colors duration-200",
                        on ? "border-accent-mint bg-accent-mint text-canvas-deep" : "border-white/25",
                      )}
                    >
                      <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
                        <motion.path
                          d="M2.5 6.2 5 8.6 9.6 3.4"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={1.9}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          initial={false}
                          animate={{ pathLength: on ? 1 : 0 }}
                          transition={{ duration: reduceMotion ? 0 : 0.25 }}
                        />
                      </svg>
                    </span>
                    {service}
                    <span aria-hidden="true" className="font-mono text-[10px] text-fg-subtle">
                      +₹{retainer.perService / 1000}k
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="sr-only" aria-live="polite">
              {`${count} service${count > 1 ? "s" : ""}: ${picked.join(", ")}. ₹${inr(total)} a month, on one invoice.`}
            </p>
          </fieldset>
        </div>

        <div className="lg:col-start-2 lg:row-span-2 lg:row-start-1">
          <Invoice picked={picked} total={total} />
        </div>

        <div className="flex flex-col lg:col-start-1">
          <Bullets items={retainer.bullets} />
          <ButtonLink href="/#contact" size="lg" className="mt-8 w-full justify-center sm:w-auto sm:self-start">
            {retainer.cta}
          </ButtonLink>
        </div>
      </div>
    </SpotlightCard>
  );
}

/** Zig-zag tear along the bottom edge of the paper. */
const TEETH = 22;
const TORN_EDGE = `polygon(0 0, 100% 0, ${Array.from({ length: TEETH * 2 + 1 }, (_, i) => {
  const x = +(100 - (i * 100) / (TEETH * 2)).toFixed(3);
  return `${x}% ${i % 2 ? "100%" : "calc(100% - 7px)"}`;
}).join(", ")})`;

/** Printers feed in bursts: advance, pause, advance. */
const PRINT = { y: ["-101%", "-72%", "-68%", "-36%", "-32%", "0%"] };
const PRINT_TIMING = { duration: 1.7, times: [0, 0.22, 0.36, 0.6, 0.72, 1], ease: "easeOut" as const };

const INK = "#11201A";

/**
 * The retainer as the invoice it becomes. It prints out of a slot the first
 * time it's on screen, and each service picked adds a line; the total rolls.
 * Decorative: the fieldset and its live summary carry the same information.
 */
function Invoice({ picked, total }: { picked: readonly Service[]; total: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const printed = useInView(ref, { once: true, amount: 0.35 });
  const count = picked.length;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="relative h-full rounded-2xl border border-white/[0.06] bg-black/25 px-3 pt-5 pb-2 sm:px-8"
    >
      {/* The printer slot */}
      <div className="relative z-10 mx-auto h-4 rounded-full border border-white/10 bg-[#050806] shadow-[inset_0_2px_6px_rgba(0,0,0,0.9)]">
        <span className="absolute inset-x-5 top-1/2 h-[2px] -translate-y-1/2 rounded-full bg-black" />
        <span className="absolute top-1/2 right-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-accent-mint shadow-[0_0_8px_rgba(96,185,126,0.9)] motion-safe:animate-pulse" />
      </div>

      <div className="-mt-2 overflow-hidden px-1 pb-6 sm:px-2 drop-shadow-[0_18px_24px_rgba(0,0,0,0.55)]">
        <motion.div
          initial={{ y: "-101%" }}
          animate={reduceMotion ? { y: "0%" } : printed ? PRINT : undefined}
          transition={reduceMotion ? { duration: 0 } : PRINT_TIMING}
          style={{ clipPath: TORN_EDGE, color: INK }}
          className="bg-[#E7EEE4] px-4 pt-6 pb-9 sm:px-5 font-mono"
        >
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold tracking-[0.14em] whitespace-nowrap uppercase sm:text-[11px] sm:tracking-[0.18em]">The Digital Coconut</p>
              <p className="mt-1 text-[10px] tracking-wider whitespace-nowrap uppercase opacity-60">Monthly retainer · Kochi</p>
            </div>
            <p className="hidden text-[10px] tracking-wider uppercase opacity-60 min-[360px]:block">Invoice</p>
          </div>

          <Rule />

          <AnimatePresence initial={false}>
            {picked.map((service) => (
              <motion.div
                key={service}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.4, ease: EASE }}
                className="overflow-hidden"
              >
                <motion.div
                  initial={reduceMotion ? false : { backgroundColor: "rgba(96,185,126,0.45)" }}
                  animate={{ backgroundColor: "rgba(96,185,126,0)" }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="-mx-2 rounded px-2 py-1.5"
                >
                  <div className="flex items-baseline justify-between gap-3 text-[12px] font-semibold sm:text-[13px]">
                    <span>{service}</span>
                    <span className="tabular-nums">₹{inr(retainer.perService)}</span>
                  </div>
                  <p className="text-[10px] opacity-55">Strategy + execution</p>
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>

          <Rule />

          <div className="flex items-baseline justify-between gap-3 text-[10px] tracking-wider whitespace-nowrap uppercase opacity-60">
            <span>
              {count} service{count > 1 ? "s" : ""}<span className="hidden sm:inline"> · 1 invoice</span>
            </span>
            <span className="tabular-nums">
              {count} × ₹{inr(retainer.perService)}
            </span>
          </div>
          <div className="mt-2 flex flex-wrap items-end justify-between gap-x-3 gap-y-1">
            <span className="pb-1 text-[11px] font-bold tracking-[0.16em] whitespace-nowrap uppercase">Total / month</span>
            <span className="ml-auto inline-flex font-display text-3xl leading-none font-bold tracking-tight whitespace-nowrap sm:text-4xl">
              ₹<Odometer value={inr(total)} instant={reduceMotion} />
            </span>
          </div>

          <div
            className="mt-6 h-9 opacity-80"
            style={{
              backgroundImage: `repeating-linear-gradient(90deg, ${INK} 0 2px, transparent 2px 4px, ${INK} 4px 5px, transparent 5px 8px, ${INK} 8px 11px, transparent 11px 12px, ${INK} 12px 13px, transparent 13px 17px)`,
            }}
          />
          <p className="mt-3 text-center text-[10px] tracking-wider uppercase opacity-60">
            Start with one · stack as you scale
          </p>
        </motion.div>
      </div>
    </div>
  );
}

function Rule() {
  return <div className="my-4 border-t border-dashed" style={{ borderColor: `${INK}40` }} />;
}

/* ------------------------------------------------------------------ */
/* Sprint: a timeline that meets your deadline                         */
/* ------------------------------------------------------------------ */

function SprintCard() {
  return (
    <SpotlightCard lift={false} className="h-full p-5 sm:p-8">
      <div className="flex h-full flex-col">
        <PlanHeader name={sprint.name} tagline={sprint.tagline} />
        <Price value={sprint.price} detail={sprint.priceDetail} />
        <SprintTimeline className="mt-7" />
        <Bullets items={sprint.bullets} className="mt-7 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:space-y-0 sm:gap-y-3" />
        {/* Pushes the button to the card floor when the row stretches it */}
        <div aria-hidden="true" className="min-h-8 flex-1" />
        <ButtonLink href="/#contact" variant="secondary" size="lg" className="w-full justify-center sm:w-auto sm:self-start">
          {sprint.cta}
        </ButtonLink>
      </div>
    </SpotlightCard>
  );
}

/** Where the deadline lands on each run, as a fraction of the track. */
const DEADLINES = [0.9, 0.6, 0.8, 0.68];
const RUN_MS = 4200;

/**
 * A sprint on a track. Each run the deadline flag moves, the build bar
 * refills to meet it, and what shipped pops up at the flag: the timeline
 * fits the deadline, not the other way round. Runs only while on screen.
 * The server (and reduced motion) render one finished run.
 */
function SprintTimeline({ className }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Run counter. 0 is the static, finished render; each tick is a new sprint.
  const [run, setRun] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion) return;
    return inView(
      el,
      () => {
        setRun((r) => r + 1);
        const id = window.setInterval(() => setRun((r) => r + 1), RUN_MS);
        return () => window.clearInterval(id);
      },
      { amount: 0.6 },
    );
  }, [reduceMotion]);

  const live = run > 0 && !reduceMotion;
  const k = reduceMotion ? 0 : run % DEADLINES.length;
  const pos = DEADLINES[k];
  // Labels at the flag hang back from it once it's far enough right, so on
  // a phone-width track they never run past the panel or into "Scope call".
  const rightAligned = pos > 0.62;
  const glide = { duration: live ? 0.9 : 0, ease: EASE };

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={cn("relative rounded-xl border border-white/10 bg-[#0B1410] px-4 pt-4 pb-6 sm:px-6", className)}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 font-mono text-[10px] tracking-[0.18em] uppercase">
        <span className="whitespace-nowrap text-fg-subtle">
          Sprint <span className="text-fg">{String(k + 1).padStart(2, "0")}</span>
        </span>
        <span className="whitespace-nowrap text-accent-mint">Built to your deadline</span>
      </div>

      <div className="relative mt-16 mb-12 h-2">
        {/* Track */}
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.22)_0_6px,transparent_6px_12px)]" />

        {/* The build, refilling each run up to the deadline */}
        <motion.span
          key={`bar-${run}`}
          className="absolute top-0 left-0 h-2 origin-left rounded-full bg-gradient-to-r from-accent to-accent-mint shadow-[0_0_18px_rgba(96,185,126,0.45)]"
          style={{ width: `${pos * 100}%` }}
          initial={live ? { scaleX: 0 } : false}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, ease: EASE, delay: 0.15 }}
        />

        {/* Start */}
        <span className="absolute top-1/2 left-0 h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-accent-mint bg-canvas-deep" />
        <span className="absolute bottom-[calc(50%+1rem)] left-0 font-mono text-[9px] tracking-[0.16em] whitespace-nowrap text-fg-subtle uppercase sm:text-[10px]">
          {sprint.stages[0]}
        </span>

        {/* Middle, riding halfway along the build */}
        <motion.span
          className="absolute inset-x-0 bottom-[calc(50%+1rem)] hidden md:block"
          initial={false}
          animate={{ x: `${(pos / 2) * 100}%` }}
          transition={glide}
        >
          <span className="absolute bottom-0 left-0 -translate-x-1/2 font-mono text-[10px] tracking-[0.16em] whitespace-nowrap text-fg-subtle uppercase">
            {sprint.stages[1]}
          </span>
        </motion.span>

        {/* The deadline flag, with what shipped */}
        <motion.span className="absolute inset-0" initial={false} animate={{ x: `${pos * 100}%` }} transition={glide}>
          <span className="absolute bottom-1/2 left-0 h-9 w-px bg-fg/80" />
          <svg viewBox="0 0 14 10" className="absolute bottom-[calc(50%+1.5rem)] left-0 h-3 w-[1.1rem] text-accent-mint">
            <path d="M0 0h14l-4 5 4 5H0z" fill="currentColor" />
          </svg>
          <motion.span
            className="absolute bottom-[calc(50%+2.6rem)] left-0 font-mono text-[9px] tracking-[0.16em] whitespace-nowrap text-fg uppercase sm:text-[10px]"
            initial={false}
            animate={{ x: rightAligned ? "-100%" : "0%" }}
            transition={glide}
          >
            {sprint.stages[2]}
          </motion.span>

          <AnimatePresence initial={false}>
            <motion.span
              key={`ship-${run}`}
              className="absolute top-full left-0 mt-2.5"
              initial={live ? { opacity: 0, y: -6, scale: 0.9 } : false}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease: EASE, delay: live ? 1.35 : 0 }}
            >
              <span
                className={cn(
                  "flex items-center gap-1.5 rounded-full border border-accent-mint/50 bg-[rgba(46,126,80,0.25)] px-2.5 py-1 font-mono text-[9px] tracking-[0.12em] whitespace-nowrap text-accent-mint uppercase sm:text-[10px]",
                  rightAligned ? "-translate-x-full" : "-translate-x-1/2",
                )}
              >
                <svg viewBox="0 0 12 12" className="h-2.5 w-2.5">
                  <path d="M2.5 6.2 5 8.6 9.6 3.4" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" />
                </svg>
                {sprint.artefacts[k]} shipped
              </span>
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Websites: per project, a page assembling itself                     */
/* ------------------------------------------------------------------ */

function WebsiteCard() {
  const { website } = pricing;
  return (
    <SpotlightCard className="h-full border-dashed p-5 sm:p-8">
      <div className="flex h-full flex-col">
        <p className="font-mono text-[11px] tracking-[0.14em] text-accent-mint uppercase">{website.label}</p>
        <div className="mt-5 flex items-baseline gap-2">
          <span className="text-sm text-fg-subtle">from</span>
          <span className="font-display text-4xl font-bold tracking-tight text-fg sm:text-5xl">{website.from}</span>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-fg-muted">{website.detail}</p>
        {/* Grows to fill whatever height the row gives the card */}
        <BuildingPage className="mt-6 min-h-44 flex-1" />
        <ButtonLink href="/#contact" variant="secondary" className="mt-6 w-full justify-center">
          {website.cta}
        </ButtonLink>
      </div>
    </SpotlightCard>
  );
}

/** A small browser whose page blocks lay themselves in, once, when seen. */
function BuildingPage({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();
  const block = (i: number, cls: string, children?: ReactNode) => (
    <motion.div
      className={cn("origin-left rounded-[3px]", cls)}
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE, delay: reduceMotion ? 0 : 0.2 + i * 0.14 }}
    >
      {children}
    </motion.div>
  );

  return (
    <div
      aria-hidden="true"
      className={cn("flex flex-col overflow-hidden rounded-lg border border-white/10 bg-[#0B1410]", className)}
    >
      <div className="flex items-center gap-1.5 border-b border-white/10 px-3 py-2">
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="h-1.5 w-1.5 rounded-full bg-white/20" />
        <span className="ml-2 h-3 flex-1 rounded-full bg-white/[0.05]" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <div className="flex items-center justify-between">
          {block(0, "h-2 w-1/4 bg-white/25")}
          {block(0, "h-2 w-1/3 bg-white/10")}
        </div>
        {block(
          1,
          "flex min-h-16 w-full flex-1 flex-col justify-center gap-2 bg-gradient-to-r from-accent-deep/70 via-accent/50 to-accent-mint/40 px-4",
          <>
            {block(1.6, "h-2.5 w-3/5 bg-white/55")}
            {block(1.9, "h-2 w-2/5 bg-white/25")}
            {block(2.2, "mt-1 h-3 w-12 rounded-full bg-canvas-deep/70")}
          </>,
        )}
        <div className="grid grid-cols-3 gap-2">
          {block(2, "h-7 bg-white/[0.08]")}
          {block(2.5, "h-7 bg-white/[0.08]")}
          {block(3, "h-7 bg-white/[0.08]")}
        </div>
        {block(4, "h-3 w-1/4 rounded-full bg-accent-mint/70")}
      </div>
    </div>
  );
}
