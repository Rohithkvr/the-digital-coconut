import Image from "next/image";
import { PlayIcon } from "@/components/layout/icons";
import type { Film } from "@/content/studio";
import { cn } from "@/lib/cn";

const watchHref = (youtubeId: string) => `https://www.youtube.com/watch?v=${youtubeId}`;

function Cover({ film, duplicate }: { film: Film; duplicate: boolean }) {
  return (
    <a
      href={watchHref(film.youtubeId)}
      target="_blank"
      rel="noopener noreferrer"
      // The duplicate track exists only to hide the loop seam. Keeping it out
      // of the tab order and the accessibility tree means a keyboard or
      // screen-reader user meets each film exactly once.
      tabIndex={duplicate ? -1 : undefined}
      className={cn(
        "group relative block w-[280px] shrink-0 overflow-hidden rounded-xl",
        "border border-white/[0.07] bg-canvas-elevated",
        "transition-all duration-300 ease-expo",
        "hover:border-accent-mint/40 hover:shadow-[0_0_0_1px_rgba(96,185,126,0.22),0_8px_40px_rgba(0,0,0,0.55),0_0_70px_rgba(96,185,126,0.08)]",
        "sm:w-[340px] lg:w-[400px]",
      )}
    >
      <div className="relative aspect-video w-full overflow-hidden bg-canvas-deep">
        <Image
          src={`https://i.ytimg.com/vi/${film.youtubeId}/hqdefault.jpg`}
          alt=""
          fill
          sizes="400px"
          className="object-cover transition-transform duration-500 ease-expo group-hover:scale-[1.05]"
        />

        {/* Floor gradient — the caption sits on top of it, so it has to be
            dark enough to hold small type over any poster. */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/35 to-transparent"
        />

        <span className="absolute top-2.5 right-2.5 rounded-full border border-white/10 bg-black/80 px-2 py-0.5 font-mono text-[10px] tracking-wider text-fg-muted uppercase">
          {film.runtime}
        </span>

        <span
          aria-hidden="true"
          className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white opacity-0 transition-all duration-300 ease-expo group-hover:scale-110 group-hover:border-accent-mint group-hover:text-accent-mint group-hover:opacity-100"
        >
          <PlayIcon className="h-4 w-4" />
        </span>

        <span className="absolute inset-x-0 bottom-0 block p-4">
          <span className="flex items-center gap-2">
            <span className="font-mono text-[10px] tracking-wider text-accent-mint uppercase">
              {film.kind}
            </span>
            <span aria-hidden="true" className="text-white/25">
              /
            </span>
            <span className="font-mono text-[10px] tracking-wider text-white/60 uppercase">
              {film.views} views
            </span>
          </span>
          <span className="mt-1 block font-display text-base leading-snug font-bold tracking-tight text-white transition-colors group-hover:text-accent-mint">
            {film.title}
          </span>
        </span>
      </div>
    </a>
  );
}

/**
 * The studio catalogue as one continuously scrolling band of cover art,
 * full-bleed so it runs off both edges of the viewport and reads as a reel
 * passing through the page rather than a widget sitting inside it.
 *
 * The track holds two identical copies of the list and animates exactly
 * -50%, which puts the seam exactly where the first copy ends — so the loop
 * is invisible.
 *
 * Motion pauses on hover and on keyboard focus, otherwise the covers would
 * slide out from under anyone trying to click one. Under reduced motion the
 * animation is dropped entirely and the band becomes a normal horizontal
 * scroller instead.
 */
export function FilmReel({
  films,
  durationSeconds = 72,
}: {
  films: readonly Film[];
  durationSeconds?: number;
}) {
  const track = (key: string, duplicate: boolean) => (
    <div key={key} aria-hidden={duplicate} className="flex shrink-0 items-center gap-5 pl-5">
      {films.map((film) => (
        <Cover key={film.slug} film={film} duplicate={duplicate} />
      ))}
    </div>
  );

  return (
    <div className="group/reel relative">
      {/* Edge fades, so covers dissolve into the section rather than being
          chopped off square by the viewport edge. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-canvas-base to-transparent md:w-32"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-canvas-base to-transparent md:w-32"
      />

      <div className="overflow-x-auto overflow-y-hidden [scrollbar-width:none] motion-safe:overflow-x-hidden [&::-webkit-scrollbar]:hidden">
        <div
          className="flex w-max motion-reduce:animate-none group-focus-within/reel:[animation-play-state:paused] group-hover/reel:[animation-play-state:paused]"
          style={{ animation: `reel-marquee ${durationSeconds}s linear infinite` }}
        >
          {track("original", false)}
          {track("duplicate", true)}
        </div>
      </div>
    </div>
  );
}
