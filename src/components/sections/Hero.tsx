"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { TypewriterWord } from "@/components/ui/TypewriterWord";
import { hero, services } from "@/content/home";
import { site } from "@/content/site";
import { ArrowIcon } from "@/components/layout/icons";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Centred statement hero: everything on one axis, oversized type, and a pool
 * of light behind the headline. The lead sits on its own line so the
 * typewriter field can grow from the centre without moving anything above it.
 */
export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.95]);
  const y = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const parallax = reduceMotion ? undefined : { opacity, scale, y };

  // Entrance: each element rises into place 80ms after the one before it.
  const rise = (delay: number) => ({
    initial: reduceMotion ? false : { opacity: 0, y: 24 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: EASE },
  });

  return (
    <section
      ref={ref}
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 md:pt-44 md:pb-28 lg:pt-52"
    >
      {/* Light pooling behind the statement — the centre of gravity */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className={`absolute top-[6%] left-1/2 h-[620px] w-[1100px] -translate-x-1/2 rounded-full blur-[130px] bg-[radial-gradient(ellipse,rgba(46,126,80,0.30)_0%,rgba(96,185,126,0.10)_45%,transparent_72%)] ${
            reduceMotion ? "" : "animate-pulse-glow"
          }`}
        />
        <div className="absolute top-[32%] left-1/2 h-[320px] w-[620px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse,rgba(140,167,122,0.12)_0%,transparent_70%)] blur-[90px]" />
      </div>

      <Container>
        <motion.div
          style={parallax}
          className="relative mx-auto max-w-5xl text-center"
        >
          {/* Status pill */}
          <motion.div {...rise(0)}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-line-accent bg-white/[0.04] py-1.5 pr-4 pl-3 font-mono text-[10px] tracking-[0.16em] text-brand-olive uppercase backdrop-blur-sm sm:text-[11px] sm:tracking-[0.18em]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-mint opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-mint" />
              </span>
              Full-stack agency · {site.city}, {site.region}
            </span>
          </motion.div>

          {/* Statement */}
          <motion.h1
            {...rise(0.08)}
            className="mt-8 font-display text-[2.5rem] leading-[1.05] font-semibold tracking-[-0.035em] sm:text-5xl md:text-6xl lg:text-[4rem] xl:text-[4.5rem]"
          >
            {/* One stable sentence for assistive tech and crawlers; the
                visible headline is decorative to them. */}
            <span className="sr-only">
              {hero.headline.lead} {hero.headline.rotating.join(", ")}.
            </span>

            <span aria-hidden="true" className="text-gradient block">
              {hero.headline.lead}
            </span>
            <span aria-hidden="true" className="mt-4 block sm:mt-5">
              <TypewriterWord words={hero.headline.rotating} />
            </span>
          </motion.h1>

          {/* Sub */}
          <motion.p
            {...rise(0.16)}
            className="mx-auto mt-8 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg md:text-xl"
          >
            {hero.sub}
          </motion.p>

          {/* CTAs */}
          <motion.div
            {...rise(0.24)}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <ButtonLink href={hero.primaryCta.href} size="lg" className="w-full sm:w-auto">
              {hero.primaryCta.label}
              <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
            </ButtonLink>
            <ButtonLink
              href={hero.secondaryCta.href}
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              {hero.secondaryCta.label}
            </ButtonLink>
          </motion.div>

          {/* Disciplines — one centred line, fading hairline above */}
          <motion.div {...rise(0.34)} className="mt-16">
            <div
              aria-hidden="true"
              className="mx-auto h-px w-full max-w-3xl bg-gradient-to-r from-transparent via-white/12 to-transparent"
            />
            <ul className="mx-auto mt-6 grid grid-cols-2 gap-x-3 gap-y-3 font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-5 sm:text-[11px]">
              {services.map((s, i) => (
                <li key={s.slug} className="flex items-center justify-center sm:gap-5">
                  {i > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden h-1 w-1 rounded-full bg-accent-mint/50 sm:block"
                    />
                  )}
                  {s.title}
                </li>
              ))}
            </ul>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}
