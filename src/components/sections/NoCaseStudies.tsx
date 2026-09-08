import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";
import { noCaseStudies } from "@/content/home";

export function NoCaseStudies() {
  return (
    <Section id="no-case-studies">
      <Reveal className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/[0.06] to-white/[0.01] p-8 sm:p-12 lg:p-16">
        {/* a single pool of light behind the boldest claim on the page */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(46,126,80,0.22)_0%,transparent_70%)] blur-[90px]"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
        />

        <div className="relative max-w-3xl">
          <Eyebrow className="mb-5">{noCaseStudies.eyebrow}</Eyebrow>

          <h2 className="text-gradient font-display text-2xl font-semibold tracking-tight text-balance sm:text-3xl lg:text-[2.25rem] lg:leading-[1.15]">
            {noCaseStudies.lines[0]}
          </h2>

          <ScrollHighlightText
            text={noCaseStudies.lines[1]}
            className="mt-6 leading-relaxed sm:text-lg"
          />

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="#contact" variant="secondary">
              {noCaseStudies.close}
            </ButtonLink>
            <span className="font-mono text-[11px] tracking-[0.16em] text-fg-subtle uppercase">
              Real accounts · Real references
            </span>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
