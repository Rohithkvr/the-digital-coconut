import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";

/**
 * Label, heading, lede — the opening of every section.
 *
 * The heading is plain solid type that arrives with the block. It used to
 * reveal word by word, each word gradient-clipped: a dozen extra animated
 * nodes per heading, and every section opening with the same flourish.
 */
export function SectionHeading({
  eyebrow,
  title,
  lede,
  className,
  align = "left",
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  className?: string;
  align?: "left" | "center";
}) {
  return (
    <Reveal className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <Eyebrow className="mb-4">{eyebrow}</Eyebrow>}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-balance text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {title}
      </h2>
      {lede && <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">{lede}</p>}
    </Reveal>
  );
}
