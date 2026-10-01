"use client";

import Image from "next/image";
import {
  AnimatePresence,
  animate,
  inView,
  motion,
  useMotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { PlayIcon } from "@/components/layout/icons";
import { FilmReel } from "./FilmReel";
import { featuredFilm, films, studio, studioStats, studioStory } from "@/content/studio";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Letterbox bar height, in % of the 16:9 screen. Closed, the two bars meet
 * in a slit; at rest they frame the picture at roughly 2.35:1 scope.
 */
const BAR_CLOSED = 50;
const BAR_REST = 12;

/**
 * Urumbhu Productions — the in-house film studio, presented like a film.
 *
 * The featured film sits on a cinema screen whose letterbox opens as it
 * scrolls in, from a slit to scope, the poster settling as it goes, with
 * opening titles over the picture and the technical details riding the
 * edges of the bars like a viewfinder. Pressing play pulls the bars fully
 * back and plays the film in place; YouTube only loads on that click.
 * Below: the story, the numbers as end credits, and the catalogue running
 * past on a 35mm strip.
 *
 * `bare` on the Section: the strip is full-bleed and has to escape the
 * Container, so this section manages its own.
 */
export function Studio() {
  return (
    <Section id="studio" bare>
      <Container>
        <SectionHeading eyebrow={studio.eyebrow} title={studio.heading} lede={studio.lede} />

        <CinemaScreen />

        <div className="mt-14 grid grid-cols-1 gap-12 lg:mt-20 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <div className="space-y-5">
              {studioStory.map((paragraph, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "font-display text-xl leading-snug font-medium tracking-tight text-fg sm:text-2xl"
                      : "text-base leading-relaxed text-fg-muted sm:text-lg"
                  }
                >
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <ButtonLink href={studio.channelUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
                {studio.cta}
              </ButtonLink>
            </div>
          </Reveal>

          <div className="lg:col-span-6">
            <Reveal>
              <p className="font-mono text-[11px] tracking-[0.2em] text-accent-mint uppercase">Credits</p>
            </Reveal>
            <dl className="mt-4 border-t border-white/10">
              {studioStats.map((stat, i) => (
                <Reveal
                  key={stat.label}
                  delay={0.06 * i}
                  className="flex items-baseline gap-4 border-b border-white/10 py-4 sm:py-5"
                >
                  {/* The dotted leader is the label's own ::after, so the dl
                      keeps its div > dt + dd content model. */}
                  <dt className="flex min-w-0 flex-1 items-baseline gap-4 font-mono text-[10px] leading-relaxed tracking-wider text-fg-muted uppercase after:mb-1 after:min-w-6 after:flex-1 after:border-b after:border-dotted after:border-white/20 after:content-[''] sm:text-[11px]">
                    {stat.label}
                  </dt>
                  <dd className="shrink-0 font-display text-3xl leading-none font-semibold tracking-tight text-fg tabular-nums sm:text-5xl">
                    <Counter value={stat.value} />
                  </dd>
                </Reveal>
              ))}
            </dl>
          </div>
        </div>

        <Reveal className="mt-16 lg:mt-24">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent-mint uppercase">The reel</span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">{films.length} films</span>
          </div>
        </Reveal>
      </Container>

      {/* Full-bleed on purpose — outside the Container so the strip runs off
          both edges of the viewport. */}
      <Reveal className="relative mt-8">
        <FilmReel films={films} />
      </Reveal>
    </Section>
  );
}

/**
 * The featured film on a cinema screen. Both bars read one height, so they
 * always move together: scroll progress opens them to scope, and play
 * (a 0→1 value) retracts them from wherever the scroll left them. The
 * opening titles fade up over the last stretch of the opening, once there's
 * picture for them to sit on.
 *
 * Films the channel won't let other sites embed (see `Film.embeddable`)
 * would only play YouTube's "Video unavailable" card, so for those the
 * screen is a link out to youtube.com instead of a player.
 */
function CinemaScreen() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [playing, setPlaying] = useState(false);
  const [poster, setPoster] = useState<"maxresdefault" | "hqdefault">("maxresdefault");

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "center 0.55"] });
  const play = useMotionValue(0);
  const bar = useTransform(
    [scrollYProgress, play],
    ([p, pl]: number[]) => `${(BAR_CLOSED + (BAR_REST - BAR_CLOSED) * Math.min(1, p)) * (1 - pl)}%`,
  );
  const barStill = useTransform(play, (pl) => `${BAR_REST * (1 - pl)}%`);
  const posterScale = useTransform(scrollYProgress, [0, 1], [1.16, 1]);
  const titlesOpacity = useTransform(scrollYProgress, [0.7, 1], [0, 1]);
  const titlesY = useTransform(scrollYProgress, [0.7, 1], [28, 0]);

  const start = () => {
    setPlaying(true);
    animate(play, 1, { duration: reduceMotion ? 0 : 0.8, ease: EASE });
  };

  const embeddable = featuredFilm.embeddable !== false;
  const barHeight = reduceMotion ? barStill : bar;
  const detail = `${featuredFilm.kind}, ${featuredFilm.runtime}`;
  const surface = "group absolute inset-0 block h-full w-full cursor-pointer focus-visible:outline-none";

  const face = (
    <>
      <motion.span className="absolute inset-0 block" style={{ scale: reduceMotion ? 1 : posterScale }}>
        <Image
          src={`https://i.ytimg.com/vi/${featuredFilm.youtubeId}/${poster}.jpg`}
          alt=""
          fill
          sizes="(min-width: 1280px) 1216px, 100vw"
          className="object-cover transition-transform duration-700 ease-expo group-hover:scale-[1.03]"
          onError={() => setPoster("hqdefault")}
        />
      </motion.span>
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/35 to-black/5" />
      <span
        aria-hidden="true"
        className="absolute top-1/2 right-[7%] flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-full border border-white/50 bg-black/40 text-white transition-[transform,border-color,background-color] duration-300 ease-expo group-hover:scale-110 group-hover:border-accent-mint group-hover:bg-accent/70 group-focus-visible:scale-110 group-focus-visible:border-accent-mint sm:h-20 sm:w-20 lg:h-24 lg:w-24"
      >
        <span className="absolute inset-0 rounded-full border border-white/30" />
        <PlayIcon className="ml-1 h-5 w-5 sm:h-7 sm:w-7" />
        {!embeddable && (
          <span className="absolute top-full left-1/2 mt-2 -translate-x-1/2 rounded-full bg-black/70 px-2 py-1 font-mono text-[8px] leading-none tracking-[0.2em] whitespace-nowrap text-white/85 uppercase sm:mt-3 sm:px-2.5 sm:text-[10px]">
            YouTube ↗
          </span>
        )}
      </span>
    </>
  );

  return (
    <div ref={ref} className="relative isolate mt-12 lg:mt-16">
      {/* Projector spill: static light behind the screen. Kept inside the
          Container's box so it can't widen a phone's layout viewport. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-16 bottom-0 -z-10 bg-[radial-gradient(65%_60%_at_50%_45%,rgba(96,185,126,0.16),transparent_70%)]"
      />

      <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black shadow-[0_40px_120px_-30px_rgba(96,185,126,0.28),0_30px_80px_rgba(0,0,0,0.6)] ring-accent-mint ring-offset-4 ring-offset-canvas-base has-[:focus-visible]:ring-2">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${featuredFilm.youtubeId}?autoplay=1`}
            title={featuredFilm.title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : embeddable ? (
          <button type="button" onClick={start} aria-label={`Play ${featuredFilm.title} (${detail})`} className={surface}>
            {face}
          </button>
        ) : (
          <a
            href={`https://www.youtube.com/watch?v=${featuredFilm.youtubeId}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Watch ${featuredFilm.title} on YouTube (${detail})`}
            className={surface}
          >
            {face}
          </a>
        )}

        {/* Opening titles, inside the scope picture; they leave when it plays */}
        <AnimatePresence>
          {!playing && (
            <motion.div
              key="titles"
              className="pointer-events-none absolute bottom-[18%] left-[5%] max-w-[68%]"
              exit={{ opacity: 0, transition: { duration: 0.25 } }}
            >
              {/* Explicit values under reduced motion: dropping the motion
                  values from style would leave their last inline value. */}
              <motion.div style={reduceMotion ? { opacity: 1, y: 0 } : { opacity: titlesOpacity, y: titlesY }}>
                <span className="block font-mono text-[8px] tracking-[0.14em] whitespace-nowrap text-white/70 uppercase min-[400px]:text-[9px] min-[400px]:tracking-[0.2em] sm:text-[11px] sm:tracking-[0.3em]">
                  {studio.eyebrow} presents
                </span>
                <span className="mt-1.5 block font-display text-4xl leading-[0.9] font-semibold tracking-[-0.035em] text-white sm:mt-3 sm:text-7xl lg:text-8xl">
                  {featuredFilm.title}
                </span>
                {featuredFilm.credits && (
                  <span className="mt-4 hidden max-w-md text-sm leading-relaxed text-white/65 md:block">
                    {featuredFilm.credits}
                  </span>
                )}
                <span className="sr-only">
                  {detail}, {featuredFilm.views} views
                </span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* The letterbox. Each bar carries its line of detail on its inner
            edge, so the text rides the opening like a viewfinder readout.
            No padding on the bars themselves: they must reach 0 height. */}
        <motion.div
          aria-hidden="true"
          style={{ height: barHeight }}
          className="pointer-events-none absolute inset-x-0 top-0 z-10 overflow-hidden bg-black"
        >
          <span className={cn(READOUT, "bottom-1.5 sm:bottom-3")}>
            <span className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-accent-mint" />
              Now showing
            </span>
            <span>{featuredFilm.kind}</span>
          </span>
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={{ height: barHeight }}
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 overflow-hidden bg-black"
        >
          <span className={cn(READOUT, "top-1.5 sm:top-3")}>
            <span>
              {featuredFilm.runtime} · {featuredFilm.views} views
            </span>
            <span>2.35 : 1</span>
          </span>
        </motion.div>
      </div>
    </div>
  );
}

const READOUT =
  "absolute inset-x-[4%] flex items-center justify-between font-mono text-[8px] leading-none tracking-[0.22em] text-white/50 uppercase sm:text-[10px]";

/**
 * A stat that counts up the first time it comes into view, like credits
 * rolling. The markup always starts with the real value, so the server HTML
 * (crawlers, no-JS, reduced motion) has the true number. It is only zeroed
 * on the client, and only if it's still below the fold at that point: a
 * stat already on screen (a deep link, a restored scroll) keeps its value
 * rather than blinking to 0.
 */
function Counter({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduceMotion = useReducedMotion();

  const parts = /^([^\d]*)(\d+(?:\.\d+)?)(.*)$/.exec(value);
  const prefix = parts?.[1] ?? "";
  const target = parts ? parseFloat(parts[2]) : 0;
  const decimals = parts?.[2].split(".")[1]?.length ?? 0;
  const suffix = parts?.[3] ?? "";
  const countable = parts !== null;

  const count = useMotionValue(target);
  const text = useTransform(count, (v) => `${prefix}${v.toFixed(decimals)}${suffix}`);

  useEffect(() => {
    const el = ref.current;
    if (!el || !countable || reduceMotion) return;
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    count.set(0);
    let run: ReturnType<typeof animate> | undefined;
    const stop = inView(el, () => {
      run = animate(count, target, { duration: 1.8, ease: EASE });
    }, { amount: 0.8 });
    return () => {
      stop();
      run?.stop();
      count.set(target);
    };
  }, [countable, reduceMotion, target, count]);

  return <motion.span ref={ref}>{countable ? text : value}</motion.span>;
}
