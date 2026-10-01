import { cn } from "@/lib/cn";

/**
 * The small label above a section heading, set like a running head:
 * sentence case, in the brand olive. It was a spaced-out monospace tag in
 * capitals with a glowing tick, on every section, which is the house style
 * of a thousand generated landing pages.
 */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("inline-block text-sm font-medium text-brand-olive", className)}>{children}</span>;
}
