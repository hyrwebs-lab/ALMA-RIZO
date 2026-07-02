"use client";

import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { ArrowIcon } from "@/components/ui/Icons";
import { formatDuration, formatPrice } from "@/lib/utils";
import type { Service } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function ServiceCard({ service }: { service: Service }) {
  const t = useT();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand/10 bg-cream-soft transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_30px_60px_-30px_rgba(24,59,50,0.45)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image ?? "/photos/portrait-hero.jpg"}
          alt={service.name}
          fill
          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-0 top-4 bg-brand/90 px-3 py-1 eyebrow text-cream">
          {service.tagline}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="font-display text-2xl text-brand">{service.name}</h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
          {service.description}
        </p>

        <div className="mt-5 flex items-center justify-between border-t border-brand/10 pt-4 text-sm text-ink-soft">
          <span>{formatDuration(service.durationMin)}</span>
          <span className="font-display text-xl text-brand">
            {formatPrice(service.price)}
          </span>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <ButtonLink
            href={`/reservar?servicio=${service.slug}`}
            variant="gold"
            size="sm"
          >
            {t.services.reservar}
          </ButtonLink>
          <Link
            href={`/servicios#${service.slug}`}
            className="inline-flex items-center gap-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand transition-colors hover:text-gold"
          >
            {t.cta.verMas} <ArrowIcon className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
