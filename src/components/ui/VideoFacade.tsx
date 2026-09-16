"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayIcon } from "@/components/layout/icons";
import { cn } from "@/lib/cn";

/**
 * Click-to-load YouTube embed. Renders only a thumbnail and a play button
 * until activated — a live iframe on page load costs several hundred KB and
 * a pile of third-party requests, so nothing YouTube-owned loads until the
 * visitor actually asks for it.
 *
 * The facade is a real <button>, so Enter/Space activation and focus
 * styling come for free rather than needing custom key handling.
 *
 * Thumbnails ask for `maxresdefault` first and fall back to `hqdefault` on
 * error: maxres is never generated for some older or non-widescreen
 * uploads, while hqdefault is guaranteed to exist for every video.
 */
export function VideoFacade({
  youtubeId,
  title,
  className,
}: {
  youtubeId: string;
  title: string;
  className?: string;
}) {
  const [activated, setActivated] = useState(false);
  const [quality, setQuality] = useState<"maxresdefault" | "hqdefault">("maxresdefault");

  if (activated) {
    return (
      <div className={cn("relative aspect-video w-full overflow-hidden bg-canvas-deep", className)}>
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1`}
          title={title}
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActivated(true)}
      aria-label={`Play video: ${title}`}
      className={cn(
        "group/facade relative block aspect-video w-full cursor-pointer overflow-hidden bg-canvas-deep",
        className,
      )}
    >
      <Image
        src={`https://i.ytimg.com/vi/${youtubeId}/${quality}.jpg`}
        alt=""
        fill
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-cover"
        onError={() => setQuality("hqdefault")}
      />
      <span
        aria-hidden="true"
        className="absolute inset-0 bg-black/25 transition-colors duration-300 ease-expo group-hover/facade:bg-black/10"
      />
      <span
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/70 bg-black/40 text-white transition-transform duration-300 ease-expo group-hover/facade:scale-105"
      >
        <PlayIcon className="ml-1 h-6 w-6" />
      </span>
    </button>
  );
}
