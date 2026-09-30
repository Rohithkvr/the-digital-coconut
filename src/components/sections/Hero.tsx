"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useRef, useSyncExternalStore, type ReactNode } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LocalTime } from "@/components/ui/LocalTime";
import { Magnetic } from "@/components/ui/Magnetic";
import { PixelTrail } from "@/components/ui/PixelTrail";
import { RollingWord } from "@/components/ui/RollingWord";
import { ShowreelCard } from "@/components/ui/ShowreelCard";
import { hero, services } from "@/content/home";
import { featuredFilm, films, studio, type Film } from "@/content/studio";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/layout/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Entrance choreography, in seconds: the pill, then the three headline lines
 * flipping up one after another, then the supporting copy, and the chrome at
 * the edges last — the eye lands on the statement before anything else.
 */
const T = {
  pill: 0,
  lines: 0.12,
  lineStep: 0.13,
  sub: 0.75,
  ctas: 0.87,
  edges: 1.15,
  ticker: 1.3,
} as const;

/*
 * The headline is centred, so the rolling word gets a line of its own: on a
 * shared line ("that Perform") every change of word length would re-centre
 * the line and shove "that" sideways. The lead sentence is split from the
 * copy doc's text rather than retyped, so an edit there can't desync it.
 */
const leadWords = hero.headline.lead.split(" ");
const LEAD_LINES = [leadWords.slice(0, 2).join(" "), leadWords.slice(2).join(" ")] as const;
const LINE_COUNT = LEAD_LINES.length + 1;

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
 * The homepage hero: one centred column, the statement as large as the
 * column allows.
 *
 *  - The headline flips up line by line out of its own masks, in 3D, and
 *    the last word rolls over split-flap style on a line of its own, lit in
 *    the brand green.
 *  - The logo's dissolving pixel trail follows the cursor (or bursts from a
 *    tap) and snaps to the page grid; once after load, a ghost stroke sweeps
 *    across the headline to show it's there.
 *  - The edges carry proof rather than decoration: the local time in Kochi,
 *    a reel of the studio's own films, the four disciplines on a ticker.
 *
 * The scroll exit is desktop-only: on a phone the hero is taller than the
 * screen, and a fade would dim the CTAs while they're still being read.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
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

  // Exit: the lines drift apart as they leave — the lower the line, the
  // further it travels — while everything fades.
  const copyOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const line0 = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const line1 = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const line2 = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const lineY = [line0, line1, line2];
  const copyBottomY = useTransform(scrollYProgress, [0, 1], [0, 190]);
  const edgesOpacity = useTransform(scrollYProgress, [0, 0.35], [1, 0]);
  const trailOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);

  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  /** One headline line: a vertical-only mask, and the line flipping up in it. */
  const line = (i: number, content: ReactNode) => (
    // Mask: clips vertically only (`overflow-y: clip`), so a line can never
    // be cut off at the side if a wider font lands; pb/-mb gives descenders
    // room inside it. The perspective here is what makes the flip 3D.
    <motion.span
      key={i}
      className="-mb-[0.18em] block overflow-y-clip [perspective:1000px]"
      style={exit ? { y: lineY[i] } : undefined}
    >
      <motion.span
        className="block origin-bottom pb-[0.18em]"
        initial={reduceMotion ? false : { y: "100%", rotateX: -70, opacity: 0 }}
        animate={{ y: "0%", rotateX: 0, opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE, delay: T.lines + i * T.lineStep }}
      >
        {content}
      </motion.span>
    </motion.span>
  );

  return (
    <section
      ref={ref}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden pt-28 pb-6 sm:pt-32 lg:pt-28"
    >
      {/* ── Atmosphere: light pooled behind the statement ─────────── */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`absolute top-[6%] left-1/2 h-[640px] w-[1100px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(46,126,80,0.32)_0%,rgba(96,185,126,0.09)_45%,transparent_72%)] blur-[120px] ${
            reduceMotion ? "" : "animate-pulse-glow"
          }`}
        />
        <div className="absolute top-[34%] left-1/2 h-[300px] w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(140,167,122,0.12)_0%,transparent_70%)] blur-[90px]" />
      </div>

      {/* ── Signature: the logo's pixel trail, under everything ── */}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={exit ? { opacity: trailOpacity } : undefined}
      >
        <PixelTrail targetRef={ref} originRef={headlineRef} />
      </motion.div>

      <Container className="relative flex flex-1 flex-col">
        {/* Local time — a corner detail, large screens only */}
        {/* Entrance and scroll exit both drive opacity, so they sit on two
            elements rather than fighting over one. */}
        <motion.div
          style={exit ? { opacity: edgesOpacity } : undefined}
          className="absolute top-1 right-5 z-10 hidden sm:right-8 lg:block"
        >
          <motion.div {...rise(T.edges)}>
            <LocalTime city={site.city} />
          </motion.div>
        </motion.div>

        {/* ── The centred statement ─────────────────────────────── */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">
          <motion.div
            style={exit ? { opacity: copyOpacity } : undefined}
            className="flex w-full flex-col items-center"
          >
            <motion.span
              {...rise(T.pill)}
              className="inline-flex items-center gap-2.5 rounded-full border border-line-accent bg-white/[0.04] py-1.5 pr-4 pl-3 font-mono text-[10px] tracking-[0.16em] text-brand-olive uppercase backdrop-blur-sm sm:text-[11px] sm:tracking-[0.18em]"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-mint opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-mint" />
              </span>
              {/* City and region share one span: the pill is a flex row with
                  a gap, so a separate ", Kerala" span would become its own
                  flex item and get a gap before the comma. Region is dropped
                  on the smallest phones, where it wrapped the pill. */}
              <span>
                Full-stack agency · {site.city}
                <span className="hidden sm:inline">, {site.region}</span>
              </span>
            </motion.span>

            {/* `@container` so the headline sizes to this column (cqw), not
                the viewport: the longest line fits at every breakpoint and in
                either brand font. It's also capped by screen height (svh), so a
                short laptop screen still shows the whole hero. On the narrowest
                phones the middle line may wrap inside its mask rather than
                shrink the whole headline. */}
            <div ref={headlineRef} className="@container relative mt-7 w-full sm:mt-8">
              {/* The rolling word's glow: a static pool of light behind the
                  bottom line, not a drop-shadow filter on the word. A filter
                  there is recomputed on every frame of every roll; this is
                  painted once. Outside the line masks so it isn't clipped. */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[2%] left-1/2 -z-10 h-[38%] w-[52%] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(96,185,126,0.30)_0%,rgba(96,185,126,0.08)_50%,transparent_72%)] blur-2xl"
                initial={reduceMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1.4, ease: EASE, delay: T.lines + (LINE_COUNT - 1) * T.lineStep + 0.3 }}
              />
              <h1 className="font-display text-[length:clamp(2.9rem,min(10.5cqw,12.5svh),7.5rem)] leading-[0.92] font-semibold tracking-[-0.045em] text-balance">
                {/* One stable sentence for assistive tech and crawlers; the
                    animated lines below are decoration to them. */}
                <span className="sr-only">
                  {hero.headline.lead} {hero.headline.rotating.join(", ")}.
                </span>

                <span aria-hidden="true" className="block">
                  {/* `text-gradient` sits on the inline span that owns the
                      glyphs — never on an ancestor of a mask. */}
                  {LEAD_LINES.map((text, i) =>
                    line(i, <span className="text-gradient">{text}</span>),
                  )}
                  {line(
                    LINE_COUNT - 1,
                    <RollingWord
                      words={hero.headline.rotating}
                      paused={!inView}
                      letterClassName="bg-gradient-to-b from-[#D6F3DF] via-[#8FD3A6] to-accent-mint bg-clip-text text-transparent"
                    />,
                  )}
                </span>
              </h1>
            </div>
          </motion.div>

          <motion.div
            style={exit ? { opacity: copyOpacity, y: copyBottomY } : undefined}
            className="flex w-full flex-col items-center"
          >
            <motion.p
              {...rise(T.sub)}
              className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg"
            >
              {hero.sub}
            </motion.p>
            <motion.div
              {...rise(T.ctas)}
              className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row"
            >
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
        </div>

        {/* ── Edges: scroll cue (left) and the reel (right) ─────── */}
        <motion.div
          style={exit ? { opacity: edgesOpacity } : undefined}
          className="relative z-10 mt-10 flex items-end justify-center lg:justify-between"
        >
          <motion.div
            {...rise(T.edges)}
            aria-hidden="true"
            className="hidden items-center gap-3 font-mono text-[10px] tracking-[0.22em] text-fg-subtle uppercase lg:flex"
          >
            <span className="relative h-9 w-px overflow-hidden bg-white/10">
              <span className="absolute inset-x-0 top-0 h-3 bg-accent-mint motion-safe:animate-[scroll-cue_2.2s_cubic-bezier(0.65,0,0.35,1)_infinite]" />
            </span>
            Scroll
          </motion.div>

          {reelFilms.length > 0 && (
            <motion.div {...rise(T.edges)} className="w-full max-w-md lg:w-[360px]">
              <ShowreelCard
                films={reelFilms}
                href="#studio"
                label={studio.eyebrow}
                paused={!inView}
              />
            </motion.div>
          )}
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
        className="relative mt-8 overflow-hidden border-y border-line py-4 [mask-image:linear-gradient(to_right,transparent,#000_12%,#000_88%,transparent)]"
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
