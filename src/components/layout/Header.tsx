"use client";

import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav } from "@/content/site";
import { ButtonLink } from "@/components/ui/Button";
import { Logo } from "./Logo";
import { CloseIcon, MenuIcon } from "./icons";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Floating glass island: centred, detached from the top edge, frosted.
 * Depth comes from four stacked layers — backdrop blur, a translucent fill,
 * a 1px top inner highlight (the "lit edge" that sells glass), and an outer
 * ambient shadow. It tightens and darkens once the page scrolls under it.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  // Only exact routes can be "current"; the in-page anchors all live on "/".
  const isCurrent = (href: string) => href === pathname;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6 md:pt-5">
      {/* A floating island leaves gaps above and beside it that page content
          scrolls straight through. This fades that strip out so nothing
          appears to drift over the nav. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%+1.75rem)] bg-gradient-to-b from-canvas-base via-canvas-base/85 to-transparent"
      />

      <div
        className={cn(
          "mx-auto w-full max-w-5xl rounded-[20px] backdrop-blur-xl",
          "border border-white/10 transition-all duration-300 ease-expo",
          // inner top highlight + ambient drop, layered
          "shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_1px_2px_rgba(0,0,0,0.3),0_8px_32px_rgba(0,0,0,0.35)]",
          scrolled
            ? "bg-[rgba(11,20,16,0.72)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.14),0_1px_2px_rgba(0,0,0,0.35),0_12px_44px_rgba(0,0,0,0.5),0_0_60px_rgba(96,185,126,0.06)]"
            : "bg-white/[0.06]",
        )}
      >
        <div className="grid h-18 grid-cols-[auto_1fr_auto] items-center gap-4 px-3 sm:px-4">
          <Logo />

          {/* Centre column keeps the nav optically centred in the island
              regardless of how wide the logo or CTA get. */}
          <nav aria-label="Main" className="hidden justify-center lg:flex">
            <ul className="flex items-center gap-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isCurrent(item.href) ? "page" : undefined}
                    className={cn(
                      "rounded-full px-3.5 py-2 text-[13px] transition-colors duration-200 ease-expo hover:bg-white/[0.07] hover:text-fg",
                      isCurrent(item.href)
                        ? "bg-white/[0.07] text-fg"
                        : "text-fg-muted",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <span className="lg:hidden" />

          <div className="flex items-center justify-end gap-2">
            <div className="hidden sm:block">
              <ButtonLink href="/#contact" size="sm" className="rounded-full">
                Tell us what you need
              </ButtonLink>
            </div>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-nav"
              aria-label={open ? "Close menu" : "Open menu"}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-fg-muted transition-colors duration-200 ease-expo hover:bg-white/[0.07] hover:text-fg lg:hidden"
            >
              {open ? <CloseIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile panel — a second glass card, so the island stays intact */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="mx-auto mt-2 w-full max-w-5xl overflow-hidden rounded-[20px] border border-white/10 bg-[rgba(11,20,16,0.9)] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.12),0_12px_44px_rgba(0,0,0,0.5)] backdrop-blur-xl lg:hidden"
          >
            <nav aria-label="Mobile" className="flex flex-col p-3">
              <ul className="flex flex-col">
                {nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      aria-current={isCurrent(item.href) ? "page" : undefined}
                      className={cn(
                        "block rounded-xl px-3 py-3 text-[15px] transition-colors duration-200 ease-expo hover:bg-white/[0.07] hover:text-fg",
                        isCurrent(item.href) ? "bg-white/[0.07] text-fg" : "text-fg-muted",
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ButtonLink
                href="/#contact"
                size="lg"
                className="mt-3 w-full rounded-xl"
                onClick={() => setOpen(false)}
              >
                Tell us what you need
              </ButtonLink>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
