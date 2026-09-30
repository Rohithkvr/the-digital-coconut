"use client";

import {
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion";
import { useRef, type ReactNode } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { ScrollHighlightText } from "@/components/ui/ScrollHighlightText";
import { whyOneTeam } from "@/content/home";
import { useReducedMotion } from "@/lib/use-reduced-motion";
import { cn } from "@/lib/cn";

/*
 * The four vendors, as tiles that start scattered and lock into one block.
 *
 * Geometry is in percent of the square scene. Merged, the tiles form a
 * seamless 2x2 block at 8%-92%, each 42% square. Scattered, each is pushed
 * outward and tilted; `dx`/`dy` are that push expressed in percent of the
 * tile's OWN size (what Framer's x/y "%" means), so the scene scales freely.
 * `outer` is the tile's one corner that stays rounded once merged.
 */
type Corner = "tl" | "tr" | "bl" | "br";
const TILES: ReadonlyArray<{
  role: string;
  left: string;
  top: string;
  dx: number;
  dy: number;
  rotate: number;
  outer: Corner;
  tint: string;
  icon: ReactNode;
}> = [
  {
    role: "Developer",
    left: "8%",
    top: "8%",
    dx: -14.5,
    dy: -9.8,
    rotate: -7,
    outer: "tl",
    tint: "rgba(62,120,82,0.30)",
    icon: <path d="M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 5.5l-3 13" />,
  },
  {
    role: "Ads freelancer",
    left: "50%",
    top: "8%",
    dx: 14,
    dy: -19.3,
    rotate: 6,
    outer: "tr",
    tint: "rgba(148,170,123,0.22)",
    icon: <path d="M4 10v4h3l6 4V6L7 10H4zM16.5 9.5a3.5 3.5 0 010 5M19 7a7 7 0 010 10" />,
  },
  {
    role: "Social",
    left: "8%",
    top: "50%",
    dx: -19.3,
    dy: 14,
    rotate: 5,
    outer: "bl",
    tint: "rgba(54,111,74,0.32)",
    icon: <path d="M4 5h16v11H10l-6 4V5zM8 10h8M8 13h5" />,
  },
  {
    role: "Videographer",
    left: "50%",
    top: "50%",
    dx: 9.3,
    dy: 18.8,
    rotate: -6,
    outer: "br",
    tint: "rgba(21,64,33,0.55)",
    icon: <path d="M3 7h12v10H3zM15 11l6-3.5v9L15 13" />,
  },
];

/** Where the scattered-state blame arrows run, in scene percent. */
const BLAME = [
  { d: "M60 11 C 54 1, 46 1, 41 12", head: "M41 12 l0.6 -3.4 M41 12 l3.2 -1.4", label: "blames the website", lx: 50, ly: 3 },
  { d: "M37 46 C 44 58, 50 59, 57 62", head: "M57 62 l-3.3 -0.9 M57 62 l-1.6 -2.9", label: "blames the creative", lx: 47, ly: 58 },
];

/** "We build all four in-house." + the promise — the promise gets the accent. */
const firstStop = whyOneTeam.close.indexOf(". ");
const CLOSE_LEAD = firstStop === -1 ? whyOneTeam.close : whyOneTeam.close.slice(0, firstStop + 1);
const CLOSE_PROMISE = firstStop === -1 ? "" : whyOneTeam.close.slice(firstStop + 2);

/**
 * "Why one team", argued with the scene rather than a caption.
 *
 * The four vendors start scattered and tilted, each tagged "Blames the
 * others", with the copy's two blame lines drawn between them. As the scene
 * scrolls up to the middle of the screen they fly together, the arrows fade,
 * their inner corners square off, and they lock into one block in the
 * mark's greens — the logo's own idea, one shape built from tiles — with a
 * single outline and the badge "One team, in-house".
 *
 * Scroll-linked, not timed: it follows the reader and runs backwards on the
 * way up. No pinning, so the page doesn't stall. Under reduced motion the
 * scene is simply shown merged.
 */
export function WhyOneTeam() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sceneRef,
    // 0 as the scene's top clears the bottom of the screen, 1 once its
    // centre is just above the middle.
    offset: ["start 0.9", "center 0.45"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 26, mass: 0.4 });
  const merged = useMotionValue(1);
  const p = reduceMotion ? merged : smooth;

  const frameOpacity = useTransform(p, [0.78, 1], [0, 1]);
  const frameScale = useTransform(p, [0.78, 1], [0.97, 1]);
  const badgeOpacity = useTransform(p, [0.86, 1], [0, 1]);
  const badgeScale = useTransform(p, [0.86, 1], [0.85, 1]);
  const glowOpacity = useTransform(p, [0.7, 1], [0, 1]);
  const arrowsDraw = useTransform(p, [0.04, 0.3], [0, 1]);
  const arrowsFade = useTransform(p, [0.42, 0.62], [1, 0]);
  // Labels appear with their arrows and leave with them.
  const labelOpacity = useTransform([arrowsDraw, arrowsFade], ([d, f]: number[]) => Math.min(d * 1.6, f));

  return (
    <Section id="why-one-team">
      <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:items-center lg:gap-20">
        <div>
          <Reveal>
            <Eyebrow className="mb-5">Why one team</Eyebrow>
          </Reveal>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
            {/* Gradient on the words, not here: the reveal's masks own their
                painting context, and a clipped background on this h2 would
                never reach the glyphs. */}
            <SplitHeading text={whyOneTeam.headline} wordClassName="text-gradient" />
          </h2>

          <Reveal delay={0.08}>
            <ScrollHighlightText text={whyOneTeam.body} className="mt-6 max-w-xl leading-relaxed sm:text-lg" />
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mt-7 max-w-xl font-display text-xl leading-snug font-medium tracking-tight text-fg sm:text-2xl">
              {CLOSE_LEAD}{" "}
              {CLOSE_PROMISE && <span className="text-gradient-accent">{CLOSE_PROMISE}</span>}
            </p>
          </Reveal>
        </div>

        {/* ── The scene ──────────────────────────────────────────── */}
        <Reveal delay={0.1}>
          <div
            ref={sceneRef}
            className="relative mx-auto aspect-square w-full max-w-[520px]"
            role="img"
            aria-label="Four separate vendors blaming each other become one in-house team."
          >
            {/* Light that gathers as the team forms */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute inset-[12%] rounded-full bg-[radial-gradient(circle,rgba(96,185,126,0.22)_0%,transparent_70%)] blur-3xl"
              style={{ opacity: glowOpacity }}
            />

            {/* Blame, drawn between the scattered vendors */}
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 100 100"
              className="pointer-events-none absolute inset-0 z-10 h-full w-full overflow-visible"
              style={{ opacity: arrowsFade }}
            >
              {BLAME.map((b) => (
                <g key={b.label}>
                  <motion.path
                    d={b.d}
                    fill="none"
                    stroke="#D98C7A"
                    strokeWidth="0.45"
                    strokeDasharray="1.4 1.1"
                    strokeLinecap="round"
                    style={{ pathLength: arrowsDraw }}
                  />
                  <motion.path
                    d={b.head}
                    fill="none"
                    stroke="#D98C7A"
                    strokeWidth="0.45"
                    strokeLinecap="round"
                    style={{ opacity: arrowsDraw }}
                  />
                </g>
              ))}
            </motion.svg>
            {BLAME.map((b) => (
              <motion.span
                key={b.label}
                aria-hidden="true"
                className="pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#D98C7A]/30 bg-[#140c0a]/85 px-2 py-0.5 font-mono text-[9px] tracking-[0.12em] whitespace-nowrap text-[#E3A596] uppercase sm:text-[10px]"
                style={{ left: `${b.lx}%`, top: `${b.ly}%`, opacity: labelOpacity }}
              >
                {b.label}
              </motion.span>
            ))}

            {TILES.map((t) => (
              <VendorTile key={t.role} tile={t} p={p} />
            ))}

            {/* The one outline around the merged block */}
            <motion.div
              aria-hidden="true"
              className="pointer-events-none absolute top-[8%] left-[8%] h-[84%] w-[84%] rounded-2xl border border-accent-mint/50 shadow-[0_0_0_1px_rgba(96,185,126,0.15),0_0_60px_rgba(96,185,126,0.18)]"
              style={{ opacity: frameOpacity, scale: frameScale }}
            />

            <motion.div
              aria-hidden="true"
              className="absolute top-1/2 left-1/2 z-30 flex items-center gap-2 rounded-full border border-line-accent bg-[#0B1410]/95 px-4 py-2 shadow-[var(--shadow-card)]"
              // Centred through Framer's x/y, not translate classes: Framer
              // writes `transform` to animate the scale, which would wipe them.
              style={{ opacity: badgeOpacity, scale: badgeScale, x: "-50%", y: "-50%" }}
            >
              <span className="grid grid-cols-2 gap-[2px]">
                <span className="h-1.5 w-1.5 bg-[#3e7852]" />
                <span className="h-1.5 w-1.5 bg-[#94aa7b]" />
                <span className="h-1.5 w-1.5 bg-[#366f4a]" />
                <span className="h-1.5 w-1.5 bg-[#154021]" />
              </span>
              <span className="font-display text-sm font-semibold whitespace-nowrap text-fg sm:text-base">
                One team, in-house
              </span>
            </motion.div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}

function VendorTile({
  tile,
  p,
}: {
  tile: (typeof TILES)[number];
  p: MotionValue<number>;
}) {
  const x = useTransform(p, [0, 0.8], [`${tile.dx}%`, "0%"]);
  const y = useTransform(p, [0, 0.8], [`${tile.dy}%`, "0%"]);
  const rotate = useTransform(p, [0, 0.8], [tile.rotate, 0]);
  const scale = useTransform(p, [0, 0.8], [0.9, 1]);
  const background = useTransform(p, [0.55, 1], ["rgba(255,255,255,0.03)", tile.tint]);
  const borderColor = useTransform(p, [0.55, 1], ["rgba(255,255,255,0.09)", "rgba(96,185,126,0.22)"]);
  // Inner corners square off as the tiles meet; the outer one stays round.
  const inner = useTransform(p, [0.66, 0.95], [16, 0]);
  const blameOpacity = useTransform(p, [0.5, 0.72], [1, 0]);
  const teamOpacity = useTransform(p, [0.68, 0.9], [0, 1]);

  const radius = (corner: Corner) => (tile.outer === corner ? 16 : inner);
  // Top-row tiles hold their content high and bottom-row tiles hold it low,
  // so the seam across the middle — where the merged badge lands — stays
  // clear of every icon and word, at any size.
  const top = tile.outer === "tl" || tile.outer === "tr";

  return (
    <motion.div
      className={cn(
        "absolute flex h-[42%] w-[42%] flex-col border p-3 sm:p-4",
        !top && "justify-end",
      )}
      style={{
        left: tile.left,
        top: tile.top,
        x,
        y,
        rotate,
        scale,
        background,
        borderColor,
        borderTopLeftRadius: radius("tl"),
        borderTopRightRadius: radius("tr"),
        borderBottomLeftRadius: radius("bl"),
        borderBottomRightRadius: radius("br"),
      }}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.06] text-fg-muted sm:h-9 sm:w-9">
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.7}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          {tile.icon}
        </svg>
      </span>
      <span className="mt-3 font-display text-sm leading-tight font-semibold text-fg sm:text-base">
        {tile.role}
      </span>
      <span className="relative mt-1.5 block h-3.5 font-mono text-[8px] tracking-[0.12em] uppercase sm:text-[9px]">
        <motion.span className="absolute inset-0 whitespace-nowrap text-[#E3A596]/80" style={{ opacity: blameOpacity }}>
          Blames the others
        </motion.span>
        <motion.span className="absolute inset-0 whitespace-nowrap text-accent-mint" style={{ opacity: teamOpacity }}>
          In-house
        </motion.span>
      </span>
    </motion.div>
  );
}
