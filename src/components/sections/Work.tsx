import Image from "next/image";
import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { MediaPlaceholder } from "@/components/ui/MediaPlaceholder";
import { ClipReveal } from "@/components/ui/ClipReveal";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/layout/icons";
import { isPlaceholder } from "@/lib/content";
import { work, workItems, type WorkItem } from "@/content/work";
import { cn } from "@/lib/cn";

/**
 * Gallery of shipped work. The first item is featured — two columns and a
 * wider crop — so the grid reads as a composition rather than a catalogue.
 *
 * Deliberately shows the artefact, not results: no metrics, no invented
 * numbers. That keeps it consistent with the "No case studies here" section
 * further down the page, which promises real accounts on a call instead of
 * screenshots nobody can verify.
 */
export function Work() {
  return (
    <Section id="work">
      <SectionHeading eyebrow={work.eyebrow} title={work.heading} lede={work.lede} />

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {workItems.map((item, i) => (
          <Reveal
            key={item.slug}
            delay={Math.min(i, 4) * 0.07}
            className={cn("h-full", i === 0 && "sm:col-span-2")}
          >
            <WorkCard item={item} featured={i === 0} />
          </Reveal>
        ))}
      </div>

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <ButtonLink href={work.cta.href} variant="secondary" size="lg">
          {work.cta.label}
          <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
        </ButtonLink>
      </Reveal>
    </Section>
  );
}

function WorkCard({ item, featured }: { item: WorkItem; featured: boolean }) {
  const namePending = isPlaceholder(item.name);
  const descPending = isPlaceholder(item.description);

  const card = (
    <SpotlightCard as="article" className="flex h-full flex-col p-3 sm:p-4">
      {/* Media */}
      <div
        className={cn(
          "relative w-full flex-1 overflow-hidden rounded-xl border border-line bg-canvas-elevated",
          featured
            ? "min-h-[240px] sm:min-h-[300px] lg:min-h-[340px]"
            : "min-h-[200px] sm:min-h-[220px]",
        )}
      >
        <ClipReveal className="absolute inset-0">
        {item.image ? (
          <Image
            src={item.image}
            alt={namePending ? "" : item.name}
            fill
            sizes={
              featured
                ? "(min-width: 1024px) 66vw, (min-width: 640px) 100vw, 100vw"
                : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            }
            className="object-cover transition-transform duration-500 ease-expo group-hover:scale-[1.04]"
          />
        ) : (
          <MediaPlaceholder />
        )}
        </ClipReveal>

        {/* legibility wash under the pill */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent"
        />

        <span className="absolute bottom-3 left-3 rounded-lg border border-line-accent bg-[rgba(11,20,16,0.8)] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-accent-mint uppercase backdrop-blur-sm">
          {item.discipline}
        </span>

        {item.href && (
          <span
            aria-hidden="true"
            className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-[rgba(11,20,16,0.75)] text-fg backdrop-blur-sm transition-all duration-200 ease-expo group-hover:border-line-accent group-hover:text-accent-mint"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="h-3.5 w-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17 17 7M9 7h8v8" />
            </svg>
          </span>
        )}
      </div>

      {/* Caption */}
      <div className="px-1.5 pt-4 pb-2">
        <h3
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            namePending ? "text-fg-subtle italic" : "text-fg",
          )}
        >
          {item.name}
        </h3>
        <p
          className={cn(
            "mt-1.5 text-sm leading-relaxed",
            descPending ? "text-fg-subtle italic" : "text-fg-muted",
          )}
        >
          {item.description}
        </p>
      </div>
    </SpotlightCard>
  );

  if (!item.href) return card;

  return (
    <Link
      href={item.href}
      target={item.href.startsWith("http") ? "_blank" : undefined}
      rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
      aria-label={namePending ? `${item.discipline} project` : item.name}
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-mint"
    >
      {card}
    </Link>
  );
}
