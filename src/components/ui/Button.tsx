import Link from "next/link";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-lg font-medium " +
  "transition-all duration-200 ease-expo select-none " +
  "active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 " +
  "focus-visible:outline-accent-mint disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  /* Solid brand fill. White text sits at 5.0:1 against the lightest point
     of the gradient, so it clears AA at every stop. */
  primary:
    "bg-gradient-to-b from-[#2E7E50] to-[#1E5B3A] text-white " +
    "shadow-[0_0_0_1px_rgba(96,185,126,0.45),0_4px_14px_rgba(30,91,58,0.45),inset_0_1px_0_0_rgba(255,255,255,0.18)] " +
    "hover:from-[#379060] hover:to-[#226844] " +
    "hover:shadow-[0_0_0_1px_rgba(96,185,126,0.6),0_6px_22px_rgba(30,91,58,0.55),0_0_28px_rgba(96,185,126,0.25),inset_0_1px_0_0_rgba(255,255,255,0.22)]",
  secondary:
    "bg-white/[0.05] text-fg shadow-[inset_0_1px_0_0_rgba(255,255,255,0.09),0_0_0_1px_rgba(255,255,255,0.07)] " +
    "hover:bg-white/[0.08] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_0_0_1px_rgba(96,185,126,0.28),0_0_24px_rgba(96,185,126,0.08)]",
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

/** Diagonal light sweep on hover — the "expensive software" tell. */
function Shine() {
  return (
    <span
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 overflow-hidden rounded-lg"
    >
      <span className="absolute inset-y-0 -left-full w-1/2 skew-x-[-20deg] bg-gradient-to-r from-transparent via-white/18 to-transparent transition-all duration-500 ease-expo group-hover:left-[150%] motion-reduce:hidden" />
    </span>
  );
}

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
      {variant === "primary" && <Shine />}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
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
      {variant === "primary" && <Shine />}
      <span className="relative z-10 inline-flex items-center gap-2">{children}</span>
    </Link>
  );
}
