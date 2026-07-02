"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { useT } from "@/lib/i18n";

export default function Identify() {
  const t = useT();
  return (
    <section className="bg-cream-soft py-20 md:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 sm:px-8 md:grid-cols-2 md:gap-16">
        <Reveal className="relative order-2 md:order-1">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl">
            <Image
              src="/photos/real-antes-rizo.jpg"
              alt="Cabello rizado sin definir antes del trabajo"
              fill
              sizes="(min-width: 768px) 45vw, 100vw"
              className="object-cover object-top"
            />
          </div>
          {/* gold frame accent */}
          <div className="absolute -bottom-3 -right-3 -z-0 hidden h-full w-full rounded-2xl border border-gold/50 md:block" />
        </Reveal>

        <Reveal className="order-1 md:order-2" delay={120}>
          <p className="gold-rule eyebrow mb-6 text-gold">{t.identify.eyebrow}</p>
          <h2 className="font-display text-4xl leading-tight text-brand sm:text-5xl">
            {t.identify.title}
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-ink-soft">
            {t.identify.text}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
