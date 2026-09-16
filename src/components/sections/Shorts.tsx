import Image from "next/image";
import { Section } from "@/components/ui/Section";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { YouTubeIcon } from "@/components/layout/icons";
import { shorts, shortsItems, studio } from "@/content/studio";

const shortHref = (youtubeId: string) => `https://www.youtube.com/shorts/${youtubeId}`;

/**
 * The channel's vertical Shorts, in a 9:16 grid that matches how they were
 * shot and how anyone actually watches them.
 */
export function Shorts() {
  return (
    <Section id="shorts">
      <SectionHeading eyebrow={shorts.eyebrow} title={shorts.heading} lede={shorts.lede} />

      <ul className="mt-12 grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:mt-16 lg:grid-cols-5">
        {shortsItems.map((short, i) => (
          <Reveal key={short.slug} as="li" delay={i * 0.07} y={16}>
            <a
              href={shortHref(short.youtubeId)}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-[9/16] w-full overflow-hidden rounded-2xl border border-line bg-canvas-deep shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_2px_20px_rgba(0,0,0,0.45)] transition-all duration-300 ease-expo hover:-translate-y-1.5 hover:border-accent-mint/40 hover:shadow-[0_0_0_1px_rgba(96,185,126,0.22),0_8px_40px_rgba(0,0,0,0.55)]"
            >
              {/* `oardefault` is YouTube's vertical still — the 16:9
                  `hqdefault` would letterbox inside this 9:16 frame and
                  crop the subject. */}
              <Image
                src={`https://i.ytimg.com/vi/${short.youtubeId}/oardefault.jpg`}
                alt=""
                fill
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 33vw, 50vw"
                className="object-cover transition-transform duration-500 ease-expo group-hover:scale-105"
              />

              <span
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/30"
              />

              <span
                aria-hidden="true"
                className="absolute top-1/2 left-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/55 text-white transition-all duration-300 ease-expo group-hover:scale-110 group-hover:border-accent-mint group-hover:text-accent-mint"
              >
                <YouTubeIcon className="h-5 w-5" />
              </span>

              <span className="absolute inset-x-0 bottom-0 block p-3.5">
                <span className="block font-mono text-[10px] tracking-wider text-accent-mint uppercase">
                  {short.views} views
                </span>
                <span className="mt-1 block font-display text-sm leading-snug font-bold tracking-tight text-white transition-colors group-hover:text-accent-mint">
                  {short.title}
                </span>
              </span>
            </a>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={shortsItems.length * 0.07} className="mt-10">
        <div className="flex flex-wrap items-center gap-4">
          <ButtonLink href={studio.channelUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
            All Shorts on YouTube
          </ButtonLink>
          <ButtonLink href={studio.instagramUrl} variant="secondary" target="_blank" rel="noopener noreferrer">
            Follow on Instagram
          </ButtonLink>
        </div>
      </Reveal>
    </Section>
  );
}
