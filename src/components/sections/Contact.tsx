"use client";

import { useState, type FormEvent } from "react";
import { Section } from "@/components/ui/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { contact } from "@/content/home";
import { site } from "@/content/site";
import { ArrowIcon, WhatsAppIcon } from "@/components/layout/icons";

const fieldBase =
  "w-full rounded-lg border border-white/10 bg-[#0B1410] px-3.5 py-3 text-sm text-fg " +
  "placeholder:text-fg-subtle transition-[border-color,box-shadow] duration-200 ease-expo " +
  "focus:border-accent-mint focus:outline-none focus:ring-2 focus:ring-[rgba(96,185,126,0.28)]";

const labelBase = "mb-2 block text-[13px] font-medium text-fg-muted";

/**
 * No CRM or mail service is wired up yet, so the form composes the enquiry
 * and hands it to WhatsApp — the channel the copy says actually closes leads
 * here. An email fallback sits alongside for anyone who prefers it.
 * Swap `handleSubmit` for a POST to /api/contact once a backend exists.
 */
export function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const message = [
      `Name: ${data.get("name")}`,
      `WhatsApp: ${data.get("whatsapp")}`,
      `Business: ${data.get("business")}`,
      `Need: ${data.get("need")}`,
      `Note: ${data.get("note") || "—"}`,
    ].join("\n");

    window.open(
      `${site.whatsappHref}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
    setSent(true);
  };

  return (
    <Section id="contact">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        {/* Pitch */}
        <div>
          <Reveal>
            <Eyebrow className="mb-5">Tell us what you need</Eyebrow>
            <h2 className="text-gradient font-display text-3xl font-semibold tracking-tight text-balance sm:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
              {contact.headline}
            </h2>
            <p className="mt-6 max-w-lg leading-relaxed text-fg-muted sm:text-lg">
              {contact.body}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-10 space-y-5 border-t border-line pt-8">
              <div>
                <dt className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">
                  Phone / WhatsApp
                </dt>
                <dd className="mt-1.5">
                  <a
                    href={site.phoneHref}
                    className="text-fg transition-colors duration-200 ease-expo hover:text-accent-mint"
                  >
                    {site.phone}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">
                  Email
                </dt>
                <dd className="mt-1.5">
                  <a
                    href={site.emailHref}
                    className="break-all text-fg transition-colors duration-200 ease-expo hover:text-accent-mint"
                  >
                    {site.email}
                  </a>
                </dd>
              </div>
              {site.address && (
                <div>
                  <dt className="font-mono text-[11px] tracking-[0.18em] text-fg-subtle uppercase">
                    Address
                  </dt>
                  <dd className="mt-1.5 text-fg">{site.address}</dd>
                </div>
              )}
            </dl>
          </Reveal>
        </div>

        {/* Form */}
        <Reveal delay={0.08}>
          <div className="relative overflow-hidden rounded-2xl border border-line bg-gradient-to-b from-white/[0.06] to-white/[0.015] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.5)] sm:p-8">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent"
            />

            <form onSubmit={handleSubmit} className="grid gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelBase}>Name</label>
                  <input id="name" name="name" required autoComplete="name" className={fieldBase} placeholder="Your name" />
                </div>
                <div>
                  <label htmlFor="whatsapp" className={labelBase}>WhatsApp</label>
                  <input id="whatsapp" name="whatsapp" required inputMode="tel" autoComplete="tel" className={fieldBase} placeholder="+91" />
                </div>
              </div>

              <div>
                <label htmlFor="business" className={labelBase}>Business</label>
                <input id="business" name="business" required autoComplete="organization" className={fieldBase} placeholder="Business name" />
              </div>

              <div>
                <label htmlFor="need" className={labelBase}>What do you need?</label>
                <select id="need" name="need" required defaultValue="" className={fieldBase}>
                  <option value="" disabled>Choose one</option>
                  {contact.needs.map((need) => (
                    <option key={need} value={need}>{need}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="note" className={labelBase}>
                  Brief note <span className="text-fg-subtle">(optional)</span>
                </label>
                <textarea id="note" name="note" rows={4} className={`${fieldBase} resize-y`} placeholder="What's happening right now?" />
              </div>

              <Button type="submit" size="lg" className="w-full">
                <WhatsAppIcon className="h-4 w-4" />
                {contact.submit}
                <ArrowIcon className="h-4 w-4 transition-transform duration-200 ease-expo group-hover:translate-x-0.5" />
              </Button>

              <p aria-live="polite" className="text-[13px] text-fg-subtle">
                {sent
                  ? "WhatsApp should have opened with your details. If it didn't, message us on " 
                  : "This opens WhatsApp with your details filled in. Prefer email? "}
                <a
                  href={sent ? site.whatsappHref : site.emailHref}
                  className="text-accent-mint underline underline-offset-4 transition-colors duration-200 ease-expo hover:text-white"
                >
                  {sent ? site.phone : site.email}
                </a>
              </p>
            </form>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
