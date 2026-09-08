import { cn } from "@/lib/cn";

/** Mono, uppercase, wide-tracked section tag with a small accent tick. */
export function Eyebrow({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-olive",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="h-px w-6 bg-gradient-to-r from-accent-mint/70 to-transparent"
      />
      {children}
    </span>
  );
}
