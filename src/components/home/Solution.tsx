"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { useT } from "@/lib/i18n";

export default function Solution() {
  const t = useT();
  const pillars = t.solution.pillars.map((p, i) => ({ n: `0${i + 1}`, ...p }));
  return (
    <section className="bg-brand py-20 text-cream md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <p className="gold-rule eyebrow mb-6 text-gold">{t.solution.eyebrow}</p>
            <h2 className="font-display text-4xl leading-tight sm:text-5xl">
              {t.solution.titleA}{" "}
              <span className="italic text-gold-soft">{t.solution.titleB}</span>
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-cream/80">
              {t.solution.text}
            </p>
            <div className="mt-8">
              <ButtonLink href="/metodo" variant="outlineLight" size="md">
                {t.solution.descubre} <ArrowIcon className="h-4 w-4" />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={120} className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
              <Image
                src="/photos/real-diagnostico.jpg"
                alt="Diagnóstico del rizo en Alma Rizo"
                fill
                sizes="(min-width: 768px) 45vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>

        {/* Pillars */}
        <div className="mt-16 grid gap-8 border-t border-cream/15 pt-12 sm:grid-cols-3 md:mt-20">
          {pillars.map((p, i) => (
            <Reveal key={p.n} delay={i * 100}>
              <span className="font-display text-3xl text-gold">{p.n}</span>
              <h3 className="mt-3 font-display text-2xl">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-cream/70">{p.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
