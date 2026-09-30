"use client";

import { useReducedMotion } from "@/lib/use-reduced-motion";
import { useEffect, useRef, type RefObject } from "react";
import { cn } from "@/lib/cn";

/*
 * Grid pitch, in CSS px. Half of AmbientBackground's 64px grid, and snapped
 * to the same viewport origin — so every pixel lands inside one of that
 * grid's squares, with the grid line falling in the gap between tiles. The
 * cursor doesn't draw on top of the page; it lights up the grid that's
 * already there.
 */
const CELL = 32;
const GAP = 4;
/** The mark's own greens. */
const COLORS = ["#5c8c56", "#396b4c", "#7d9367", "#94aa7b", "#3e7852", "#275a3a"];
/** Hard cap on live pixels, however wild the pointer gets. */
const MAX_LIVE = 220;
/** A cell can't respawn until its last pixel has had time to read. */
const CELL_COOLDOWN = 380;

type Pixel = {
  x: number;
  y: number;
  color: string;
  born: number;
  life: number;
  /** Where it drifts while dissolving — up and to the left, like the logo. */
  dx: number;
  dy: number;
};

const easeOutBack = (t: number) => {
  const c = 1.9;
  return 1 + (c + 1) * (t - 1) ** 3 + c * (t - 1) ** 2;
};
const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

/**
 * The logo's dissolving-pixel trail, made interactive: moving a mouse across
 * `targetRef` leaves brand-green pixels that pop in and dissolve away up and
 * to the left, the same direction the trail runs in the mark. A tap on touch
 * throws a small burst instead — a drag there is a scroll, not a stroke.
 *
 * Once, shortly after load, a ghost stroke sweeps across `originRef` so the
 * interaction is visible before anyone touches anything.
 *
 * Canvas rather than Framer Motion on purpose: a stroke spawns dozens of
 * short-lived elements a second, which as React components would mean a
 * state update per pixel. Costs are kept honest:
 *  - the frame loop runs only while pixels are alive, then stops entirely;
 *  - nothing spawns while the target is off-screen;
 *  - device pixel ratio is capped at 1.5 — the tiles are axis-aligned
 *    squares, so higher density buys nothing visible;
 *  - under reduced motion no listener or loop is ever attached.
 */
