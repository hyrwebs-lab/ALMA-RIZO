import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { metodoSteps, site } from "@/lib/site";

export const metadata: Metadata = {
  title: "El Método Alma Rizo · Cabello rizado en Tarragona",
  description:
    "Nuestro método para transformar tu rizo: diagnóstico, corte en seco, tratamiento, definición y educación para que sepas mantenerlo en casa.",
};

const processPhotos = [
  { src: "/photos/real-diagnostico.jpg", label: "Diagnóstico" },
  { src: "/photos/real-elasticidad.jpg", label: "Análisis del rizo" },
  { src: "/photos/real-proteina.jpg", label: "Tratamiento" },
  { src: "/photos/real-definicion.jpg", label: "Definición" },
];

export default function MetodoPage() {
  return (
    <>
      <PageHero
        eyebrow="Nuestro método"
        title="El Método Alma Rizo"
        subtitle="Un proceso completo, personalizado y educativo. No solo transformamos tu rizo: te enseñamos a entenderlo."
      />

      {/* Filosofía */}
      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 sm:px-8 md:grid-cols-2 md:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image src="/photos/real-salon.jpg" alt="El salón Alma Rizo en Tarragona" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover object-top" />
            </div>
            <div className="absolute -left-3 -top-3 -z-0 hidden h-full w-full rounded-2xl border border-gold/50 md:block" />
          </Reveal>
          <Reveal delay={100}>
            <p className="gold-rule eyebrow mb-6 text-gold">La filosofía</p>
            <h2 className="font-display text-3xl leading-tight text-brand sm:text-4xl">
              Entender tu rizo lo cambia todo
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              No trabajamos desde lo genérico. Cada melena es distinta, así que
              partimos siempre del diagnóstico y la personalización para conseguir
              resultados naturales y duraderos.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              Y sobre todo, queremos que salgas sabiendo cuidar tu rizo en casa.
              Por eso cada paso del método incluye acompañamiento y educación.
            </p>
            <p className="mt-6 font-display text-2xl italic text-brand">“{site.claim}”</p>
          </Reveal>
        </div>
      </section>

      {/* Proceso (timeline) */}
      <section className="bg-brand py-16 text-cream md:py-24">
        <div className="mx-auto max-w-3xl px-6 sm:px-8">
          <Reveal className="text-center">
            <p className="gold-rule eyebrow mb-5 justify-center text-gold">Paso a paso</p>
            <h2 className="font-display text-4xl sm:text-5xl">Cómo trabajamos tu rizo</h2>
          </Reveal>

          <div className="mt-14">
            {metodoSteps.map((step, i) => (
              <Reveal key={step.n} delay={i * 80}>
                <div className="flex gap-6">
                  {/* Number + line */}
                  <div className="flex flex-col items-center">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/50 font-display text-xl text-gold">
                      {step.n}
                    </span>
                    {i < metodoSteps.length - 1 && <span className="my-2 w-px flex-1 bg-cream/20" />}
                  </div>
                  {/* Content */}
                  <div className={i < metodoSteps.length - 1 ? "pb-10" : ""}>
                    <h3 className="font-display text-2xl">{step.title}</h3>
                    <p className="mt-2 leading-relaxed text-cream/75">{step.text}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Fotos del proceso */}
      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8">
          <Reveal className="mb-10 text-center">
            <h2 className="font-display text-3xl text-brand sm:text-4xl">El método, en el salón</h2>
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {processPhotos.map((p, i) => (
              <Reveal key={p.src} delay={i * 70} className="relative aspect-[3/4] overflow-hidden rounded-2xl">
                <Image src={p.src} alt={p.label} fill sizes="(min-width:768px) 24vw, 45vw" className="object-cover" />
                <span className="absolute bottom-3 left-3 rounded-full bg-brand/85 px-3 py-1 text-[0.62rem] uppercase tracking-widest text-cream">
                  {p.label}
                </span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-deep py-16 text-center text-cream md:py-20">
        <Reveal className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">¿Lista para empezar?</h2>
          <p className="mt-3 text-cream/75">
            Reserva el Método Alma Rizo y empieza a entender tu rizo.
          </p>
          <div className="mt-7">
            <ButtonLink href="/reservar?servicio=metodo-alma-rizo" variant="gold" size="lg">
              Reservar el Método <ArrowIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
