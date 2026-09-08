import Link from "next/link";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { PixelMotif } from "@/components/ui/PixelMotif";
import { ArrowIcon } from "@/components/layout/icons";
import { services } from "@/content/home";

/**
 * Asymmetric bento. Web Development is the hero cell (spans 4 of 6 columns
 * and both rows on desktop); the remaining three stack around it so the grid
 * reads as a composition rather than a product matrix.
 */
const featured = "web-development";

const layout: Record<string, string> = {
  "web-development": "lg:col-span-4 lg:row-span-2",
  "performance-marketing": "lg:col-span-2",
  "seo-ai-search": "lg:col-span-2",
  "video-production": "lg:col-span-6",
};

export function Services() {
  return (
    <Section id="what-we-do">
      <SectionHeading
        eyebrow="What we do"
        title="Four things, done in-house"
        lede="No subcontracting, no handoffs between vendors who have never spoken."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-2 lg:mt-16 lg:auto-rows-[minmax(180px,auto)] lg:grid-cols-6">
        {services.map((service, i) => (
          <Reveal
            key={service.slug}
            delay={i * 0.08}
            className={layout[service.slug]}
          >
            <SpotlightCard
              as="article"
              className="flex h-full flex-col p-6 md:p-8"
              decoration={
                service.slug === featured ? (
                  <PixelMotif className="pointer-events-none absolute right-8 bottom-8 hidden h-56 w-auto opacity-60 transition-opacity duration-500 ease-expo group-hover:opacity-90 lg:block" />
                ) : undefined
              }
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-6 font-display text-xl font-semibold tracking-tight text-fg md:text-2xl">
                {service.title}
              </h3>

              <p className="mt-3 max-w-md leading-relaxed text-fg-muted">
                {service.body}
              </p>

              <Link
                href={service.href}
                className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-accent-mint transition-colors duration-200 ease-expo hover:text-white"
              >
                <span className="relative">
                  {service.cta}
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-accent-mint transition-all duration-300 ease-expo group-hover:w-full" />
                </span>
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-1" />
              </Link>
            </SpotlightCard>
          </Reveal>
        ))}
      </div>
    </Section>
  );
}
