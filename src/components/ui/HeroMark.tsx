"use client";

import { motion, type Variants } from "framer-motion";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

const EASE = [0.16, 1, 0.3, 1] as const;

/*
 * Geometry is lifted verbatim from the brand mark — the same paths as
 * public/brand/mark.png, not a redraw — so every tile, gap and green is
 * the real logo. Paths keep their original `transform` attributes (the
 * source file is y-flipped), which is why each one is wrapped in its own
 * <motion.g>: a CSS transform set on the path itself would REPLACE that
 * attribute and throw the tile off the canvas.
 */
const CLIP =
  "M347.363 354.548C342.85 354.455 338.352 354.363 333.949 354.545V300.518H306.774C306.915 282.866 315.418 266.216 329.779 256.072 351.133 240.987 380.122 243.455 398.874 261.47L399.144 262.351 380.049 281.426C363.252 264.627 334.325 276.543 334.273 300.195 349.103 300.195 361.124 312.216 361.124 327.047 375.525 327.207 388.206 314.67 387.652 300.195H415.15C415.377 326.833 395.313 350.087 368.996 353.844 364.499 354.486 359.881 354.655 355.23 354.655 352.613 354.655 349.985 354.602 347.363 354.548";

const FLIP = "matrix(1,0,0,-1,0,595.276)";

/**
 * The seven tiles of the "C", in the order the stroke is drawn: from the
 * upper terminal, over the top, down the left side and out to the lower
 * terminal. `from` is the direction each tile slides in from — outward,
 * away from the mark's centre — so it starts mostly outside the clip and
 * wipes into the shape rather than fading onto it.
 */
const TILES = [
  { d: "M431.218 293.518H372.604V317.264H431.218Z", t: FLIP, fill: "#275a3a", from: [40, -5] },
  { d: "M415.152 317.264H370.953V356.55003H415.152Z", t: FLIP, fill: "#95aa7b", from: [27, -30] },
  { d: "M0 0V31.686L-59.134 29.983-29.099 0Z", t: "matrix(1,0,0,-1,392.4238,270.5216)", fill: "#7e8f6d", from: [10, -39] },
  { d: "M0 0H-28.979L-27.422 54.083 0 26.613Z", t: "matrix(1,0,0,-1,361.1241,294.8562)", fill: "#94aa7b", from: [-22, -34] },
  { d: "M365.129 276.673H306.515V300.419H365.129Z", t: FLIP, fill: "#3e7852", from: [-36, 18] },
  { d: "M349.768 243.67H306.515V276.673H349.768Z", t: FLIP, fill: "#366f4a", from: [-25, 31] },
  { d: "M403.283 243.67H349.768V282.956H403.283Z", t: FLIP, fill: "#154021", from: [16, 37] },
] as const;

/** The five pixels trailing off the mark, top to bottom. */
const PIXELS = [
  { d: "M300.209 366.517H285.44303V381.283H300.209Z", fill: "#5c8c56" },
  { d: "M325.678 353.64H309.71403V369.604H325.678Z", fill: "#5c8c56" },
  { d: "M304.885 331.74H285.901V350.724H304.885Z", fill: "#396b4c" },
  { d: "M333.949 316.815H313.44203V337.322H333.949Z", fill: "#7d9367" },
  { d: "M302.318 305.638H288.468V319.488H302.318Z", fill: "#396b4c" },
] as const;

/**
 * Loose pixels that keep breaking away from the cluster and fading out —
 * the "dissolving" the static logo only implies. Screen-space positions,
 * so no flip needed. Each drifts up and to the left, the same direction
 * the logo's own trail runs.
 */
const DRIFTERS = [
  { x: 272, y: 236, s: 7, delay: 0.0, dur: 5.5 },
  { x: 264, y: 268, s: 5, delay: 1.6, dur: 6.5 },
  { x: 278, y: 212, s: 6, delay: 3.1, dur: 6.0 },
  { x: 256, y: 250, s: 4, delay: 4.4, dur: 7.0 },
] as const;

