"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { Magnetic } from "@/components/ui/Magnetic";
import { HeroMark } from "@/components/ui/HeroMark";
import { ParallaxLayer, useParallaxPointer } from "@/components/ui/Parallax";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { TypewriterWord } from "@/components/ui/TypewriterWord";
import { hero, services } from "@/content/home";
import { studioStats } from "@/content/studio";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/layout/icons";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Entrance choreography, in seconds. The copy and the mark run as two
 * parallel tracks: the headline rises word by word while the mark's tiles
 * wipe in beside it, and both land before the supporting copy arrives —
 * so the eye gets the statement and the logo first, then the detail.
 */
const T = {
  pill: 0,
  headline: 0.1,
  typed: 0.55,
  sub: 0.65,
  ctas: 0.75,
  disciplines: 1.0,
  chips: 1.5,
} as const;

const DESKTOP = "(min-width: 1024px)";

function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/** Chip facts come from the same content files as the rest of the page. */
const filmViews = studioStats.find((s) => s.label.startsWith("Views"))?.value;

/**
 * Split hero: the statement on the left, the brand mark assembling itself
 * on the right, with a few true facts orbiting it.
 *
 * Depth comes from two drivers shared with the rest of the site's motion
 * kit (ui/Parallax): scroll progress through the hero, and — on
 * fine-pointer devices only — the cursor. Each layer moves by a different
 * amount, so the scene reads as having a foreground and a background
 * rather than as one flat panel.
 *
 * On phones the stage drops beneath the copy and the chips are omitted:
 * they need room to orbit, and without it they would only crowd the mark.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pointer = useParallaxPointer(ref);

  // The scroll exit only makes sense where the whole hero fits on one
  // screen. On a phone the hero is taller than the viewport, so the fade
  // would start while the reader is still on the copy — dimming the CTAs
  // before they can be tapped, and the mark at the very moment it's
  // centred. Server snapshot is `false`, so hydration never disagrees.
  const isDesktop = useSyncExternalStore(
    subscribeDesktop,
    () => window.matchMedia(DESKTOP).matches,
    () => false,
  );
  const exit = isDesktop && !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Copy lifts away and fades; the mark turns and recedes more slowly, so
  // the two layers visibly separate as the hero scrolls off.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [0, 16]);
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 0.88]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.15]);

  // Cursor spotlight — a soft pool of brand light that follows the pointer.
  const spotX = useTransform(pointer.x, [-0.5, 0.5], ["0%", "100%"]);
  const spotY = useTransform(pointer.y, [-0.5, 0.5], ["0%", "100%"]);
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${spotX} ${spotY}, rgba(96,185,126,0.09), transparent 65%)`;

  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-28 pb-16 sm:pt-36 md:pb-20 lg:pt-40 lg:pb-24"
    >
      {/* ── Atmosphere ───────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={cn(
            "absolute top-[4%] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(46,126,80,0.28)_0%,rgba(96,185,126,0.08)_45%,transparent_72%)] blur-[130px] lg:left-[68%]",
            !reduceMotion && "animate-pulse-glow",
          )}
        />
        <div className="absolute top-[40%] left-[20%] h-[320px] w-[620px] rounded-full bg-[radial-gradient(ellipse,rgba(140,167,122,0.10)_0%,transparent_70%)] blur-[90px]" />
      </div>
      {pointer.active && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ background: spotlight }}
        />
      )}

      <Container>
        <div className="grid items-center gap-14 lg:grid-cols-12 lg:gap-8">
          {/* ── Copy ─────────────────────────────────────────── */}
          <motion.div
            style={exit ? { opacity: copyOpacity, y: copyY } : undefined}
            className="relative text-center lg:col-span-7 lg:text-left"
          >
            <motion.div {...rise(T.pill)}>
              <span className="inline-flex items-center gap-2.5 rounded-full border border-line-accent bg-white/[0.04] py-1.5 pr-4 pl-3 font-mono text-[10px] tracking-[0.16em] text-brand-olive uppercase backdrop-blur-sm sm:text-[11px] sm:tracking-[0.18em]">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-mint opacity-70 motion-reduce:hidden" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-mint" />
                </span>
                Full-stack agency · {site.city}, {site.region}
              </span>
            </motion.div>

            <h1 className="mt-7 font-display text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-[3.75rem] xl:text-[4.25rem]">
              {/* One stable sentence for assistive tech and crawlers; the
                  animated headline below is decorative to them. */}
              <span className="sr-only">
                {hero.headline.lead} {hero.headline.rotating.join(", ")}.
              </span>

              {/* `text-gradient` goes on each word, never on this wrapper:
                  the reveal's masks own their painting context, and a
                  clipped background set on an ancestor would never reach
                  the glyphs — the headline would render invisible. */}
              <span aria-hidden="true" className="block">
                <SplitHeading
                  text={hero.headline.lead}
                  wordClassName="text-gradient"
                  delay={T.headline}
                />
              </span>
              <motion.span
                aria-hidden="true"
                className="mt-3 block sm:mt-4"
                initial={reduceMotion ? false : { opacity: 0, y: 16, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.8, delay: T.typed, ease: EASE }}
              >
                <TypewriterWord words={hero.headline.rotating} />
              </motion.span>
            </h1>

            <motion.p
              {...rise(T.sub)}
              className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg lg:mx-0 lg:max-w-lg"
            >
              {hero.sub}
            </motion.p>

            <motion.div
              {...rise(T.ctas)}
              className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start"
            >
              {/* The width classes live on the Magnetic wrapper as well as the
                  button: the wrapper takes over layout here, so without them
                  the buttons would stop filling the row on mobile. */}
              <Magnetic className="w-full sm:w-auto">
                <ButtonLink href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
                  {hero.primaryCta.label}
                  <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
                </ButtonLink>
              </Magnetic>
              <Magnetic className="w-full sm:w-auto" strength={10}>
                <ButtonLink
                  href={hero.secondaryCta.href}
                  variant="secondary"
                  size="lg"
                  className="w-full sm:w-auto"
                >
                  {hero.secondaryCta.label}
                </ButtonLink>
              </Magnetic>
            </motion.div>
          </motion.div>

          {/* ── Stage ────────────────────────────────────────── */}
          <div className="relative lg:col-span-5">
            <motion.div
              style={exit ? { rotate: markRotate, scale: markScale, opacity: markOpacity } : undefined}
              className="relative mx-auto aspect-square w-full max-w-[300px] sm:max-w-[380px] lg:max-w-[460px]"
            >
              <Orbit reduceMotion={!!reduceMotion} />

              {/* Glow the mark sits in */}
              <div
                aria-hidden="true"
                className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(96,185,126,0.22)_0%,transparent_70%)] blur-2xl"
              />

              <ParallaxLayer
                className="absolute inset-[16%]"
                scrollYProgress={scrollYProgress}
                pointerX={pointer.x}
                pointerY={pointer.y}
                pointerRange={10}
              >
                <HeroMark className="h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]" />
              </ParallaxLayer>

              {/* Fact chips — larger viewports only, each on its own depth */}
              <div className="hidden lg:block">
                <ParallaxLayer
                  className="absolute top-[6%] -left-[14%]"
                  scrollYProgress={scrollYProgress}
                  scrollRange={-60}
                  pointerX={pointer.x}
                  pointerY={pointer.y}
                  pointerRange={22}
                >
                  <Chip delay={T.chips} float="slow">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
                    {services.length} disciplines · 1 team
                  </Chip>
                </ParallaxLayer>

                {filmViews && (
                  <ParallaxLayer
                    className="absolute top-[68%] -right-[8%]"
                    scrollYProgress={scrollYProgress}
                    scrollRange={-110}
                    pointerX={pointer.x}
                    pointerY={pointer.y}
                    pointerRange={30}
                  >
                    <Chip delay={T.chips + 0.15} float="reverse" stacked>
                      <span className="font-display text-2xl leading-none font-semibold tracking-tight text-fg">
                        {filmViews}
                      </span>
                      <span className="mt-1 font-mono text-[10px] tracking-[0.16em] text-fg-muted uppercase">
                        Film views, self-shot
                      </span>
                    </Chip>
                  </ParallaxLayer>
                )}

                <ParallaxLayer
                  className="absolute bottom-[4%] left-[2%]"
                  scrollYProgress={scrollYProgress}
                  scrollRange={-40}
                  pointerX={pointer.x}
                  pointerY={pointer.y}
                  pointerRange={16}
                >
                  <Chip delay={T.chips + 0.3} float="slow">
                    <PinIcon />
                    Made in {site.city}, {site.region}
                  </Chip>
                </ParallaxLayer>
              </div>
            </motion.div>
          </div>
        </div>

        {/* ── Disciplines ────────────────────────────────────── */}
        <motion.div {...rise(T.disciplines)} className="mt-16 lg:mt-20">
          <motion.div
            aria-hidden="true"
            className="mx-auto h-px w-full max-w-3xl origin-center bg-gradient-to-r from-transparent via-white/12 to-transparent lg:max-w-none"
            initial={reduceMotion ? false : { scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.2, delay: T.disciplines, ease: EASE }}
          />
          <ul className="mx-auto mt-6 grid grid-cols-2 gap-x-3 gap-y-3 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:text-[11px]">
            {services.map((s, i) => (
              <motion.li
                key={s.slug}
                className="flex items-center justify-center sm:gap-5"
                initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: T.disciplines + 0.2 + i * 0.08, ease: EASE }}
              >
                {i > 0 && (
                  <span
                    aria-hidden="true"
                    className="hidden h-1 w-1 rounded-full bg-accent-mint/50 sm:block"
                  />
                )}
                {s.title}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      </Container>
    </section>
  );
}

