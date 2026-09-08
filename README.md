# The Digital Coconut — Website

Next.js 16 (App Router) · React 19 · Tailwind v4 · Framer Motion · TypeScript

```bash
npm run dev      # http://localhost:3000
npm run build
npm run check    # lint + typecheck
```

## Scope

Homepage only, per the current delivery decision. The shared layout, token
system and primitives are built to carry the other pages without rework.

Header nav is Home · About us · Services · Blog · Contact. Since only the
homepage exists, **About us** and **Services** point at the matching homepage
sections (`#why-one-team`, `#what-we-do`) rather than dead routes — see the
`TODO(pages)` in `src/content/site.ts` to repoint them at `/about` and
`/services` once built. **Blog** points at `/blog` and 404s until that page
exists, as do the four service links in the footer.

## Design system

Linear/Modern depth language (near-black canvas, layered ambient light,
multi-layer shadows, expo-out micro-interactions) tinted to the TDC brand
greens rather than the reference indigo.

**Tokens live in `src/styles/tokens.css` and nowhere else.** `src/app/globals.css`
only exposes them to Tailwind via `@theme inline`, so a palette change is a
one-file edit.

### Colour, and why the brand palette was adapted

`#1E5B3A` (brand primary) sits at **2.5:1** on the near-black canvas — unusable
as text or as an accent glow. So:

| Role | Token | Value | Contrast |
|:--|:--|:--|:--|
| Text, icons, hairlines, glows | `--accent-mint` | `#60B97E` | 8.3:1 on canvas |
| Solid button fill | `--accent` → `--accent-deep` | `#2E7E50` → `#1E5B3A` | white text 5.0–8.0:1 |
| Eyebrows / metadata | `--brand-olive` | `#8CA77A` | 7.5:1 |
| Body copy | `--fg-muted` | `#8FA499` | 7.5:1 |

The brand primary is preserved where it works — as a fill behind white text.

### Typography

The brand faces are **Grift** (headlines) and **Xenon Nue** (body). Both are
commercial licences and are not in this repo.

`src/styles/brand-fonts.css` already declares `@font-face` rules pointing at
`/public/fonts/`. **Drop the licensed .woff2 files in with the names listed in
`public/fonts/README.md` and they activate — no code change.** Until then the
browser falls through to the substitutes and logs 404s for those font URLs,
which is expected.

| Role | Brand face | Substitute |
|:--|:--|:--|
| Headlines, logo wordmark | Grift | Outfit |
| Body | Xenon Nue | Plus Jakarta Sans |
| Labels, metadata | — | JetBrains Mono |

The stacks live in `globals.css` (`--font-display`, `--font-sans`) and list the
brand face first, so nothing else needs to know which one is loaded.

### Header

A floating glass island: centred, detached from the top edge, `rounded-[20px]`,
`backdrop-blur-xl`. Depth is four layers — blur, translucent fill, a 1px inner
top highlight, and an ambient drop shadow — and it darkens and tightens once
the page scrolls under it. The mobile menu is a second glass card beneath it so
the island itself stays intact.

### Logo

The original full-colour mark, locked up with the wordmark as live text in the
display font. This is the brand deck's own dark-background treatment (see the
phone mockup): colour stays in the mark where it reads, and the wordmark goes
white because the printed lockup's deep green sits at 2.5:1 on this canvas.
Live text also means the wordmark picks up Grift as soon as it is installed.

## Structure

```
src/
  app/          layout (fonts, metadata, JSON-LD), page, robots, sitemap, icons
  components/
    ui/         primitives — Button, SpotlightCard, AmbientBackground, Reveal,
                Section, SectionHeading, Container, Eyebrow, PixelMotif
    layout/     Header (+ mobile nav), Footer, Logo, icons
    sections/   one file per homepage section, presentational only
  content/      all copy — site.ts (identity, nav), home.ts (page copy)
  lib/          cn, schema (JSON-LD)
  styles/       tokens.css
```

Copy is verbatim from the website copy document. Components read from
`src/content/`, so editing wording never means touching a component.

## Accessibility

Verified in a real browser: one `<h1>`, logical heading order, every form field
labelled, every image has alt text, no horizontal overflow, and no content
hidden when `prefers-reduced-motion: reduce` is set (all ambient animation,
parallax and reveal transitions are disabled, content renders statically).
FAQ answers are in the page source via native `<details>` — not JS-injected —
per the build notes.

## Before launch

Search the codebase for `TODO(pre-launch)`:

- [ ] Confirm the email domain `thedigitalcoconut.com` is correct
- [ ] Add the office address (`site.address` — footer, contact block and
      `PostalAddress` schema all light up automatically once set)
- [ ] Add the Google Reviews link (`site.reviewsUrl` — same)
- [ ] Set the real production URL in `site.url` (currently `https://thedigitalcoconut.com`)
- [ ] Google Business Profile live
- [ ] Replace the contact form handoff (see below) if a CRM/mail service is chosen

## Motion

Three scroll effects are adapted from
[jaydickinson/free-gsap-effects](https://github.com/jaydickinson/free-gsap-effects) (MIT):

| Effect | Where | Component |
|:--|:--|:--|
| Scroll progress | Top of viewport, all pages | `ScrollProgress` |
| Image clip reveal | Work card media | `ClipReveal` |
| Scroll text highlight | "Why one team" paragraph | `ScrollHighlightText` |

They are implemented with **Framer Motion**, which is already in the bundle,
rather than by adding GSAP + ScrollTrigger. The source repo is framework-
agnostic copy-paste vanilla JS, so porting to React meant a rewrite either way,
and a second animation runtime would cost roughly 35 KB gzipped against the
build note requiring page load under 2.5s on 4G — for effects Framer Motion
already does natively. Swapping to real GSAP is a self-contained change to
these three files if that is preferred.

All three are scroll-linked rather than autoplaying. `ClipReveal` and
`ScrollHighlightText` render static, fully-visible content under
`prefers-reduced-motion`; `ScrollProgress` is exempt because it reports the
reader's own scroll position rather than animating on its own.

## Selected work

`src/content/work.ts` drives the showcase section. Append an object to
`workItems` and the grid renders it — the first entry is the featured card and
spans two columns.

- Anything written as `[[ ... ]]` is an unfilled slot. It renders muted and
  italic so it is obvious on the page rather than shipping as if it were copy.
- `image` is optional. Omit it and the card shows a labelled placeholder
  (`MediaPlaceholder`) instead of a broken image. Put files under
  `/public/images/work/`.
- `href` is optional; supplying it makes the whole card a link and adds the
  outbound arrow badge.

The section shows **artefacts, not results** — no metrics, no invented numbers.
That is what keeps it consistent with the "No case studies here" section lower
down the page.

## Contact form

No backend is wired up. The form composes the enquiry and hands it to WhatsApp —
the channel the copy says closes leads here — with an email fallback shown
beneath. To move to a server: replace `handleSubmit` in
`src/components/sections/Contact.tsx` with a POST to an API route.
