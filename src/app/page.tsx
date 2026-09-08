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
  WhyOneTeam,
} from "@/components/sections";
import { JsonLd, faqSchema } from "@/lib/schema";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Services />
      <Industries />
      <WhyOneTeam />
      <HowWeWork />
      <Problems />
      <NoCaseStudies />
      <BuiltForKerala />
      <Pricing />
      <Contact />
      <Faq />
      <JsonLd data={faqSchema()} />
    </>
  );
}
