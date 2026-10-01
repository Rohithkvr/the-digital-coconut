import { cn } from "@/lib/cn";

/**
 * The page canvas: one fixed gradient, a little lighter at the top.
 *
 * This used to stack four blurred, permanently animated light pools, a
 * blended noise layer and a grid over the whole viewport. Together they
 * kept the GPU repainting full-screen blurs on every frame (worst on
 * phones) and read as a stock "dark SaaS" background. A plain gradient
 * gives the same depth for nothing.
 */
export function AmbientBackground({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_100%_55%_at_50%_0%,#0c1b14_0%,#060B08_60%,#040806_100%)]",
        className,
      )}
    />
  );
}
