import { cn } from "@/lib/cn";
import { PixelMotif } from "./PixelMotif";

/**
 * Labelled stand-in for an image slot that has not been filled yet.
 * Never render a broken <img> — render this, so an empty slot reads as
 * deliberate and tells whoever is filling it what belongs there.
 *
 * Fills its slot the way next/image's `fill` does, so the parent must be
 * positioned.
 */
export function MediaPlaceholder({
  label = "Add project image",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "absolute inset-0 flex items-center justify-center overflow-hidden",
        "bg-[linear-gradient(135deg,rgba(255,255,255,0.05)_0%,rgba(255,255,255,0.01)_100%)]",
        className,
      )}
    >
      <PixelMotif className="absolute -right-4 -bottom-6 h-32 w-auto opacity-40" />
      <div className="relative flex flex-col items-center gap-2.5 px-4 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          className="h-7 w-7 text-fg-subtle"
        >
          <rect x="3" y="4" width="18" height="16" rx="2.5" />
          <circle cx="9" cy="10" r="1.4" />
          <path d="m4 18 5-5 4 4 3-3 4 4" />
        </svg>
        <span className="font-mono text-[10px] tracking-[0.16em] text-fg-subtle uppercase">
          {label}
        </span>
      </div>
    </div>
  );
}
