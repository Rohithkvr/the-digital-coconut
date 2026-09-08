/**
 * Single source of truth for business identity.
 * Anything the copy doc flagged as "confirm before publishing" is marked TODO
 * so it is greppable before launch.
 */

export const site = {
  name: "The Digital Coconut",
  tagline: "Nothing wasted.",
  city: "Kochi",
  region: "Kerala",
  country: "IN",
  url: "https://thedigitalcoconut.com",
  phone: "+91 79070 02391",
  phoneHref: "tel:+917907002391",
  whatsappHref: "https://wa.me/917907002391",
  // TODO(pre-launch): confirm this domain is correct — flagged in the copy doc.
  email: "hello@thedigitalcoconut.com",
  emailHref: "mailto:hello@thedigitalcoconut.com",
  // TODO(pre-launch): add the office address once confirmed.
  address: "",
  // TODO(pre-launch): add the Google Reviews link once the profile is live.
  reviewsUrl: "",
} as const;

/**
 * Header navigation.
 * Only the homepage exists so far, so About and Services point at the
 * matching homepage sections rather than dead routes.
 * TODO(pages): repoint to /about and /services once those pages are built.
 */
export const nav = [
  { label: "Home", href: "/" },
  { label: "About us", href: "/#why-one-team" },
  { label: "Services", href: "/#what-we-do" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/#contact" },
] as const;

/** Service pages — used by the footer, and by the homepage service cards. */
export const serviceLinks = [
  { label: "Web Development", href: "/services/web-development" },
  { label: "Performance Marketing", href: "/services/performance-marketing" },
  { label: "SEO & AI Search", href: "/services/seo-ai-search" },
  { label: "Video Production", href: "/services/video-production" },
] as const;
