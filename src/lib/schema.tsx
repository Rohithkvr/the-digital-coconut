import { faqs } from "@/content/home";
import { site } from "@/content/site";

/** JSON-LD kept in one place so every page emits consistent entity data. */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: site.name,
    url: site.url,
    email: site.email,
    telephone: site.phone,
    description:
      "Web development, performance marketing, SEO and AI search, and video production — all in-house, from one team in Kochi, Kerala.",
    areaServed: [
      { "@type": "State", name: "Kerala" },
      { "@type": "Country", name: "India" },
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      addressRegion: site.region,
      addressCountry: site.country,
      // TODO(pre-launch): streetAddress once the office address is confirmed.
      ...(site.address ? { streetAddress: site.address } : {}),
    },
    ...(site.reviewsUrl ? { sameAs: [site.reviewsUrl] } : {}),
  };
}

export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };
}

export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
