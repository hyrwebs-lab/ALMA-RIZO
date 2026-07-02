import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/site/ContactForm";
import { site } from "@/lib/site";
import { telUrl, whatsappUrl } from "@/lib/utils";
import {
  MapPinIcon,
  ClockIcon,
  PhoneIcon,
  WhatsAppIcon,
  InstagramIcon,
  TikTokIcon,
} from "@/components/ui/Icons";

export const metadata: Metadata = {
  title: "Contacto · Peluquería curly en Tarragona",
  description:
    "Encuéntranos en Tarragona. Dirección, horarios, teléfono y WhatsApp de Alma Rizo, especialistas en cabello rizado.",
};

export default function ContactoPage() {
  return (
    <>
      <PageHero
        eyebrow="Contacto"
        title="Hablemos de tu rizo"
        subtitle="Estamos en el centro de Tarragona. Escríbenos, llámanos o pásate a vernos."
      />

      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-16">
          {/* Info + map */}
          <Reveal>
            <ul className="space-y-5 text-ink-soft">
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

            <div className="mt-6 flex flex-wrap gap-3">
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#25D366] px-4 py-2.5 text-xs font-medium uppercase tracking-widest text-white transition-opacity hover:opacity-90">
                <WhatsAppIcon className="h-4 w-4" /> WhatsApp
              </a>
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="flex h-10 w-10 items-center justify-center border border-brand/20 text-brand transition-colors hover:border-gold hover:text-gold">
                <InstagramIcon className="h-5 w-5" />
              </a>
              <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="flex h-10 w-10 items-center justify-center border border-brand/20 text-brand transition-colors hover:border-gold hover:text-gold">
                <TikTokIcon className="h-5 w-5" />
              </a>
            </div>

            <div className="mt-8 overflow-hidden border border-brand/10">
              <iframe
                src={site.mapsEmbed}
                title="Mapa de Alma Rizo en Tarragona"
                className="h-[320px] w-full"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </Reveal>

          {/* Form */}
          <Reveal delay={120}>
            <div className="border border-brand/10 bg-cream p-7 md:p-9">
              <h2 className="font-display text-3xl text-brand">Envíanos un mensaje</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Te responderemos lo antes posible.
              </p>
              <div className="mt-6">
                <ContactForm />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
