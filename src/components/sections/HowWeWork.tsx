import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { howWeWork } from "@/content/home";

export function HowWeWork() {
  return (
    <Section id="how-we-work">
      <SectionHeading
        eyebrow="How we work"
        title="Four steps, in order, every time"
        lede="The sequence matters more than the tactics. Skipping the first step is why most budgets get wasted."
      />

      <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-white/[0.04] md:grid-cols-2 lg:mt-16 lg:grid-cols-4">
        {howWeWork.map((step, i) => (
          <Reveal
            key={step.step}
            delay={i * 0.08}
            as="li"
            className="group relative flex h-full flex-col bg-canvas-base/80 p-6 transition-colors duration-300 ease-expo hover:bg-canvas-elevated/80 lg:p-7"
          >
              <div className="flex items-baseline gap-3">
                <span className="font-mono text-sm text-accent-mint tabular-nums">
                  {step.step}
                </span>
                <span
                  aria-hidden="true"
                  className="h-px flex-1 bg-gradient-to-r from-accent-mint/30 to-transparent transition-all duration-300 ease-expo group-hover:from-accent-mint/60"
                />
              </div>

              <h3 className="mt-5 font-display text-xl font-semibold tracking-tight text-fg">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-fg-muted">
                {step.body}
              </p>
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}
