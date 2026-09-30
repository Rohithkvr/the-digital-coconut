"use client";

import Image from "next/image";
import {
  animate,
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type PanInfo,
} from "framer-motion";
import { useRef, type FocusEvent, type MouseEvent, type PointerEvent } from "react";
import { PlayIcon } from "@/components/layout/icons";
import type { Film } from "@/content/studio";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

const watchHref = (youtubeId: string) => `https://www.youtube.com/watch?v=${youtubeId}`;

/**
 * One perforation, tiled along the strip's edges. The pitch (24px) divides
 * every track width the covers produce (10 × cover + gaps = 3000 / 3600 /
 * 4200px), so the holes line up across the seam between the two copies.
 */
const SPROCKET = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='12'%3E%3Crect x='7' y='2' width='10' height='8' rx='2' fill='%23060B08' stroke='%23ffffff' stroke-opacity='.08'/%3E%3C/svg%3E")`;

/** Wrap an offset into (-50, 0]: one copy's width, as % of the doubled band. */
const wrapHalf = (v: number) => ((v % 50) - 50) % 50;

function Sprockets({ className }: { className: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-x-0 h-3 bg-repeat-x", className)}
      style={{ backgroundImage: SPROCKET, backgroundSize: "24px 12px" }}
    />
  );
}

