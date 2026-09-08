/**
 * Homepage copy — verbatim from The Digital Coconut website copy document.
 * Section numbering matches the doc so edits are easy to trace back.
 */

export const hero = {
  // The lead is fixed; the last word cycles inside a framed field.
  headline: {
    lead: "We design experiences that",
    rotating: ["Connect", "Perform", "Grow"],
  },
  sub: "Everything your business needs online — the site, the ads, the search visibility, the video — from one team in Kochi.",
  primaryCta: { label: "Tell us what you need", href: "#contact" },
  secondaryCta: { label: "See how we work", href: "#how-we-work" },
} as const;

export const services = [
  {
    slug: "web-development",
    title: "Web Development",
    body: "Websites and landing pages built to convert, not just to look finished.",
    href: "/services/web-development",
    cta: "See how we build",
  },
  {
    slug: "performance-marketing",
    title: "Performance Marketing",
    body: "Meta and Google campaigns measured in customers, not impressions.",
    href: "/services/performance-marketing",
    cta: "See how we run ads",
  },
  {
    slug: "seo-ai-search",
    title: "SEO & AI Search",
    body: "Rank on Google. Get cited inside ChatGPT, Perplexity and AI Overviews.",
    href: "/services/seo-ai-search",
    cta: "See how we get cited",
  },
  {
    slug: "video-production",
    title: "Video Production",
    body: "Brand films, reels and ad creative, shot and edited by our own team.",
    href: "/services/video-production",
    cta: "See how we shoot",
  },
] as const;

export const whyOneTeam = {
  headline: "Most businesses hire four vendors and get four excuses.",
  body: "A developer, an ads freelancer, someone for social, a videographer for the launch. When results don't come, the developer blames the creative and the media buyer blames the website.",
  close: "We build all four in-house. One team to fix it. One team to answer for it.",
} as const;

export const howWeWork = [
  {
    step: "01",
    title: "Diagnose",
    body: "We find what's actually broken before spending anything. Usually it's tracking, not creative.",
  },
  {
    step: "02",
    title: "Prescribe",
    body: "A written plan with named channels, budgets and targets. No vague deliverables.",
  },
  {
    step: "03",
    title: "Build",
    body: "Executed by the people who wrote the plan.",
  },
  {
    step: "04",
    title: "Measure",
    body: "A live dashboard from week one. You see what we see, the day we see it.",
  },
] as const;

export const problems = [
  { quote: "Traffic but no enquiries.", body: "Usually friction on the page, not a traffic problem." },
  { quote: "Ad costs keep rising.", body: "Usually creative fatigue. A bigger budget won't fix it." },
  { quote: "We don't know what's working.", body: "Two platforms claiming the same customer. We rebuild tracking first." },
  { quote: "Videos get views, nothing happens.", body: "Built to be admired instead of built to move someone." },
  { quote: "Nobody finds us when they search.", body: "Including inside AI answers, where a lot of research now ends." },
] as const;

export const noCaseStudies = {
  eyebrow: "No case studies here",
  lines: [
    "Every agency shows results you have no way of checking. Screenshots crop. Numbers round up.",
    "So we publish our method instead — and on a call we'll screen-share real accounts and give you references you can phone.",
  ],
  close: "Ask us to.",
} as const;

export const builtForKerala = {
  eyebrow: "Built for Kerala",
  points: [
    "Instagram warms the lead.",
    "WhatsApp closes it.",
    "Malayalam isn't a translation layer.",
    "Onam and Vishu decide half the year.",
  ],
  close: "We build for how people here actually buy.",
} as const;

export const industries = {
  eyebrow: "Industries we know",
  heading: "Different business. Same discipline underneath.",
  lede: "Five sectors we've already worked in — where we know what a lead is actually worth before the campaign starts.",
  cta: { label: "Don't see yours? Tell us what you need.", href: "/#contact" },
} as const;

export const industryItems = [
  { label: "Education", hook: "Admissions filled before the deadline, not enquiries that go cold in a spreadsheet." },
  { label: "Real Estate", hook: "Site visits booked, not just leads collected." },
  { label: "Retail & eCommerce", hook: "Orders confirmed on WhatsApp, not carts abandoned on a checkout page." },
  { label: "Healthcare", hook: "Appointments your front desk can handle, not a spike it can't absorb." },
  { label: "Hospitality", hook: "Direct bookings, not commission handed to an OTA." },
] as const;

export const pricing = {
  eyebrow: "Pricing",
  heading: "What this actually costs.",
  lede: "Two ways to work with us. A monthly retainer per service, or a one-off sprint scoped to a single goal.",
  note: "Website development starts at ₹6,000 — priced per project, scoped on a call.",
} as const;

export const pricingPlans = [
  {
    slug: "retainer",
    name: "Service Retainer",
    tagline: "A 2-person team for less than one in-house hire.",
    price: "₹20k",
    priceSuffix: "/month",
    priceDetail: "Per service · less than one marketer's salary",
    bullets: [
      "Both the brain (strategy) and the hands (execution) under one invoice",
      "Pick from Paid Ads, SEO, Social Media, Consultation — start with one, stack as you scale",
      "Weekly working sessions with your team",
    ],
    cta: "Start with one service",
    featured: true,
  },
  {
    slug: "sprint",
    name: "Custom Sprint",
    tagline: "Focused sprints scoped to your goal.",
    price: "Custom",
    priceDetail: "Scoped per engagement · timeline flexes to fit",
    bullets: [
      "Discovery call to scope the goal",
      "Senior-led sprint team assembled to fit the brief",
      "Timeline built to your deadline, not a fixed template",
      "One or more shippable artefacts — campaign, LP, audit, system",
    ],
    cta: "Scope a sprint",
    featured: false,
  },
] as const;

export const contact = {
  headline: "Tell us what you need.",
  body: "Thirty minutes. We'll look at what you're running and tell you honestly what's working and what isn't. If we're not right for it, we'll say so on the call.",
  needs: [
    "A website",
    "Performance marketing",
    "SEO & AI search",
    "Video production",
    "Not sure yet",
  ],
  submit: "Send",
} as const;

export const faqs = [
  {
    q: "What does The Digital Coconut do?",
    a: "We're a full-stack agency in Kochi, Kerala. Web development, performance marketing, SEO and AI search visibility, and video production — all in-house, one team.",
  },
  {
    q: "Can we hire you for just one service?",
    a: "Yes. Most clients start with one — a website, a campaign, a film — and expand later. No bundles required.",
  },
  {
    q: "Do you work outside Kerala?",
    a: "Yes. Marketing, development and search work is remote across India. Film is Kerala-based; travel quoted separately.",
  },
  {
    q: "How long before we see results?",
    a: "Paid campaigns give useful data in four to six weeks. SEO and AI visibility take four to six months. Websites and films run to a fixed agreed timeline.",
  },
  {
    q: "How do I choose an agency in Kerala?",
    a: "Ask who does the daily work, how results are measured, whether you get live dashboard access, and what they'll tell you when performance drops. Ask for references you can call.",
  },
] as const;
