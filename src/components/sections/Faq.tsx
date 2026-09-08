import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { faqs } from "@/content/home";

/**
 * Native <details> so every answer is in the page source and readable
 * without JavaScript — a hard requirement from the build notes, and what
 * makes the content extractable by AI answer engines.
 */
export function Faq() {
  return (
    <Section id="faq">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <SectionHeading
          eyebrow="FAQ"
          title="Questions worth asking any agency"
          className="lg:sticky lg:top-28 lg:self-start"
        />

        <div className="divide-y divide-[color:var(--border)] border-y border-line">
          {faqs.map((faq, i) => (
            <Reveal key={faq.q} delay={i * 0.05} y={16}>
              <details className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 rounded-lg text-left font-display text-base font-semibold tracking-tight text-fg transition-colors duration-200 ease-expo hover:text-accent-mint sm:text-lg [&::-webkit-details-marker]:hidden">
                  {faq.q}
                  <span
                    aria-hidden="true"
                    className="relative mt-2 h-3 w-3 shrink-0 text-accent-mint"
                  >
                    <span className="absolute top-1/2 left-0 h-px w-3 -translate-y-1/2 bg-current" />
                    <span className="absolute top-0 left-1/2 h-3 w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-expo group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>
                <p className="mt-3 max-w-2xl pr-10 leading-relaxed text-fg-muted">
                  {faq.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
