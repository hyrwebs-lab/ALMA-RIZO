"use client";

import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { MapPinIcon, ClockIcon, PhoneIcon, ArrowIcon } from "@/components/ui/Icons";
import { site } from "@/lib/site";
import { telUrl } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export default function Location() {
  const t = useT();
  return (
    <section id="ubicacion" className="bg-cream-soft py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 md:grid-cols-2 md:gap-16">
        <Reveal>
          <p className="gold-rule eyebrow mb-6 text-gold">{t.location.eyebrow}</p>
          <h2 className="font-display text-4xl leading-tight text-brand sm:text-5xl">
            {t.location.title}
          </h2>

          <ul className="mt-8 space-y-5 text-ink-soft">
            <li className="flex gap-4">
              <MapPinIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                {site.contact.address}
                <br />
                {site.contact.postalCode} {site.contact.cityRegion}
              </span>
            </li>
            <li className="flex gap-4">
              <ClockIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <span>
                Lun–Mié · 9:30–18:30
                <br />
                Jue–Vie · 9:30–19:30
                <br />
                Sáb · 9:30–13:30 · Dom cerrado
              </span>
            </li>
            <li className="flex gap-4">
              <PhoneIcon className="mt-1 h-5 w-5 shrink-0 text-gold" />
              <a href={telUrl()} className="transition-colors hover:text-gold">
                {site.contact.phone}
              </a>
            </li>
          </ul>

          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/reservar" variant="gold" size="md">
              {t.cta.reservarCorto}
            </ButtonLink>
            <ButtonLink href={site.mapsLink} variant="outline" size="md" external>
              {t.cta.comoLlegar} <ArrowIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>

        <Reveal delay={120} className="relative">
          <div className="overflow-hidden border border-brand/10 shadow-[0_30px_60px_-30px_rgba(24,59,50,0.4)]">
            <iframe
              src={site.mapsEmbed}
              title="Mapa de Alma Rizo en Tarragona"
              className="h-[360px] w-full md:h-[460px]"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
