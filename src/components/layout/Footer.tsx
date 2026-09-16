import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { serviceLinks, site } from "@/content/site";
import { Logo } from "./Logo";
import { WhatsAppIcon } from "./icons";

export function Footer() {
  return (
    <footer className="relative border-t border-line bg-canvas-deep/80">
      <Container>
        <div className="grid gap-12 py-16 md:grid-cols-[1.2fr_1fr_1fr] md:py-20">
          <div>
            <Logo size="lg" />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-fg-muted">
              Websites, campaigns and films. Built by one team in {site.city}.
            </p>
            <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.18em] text-brand-olive">
              {site.tagline}
            </p>
          </div>

          <nav aria-label="Services">
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
              Services
            </h2>
            <ul className="mt-5 space-y-1">
              {serviceLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block py-1.5 text-sm text-fg-muted transition-colors duration-200 ease-expo hover:text-accent-mint"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/blog"
                  className="inline-block py-1.5 text-sm text-fg-muted transition-colors duration-200 ease-expo hover:text-accent-mint"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-mono text-[11px] uppercase tracking-[0.18em] text-fg-subtle">
              Contact
            </h2>
            <ul className="mt-5 space-y-1 text-sm">
              <li>
                <a
                  href={site.phoneHref}
                  className="inline-block py-1.5 text-fg-muted transition-colors duration-200 ease-expo hover:text-accent-mint"
                >
                  {site.phone}
                </a>
              </li>
              <li>
                <a
                  href={site.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 py-1.5 text-fg-muted transition-colors duration-200 ease-expo hover:text-accent-mint"
                >
                  <WhatsAppIcon className="h-4 w-4" />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={site.emailHref}
                  className="inline-block break-all py-1.5 text-fg-muted transition-colors duration-200 ease-expo hover:text-accent-mint"
                >
                  {site.email}
                </a>
              </li>
              {site.address && <li className="text-fg-muted">{site.address}</li>}
              {site.reviewsUrl && (
                <li>
                  <a
                    href={site.reviewsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block py-1.5 text-fg-muted transition-colors duration-200 ease-expo hover:text-accent-mint"
                  >
                    Google Reviews
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-line py-7 text-xs text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. {site.city}, {site.region}.
          </p>
          <p className="font-mono tracking-[0.14em] uppercase">
            Web · Marketing · Search · Film
          </p>
        </div>
      </Container>
    </footer>
  );
}
