import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";
import { whyOneTeam } from "@/content/home";

const vendors = ["Developer", "Ads freelancer", "Social", "Videographer"];

export function WhyOneTeam() {
  return (
    <Section id="why-one-team">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="mb-5">Why one team</Eyebrow>
            <h2 className="text-gradient font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {whyOneTeam.headline}
            </h2>
          </Reveal>

          <Reveal delay={0.08}>
            <ScrollHighlightText
              text={whyOneTeam.body}
              className="mt-6 max-w-xl leading-relaxed sm:text-lg"
            />
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-6 max-w-xl text-lg leading-relaxed font-medium text-fg">
              {whyOneTeam.close}
            </p>
          </Reveal>
        </div>

        {/* Visual argument: four disconnected vendors collapsing into one team. */}
        <Reveal delay={0.12}>
          <div className="relative rounded-2xl border border-line bg-gradient-to-b from-white/[0.05] to-transparent p-6 sm:p-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent"
            />

            <p className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">
              The usual arrangement
            </p>

            <ul className="mt-5 grid grid-cols-2 gap-3">
              {vendors.map((v) => (
                <li
                  key={v}
                  className="rounded-xl border border-line bg-white/[0.02] px-4 py-3.5 text-sm text-fg-muted"
                >
                  {v}
                  <span className="mt-1.5 block font-mono text-[10px] tracking-[0.12em] text-fg-subtle uppercase">
                    Blames the others
                  </span>
                </li>
              ))}
            </ul>

            <div aria-hidden="true" className="my-6 flex items-center gap-3">
              <span className="h-px flex-1 bg-gradient-to-r from-transparent to-accent-mint/40" />
              <svg viewBox="0 0 24 24" className="h-4 w-4 text-accent-mint" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 5v14M6 13l6 6 6-6" />
              </svg>
              <span className="h-px flex-1 bg-gradient-to-l from-transparent to-accent-mint/40" />
            </div>

            <div className="rounded-xl border border-line-accent bg-gradient-to-b from-[#1E5B3A]/25 to-transparent px-5 py-5 shadow-[0_0_30px_rgba(96,185,126,0.10)]">
              <p className="font-display text-lg font-semibold text-fg">
                One team, in-house
              </p>
              <p className="mt-1.5 text-sm text-fg-muted">
                One team to fix it. One team to answer for it.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
