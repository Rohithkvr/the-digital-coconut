import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/layout/icons";
import { industries, industryItems } from "@/content/home";
import { cn } from "@/lib/cn";

/**
 * Stands in for a portfolio grid until real client work can be shown here —
 * proof of sector knowledge instead of screenshots, consistent with the
 * "No case studies here" section further down the page.
 *
 * Bento layout: the first sector gets a wide feature tile, the rest fill in
 * around it. At 3 columns that's a full-width row followed by three, so the
 * grid naturally reflows into fewer columns on smaller screens rather than
 * squeezing five even cards into one row.
 */
export function Industries() {
  return (
    <Section id="industries">
      <SectionHeading
        eyebrow={industries.eyebrow}
        title={industries.heading}
        lede={industries.lede}
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3">
        {industryItems.map((item, i) => {
          const featured = i === 0;
          return (
            <Reveal
              key={item.label}
              as="li"
              delay={i * 0.07}
              y={16}
              className={cn("h-full", featured && "sm:col-span-2")}
            >
              <SpotlightCard
                className={cn("h-full p-6 sm:p-7", featured && "lg:p-10")}
                decoration={
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-3 right-4 font-display text-[5.5rem] leading-none font-bold text-white/5 select-none sm:text-[6.5rem]"
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                }
              >
                <h3
                  className={cn(
                    "relative font-display font-semibold tracking-tight",
                    featured
                      ? "text-gradient-accent text-2xl sm:text-3xl"
                      : "text-fg text-lg",
                  )}
                >
                  {item.label}
                </h3>
                <p
                  className={cn(
                    "relative mt-3 leading-relaxed text-fg-muted",
                    featured ? "max-w-md text-base sm:text-lg" : "text-sm",
                  )}
                >
                  {item.hook}
                </p>
              </SpotlightCard>
            </Reveal>
          );
        })}
      </ul>

      <Reveal delay={0.1} className="mt-10 flex justify-center">
        <ButtonLink href={industries.cta.href} variant="secondary" size="lg">
          {industries.cta.label}
          <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
        </ButtonLink>
      </Reveal>
    </Section>
  );
}
