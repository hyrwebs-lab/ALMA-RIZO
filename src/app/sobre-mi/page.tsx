import type { Metadata } from "next";
import Image from "next/image";
import PageHero from "@/components/site/PageHero";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre mí · Maricruz, especialista en cabello rizado",
  description:
    "Conoce a Maricruz y la filosofía de Alma Rizo: entender el rizo para transformarlo y enseñarte a cuidarlo en casa.",
};

const values = [
  {
    title: "Diagnóstico primero",
    text: "Antes de cortar, entendemos tu rizo: su patrón, su estado y tu rutina.",
  },
  {
    title: "Resultados naturales",
    text: "Buscamos que tu rizo se vea como tú, pero en su mejor versión.",
  },
  {
    title: "Educación",
    text: "Te enseñamos a mantener el resultado en casa, paso a paso.",
  },
];

export default function SobreMiPage() {
  return (
    <>
      <PageHero eyebrow="Sobre mí" title="Hola, soy Maricruz" />

      <section className="bg-cream-soft py-16 md:py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 md:grid-cols-2 md:gap-16">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/photos/maricruz-sobre-mi.jpg"
                alt="Maricruz trabajando el rizo en el salón Alma Rizo, Tarragona"
                fill
                sizes="(min-width:768px) 45vw, 100vw"
                className="object-cover object-center"
              />
            </div>
            <div className="absolute -left-3 -top-3 -z-0 hidden h-full w-full rounded-2xl border border-gold/50 md:block" />
            <span className="absolute bottom-4 left-4 bg-brand/85 px-3 py-1 eyebrow text-cream">
              Alma Rizo · Tarragona
            </span>
          </Reveal>

          <Reveal delay={120}>
            <h2 className="font-display text-3xl leading-tight text-brand sm:text-4xl">
              Especialista en cabello rizado
            </h2>
            <p className="mt-5 leading-relaxed text-ink-soft">
              Después de años trabajando con diferentes tipos de rizo, decidí
              especializarme para poder ofrecer resultados reales y personalizados
              a cada clienta.
            </p>
            <p className="mt-4 leading-relaxed text-ink-soft">
              En Alma Rizo no trabajamos desde lo genérico, sino desde el
              diagnóstico, la personalización y el conocimiento del cabello
              rizado. Mi objetivo no es solo que salgas bien del salón, sino que
              sepas mantener ese resultado en tu día a día.
            </p>
            <p className="mt-6 font-display text-2xl italic text-brand">
              “{site.claim}”
            </p>
            <div className="mt-8">
              <ButtonLink href="/reservar" variant="gold" size="md">
                Reserva tu cita
              </ButtonLink>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-brand py-16 text-cream md:py-20">
        <div className="mx-auto max-w-6xl px-6 sm:px-8">
          <div className="grid gap-10 sm:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 100}>
                <span className="font-display text-3xl text-gold">0{i + 1}</span>
                <h3 className="mt-3 font-display text-2xl">{v.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/70">{v.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
