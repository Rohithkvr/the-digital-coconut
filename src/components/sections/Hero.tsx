"use client";

import {
  motion,
  useInView,
  useScroll,
  useTransform,
} from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef, useSyncExternalStore } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { HeroMark } from "@/components/ui/HeroMark";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic } from "@/components/ui/Magnetic";
import { ParallaxLayer, useParallaxPointer } from "@/components/ui/Parallax";
import { PixelTrail } from "@/components/ui/PixelTrail";
import { RollingWord } from "@/components/ui/RollingWord";
import { ShowreelCard } from "@/components/ui/ShowreelCard";
import { hero, services } from "@/content/home";
import { featuredFilm, films, studio, type Film } from "@/content/studio";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/layout/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Entrance choreography, in seconds. Headline lines sweep up one after
 * another while the mark assembles beside them; the supporting copy, the
 * reel and the chrome only arrive once the statement has landed.
 */
const T = {
  chrome: 0,
  lines: 0.15,
  lineStep: 0.12,
  sub: 0.8,
  ctas: 0.9,
  reel: 1.15,
  cue: 1.4,
  ticker: 1.3,
} as const;

/*
 * The headline is set in three short lines — two lead words, the middle,
 * then the last word joined by the rolling one — derived from the copy doc's
 * sentence rather than retyped, so an edit to the copy can't desync them.
 */
const leadWords = hero.headline.lead.split(" ");
const LINES = [
  leadWords.slice(0, 2).join(" "),
  leadWords.slice(2, -1).join(" "),
  leadWords.at(-1) ?? "",
] as const;

/** The reel leads with reach: the three originals with the most views. */
const REEL_SLUGS = ["marco-teaser-recreation", "consent", "njanaam-nilavu"] as const;
const reelFilms = REEL_SLUGS.map((slug) =>
  [featuredFilm, ...films].find((f) => f.slug === slug),
).filter((f): f is Film => Boolean(f));

const TICKER = services.map((s) => s.title);
const TICKER_GREENS = ["#5c8c56", "#94aa7b", "#3e7852", "#7d9367"] as const;

