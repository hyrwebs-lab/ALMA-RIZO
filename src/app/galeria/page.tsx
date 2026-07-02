import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import BeforeAfterPair from "@/components/site/BeforeAfterPair";
import { ButtonLink } from "@/components/ui/Button";
import { getBeforeAfter, getGallery } from "@/lib/content";

export const metadata: Metadata = {
  title: "Transformaciones · Resultados reales de cabello rizado",
  description:
    "Antes y después, cortes en seco y definición de rizos reales en Alma Rizo, peluquería curly en Tarragona.",
};

export const dynamic = "force-dynamic";

export default async function GaleriaPage() {
  const [beforeAfter, gallery] = await Promise.all([getBeforeAfter(), getGallery()]);
  return (
    <>
      <PageHero
        eyebrow="Transformaciones"
        title="Resultados reales, rizos felices"
        subtitle="Cada melena es única. Estos son algunos de los cambios que conseguimos entendiendo el rizo."
      />

      {/* Before / after */}
      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto max-w-5xl px-6 sm:px-8">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl text-brand sm:text-4xl">
              Antes y después
            </h2>
            <p className="mt-3 text-ink-soft">Transformaciones reales de nuestras clientas.</p>
          </Reveal>
          <div className="grid gap-7 sm:grid-cols-2">
            {beforeAfter.map((ba, i) => (
              <Reveal key={i} delay={i * 120}>
                <BeforeAfterPair before={ba.before} after={ba.after} label={ba.label} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery grid */}
      <section className="bg-cream-deep py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl text-brand sm:text-4xl">
              Galería
            </h2>
          </Reveal>
          <div className="columns-2 gap-4 md:columns-3 lg:columns-4 [&>*]:mb-4">
            {gallery.map((g, i) => (
              <Reveal key={g.src} delay={(i % 4) * 60} className="break-inside-avoid">
                <div className="relative overflow-hidden rounded-xl">
                  <Image
                    src={g.src}
                    alt={g.alt}
                    width={500}
                    height={650}
                    className="w-full object-cover transition-transform duration-700 hover:scale-105"
                  />
                  {g.real && (
                    <span className="absolute bottom-2 left-2 bg-brand/85 px-2.5 py-1 text-[0.6rem] uppercase tracking-widest text-cream">
                      Foto real
                    </span>
                  )}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand py-16 text-center text-cream md:py-20">
        <Reveal className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            ¿Quieres ser nuestra próxima transformación?
          </h2>
          <div className="mt-7">
            <ButtonLink href="/reservar" variant="gold" size="lg">
              Reserva tu cita
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
