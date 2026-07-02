import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/site/ProductCard";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { getProducts } from "@/lib/content";
import { whatsappUrl } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Productos · Cuidado del cabello rizado",
  description:
    "Productos recomendados por Alma Rizo para cuidar y definir tu rizo en casa: champús sin sulfatos, acondicionadores, cremas de definición y mascarillas.",
};

export const dynamic = "force-dynamic";

export default async function ProductosPage() {
  const active = (await getProducts()).filter((p) => p.active);
  return (
    <>
      <PageHero
        eyebrow="Productos"
        title="Cuida tu rizo también en casa"
        subtitle="Seleccionamos los productos que de verdad funcionan para tu tipo de rizo. Consúltanos y te asesoramos."
      />

      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {active.map((p, idx) => (
              <Reveal key={p.slug} delay={(idx % 4) * 80}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-14 max-w-xl rounded-lg border border-gold/30 bg-cream p-8 text-center">
            <h2 className="font-display text-2xl text-brand">¿No sabes cuál es el tuyo?</h2>
            <p className="mt-2 text-sm text-ink-soft">
              En tu cita te recomendamos exactamente lo que necesita tu rizo. También puedes preguntarnos por WhatsApp.
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <ButtonLink href="/reservar" variant="gold" size="md">Reservar cita</ButtonLink>
              <ButtonLink href={whatsappUrl()} variant="outline" size="md" external>
                <WhatsAppIcon className="h-4 w-4" /> Preguntar
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
