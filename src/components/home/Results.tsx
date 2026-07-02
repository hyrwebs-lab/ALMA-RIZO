"use client";

import Image from "next/image";
import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import BeforeAfterPair from "@/components/site/BeforeAfterPair";
import { ArrowIcon } from "@/components/ui/Icons";
import { beforeAfter, gallery } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function Results() {
  const t = useT();
  return (
    <section id="resultados" className="bg-cream-deep py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.results.eyebrow}</p>
          <h2 className="font-display text-4xl text-brand sm:text-5xl">
            {t.results.title}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {t.results.sub}
          </p>
        </Reveal>

        {/* Before / after */}
        <div className="mx-auto mt-14 grid max-w-4xl gap-7 sm:grid-cols-2">
          {beforeAfter.map((ba, i) => (
            <Reveal key={i} delay={i * 120}>
              <BeforeAfterPair before={ba.before} after={ba.after} label={ba.label} />
            </Reveal>
          ))}
        </div>

        {/* Gallery strip */}
        <div className="mt-12 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {gallery.slice(0, 6).map((g, i) => (
            <Reveal key={g.src} delay={i * 60} className="relative aspect-[3/4] overflow-hidden rounded-xl">
              <Image
                src={g.src}
                alt={g.alt}
                fill
                sizes="(min-width:1024px) 16vw, (min-width:640px) 33vw, 50vw"
                className="object-cover transition-transform duration-700 hover:scale-105"
              />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href="/galeria"
            className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-brand transition-colors hover:text-gold"
          >
            {t.results.verTodas} <ArrowIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
