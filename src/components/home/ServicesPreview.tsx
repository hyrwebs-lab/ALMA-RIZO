"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ServiceCard from "@/components/site/ServiceCard";
import { ArrowIcon } from "@/components/ui/Icons";
import { services as seedServices, type Service } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function ServicesPreview({ services }: { services?: Service[] }) {
  const t = useT();
  const featured = (services ?? seedServices).filter((s) => s.featured);

  return (
    <section id="servicios" className="bg-cream-soft py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.services.eyebrow}</p>
          <h2 className="font-display text-4xl text-brand sm:text-5xl">
            {t.services.title}
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            {t.services.sub}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 100}>
              <ServiceCard service={s} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link
            href="/servicios"
            className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-brand transition-colors hover:text-gold"
          >
            {t.services.verTodos} <ArrowIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
