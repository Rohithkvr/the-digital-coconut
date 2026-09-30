import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

/**
 * Drop-in replacement for framer-motion's `useReducedMotion`, safe to use
 * for anything that changes the rendered markup.
 *
 * Framer's hook reads the browser setting on the very first client render,
 * while the server has no setting to read and renders "motion allowed". For
 * a visitor with reduced motion switched on, the two disagree, so any
 * markup gated on the hook (a class, an inline style, one element type
 * versus another) fails hydration: React logs an error and throws away the
 * server HTML for the whole tree.
 *
 * Here the server snapshot is a definite `false`, so hydration always
 * agrees with the server; React then re-renders with the real value. The
 * end state is the same, and it also follows the setting live if the
 * visitor changes it while the page is open.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