const DESKTOP = "(min-width: 1024px)";
function subscribeDesktop(onChange: () => void) {
  const mq = window.matchMedia(DESKTOP);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * The homepage hero.
 *
 * Three ideas carry it:
 *  1. Editorial scale — a three-line statement set as large as its column
 *     allows, each line sweeping up out of its own mask, the last word
 *     rolling over like a split-flap board.
 *  2. The brand, made interactive — the logo's dissolving pixel trail
 *     follows the cursor (or bursts from a tap) and snaps to the page grid,
 *     beside the mark assembling itself tile by tile.
 *  3. Proof over claims — a live reel of the studio's own films, the local
 *     time in Kochi, the four disciplines on a running ticker.
 *
 * On phones the mark drops behind the headline as a backdrop and the reel
 * becomes a compact row, so the statement and both CTAs stay above the fold.
 * The scroll exit is desktop-only: on a phone the hero is taller than the
 * screen, and a fade would dim the CTAs while they're still being read.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pointer = useParallaxPointer(ref);
  // Cycles (rolling word, reel) hold still while the hero is off-screen.
  const inView = useInView(ref, { amount: 0.15 });

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

  // Exit: the three lines drift apart as they leave — the lower the line,
  // the further it travels — while the mark turns away and the reel rises.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const line0 = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const line1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const line2 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const lineY = [line0, line1, line2];
  const copyBottomY = useTransform(scrollYProgress, [0, 1], [0, 180]);
  const markRotate = useTransform(scrollYProgress, [0, 1], [0, 18]);
  const markScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const markOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.12]);
  const trailOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-8 sm:pt-32 lg:pt-32"
    >
      {/* ── Atmosphere ─────────────────────────────────────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`absolute top-[2%] left-[62%] h-[640px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(46,126,80,0.30)_0%,rgba(96,185,126,0.08)_45%,transparent_72%)] blur-[120px] ${
            reduceMotion ? "" : "animate-pulse-glow"
          }`}
        />
        <div className="absolute top-[45%] left-[8%] h-[360px] w-[680px] rounded-full bg-[radial-gradient(ellipse,rgba(140,167,122,0.10)_0%,transparent_70%)] blur-[100px]" />
      </div>

      {/* ── Signature: the logo's pixel trail, under everything ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={exit ? { opacity: trailOpacity } : undefined}
      >
        <PixelTrail targetRef={ref} originRef={stageRef} />
      </motion.div>

      <Container className="relative flex flex-1 flex-col">
        {/* ── Top chrome ─────────────────────────────────────── */}
        <motion.div
          {...rise(T.chrome)}
          className="relative z-10 flex items-center justify-between gap-4"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-line-accent bg-white/[0.04] py-1.5 pr-4 pl-3 font-mono text-[10px] tracking-[0.16em] text-brand-olive uppercase backdrop-blur-sm sm:text-[11px] sm:tracking-[0.18em]">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-mint opacity-70 motion-reduce:hidden" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-mint" />
            </span>
            Full-stack agency · {site.city}, {site.region}
          </span>
          {/* Breakpoint on a wrapper: LocalTime's own `inline-flex` and a
              `hidden` on the same element would leave the winner to
              stylesheet order. */}
          <div className="hidden lg:block">
            <LocalTime city={site.city} />
          </div>
        </motion.div>

        <div className="relative mt-10 grid flex-1 grid-cols-1 content-center gap-y-9 lg:mt-4 lg:grid-cols-[minmax(0,1.75fr)_minmax(0,1fr)] lg:grid-rows-[auto_auto] lg:gap-x-10 lg:gap-y-10">
          {/* ── Statement ──────────────────────────────────────── */}
          {/* `@container` so the headline sizes to THIS column (cqw), not
              the viewport: the longest line always fits whatever the grid
              leaves it, at every breakpoint and in either brand font. */}
          <motion.div
            style={exit ? { opacity: copyOpacity } : undefined}
            className="@container relative z-10 lg:col-start-1 lg:row-start-1 lg:self-end"
          >
            <h1 className="font-display text-[length:clamp(2.6rem,14cqw,7.5rem)] leading-[0.92] font-semibold tracking-[-0.045em]">
              {/* One stable sentence for assistive tech and crawlers; the
                  animated lines below are decoration to them. */}
              <span className="sr-only">
                {hero.headline.lead} {hero.headline.rotating.join(", ")}.
              </span>

              <span aria-hidden="true" className="block">
                {LINES.map((line, i) => (
                  // Mask: clips vertically only (`overflow-y: clip`), so a
                  // line can never be cut off at the side if a wider font
                  // lands; pb/-mb gives descenders room inside it.
                  <motion.span
                    key={line}
                    className="-mb-[0.18em] block overflow-y-clip"
                    style={exit ? { y: lineY[i] } : undefined}
                  >
                    <motion.span
                      className="block origin-bottom-left pb-[0.18em]"
                      initial={reduceMotion ? false : { y: "115%", rotate: 4 }}
                      animate={{ y: "0%", rotate: 0 }}
                      transition={{ duration: 1.05, ease: EASE, delay: T.lines + i * T.lineStep }}
                    >
                      {/* `text-gradient` sits on the inline span that owns
                          the glyphs — never on an ancestor of a mask. */}
                      <span className="text-gradient">{line}</span>
                      {i === LINES.length - 1 && (
                        <>
                          {" "}
                          <RollingWord
                            words={hero.headline.rotating}
                            paused={!inView}
                            letterClassName="bg-gradient-to-b from-[#CDEFD7] via-[#8FD3A6] to-accent-mint bg-clip-text text-transparent"
                          />
                        </>
                      )}
                    </motion.span>
                  </motion.span>
                ))}
              </span>
            </h1>
          </motion.div>

          {/* ── Stage: the mark ────────────────────────────────── */}
          {/* Phones: a backdrop behind the headline, top right. From lg: its
              own column, spanning both rows. */}
          <div
            ref={stageRef}
            className="pointer-events-none absolute -top-6 -right-20 w-[72%] max-w-[340px] opacity-40 sm:-right-10 lg:pointer-events-auto lg:relative lg:top-auto lg:right-auto lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:w-full lg:max-w-[440px] lg:self-start lg:justify-self-end lg:opacity-100"
          >
            <motion.div
              style={exit ? { rotate: markRotate, scale: markScale, opacity: markOpacity } : undefined}
              className="relative aspect-square w-full"
            >
              <Orbit reduceMotion={!!reduceMotion} />
              <div
                aria-hidden="true"
                className="absolute inset-[18%] rounded-full bg-[radial-gradient(circle,rgba(96,185,126,0.24)_0%,transparent_70%)] blur-2xl"
              />
              <ParallaxLayer
                className="absolute inset-[15%]"
                scrollYProgress={scrollYProgress}
                pointerX={pointer.x}
                pointerY={pointer.y}
                pointerRange={12}
              >
                {/* Idle float is CSS, on an element Framer isn't moving */}
                <div className="h-full w-full animate-float-slow">
                  <HeroMark className="h-full w-full drop-shadow-[0_18px_40px_rgba(0,0,0,0.55)]" />
                </div>
              </ParallaxLayer>
            </motion.div>
          </div>

          {/* ── Sub + CTAs ─────────────────────────────────────── */}
          <motion.div
            style={exit ? { opacity: copyOpacity, y: copyBottomY } : undefined}
            className="relative z-10 lg:col-start-1 lg:row-start-2 lg:self-start"
          >
            <motion.p
              {...rise(T.sub)}
              className="max-w-md text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              {hero.sub}
            </motion.p>
            <motion.div {...rise(T.ctas)} className="mt-8 flex flex-col gap-3 sm:flex-row">
              {/* The width classes live on the Magnetic wrapper as well as
                  the button: the wrapper takes over layout, so without them
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

          {/* ── Reel ───────────────────────────────────────────── */}
          {reelFilms.length > 0 && (
            <motion.div
              style={exit ? { opacity: copyOpacity } : undefined}
              className="relative z-10 w-full max-w-md lg:col-start-2 lg:row-start-2 lg:w-[340px] lg:self-end lg:justify-self-end"
            >
              <ParallaxLayer
                scrollYProgress={scrollYProgress}
                scrollRange={exit ? -120 : 0}
                pointerX={pointer.x}
                pointerY={pointer.y}
                pointerRange={-14}
              >
                <motion.div {...rise(T.reel)}>
                  <ShowreelCard
                    films={reelFilms}
                    href="#studio"
                    label={studio.eyebrow}
                    paused={!inView}
                  />
                </motion.div>
              </ParallaxLayer>
            </motion.div>
          )}
        </div>

        {/* ── Scroll cue ──────────────────────────────────────── */}
        <motion.div
          {...rise(T.cue)}
          aria-hidden="true"
          className="relative z-10 mt-10 hidden items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-fg-subtle uppercase lg:flex"
        >
          <span className="relative h-9 w-px overflow-hidden bg-white/10">
            <span className="absolute inset-x-0 top-0 h-3 bg-accent-mint motion-safe:animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
          </span>
          Scroll
        </motion.div>
      </Container>

      {/* ── Ticker ───────────────────────────────────────────── */}
      {/* Decorative: the same four disciplines are listed, readably, in
          the Services section. Each copy of the track is three rounds of
          the list, so one copy is always wider than the screen and the
          -50% loop never shows a gap. */}
      <motion.div
        {...rise(T.ticker)}
        aria-hidden="true"
        className="relative mt-10 overflow-hidden border-y border-line py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
      >
        <div className="flex w-max motion-safe:animate-[reel-marquee_48s_linear_infinite]">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0 items-center">
              {[0, 1, 2].flatMap((round) =>
                TICKER.map((item, i) => (
                  <span
                    key={`${round}-${item}`}
                    className="flex items-center gap-8 pr-8 font-mono text-[11px] tracking-[0.22em] whitespace-nowrap text-fg-subtle uppercase"
                  >
                    {item}
                    <span
                      className="h-2 w-2"
                      style={{ backgroundColor: TICKER_GREENS[(i + round) % TICKER_GREENS.length] }}
                    />
                  </span>
                )),
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

/**
 * Two rings around the mark: a solid hairline that draws itself in, and a
 * dashed ring carrying a single point of light that turns slowly. The turn
 * is CSS, so the global reduced-motion rule in globals.css stops it.
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
            fight it for `transform`. */}
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
