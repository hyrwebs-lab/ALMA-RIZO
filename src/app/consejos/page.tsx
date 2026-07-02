import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { consejos } from "@/lib/site";

export const metadata: Metadata = {
  title: "Consejos para cuidar tu rizo · Alma Rizo Tarragona",
  description:
    "Trucos y rutinas de nuestras especialistas para lavar, secar y definir tu cabello rizado en casa y mantener el resultado del salón.",
};

export default function ConsejosPage() {
  return (
    <>
      <PageHero
        eyebrow="Consejos"
        title="Aprende a entender tu rizo"
        subtitle="Pequeños gestos que marcan la diferencia. Nuestra filosofía no es solo transformar tu rizo, sino enseñarte a cuidarlo."
      />

      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto max-w-6xl space-y-16 px-6 sm:px-8 md:space-y-24">
          {consejos.map((c, i) => (
            <div
              key={c.slug}
              className="grid items-center gap-10 md:grid-cols-2 md:gap-16"
            >
              <Reveal className={i % 2 === 1 ? "md:order-2" : ""}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="(min-width:768px) 45vw, 100vw"
                    className="object-cover"
                  />
                </div>
              </Reveal>
              <Reveal delay={100} className={i % 2 === 1 ? "md:order-1" : ""}>
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <h2 className="mt-2 font-display text-3xl leading-tight text-brand sm:text-4xl">
                  {c.title}
                </h2>
                <ul className="mt-5 space-y-3">
                  {c.body.map((p, idx) => (
                    <li key={idx} className="flex gap-3 leading-relaxed text-ink-soft">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      {p}
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-brand py-16 text-center text-cream md:py-20">
        <Reveal className="mx-auto max-w-xl px-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            ¿Quieres una rutina hecha para tu rizo?
          </h2>
          <p className="mt-3 text-cream/75">
            En tu cita te enseñamos, paso a paso, cómo cuidarlo en casa.
          </p>
          <div className="mt-7">
            <ButtonLink href="/reservar" variant="gold" size="lg">Reserva tu cita</ButtonLink>
          </div>
        </Reveal>
      </section>
    </>
  );
}
