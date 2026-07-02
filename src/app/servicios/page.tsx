import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { getServices } from "@/lib/content";
import { formatDuration, formatPrice } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Servicios · Peluquería curly en Tarragona",
  description:
    "Corte en seco, Método Alma Rizo, diagnóstico capilar y tratamientos de definición para cabello rizado en Tarragona. Consulta precios y reserva tu cita.",
};

export const dynamic = "force-dynamic";

export default async function ServiciosPage() {
  const services = await getServices();
  return (
    <>
      <PageHero
        eyebrow="Servicios"
        title="Cuidamos tu rizo de principio a fin"
        subtitle="Cada servicio parte del diagnóstico y se adapta a tu tipo de rizo, tu rutina y tus objetivos."
      />

      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-6 px-6 sm:px-8">
          {services.map((s, i) => (
            <Reveal key={s.slug} delay={(i % 3) * 80}>
              <article
                id={s.slug}
                className="group grid scroll-mt-28 gap-0 overflow-hidden rounded-2xl border border-brand/10 bg-cream-soft md:grid-cols-[300px_1fr]"
              >
                <div className="relative h-56 md:h-full">
                  <Image
                    src={s.image ?? "/photos/portrait-hero.jpg"}
                    alt={s.name}
                    fill
                    sizes="(min-width:768px) 300px, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col p-7 md:p-9">
                  <p className="eyebrow text-gold">{s.tagline}</p>
                  <h2 className="mt-2 font-display text-3xl text-brand">{s.name}</h2>
                  <p className="mt-3 max-w-2xl leading-relaxed text-ink-soft">
                    {s.description}
                  </p>
                  <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3">
                    <span className="text-sm text-ink-soft">
                      Duración ·{" "}
                      <span className="text-ink">{formatDuration(s.durationMin)}</span>
                    </span>
                    <span className="font-display text-2xl text-brand">
                      {formatPrice(s.price)}
                    </span>
                    <ButtonLink
                      href={`/reservar?servicio=${s.slug}`}
                      variant="gold"
                      size="sm"
                      className="md:ml-auto"
                    >
                      Reservar <ArrowIcon className="h-4 w-4" />
                    </ButtonLink>
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <p className="pt-4 text-center text-sm text-ink-soft/70">
            * Los precios y duraciones son orientativos y pueden ajustarse según el
            diagnóstico personalizado.
          </p>
        </div>
      </section>
    </>
  );
}
