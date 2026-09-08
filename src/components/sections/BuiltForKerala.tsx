import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { builtForKerala } from "@/content/home";

export function BuiltForKerala() {
  return (
    <Section id="built-for-kerala">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <Reveal>
          <Eyebrow className="mb-5">{builtForKerala.eyebrow}</Eyebrow>
          <h2 className="text-gradient font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {builtForKerala.close}
          </h2>
        </Reveal>

        <ul className="grid gap-px overflow-hidden rounded-2xl border border-line bg-white/[0.04] sm:grid-cols-2">
          {builtForKerala.points.map((point, i) => (
            <Reveal
              key={point}
              as="li"
              delay={i * 0.07}
              y={16}
              className="group bg-canvas-base/80 p-6 transition-colors duration-300 ease-expo hover:bg-canvas-elevated/80 sm:p-7"
            >
              <span className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
              <p className="mt-4 text-lg leading-snug font-medium text-balance text-fg">
                {point}
              </p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
