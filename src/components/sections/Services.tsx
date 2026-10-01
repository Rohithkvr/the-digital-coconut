"use client";

import { AnimatePresence, inView, motion, useInView, useScroll } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ArrowIcon } from "@/components/layout/icons";
import { contact, services } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";
import { SERVICE_VISUALS } from "./ServiceVisuals";

const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Each service's CTA opens the contact form with that service already
 * chosen. The dedicated /services/* pages the content links to don't exist
 * (they 404), so the form is where "talk to us about this" really leads.
 * The need is only preselected if the form actually offers it.
 */
const NEED_FOR: Record<string, string> = {
  "web-development": "A website",
  "performance-marketing": "Performance marketing",
  "seo-ai-search": "SEO & AI search",
  "video-production": "Video production",
};

function preselectNeed(slug: string) {
  const need = NEED_FOR[slug];
  if (!need || !(contact.needs as readonly string[]).includes(need)) return;
  const select = document.getElementById("need");
  if (select instanceof HTMLSelectElement) select.value = need;
}

/**
 * "What we do", as a scroll story.
 *
 * Desktop: a stage stays pinned on the left while the four services scroll
 * past on the right. Whichever service crosses the middle of the screen
 * lights up, and the stage switches to a live demonstration of it — a page
 * building itself and converting, impressions narrowing to customers, a
 * search answered with the site cited, the studio's own cut on a timeline.
 *
 * Phones: no pinning; each service is a card with its demonstration on top,
 * playing only while it's on screen.
 *
 * Only one demonstration runs at a time, and none run off-screen or under
 * reduced motion — they render their finished frame instead.
 */
