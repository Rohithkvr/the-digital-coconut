import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Eyebrow } from "./Eyebrow";
import { Reveal } from "./Reveal";
import { SplitHeading } from "./SplitHeading";

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
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && <Eyebrow className="mb-5">{eyebrow}</Eyebrow>}
      {/* A plain-string title gets the word-by-word reveal; a rich
          ReactNode title renders as-is, since splitting would flatten
          whatever markup it carries.

          Note where `text-gradient` goes. On the split branch it must sit
          on each WORD, because the reveal's masks establish their own
          painting context and a clipped background set up here would never
          reach the glyphs — the heading would render invisible. */}
      <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
        {typeof title === "string" ? (
          <SplitHeading text={title} wordClassName="text-gradient" />
        ) : (
          <span className="text-gradient">{title}</span>
        )}
      </h2>
      {lede && (
        <p className="mt-5 text-base leading-relaxed text-fg-muted sm:text-lg">
          {lede}
        </p>
      )}
    </Reveal>
  );
}
