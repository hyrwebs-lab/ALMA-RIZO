"use client";

import Link from "next/link";
import Image from "next/image";
import { nav, site } from "@/lib/site";
import { telUrl } from "@/lib/utils";
import { useT } from "@/lib/i18n";
import {
  InstagramIcon,
  MapPinIcon,
  PhoneIcon,
  ClockIcon,
} from "@/components/ui/Icons";

export default function Footer() {
  const t = useT();
  const label = (href: string): string =>
    ({
      "/": t.nav.inicio,
      "/servicios": t.nav.servicios,
      "/galeria": t.nav.transformaciones,
      "/productos": t.nav.productos,
      "/sobre-mi": t.nav.sobremi,
      "/contacto": t.nav.contacto,
    })[href] ?? "";
  return (
    <footer className="bg-brand text-cream">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 sm:px-8 md:grid-cols-[1.3fr_1fr_1fr] md:py-20">
        {/* Brand */}
        <div>
          <Image
            src="/logos/logo-cream.png"
            alt="Alma Rizo · Curly Studio by MariCruz"
            width={240}
            height={120}
            className="h-16 w-auto"
          />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-cream/70">
            {t.footer.tagline}
          </p>
          <p className="mt-5 font-display text-xl text-gold-soft">
            “{site.claim}”
          </p>
        </div>

        {/* Contact */}
        <div>
          <h3 className="eyebrow mb-5 text-gold">{t.footer.contacto}</h3>
          <ul className="space-y-4 text-sm text-cream/80">
            <li className="flex gap-3">
              <MapPinIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span>
                {site.contact.address}
                <br />
                {site.contact.postalCode} {site.contact.cityRegion}
              </span>
            </li>
            <li>
              <a href={telUrl()} className="flex gap-3 transition-colors hover:text-gold">
                <PhoneIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {site.contact.phone}
              </a>
            </li>
            <li className="flex gap-3">
              <ClockIcon className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
              <span className="space-y-0.5">
                <span className="block">Lun–Mié · 9:30–18:30</span>
                <span className="block">Jue–Vie · 9:30–19:30</span>
                <span className="block">Sáb · 9:30–13:30</span>
              </span>
            </li>
          </ul>
          <div className="mt-6 flex items-center gap-4">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="transition-colors hover:text-gold">
              <InstagramIcon className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Nav */}
        <div>
          <h3 className="eyebrow mb-5 text-gold">{t.footer.explora}</h3>
          <ul className="space-y-3 text-sm text-cream/80">
            {nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="transition-colors hover:text-gold">
                  {label(item.href)}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/metodo" className="transition-colors hover:text-gold">
                {t.footer.metodo}
              </Link>
            </li>
            <li>
              <Link href="/consejos" className="transition-colors hover:text-gold">
                {t.footer.consejos}
              </Link>
            </li>
            <li>
              <Link href="/faq" className="transition-colors hover:text-gold">
                {t.footer.faq}
              </Link>
            </li>
            <li>
              <Link href="/reservar" className="transition-colors hover:text-gold">
                {t.footer.reservar}
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-cream/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-cream/50 sm:flex-row sm:px-8">
          <p>
            © {new Date().getFullYear()} {site.fullName} {site.byline}. {t.footer.rights}
          </p>
          <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1">
            <Link href="/aviso-legal" className="transition-colors hover:text-gold">{t.footer.avisoLegal}</Link>
            <Link href="/privacidad" className="transition-colors hover:text-gold">{t.footer.privacidad}</Link>
            <Link href="/cookies" className="transition-colors hover:text-gold">{t.footer.cookies}</Link>
            <Link href="/admin" className="text-cream/40 transition-colors hover:text-gold">{t.footer.acceso}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
