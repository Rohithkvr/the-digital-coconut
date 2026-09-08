/**
 * ─────────────────────────────────────────────────────────────
 *  Selected work
 * ─────────────────────────────────────────────────────────────
 *  Add a project by appending one object below — Work.tsx renders
 *  whatever is here with no component changes. The first entry is the
 *  featured card and spans two columns on desktop.
 *
 *  Anything written as [[ ... ]] is an unfilled slot: it renders in a
 *  muted, italic "needs filling" style so it is obvious on the page
 *  rather than shipping as if it were real copy.
 *
 *  `image` is optional. Omit it and the card shows a labelled empty
 *  state instead of a broken image. Paths are relative to /public,
 *  e.g. "/images/work/project.jpg".
 *
 *  Only put real projects here. No invented clients, no invented numbers.
 * ─────────────────────────────────────────────────────────────
 */

export type WorkItem = {
  slug: string;
  /** Which discipline it belongs to — shown as the pill on the card. */
  discipline: string;
  name: string;
  /** One line: what it is, and what we built. No results claims here. */
  description: string;
  image?: string;
  /** Optional outbound link to the live site, film or profile. */
  href?: string;
};

export const work = {
  eyebrow: "Selected work",
  heading: "Things we've actually shipped",
  lede: "Sites, campaigns and films we built. Ask on a call and we'll walk you through the accounts behind any of them.",
  cta: { label: "Talk about your project", href: "/#contact" },
} as const;

export const workItems: WorkItem[] = [
  {
    slug: "project-01",
    discipline: "Web Development",
    name: "[[ Project name ]]",
    description: "[[ One line: what kind of business, and what you built for them. ]]",
  },
  {
    slug: "project-02",
    discipline: "Performance Marketing",
    name: "[[ Project name ]]",
    description: "[[ One line: what kind of business, and what you ran for them. ]]",
  },
  {
    slug: "project-03",
    discipline: "Video Production",
    name: "[[ Project name ]]",
    description: "[[ One line: what you shot, and what it was for. ]]",
  },
  {
    slug: "project-04",
    discipline: "SEO & AI Search",
    name: "[[ Project name ]]",
    description: "[[ One line: what kind of business, and what you fixed. ]]",
  },
  {
    slug: "project-05",
    discipline: "Web Development",
    name: "[[ Project name ]]",
    description: "[[ One line: what kind of business, and what you built for them. ]]",
  },
];