function Cover({ film, index, duplicate }: { film: Film; index: number; duplicate: boolean }) {
  return (
    <a
      href={watchHref(film.youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      draggable={false}
      // The duplicate track exists only to hide the loop seam. Keeping it out
      // of the tab order and the accessibility tree means a keyboard or
      // screen-reader user meets each film exactly once.
      tabIndex={duplicate ? -1 : undefined}
      className="group block w-[280px] shrink-0 rounded-md select-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-mint sm:w-[340px] lg:w-[400px]"
    >
      <span
        className={cn(
          "relative block aspect-video w-full overflow-hidden rounded-md bg-canvas-deep",
          "ring-1 ring-white/[0.07] transition-[box-shadow] duration-300 ease-expo",
          "group-hover:shadow-[0_0_0_1px_rgba(96,185,126,0.5),0_0_60px_rgba(96,185,126,0.18)]",
        )}
      >
        <Image
          src={`https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`}
          alt=""
          fill
          sizes="400px"
          draggable={false}
          className="object-cover transition-transform duration-500 ease-expo group-hover:scale-[1.05]"
        />

        {/* Floor gradient — the caption sits on top of it, so it has to be
            dark enough to hold small type over any poster. */}
        <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent" />

        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 transition-all duration-300 ease-expo group-hover:scale-110 group-hover:border-accent-mint group-hover:text-accent-mint group-hover:opacity-100 group-focus-visible:opacity-100"
        >
          <PlayIcon className="h-4 w-4" />
        </span>

        <span className="absolute inset-x-0 bottom-0 block p-4">
          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-wider text-accent-mint uppercase">{film.kind}</span>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="font-mono text-[10px] tracking-wider text-white/60 uppercase">{film.views} views</span>
          </span>
          <span className="mt-1 block font-display text-base leading-snug font-bold tracking-tight text-white transition-colors group-hover:text-accent-mint">
            {film.title}
          </span>
        </span>
      </span>

      {/* Edge print, as on the rebate of real stock: frame number, runtime */}
      <span className="mt-2.5 flex items-center justify-between font-mono text-[9px] tracking-[0.22em] text-white/40 uppercase">
        <span aria-hidden="true">{String(index + 1).padStart(2, "0")}A ▸</span>
        <span>{film.runtime}</span>
      </span>
    </a>
  );
}

/**
 * The studio catalogue on a 35mm strip, full-bleed and tilted a touch so it
 * reads as film running through the page rather than a widget in it.
 *
 * The band holds two identical copies of the list and loops over exactly
 * one copy's width (50%), so the seam never shows. It runs on a frame loop
 * rather than a CSS animation so it can respond:
 * - scrolling the page pushes it faster (smoothed scroll velocity);
 * - hovering or focusing it eases it to a stop, so a cover never slides out
 *   from under a click;
 * - it can be dragged to scrub, and flung;
 * - a cover that takes keyboard focus is brought into view.
 * The loop idles while the strip is off screen. Under reduced motion it
 * doesn't move at all and becomes an ordinary horizontal scroller.
 */
export function FilmReel({
  films,
  secondsPerLoop = 72,
}: {
  films: readonly Film[];
  secondsPerLoop?: number;
}) {
  const root = useRef<HTMLDivElement>(null);
  const band = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const onScreen = useInView(root, { margin: "200px 0px" });

  const offset = useMotionValue(0);
  const x = useTransform(offset, (v) => `${v}%`);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const boost = useTransform(velocity, [-3000, 0, 3000], [6, 0, 6]);

  const hovered = useRef(false);
  const focused = useRef(false);
  const panning = useRef(false);
  const dragged = useRef(false);
  /** Cruise rate, 1 running → 0 held, eased toward its target each frame. */
  const rate = useRef(1);
  /** Leftover velocity from a fling, in % per second, decaying. */
  const fling = useRef(0);

  useAnimationFrame((_, delta) => {
    if (reduceMotion || !onScreen || offset.isAnimating()) return;
    const dt = Math.min(delta, 64) / 1000;
    const held = hovered.current || focused.current || panning.current;
    rate.current += ((held ? 0 : 1) - rate.current) * Math.min(1, dt / 0.18);

    let step = -(50 / secondsPerLoop) * dt * rate.current * (1 + boost.get());
    if (!panning.current && fling.current !== 0) {
      step += fling.current * dt;
      fling.current *= Math.exp(-dt / 0.35);
      if (Math.abs(fling.current) < 0.05) fling.current = 0;
    }
    if (step !== 0) offset.set(wrapHalf(offset.get() + step));
  });

  const toPercent = (px: number) => (band.current ? (px / band.current.offsetWidth) * 100 : 0);

  const onPointerEnter = (e: PointerEvent) => {
    if (e.pointerType === "mouse") hovered.current = true;
  };
  const onFocus = (e: FocusEvent) => {
    focused.current = true;
    // Bring the focused cover in past the left fade. Covers are measured on
    // the original track, which spans the band's first half, so the target
    // is already inside (-50, 0] and nothing wraps.
    const cover = (e.target as HTMLElement).closest("a");
    if (!cover || reduceMotion) return;
    fling.current = 0;
    const target = Math.min(0, -toPercent(cover.offsetLeft - (window.innerWidth * 0.05 + 96)));
    animate(offset, target, { duration: 0.5, ease: EASE });
  };
  const onBlur = (e: FocusEvent) => {
    if (!root.current?.contains(e.relatedTarget as Node | null)) focused.current = false;
  };

  const pan = reduceMotion
    ? {}
    : {
        onPanStart: () => {
          panning.current = true;
          dragged.current = true;
          fling.current = 0;
          rate.current = 0;
        },
        onPan: (_: unknown, info: PanInfo) => offset.set(wrapHalf(offset.get() + toPercent(info.delta.x))),
        onPanEnd: (_: unknown, info: PanInfo) => {
          panning.current = false;
          fling.current = toPercent(info.velocity.x);
        },
      };

  const track = (key: string, duplicate: boolean) => (
    <div
      key={key}
      aria-hidden={duplicate || undefined}
      className="relative flex shrink-0 items-start gap-5 border-y border-white/[0.06] bg-[#0b110d] py-7 pl-5 sm:py-8"
    >
      <Sprockets className="top-2" />
      {films.map((film, i) => (
        <Cover key={film.slug} film={film} index={i} duplicate={duplicate} />
      ))}
      <Sprockets className="bottom-2" />
    </div>
  );

  return (
    // The strip is rotated and wider than the viewport so its ends stay off
    // screen; clipping only the x axis leaves room for the tilt vertically.
    <div className="overflow-x-clip py-6 sm:py-10">
      <motion.div
        ref={root}
        {...pan}
        onPointerDown={() => {
          dragged.current = false;
        }}
        onPointerEnter={onPointerEnter}
        onPointerLeave={() => {
          hovered.current = false;
        }}
        onClickCapture={(e: MouseEvent) => {
          // A drag that ends over a cover shouldn't also open it.
          if (dragged.current) {
            e.preventDefault();
            e.stopPropagation();
            dragged.current = false;
          }
        }}
        onFocus={onFocus}
        onBlur={onBlur}
        style={reduceMotion ? undefined : { touchAction: "pan-y" }}
        className={cn("relative -mx-[5vw] w-[110vw] -rotate-2", !reduceMotion && "cursor-grab active:cursor-grabbing")}
      >
        {/* Edge fades, so the strip dissolves into the section rather than
            being chopped off square by the viewport edge. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 left-0 z-10 w-[calc(5vw+4rem)] bg-gradient-to-r from-canvas-base to-transparent md:w-[calc(5vw+8rem)]"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 z-10 w-[calc(5vw+4rem)] bg-gradient-to-l from-canvas-base to-transparent md:w-[calc(5vw+8rem)]"
        />

        <div
          // Focusing a cover makes the browser scroll this box; the offset
          // already handles that, so the native scroll is undone.
          onScroll={(e) => {
            if (!reduceMotion) e.currentTarget.scrollLeft = 0;
          }}
          className={cn(
            "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
            reduceMotion ? "overflow-x-auto px-[5vw]" : "overflow-hidden",
          )}
        >
          <motion.div ref={band} className="flex w-max" style={{ x: reduceMotion ? 0 : x }}>
            {track("original", false)}
            {!reduceMotion && track("duplicate", true)}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
