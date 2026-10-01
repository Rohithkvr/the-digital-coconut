import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-[color,background-color,border-color,transform] duration-200 ease-expo select-none " +
  "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent-mint disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /* Flat brand fill: white on #2E7E50 is 5.0:1. No gradient, glow or
     light sweep — a button should look pressable, not lit. */
  primary: "bg-accent text-white hover:bg-accent-bright",
  secondary: "border border-white/15 text-fg hover:border-white/30 hover:bg-white/[0.04]",
  ghost:
    "text-fg-muted hover:bg-white/[0.05] hover:text-fg",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3.5 text-[13px]",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-[15px]",
};

type SharedProps = {
  children: ReactNode;
  variant?: Variant;
  size?: Size;
  className?: string;
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: SharedProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </button>
  );
}

export function ButtonLink({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: SharedProps & { href: string } & Omit<ComponentPropsWithoutRef<typeof Link>, "href" | "className" | "children">) {
  return (
    <Link
      href={href}
      className={cn(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      <span className="inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
