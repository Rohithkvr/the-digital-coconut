import type { Metadata, Viewport } from "next";
import { JetBrains_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { AmbientBackground } from "@/components/ui/AmbientBackground";
import { ScrollProgress } from "@/components/ui/ScrollProgress";
import { Footer, Header } from "@/components/layout";
import { site } from "@/content/site";
import { JsonLd, organizationSchema } from "@/lib/schema";
import "./globals.css";

/*
 * Fallbacks for the brand fonts. Grift and Xenon Nue are commercial licences
 * and load from /public/fonts via styles/brand-fonts.css when present; these
 * two carry the design until then — Outfit for Grift (geometric, matches the
 * wordmark), Plus Jakarta Sans for Xenon Nue (geometric humanist, same
 * proportions and open apertures).
 */
const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-jb",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "The Digital Coconut | Web, Marketing & Video Agency Kerala",
    template: `%s | ${site.name}`,
  },
  description:
    "Websites, campaigns and films built by one team in Kerala. Everything your business needs online, under one roof.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: site.url,
    siteName: site.name,
    title: "The Digital Coconut | Web, Marketing & Video Agency Kerala",
    description:
      "Websites, campaigns and films built by one team in Kerala. Everything your business needs online, under one roof.",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Digital Coconut | Web, Marketing & Video Agency Kerala",
    description:
      "Websites, campaigns and films built by one team in Kerala. Everything your business needs online, under one roof.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#060B08",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en-IN"
      className={`${outfit.variable} ${jakarta.variable} ${mono.variable}`}
    >
      <body className="min-h-screen bg-canvas-base text-fg antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:bg-canvas-elevated focus:px-4 focus:py-2 focus:text-sm focus:text-fg focus:outline-2 focus:outline-accent-mint"
        >
          Skip to content
        </a>

        <AmbientBackground />
        <ScrollProgress />
        <Header />
        <main id="main">{children}</main>
        <Footer />

        <JsonLd data={organizationSchema()} />
        <SpeedInsights />
      </body>
    </html>
  );
}
