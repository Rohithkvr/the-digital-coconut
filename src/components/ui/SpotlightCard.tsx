import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A plain card: border, a faint fill, a border that firms up on hover.
 *
 * It used to follow the cursor with a green spotlight (a mousemove handler
 * on every card) under a gradient hairline. The name is kept so call sites
 * don't churn; it no longer needs to be a client component at all.
 */
export function SpotlightCard({
  children,
  className,
  lift = true,
  as: Tag = "div",
  decoration,
}: {
  children: ReactNode;
  className?: string;
  lift?: boolean;
  as?: "div" | "article" | "li";
  /** Artwork anchored to the card box, painted under the content. */
  decoration?: ReactNode;
}) {
  return (
    <Tag
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-line bg-white/[0.035]",
        "transition-[transform,border-color] duration-300 ease-expo hover:border-line-hover",
        lift && "hover:-translate-y-0.5 motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      {decoration}
      {/* Fills the card and inherits the column so callers' flex-1 /
          mt-auto on children actually take effect. */}
      <div className="relative z-10 flex h-full flex-col">{children}</div>
    </Tag>
  );
}
