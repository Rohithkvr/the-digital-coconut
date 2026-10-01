import { Suspense, type ReactNode } from "react";
import {
  BuiltForKerala,
  Contact,
  Faq,
  Hero,
  HowWeWork,
  Industries,
  NoCaseStudies,
  Pricing,
  Problems,
  Services,
  Shorts,
  Studio,
  WhyOneTeam,
} from "@/components/sections";
import { JsonLd, faqSchema } from "@/lib/schema";

/**
 * Each section below the hero sits in its own Suspense boundary. Nothing
 * here suspends, so the server HTML is identical; what changes is
 * hydration. React hydrates each boundary as a separate unit and yields
 * the main thread between them (prioritising whichever one you interact
 * with), instead of hydrating the whole page in one long task that held
 * the first screen back on phones.
 */
function Chunk({ children }: { children: ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

export default function HomePage() {
  return (
    <>
      <Hero />
      <Chunk><Services /></Chunk>
      <Chunk><Industries /></Chunk>
      <Chunk><WhyOneTeam /></Chunk>
      <Chunk><HowWeWork /></Chunk>
      <Chunk><Problems /></Chunk>
      <Chunk><NoCaseStudies /></Chunk>
      <Chunk><Studio /></Chunk>
      <Chunk><Shorts /></Chunk>
      <Chunk><BuiltForKerala /></Chunk>
      <Chunk><Pricing /></Chunk>
      <Chunk><Contact /></Chunk>
      <Chunk><Faq /></Chunk>
      <JsonLd data={faqSchema()} />
    </>
  );
}
