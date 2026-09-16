/**
 * Urumbhu Productions — the in-house film studio.
 *
 * Everything here is pulled from the live channel (youtube.com/@Urumbhu).
 * Titles and runtimes are exact; view counts are a rounded snapshot taken
 * 2026-09-14, so they drift. Re-check them before a launch or a campaign
 * rather than letting the page quietly overstate.
 *
 * This is the one section on the homepage that isn't selling anything —
 * it exists because it is genuine, self-funded work, and it is currently
 * the only real portfolio the agency can show while client case studies
 * are still unpublishable (see the NoCaseStudies section).
 */

export const studio = {
  eyebrow: "Urumbhu Productions",
  heading: "Before the agency, there was a love for film.",
  lede: "Urumbhu Productions is our in-house studio — the reason we picked up a camera in the first place. No brief, no client, no budget. Just a story we wanted to tell.",
  channelUrl: "https://www.youtube.com/@Urumbhu",
  instagramUrl: "https://www.instagram.com/urumbhuproductions",
  cta: "Watch the full channel on YouTube",
} as const;

export const studioStory = [
  "We started shooting short films with friends, borrowed gear and far too many takes. Nobody was paying us. We did it because a scene that lands — the right cut, the right silence, the right frame — is worth chasing on its own.",
  "That studio never closed. The people who write, shoot, cut and grade these films are the same people who make your ads. It's where we learn what actually holds a viewer's attention, so that by the time it matters for your brand, we already know.",
] as const;

export const studioStats = [
  { value: "10", label: "Films & teasers released" },
  { value: "240K+", label: "Views across the channel" },
  { value: "1.79K", label: "Subscribers, zero ad spend" },
  { value: "100%", label: "Self-funded, self-shot" },
] as const;

export type Film = {
  slug: string;
  youtubeId: string;
  /** Clean display title — the YouTube title minus its credit tail. */
  title: string;
  /** Credit tail, shown small under the title. Omit when there isn't one. */
  credits?: string;
  /** Short label: "Short film", "Teaser", "Mini series"… */
  kind: string;
  /** Runtime as shown on YouTube. */
  runtime: string;
  /** Rounded view count. */
  views: string;
};

/** The one we lead with — the longest and most-watched original. */
export const featuredFilm: Film = {
  slug: "consent",
  youtubeId: "1ojDW5EVGVs",
  title: "Consent",
  credits: "Justin Jolly Venad · Vedhaa Menon · Ajinsh Vijayan · Sreejith Varma",
  kind: "Short film",
  runtime: "17:18",
  views: "70K",
};

/**
 * The scrolling cover reel, in display order. The first four are the
 * studio's own picks, so they are what a visitor sees before the band
 * starts moving; the rest follow by reach.
 */
export const films: readonly Film[] = [
  {
    slug: "lokah",
    youtubeId: "PGeiIKoGn0g",
    title: "Lokah — Our Version",
    kind: "Teaser",
    runtime: "0:45",
    views: "1K",
  },
  featuredFilm,
  {
    slug: "rooh",
    youtubeId: "cIIKzHPqqb4",
    title: "Rooh",
    credits: "Jaseem · Anagha Sreekumar · Jishin CK · Vishnu Vylissery",
    kind: "Short film",
    runtime: "4:44",
    views: "956",
  },
  {
    slug: "marco-telugu",
    youtubeId: "cNTbauktS78",
    title: "Marco — Telugu Recreation",
    credits: "Yadhu Krishna · Jivin Johnson · Abhinav Subramanyian",
    kind: "Recreation",
    runtime: "1:11",
    views: "2.6K",
  },
  {
    slug: "marco-teaser-recreation",
    youtubeId: "9Hh8eTTybA4",
    title: "Marco — Teaser Recreation",
    credits: "Yadhu Krishna · Jivin Johnson · Abhinav Subramanyian",
    kind: "Recreation",
    runtime: "1:11",
    views: "133K",
  },
  {
    slug: "njanaam-nilavu",
    youtubeId: "SC3311CKCqU",
    title: "Njanaam Nilavu",
    credits: "Jivin Johnson · Jees Paul · Aneesh Dharma",
    kind: "Short film",
    runtime: "25:26",
    views: "18K",
  },
  {
    slug: "consent-teaser",
    youtubeId: "CxKoL5kRI3U",
    title: "Consent — Official Teaser",
    credits: "Justin Jolly Venad · Vedhaa Menon · Ajinsh Vijayan",
    kind: "Teaser",
    runtime: "1:20",
    views: "8.7K",
  },
  {
    slug: "njanaam-nilavu-teaser",
    youtubeId: "HEBd8w4nmU0",
    title: "Njanaam Nilavu — Teaser",
    credits: "Jivin Johnson",
    kind: "Teaser",
    runtime: "1:17",
    views: "4.5K",
  },
  {
    slug: "digital-paulose",
    youtubeId: "Yzr3iKGi1MA",
    title: "Digital Paulose — Title Teaser",
    credits: "Aneesh Dharma · Adarsh Chandran",
    kind: "Teaser · 4K",
    runtime: "0:56",
    views: "2.8K",
  },
  {
    slug: "no-parking",
    youtubeId: "W3NwzqiLp8g",
    title: "No Parking — Part 1",
    kind: "Mini series",
    runtime: "1:57",
    views: "718",
  },
];

export const shorts = {
  eyebrow: "Shorts",
  heading: "Short, vertical, made to stop a thumb.",
  lede: "Cut for feeds rather than screens. Same crew, same camera — every one of these was shot, cut and posted by us.",
} as const;

export type Short = {
  slug: string;
  youtubeId: string;
  title: string;
  views: string;
};

/**
 * The channel's Shorts tab, most-watched first.
 *
 * The two Consent entries genuinely share a title on YouTube — they are
 * two different cuts of the same release promo, not a duplicate row.
 */
export const shortsItems: readonly Short[] = [
  { slug: "njanaam-nilavu-short", youtubeId: "EkzjFZa6CnY", title: "Njanaam Nilavu", views: "10K" },
  { slug: "consent-out-now", youtubeId: "7w_3b7Z2wXY", title: "Consent — Out Now", views: "2K" },
  { slug: "consent-out-now-2", youtubeId: "8eptjiN36fs", title: "Consent — Out Now", views: "1.4K" },
  { slug: "new-look", youtubeId: "ZrDryNTj3DY", title: "New Look, Same Passion", views: "650" },
  { slug: "njanaam-nilavu-short-2", youtubeId: "_jE_Qre-Wq0", title: "Njanaam Nilavu — Family Cut", views: "641" },
];
