import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { problems } from "@/content/home";

export function Problems() {
  return (
    <Section id="problems">
      <SectionHeading
        eyebrow="Problems we fix"
        title="If you've said one of these out loud, we've already seen it"
      />

      <ul className="mt-12 space-y-3 lg:mt-16">
        {problems.map((p, i) => (
          <Reveal key={p.quote} as="li" delay={i * 0.06} y={16}>
            <div className="group relative grid gap-2 rounded-2xl border border-line bg-gradient-to-r from-white/[0.05] to-white/[0.015] p-6 transition-[border-color,background-color,transform] duration-300 ease-expo hover:border-line-hover hover:from-white/[0.08] md:grid-cols-[1fr_1.15fr] md:items-center md:gap-8 md:p-7">
              <span
                aria-hidden="true"
                className="absolute top-6 bottom-6 left-0 w-px bg-gradient-to-b from-transparent via-accent-mint/45 to-transparent opacity-0 transition-opacity duration-300 ease-expo group-hover:opacity-100"
              />
              <p className="font-display text-lg font-semibold tracking-tight text-fg md:text-xl">
                <span className="text-accent-mint/70">“</span>
                {p.quote}
                <span className="text-accent-mint/70">”</span>
              </p>
              <p className="leading-relaxed text-fg-muted">{p.body}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
