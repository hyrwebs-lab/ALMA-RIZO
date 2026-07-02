import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import Accordion from "@/components/site/Accordion";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { faq } from "@/lib/site";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Preguntas frecuentes · Cabello rizado en Tarragona",
  description:
    "Resolvemos tus dudas sobre el método curly, el corte en seco, cómo venir a tu cita y cómo cuidar tu rizo en casa.",
};

export default function FaqPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        eyebrow="Preguntas frecuentes"
        title="Todo lo que quieres saber"
        subtitle="Y si te queda alguna duda, escríbenos: estaremos encantadas de ayudarte."
      />

      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal>
            <Accordion items={faq} />
          </Reveal>

          <Reveal className="mx-auto mt-12 max-w-xl text-center">
            <p className="text-ink-soft">¿No encuentras tu respuesta?</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/reservar" variant="gold" size="md">Reservar cita</ButtonLink>
              <ButtonLink href={whatsappUrl()} variant="outline" size="md" external>
                <WhatsAppIcon className="h-4 w-4" /> Preguntar por WhatsApp
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
