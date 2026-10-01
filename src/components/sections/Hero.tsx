"use client";

import { useRef } from "react";
import { useInView } from "framer-motion";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { LocalTime } from "@/components/ui/LocalTime";
import { RollingWord } from "@/components/ui/RollingWord";
import { ShowreelCard } from "@/components/ui/ShowreelCard";
import { hero } from "@/content/home";
import { featuredFilm, films, studio, type Film } from "@/content/studio";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/layout/icons";

/*
 * The headline is centred, so the rolling word gets a line of its own: on a
 * shared line ("that Perform") every change of word length would re-centre
 * the line and shove "that" sideways. The lead sentence is split from the
 * copy doc's text rather than retyped, so an edit there can't desync it.
 */
const leadWords = hero.headline.lead.split(" ");
const LEAD_LINES = [leadWords.slice(0, 2).join(" "), leadWords.slice(2).join(" ")] as const;

/** The reel leads with reach: the three originals with the most views. */
const REEL_SLUGS = ["marco-teaser-recreation", "consent", "njanaam-nilavu"] as const;
const reelFilms = REEL_SLUGS.map((slug) => [featuredFilm, ...films].find((f) => f.slug === slug)).filter(
  (f): f is Film => Boolean(f),
);

/**
 * The homepage hero: one centred column, the statement as large as the
 * column allows, then the two ways in.
 *
 * Everything here is in the server HTML and visible on first paint. It used
 * to hold each line at zero opacity until JavaScript arrived and flipped it
 * in — which pushed the largest paint past three seconds on a phone — under
 * a cursor pixel trail, pulsing glows, a ticker and a scroll-linked exit.
 * What's left moves only where it means something: the last word of the
 * headline cycles (it's in the copy doc), and the reel card shows the
 * studio's real films.
 */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  // Cycles (rolling word, reel) hold still while the hero is off-screen.
  const inView = useInView(ref, { amount: 0.15 });

  return (
    <section ref={ref} className="relative flex min-h-[100svh] flex-col pt-28 pb-10 sm:pt-32 lg:pt-28">
      <Container className="relative flex flex-1 flex-col">
        {/* Local time — a corner detail, large screens only */}
        <div className="absolute top-1 right-5 hidden sm:right-8 lg:block">
          <LocalTime city={site.city} />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-sm font-medium text-brand-olive">
            Full-stack agency in {site.city}
            <span className="hidden sm:inline">, {site.region}</span>
          </p>

          {/* `@container` so the headline sizes to this column (cqw), not
              the viewport: the longest line fits at every breakpoint and in
              either brand font. It's also capped by screen height (svh), so a
              short laptop screen still shows the whole hero. */}
          <div className="@container mt-6 w-full sm:mt-7">
            <h1 className="font-display text-[length:clamp(2.75rem,min(10.5cqw,12.5svh),7.25rem)] leading-[0.95] font-semibold tracking-[-0.04em] text-balance text-fg">
              {/* One stable sentence for assistive tech and crawlers; the
                  visual lines below are decoration to them. */}
              <span className="sr-only">
                {hero.headline.lead} {hero.headline.rotating.join(", ")}.
              </span>
              <span aria-hidden="true" className="block">
                {LEAD_LINES.map((text) => (
                  <span key={text} className="block">
                    {text}
                  </span>
                ))}
                <span className="block text-accent-mint">
                  <RollingWord words={hero.headline.rotating} paused={!inView} startDelay={2.4} />
                </span>
              </span>
            </h1>
          </div>

          <p className="mx-auto mt-7 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{hero.sub}</p>

          <div className="mt-8 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
            <ButtonLink href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
              {hero.primaryCta.label}
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink href={hero.secondaryCta.href} variant="secondary" size="lg" className="w-full sm:w-auto">
              {hero.secondaryCta.label}
            </ButtonLink>
          </div>
        </div>

        {reelFilms.length > 0 && (
          <div className="mt-12 flex justify-center lg:justify-end">
            <ShowreelCard
              films={reelFilms}
              href="#studio"
              label={studio.eyebrow}
              paused={!inView}
              className="w-full max-w-md lg:w-[360px]"
            />
          </div>
        )}
      </Container>
    </section>
  );
}
