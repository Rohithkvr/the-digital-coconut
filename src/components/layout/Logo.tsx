import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

/**
 * The original full-colour lockup, used as supplied.
 * Its wordmark green (#346F4A) measures 3.3:1 on the page canvas and 2.9:1
 * on the glass header — below the 4.5:1 text threshold, so the accessible
 * name comes from the alt text rather than from reading the pixels.
 */
export function Logo({
  className,
  size = "md",
}: {
  className?: string;
  size?: "md" | "lg";
}) {
  return (
    <Link
      href="/"
      aria-label={`${site.name} — home`}
      className={cn(
        "group inline-flex items-center transition-opacity duration-200 ease-expo hover:opacity-90",
        className,
      )}
    >
      <Image
        src="/brand/logo-full-colour.png"
        alt={site.name}
        width={742}
        height={380}
        priority
        className={cn(
          "w-auto transition-transform duration-300 ease-expo group-hover:scale-[1.02]",
          size === "lg" ? "h-14" : "h-12",
        )}
      />
    </Link>
  );
}
