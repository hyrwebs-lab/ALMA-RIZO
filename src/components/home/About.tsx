"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { useT } from "@/lib/i18n";

export default function About() {
  const t = useT();
  return (
    <section id="sobre-mi" className="bg-cream-soft py-20 md:py-28">
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
          <p className="gold-rule eyebrow mb-6 text-gold">{t.about.eyebrow}</p>
          <h2 className="font-display text-4xl leading-tight text-brand sm:text-5xl">
            {t.about.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {t.about.text1}
          </p>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            {t.about.text2}
          </p>
          <div className="mt-8">
            <ButtonLink href="/sobre-mi" variant="outline" size="md">
              {t.cta.conoceme} <ArrowIcon className="h-4 w-4" />
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