export function Services() {
  const [active, setActive] = useState(0);
  const reduceMotion = useReducedMotion();
  const stageRef = useRef<HTMLDivElement>(null);
  const stageInView = useInView(stageRef, { amount: 0.3 });
  const listRef = useRef<HTMLOListElement>(null);

  // A hairline beside the list fills as the services scroll past.
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start center", "end center"],
  });

  const current = services[active];
  const Visual = SERVICE_VISUALS[current.slug];

  return (
    <Section id="what-we-do">
      <SectionHeading
        eyebrow="What we do"
        title="Four things, done in-house"
        lede="No subcontracting, no handoffs between vendors who have never spoken."
      />

      <div className="mt-12 lg:mt-20 lg:grid lg:grid-cols-12 lg:gap-14">
        {/* ── Pinned stage (desktop) ─────────────────────────────── */}
        <div className="hidden lg:col-span-7 lg:block">
          {/* Pinned at the vertical centre (stage + chapter bar is ~36rem), so
              it sits level with the service that's lit — never higher than
              8rem, which keeps it clear of the fixed header. */}
          <div ref={stageRef} className="sticky top-[max(8rem,calc(50vh-18rem))]">
            <Reveal>
              <StageFrame index={active} title={current.title}>
                <AnimatePresence initial={false}>
                  <motion.div
                    key={current.slug}
                    className="absolute inset-0"
                    initial={{ opacity: 0, scale: 0.97, y: 12 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 1.02, y: -12 }}
                    // Reduced motion: the stage swaps demonstrations instantly.
                    transition={{ duration: reduceMotion ? 0 : 0.55, ease: EASE }}
                  >
                    {Visual && <Visual play={stageInView && !reduceMotion} />}
                  </motion.div>
                </AnimatePresence>
              </StageFrame>
            </Reveal>

            {/* Chapter bar under the stage */}
            <div className="mt-5 grid grid-cols-4 gap-3">
              {services.map((s, i) => (
                <div key={s.slug}>
                  <div className="h-px overflow-hidden bg-white/10">
                    <motion.div
                      className="h-full origin-left bg-accent-mint"
                      initial={false}
                      animate={{ scaleX: i <= active ? 1 : 0 }}
                      transition={{ duration: reduceMotion ? 0 : 0.6, ease: EASE }}
                    />
                  </div>
                  <span
                    className={cn(
                      "mt-2.5 block text-xs leading-snug transition-colors duration-500",
                      i === active ? "text-fg" : "text-fg-subtle",
                    )}
                  >
                    {String(i + 1).padStart(2, "0")} {s.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── The four services ────────────────────────────────── */}
        <div className="relative lg:col-span-5">
          <span aria-hidden="true" className="absolute inset-y-0 left-0 hidden w-px bg-white/[0.08] lg:block">
            <motion.span
              className="absolute inset-x-0 top-0 h-full origin-top bg-accent-mint/70"
              style={reduceMotion ? undefined : { scaleY: scrollYProgress }}
            />
          </span>

          <ol ref={listRef} className="space-y-14 lg:space-y-0">
            {services.map((service, i) => (
              <ServiceEntry
                key={service.slug}
                index={i}
                slug={service.slug}
                title={service.title}
                body={service.body}
                active={i === active}
                setActive={setActive}
                reduceMotion={reduceMotion}
              />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

function ServiceEntry({
  index,
  slug,
  title,
  body,
  active,
  setActive,
  reduceMotion,
}: {
  index: number;
  slug: string;
  title: string;
  body: string;
  active: boolean;
  setActive: (index: number) => void;
  reduceMotion: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);

  // A line across the middle of the screen: the entry crossing it becomes
  // the one the pinned stage shows. An observer callback, so the parent's
  // state is only ever set from an event — never during render.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    return inView(el, () => setActive(index), { margin: "-50% 0px -50% 0px" });
  }, [index, setActive]);

  // Phones: the entry's own demonstration plays only while it's on screen.
  const visualRef = useRef<HTMLDivElement>(null);
  const visualInView = useInView(visualRef, { amount: 0.45 });
  const Visual = SERVICE_VISUALS[slug];

  return (
    <li
      ref={ref}
      className={cn(
        "relative lg:flex lg:min-h-[58vh] lg:flex-col lg:justify-center lg:py-10 lg:pl-10",
        "transition-opacity duration-500 ease-expo",
        !active && "lg:opacity-30",
      )}
    >
      <Reveal>
        {/* Phone: the demonstration sits on the card itself */}
        <div ref={visualRef} className="mb-6 lg:hidden">
          <StageFrame index={index} title={title}>
            {Visual && <Visual play={visualInView && !reduceMotion} />}
          </StageFrame>
        </div>

        <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">
          <span className={cn("transition-colors duration-500", active && "text-accent-mint")}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <span aria-hidden="true" className="h-px w-8 bg-white/15" />
          Service
        </span>

        <h3 className="mt-4 font-display text-3xl leading-[1.05] font-semibold tracking-[-0.03em] sm:text-4xl lg:text-5xl">
          <span className="text-gradient">{title}</span>
        </h3>

        <p className="mt-4 max-w-md text-base leading-relaxed text-fg-muted lg:text-lg">{body}</p>

        <a
          href="#contact"
          onClick={() => preselectNeed(slug)}
          className="group mt-7 inline-flex items-center gap-2 rounded-full border border-line-accent bg-accent-mint/[0.06] py-2.5 pr-4 pl-5 text-sm font-medium text-accent-mint transition-[background-color,border-color,color] duration-300 ease-expo hover:border-accent-mint/60 hover:bg-accent-mint/15 hover:text-white"
        >
          Talk to us about {title}
          <ArrowIcon className="h-4 w-4 transition-transform duration-300 ease-expo group-hover:translate-x-1" />
        </a>
      </Reveal>
    </li>
  );
}

/** The glass frame every demonstration plays inside. */
function StageFrame({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl border border-line bg-surface-glass shadow-[var(--shadow-card)]">
      <div className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-3.5 font-mono text-[10px] tracking-[0.18em] text-fg-subtle uppercase">
        <span className="truncate">
          <span className="text-accent-mint">{String(index + 1).padStart(2, "0")}</span>
          <span className="mx-2 text-white/20">/</span>
          {title}
        </span>
        {/* The brand's pixels, one lit per service */}
        <span aria-hidden="true" className="flex shrink-0 gap-1.5">
          {[0, 1, 2, 3].map((k) => (
            <span
              key={k}
              className={cn(
                "h-1.5 w-1.5 transition-colors duration-500",
                k === index ? "bg-accent-mint" : "bg-white/15",
              )}
            />
          ))}
        </span>
      </div>
      {/* Taller on narrow screens: at 16:11 a phone-width frame is ~240px
          tall and the demonstrations' lower rows were cut off. Measured: 4:5
          is needed below 380px (a 280px-wide frame), square above. */}
      <div className="relative aspect-[4/5] min-[380px]:aspect-square sm:aspect-[4/3] lg:aspect-[16/11]">
        {children}
      </div>
    </div>
  );
}