// Seconds before the first tile moves. Kept short on purpose: the mark
// plays on `whileInView`, and IntersectionObserver only reports a frame or
// two after mount, which already adds ~0.2s against the headline's clock.
const TILE_START = 0.15;
const TILE_STEP = 0.09;  // gap between tiles
const PIXELS_AT = TILE_START + TILES.length * TILE_STEP + 0.25;

// `custom` is the tile's index, so each one knows both its direction and
// its place in the sequence.
const tile: Variants = {
  hidden: (i: number) => ({ x: TILES[i].from[0], y: TILES[i].from[1], opacity: 0 }),
  shown: (i: number) => ({
    x: 0,
    y: 0,
    opacity: 1,
    transition: { duration: 0.9, ease: EASE, delay: TILE_START + i * TILE_STEP },
  }),
};

/**
 * The brand mark, assembling itself: the tiles of the "C" wipe in along
 * the line of the stroke, then the pixel trail pops out beside it and
 * keeps quietly shedding pixels. Plays once, when the mark first scrolls
 * into view rather than on mount, so wherever a layout places it, the
 * assembly isn't over before anyone can see it.
 *
 * Under reduced motion it renders assembled and still: no slide, no
 * drifters.
 */
export function HeroMark({ className }: { className?: string }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.svg
      viewBox="250 200 190 170"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={cn("overflow-visible", className)}
      initial={reduceMotion ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, amount: 0.4 }}
    >
      <defs>
        <clipPath id="hero-mark-clip">
          <path transform={FLIP} d={CLIP} />
        </clipPath>
      </defs>

      {/* Tiles — clipped to the C, so each wipes in from its outer edge */}
      <g clipPath="url(#hero-mark-clip)">
        {TILES.map((t, i) => (
          <motion.g key={t.d} custom={i} variants={tile}>
            <path transform={t.t} d={t.d} fill={t.fill} />
          </motion.g>
        ))}
      </g>

      {/* Pixel trail — pops out once the C is whole, then idles */}
      {PIXELS.map((p, i) => (
        <motion.g
          key={p.d}
          style={{ transformBox: "fill-box", transformOrigin: "center" }}
          variants={{
            hidden: { scale: 0, opacity: 0 },
            shown: {
              scale: 1,
              opacity: 1,
              transition: { type: "spring", stiffness: 420, damping: 16, delay: PIXELS_AT + i * 0.07 },
            },
          }}
        >
          <motion.g
            animate={reduceMotion ? undefined : { y: [0, i % 2 ? 2.5 : -2.5, 0] }}
            transition={{ duration: 4 + i * 0.6, repeat: Infinity, ease: "easeInOut", delay: PIXELS_AT + 1 }}
          >
            <path transform={FLIP} d={p.d} fill={p.fill} />
          </motion.g>
        </motion.g>
      ))}

      {/* Drifters — pixels breaking off the trail and dissolving */}
      {!reduceMotion &&
        DRIFTERS.map((d) => (
          // The motion lives on a group, not the rect: on an SVG element
          // `x`/`y` are also geometry attributes, and animating the group
          // keeps the rect's position and the drift unambiguous.
          <motion.g
            key={`${d.x}-${d.y}`}
            initial={{ opacity: 0 }}
            animate={{ x: [0, -26], y: [0, -30], opacity: [0, 0.75, 0], scale: [1, 1, 0.5] }}
            transition={{
              duration: d.dur,
              delay: PIXELS_AT + 0.8 + d.delay,
              repeat: Infinity,
              repeatDelay: 1.2,
              ease: "easeOut",
            }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            <rect x={d.x} y={d.y} width={d.s} height={d.s} fill="#5c8c56" />
          </motion.g>
        ))}
    </motion.svg>
  );
}
