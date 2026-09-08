import { cn } from "@/lib/cn";

/**
 * The dissolving-pixel motif from the logo mark, redrawn as inline SVG so it
 * can be tinted and scaled. Used as quiet decoration inside large surfaces —
 * it is the one place the brand's graphic pattern appears on the page.
 */
const pixels = [
  { x: 0, y: 24, s: 16, o: 0.10 },
  { x: 24, y: 0, s: 16, o: 0.16 },
  { x: 48, y: 16, s: 24, o: 0.22 },
  { x: 24, y: 40, s: 24, o: 0.30 },
  { x: 56, y: 56, s: 16, o: 0.14 },
  { x: 0, y: 64, s: 24, o: 0.20 },
  { x: 32, y: 80, s: 32, o: 0.26 },
  { x: 72, y: 40, s: 16, o: 0.12 },
  { x: 8, y: 104, s: 16, o: 0.10 },
];

export function PixelMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 104 128"
      aria-hidden="true"
      className={cn("text-accent-mint", className)}
    >
      {pixels.map((p) => (
        <rect
          key={`${p.x}-${p.y}`}
          x={p.x}
          y={p.y}
          width={p.s}
          height={p.s}
          rx={2}
          fill="currentColor"
          opacity={p.o}
        />
      ))}
    </svg>
  );
}
