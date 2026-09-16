import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Container } from "@/components/ui/Container";
import { ButtonLink } from "@/components/ui/Button";
import { VideoFacade } from "@/components/ui/VideoFacade";
import { FilmReel } from "./FilmReel";
import { featuredFilm, films, studio, studioStats, studioStory } from "@/content/studio";

/** Small mono chip used for kind / runtime / views. */
function Meta({ children, accent = false }: { children: React.ReactNode; accent?: boolean }) {
  return (
    <span
      className={
        accent
          ? // Sits on top of poster art, which can be bright — needs a solid
            // backing rather than a tint to stay readable.
            "rounded-full border border-accent-mint/50 bg-black/75 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-accent-mint uppercase"
          : "rounded-full border border-white/10 bg-black/50 px-2.5 py-0.5 font-mono text-[10px] tracking-wider text-fg-muted uppercase"
      }
    >
      {children}
    </span>
  );
}

/**
 * Urumbhu Productions — the in-house film studio.
 *
 * Deliberately the one section that isn't selling: the origin story and the
 * numbers on the left, the film we lead with on the right, then the whole
 * catalogue scrolling underneath. It also does real work for the page — it
 * is the only genuine portfolio available while client case studies stay
 * unpublishable, which is the gap NoCaseStudies explains further down.
 *
 * Only the featured film gets a VideoFacade. Everything in the reel links
 * out to YouTube instead, because ten facades would mean ten potential
 * iframes on one page — exactly the weight the facade pattern avoids.
 *
 * `bare` on the Section: the reel is full-bleed and has to escape the
 * Container, so this section manages its own.
 */
export function Studio() {
  return (
    <Section id="studio" bare>
      <Container>
        <SectionHeading eyebrow={studio.eyebrow} title={studio.heading} lede={studio.lede} />

        <div className="mt-12 grid grid-cols-1 gap-10 lg:mt-16 lg:grid-cols-12 lg:gap-14">
          {/* Left — why this exists */}
          <Reveal className="lg:col-span-5">
            <div className="flex h-full flex-col justify-center">
              <div className="space-y-5">
                {studioStory.map((paragraph, i) => (
                  <p
                    key={i}
                    className={
                      i === 0
                        ? "text-lg leading-relaxed text-fg sm:text-xl"
                        : "text-base leading-relaxed text-fg-muted"
                    }
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-white/[0.06]">
                {studioStats.map((stat) => (
                  <div key={stat.label} className="bg-canvas-base px-5 py-6">
                    <dt className="sr-only">{stat.label}</dt>
                    <dd>
                      <span className="block font-display text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
                        {stat.value}
                      </span>
                      <span className="mt-1.5 block font-mono text-[10px] leading-relaxed tracking-wider text-fg-muted uppercase">
                        {stat.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-8">
                <ButtonLink href={studio.channelUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
                  {studio.cta}
                </ButtonLink>
              </div>
            </div>
          </Reveal>

          {/* Right — the film we lead with */}
          <Reveal delay={0.08} className="lg:col-span-7">
            <figure className="group relative rounded-2xl border border-line bg-canvas-elevated p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.55)] transition-colors duration-300 ease-expo hover:border-accent-mint/40">
              <div className="relative overflow-hidden rounded-xl">
                <VideoFacade youtubeId={featuredFilm.youtubeId} title={featuredFilm.title} />
                <span className="pointer-events-none absolute top-3 left-3 z-10">
                  <Meta accent>Now showing</Meta>
                </span>
              </div>

              <figcaption className="flex flex-wrap items-end justify-between gap-4 p-5 pb-4">
                <div className="min-w-0">
                  <h3 className="font-display text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
                    {featuredFilm.title}
                  </h3>
                  {featuredFilm.credits && (
                    <p className="mt-2 text-sm leading-relaxed text-fg-muted">{featuredFilm.credits}</p>
                  )}
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-2">
                  <Meta>{featuredFilm.kind}</Meta>
                  <Meta>{featuredFilm.runtime}</Meta>
                  <Meta>{featuredFilm.views} views</Meta>
                </div>
              </figcaption>
            </figure>
          </Reveal>
        </div>

        <Reveal className="mt-16 lg:mt-20">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[11px] tracking-[0.2em] text-accent-mint uppercase">
              The reel
            </span>
            <span aria-hidden="true" className="h-px flex-1 bg-white/10" />
            <span className="font-mono text-[11px] tracking-wider text-fg-muted uppercase">
              {films.length} films
            </span>
          </div>
        </Reveal>
      </Container>

      {/* Full-bleed on purpose — outside the Container so the band runs off
          both edges of the viewport. */}
      <Reveal className="relative mt-8">
        <FilmReel films={films} />
      </Reveal>
    </Section>
  );
}
