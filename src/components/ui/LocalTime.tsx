"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/cn";

const formatter = new Intl.DateTimeFormat("en-IN", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

function subscribe(onChange: () => void) {
  // Minute resolution is all that's shown; a 10s poll keeps the rollover
  // within a few seconds without re-rendering every second.
  const id = window.setInterval(onChange, 10_000);
  return () => window.clearInterval(id);
}

/**
 * The studio's local time — a small signal that there are real people in a
 * real place behind the page. Read through `useSyncExternalStore` with a
 * `null` server snapshot: the server can't know the visitor's clock, so it
 * renders a placeholder, hydration agrees with it, and the live time
 * arrives on the next render instead of as a hydration error.
 */
export function LocalTime({ city, className }: { city: string; className?: string }) {
  const time = useSyncExternalStore(subscribe, () => formatter.format(Date.now()), () => null);
  const [hours, minutes] = time ? time.split(":") : ["--", "--"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase tabular-nums",
        className,
      )}
    >
      <span className="sr-only">Local time in</span>
      <span>{city}</span>
      <span aria-hidden="true" className="h-px w-5 bg-white/15" />
      <time className="text-fg-muted">
        {hours}
        <span className="animate-[caret_1.1s_steps(1)_infinite]">:</span>
        {minutes}
      </time>
      <span>IST</span>
    </span>
  );
}