/**
 * Two rings around the mark: a solid hairline that draws itself in, and a
 * dashed ring carrying a single point of light that turns slowly behind it.
 * The turning is a CSS animation, so the global reduced-motion rule in
 * globals.css already stops it.
 */
function Orbit({ reduceMotion }: { reduceMotion: boolean }) {
  return (
    <div aria-hidden="true" className="absolute inset-0">
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90">
        <motion.circle
          cx="50"
          cy="50"
          r="48"
          fill="none"
          stroke="rgba(96,185,126,0.22)"
          strokeWidth="0.25"
          initial={reduceMotion ? false : { pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.8, delay: 0.2, ease: EASE }}
        />
      </svg>
      <motion.div
        className="absolute inset-[9%]"
        initial={reduceMotion ? false : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
      >
        {/* Spin on an inner element: Framer owns the outer one's transform
            for the entrance, and a CSS animation on the same element would
            fight it for the `transform` property. */}
        <div className="h-full w-full animate-[spin_60s_linear_infinite]">
          <svg viewBox="0 0 100 100" className="h-full w-full">
            <circle
              cx="50"
              cy="50"
              r="49"
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="0.3"
              strokeDasharray="0.6 2.4"
            />
            <circle cx="50" cy="1" r="2.6" fill="rgba(96,185,126,0.25)" />
            <circle cx="50" cy="1" r="0.9" fill="#60B97E" />
          </svg>
        </div>
      </motion.div>
    </div>
  );
}

function Chip({
  children,
  delay,
  float,
  stacked = false,
}: {
  children: ReactNode;
  delay: number;
  float: "slow" | "reverse";
  stacked?: boolean;
}) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {/* Same rule as the orbit: the idle float is CSS, so it sits on an
          inner element Framer isn't animating. */}
      <div
        className={cn(
          "rounded-2xl border border-line bg-surface-glass shadow-[var(--shadow-card)] backdrop-blur-md",
          stacked
            ? "flex flex-col px-4 py-3"
            : "flex items-center gap-2 px-3.5 py-2 text-sm whitespace-nowrap text-fg",
          float === "slow" ? "animate-float-slow" : "animate-float-reverse",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
}

function PinIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="h-3.5 w-3.5 text-accent-mint"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 21s-7-6.2-7-11.5a7 7 0 1 1 14 0C19 14.8 12 21 12 21Z"
      />
      <circle cx="12" cy="9.5" r="2.5" />
    </svg>
  );
}