export function PixelTrail({
  targetRef,
  originRef,
  introDelay = 1.7,
  className,
}: {
  /** Element whose pointer movement draws the trail. */
  targetRef: RefObject<HTMLElement | null>;
  /** Element the intro stroke sweeps across, right to left. */
  originRef?: RefObject<HTMLElement | null>;
  /** Seconds before the intro stroke. */
  introDelay?: number;
  className?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const target = targetRef.current;
    const ctx = canvas?.getContext("2d");
    if (reduceMotion || !canvas || !target || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let width = 0;
    let height = 0;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      width = r.width;
      height = r.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(canvas);

    let visible = true;
    const visibility = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    visibility.observe(target);

    const pixels: Pixel[] = [];
    const lastSpawn = new Map<string, number>();
    let frame = 0;
    let running = false;

    const draw = (now: number) => {
      ctx.clearRect(0, 0, width, height);
      for (let i = pixels.length - 1; i >= 0; i--) {
        const p = pixels[i];
        // Clamped at 0: `now` is the frame's timestamp, but a pixel spawned
        // inside an event handler is stamped with performance.now(), which
        // can land a little after it. A negative age would drive the
        // overshoot ease below zero and flash a stray square for a frame.
        const t = Math.max(0, (now - p.born) / p.life);
        if (t >= 1) {
          pixels.splice(i, 1);
          continue;
        }
        // Pop in over the first 14%, hold, then dissolve: shrink, fade and
        // drift over the last 55%.
        const pop = t < 0.14 ? easeOutBack(t / 0.14) : 1;
        const dissolve = t > 0.45 ? (t - 0.45) / 0.55 : 0;
        const size = (CELL - GAP) * pop * (1 - 0.45 * dissolve);
        const cx = p.x + CELL / 2 + p.dx * dissolve;
        const cy = p.y + CELL / 2 + p.dy * dissolve;
        ctx.globalAlpha = 0.78 * (1 - dissolve);
        ctx.fillStyle = p.color;
        ctx.fillRect(cx - size / 2, cy - size / 2, size, size);
      }
      ctx.globalAlpha = 1;

      if (pixels.length > 0) {
        frame = requestAnimationFrame(draw);
      } else {
        running = false;
        lastSpawn.clear();
      }
    };

    const wake = () => {
      if (running) return;
      running = true;
      frame = requestAnimationFrame(draw);
    };

    /** Spawn at a viewport point, snapped to the shared 32px grid. */
    const spawn = (clientX: number, clientY: number, now: number, scatter: boolean) => {
      const col = Math.floor(clientX / CELL);
      const row = Math.floor(clientY / CELL);
      const cells: Array<[number, number]> = [[col, row]];
      if (scatter) {
        // Loose neighbours, weighted up and to the left, so the trail frays
        // the way the logo's does instead of drawing a clean line.
        if (Math.random() < 0.32) cells.push([col - 1, row - (Math.random() < 0.5 ? 1 : 0)]);
        if (Math.random() < 0.14) cells.push([col - 2, row - 1]);
      }

      const rect = canvas.getBoundingClientRect();
      for (const [c, r] of cells) {
        const key = `${c}:${r}`;
        const prev = lastSpawn.get(key);
        if (prev !== undefined && now - prev < CELL_COOLDOWN) continue;
        lastSpawn.set(key, now);
        pixels.push({
          x: c * CELL - rect.left,
          y: r * CELL - rect.top,
          color: COLORS[Math.floor(Math.random() * COLORS.length)],
          born: now,
          life: 850 + Math.random() * 650,
          dx: -(3 + Math.random() * 7),
          dy: -(4 + Math.random() * 9),
        });
      }
      if (pixels.length > MAX_LIVE) pixels.splice(0, pixels.length - MAX_LIVE);
      wake();
    };

    /**
     * A stroke walks the segment between samples one cell at a time, so a
     * fast flick still leaves a continuous trail instead of dotted gaps.
     * Each stroke keeps its own last point — the intro and the real pointer
     * can overlap without joining up.
     */
    const makeStroke = () => {
      let last: { x: number; y: number } | null = null;
      return {
        to(x: number, y: number, now: number) {
          if (!last) {
            spawn(x, y, now, true);
          } else {
            const dx = x - last.x;
            const dy = y - last.y;
            const steps = Math.max(1, Math.ceil(Math.hypot(dx, dy) / (CELL * 0.75)));
            for (let s = 1; s <= steps; s++) {
              spawn(last.x + (dx * s) / steps, last.y + (dy * s) / steps, now, true);
            }
          }
          last = { x, y };
        },
        lift() {
          last = null;
        },
      };
    };

    const pointer = makeStroke();

    const onMove = (e: PointerEvent) => {
      // On touch a drag is a scroll, not a stroke — taps get a burst instead.
      if (!visible || e.pointerType === "touch") return;
      pointer.to(e.clientX, e.clientY, performance.now());
    };
    const onLeave = () => pointer.lift();
    const onDown = (e: PointerEvent) => {
      if (!visible || e.pointerType === "mouse") return;
      const now = performance.now();
      for (let k = 0; k < 8; k++) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.random() * CELL * 2;
        spawn(e.clientX + Math.cos(angle) * radius, e.clientY + Math.sin(angle) * radius, now, false);
      }
    };

    target.addEventListener("pointermove", onMove, { passive: true });
    target.addEventListener("pointerleave", onLeave);
    target.addEventListener("pointerdown", onDown, { passive: true });

    // Intro: one ghost stroke sweeping right to left across the origin —
    // the headline — so the interaction is shown before it's asked for.
    // Right to left, and drifting down, because that's the direction the
    // pixels trail off the mark in the logo.
    let introFrame = 0;
    const introTimer = window.setTimeout(() => {
      const origin = originRef?.current;
      if (!origin || !visible) return;
      const o = origin.getBoundingClientRect();
      const x0 = o.left + o.width * 0.9;
      const y0 = o.top + o.height * 0.3;
      const x1 = o.left + o.width * 0.1;
      const y1 = o.top + o.height * 0.7;
      const ghost = makeStroke();
      const start = performance.now();
      const duration = 1300;
      const step = () => {
        const now = performance.now();
        const k = Math.min(1, (now - start) / duration);
        const e = easeInOut(k);
        const wave = Math.sin(e * Math.PI * 2) * CELL * 1.4;
        ghost.to(x0 + (x1 - x0) * e, y0 + (y1 - y0) * e + wave, now);
        if (k < 1) introFrame = requestAnimationFrame(step);
      };
      introFrame = requestAnimationFrame(step);
    }, introDelay * 1000);

    return () => {
      target.removeEventListener("pointermove", onMove);
      target.removeEventListener("pointerleave", onLeave);
      target.removeEventListener("pointerdown", onDown);
      window.clearTimeout(introTimer);
      cancelAnimationFrame(introFrame);
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      visibility.disconnect();
    };
  }, [reduceMotion, targetRef, originRef, introDelay]);

  // Always rendered, even under reduced motion: returning nothing here
  // would make this markup depend on the setting. An idle, empty canvas
  // costs nothing.
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
