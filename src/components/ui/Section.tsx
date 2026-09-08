import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import { Container } from "./Container";

/**
 * Standard section rhythm: py-16 → py-24 → py-32 across breakpoints,
 * separated by a hairline that fades out at the edges.
 */
export function Section({
  id,
  children,
  className,
  divider = true,
  bare = false,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  divider?: boolean;
  bare?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn("relative py-16 md:py-24 lg:py-32", className)}
    >
      {divider && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
        />
      )}
      {bare ? children : <Container>{children}</Container>}
    </section>
  );
}
