import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { SpotlightCard } from "@/components/ui/SpotlightCard";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { pricing, pricingPlans } from "@/content/home";
import { cn } from "@/lib/cn";

export function Pricing() {
  return (
    <Section id="pricing">
      <SectionHeading
        eyebrow={pricing.eyebrow}
        title={pricing.heading}
        lede={pricing.lede}
      />

      <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:mt-16">
        {pricingPlans.map((plan, i) => (
          <Reveal key={plan.slug} as="li" delay={i * 0.08} y={16} className="h-full">
            <SpotlightCard
              className={cn(
                "h-full p-7 sm:p-8",
                plan.featured && "border-line-accent",
              )}
              decoration={
                plan.featured ? (
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute -top-24 right-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(96,185,126,0.16)_0%,transparent_72%)] blur-2xl"
                  />
                ) : undefined
              }
            >
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
                <h3 className="font-display text-xl font-semibold tracking-tight text-fg">
                  {plan.name}
                </h3>
                {plan.featured && (
                  <span className="shrink-0 rounded-full border border-line-accent bg-[rgba(46,126,80,0.14)] px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-accent-mint uppercase">
                    Most picked
                  </span>
                )}
              </div>

              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{plan.tagline}</p>

              <div className="mt-7 flex items-baseline gap-1.5">
                <span className="font-display text-4xl font-bold tracking-tight text-fg sm:text-[2.75rem]">
                  {plan.price}
                </span>
                {"priceSuffix" in plan && (
                  <span className="text-sm text-fg-subtle">{plan.priceSuffix}</span>
                )}
              </div>
              <p className="mt-1.5 font-mono text-[11px] tracking-[0.1em] text-fg-subtle uppercase">
                {plan.priceDetail}
              </p>

              <ul className="mt-7 space-y-3">
                {plan.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2.5 text-sm leading-relaxed text-fg-muted">
                    <span
                      aria-hidden="true"
                      className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-accent-mint"
                    />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>

              <ButtonLink
                href="/#contact"
                variant={plan.featured ? "primary" : "secondary"}
                size="lg"
                className="mt-8 w-full justify-center"
              >
                {plan.cta}
              </ButtonLink>
            </SpotlightCard>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={0.16} className="mt-10 text-center">
        <p className="text-sm text-fg-subtle">{pricing.note}</p>
      </Reveal>
    </Section>
  );
}
