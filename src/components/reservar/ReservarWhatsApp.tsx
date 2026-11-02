"use client";

import { useState } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon, PhoneIcon, ClockIcon, ArrowIcon } from "@/components/ui/Icons";
import { useLinks } from "@/lib/contact";
import { bookingMessage } from "@/lib/booking";
import { formatDuration, formatPrice } from "@/lib/utils";
import { site } from "@/lib/site";

type Svc = { slug: string; name: string; tagline: string; durationMin: number; price: number };

const HORARIO = [
  { days: "Lunes · Martes · Miércoles", value: "9:30 – 18:30" },
  { days: "Jueves · Viernes", value: "9:30 – 19:30" },
  { days: "Sábado", value: "9:30 – 13:30" },
  { days: "Domingo", value: "Cerrado", closed: true },
];

/**
 * Página de reservas. No se cierra la hora aquí: la clienta elige servicio (si
 * quiere) y se abre WhatsApp con el mensaje escrito para que el salón le dé
 * hora. El QR del escaparate apunta a esta página.
 */
export default function ReservarWhatsApp({ services }: { services: Svc[] }) {
  const [slug, setSlug] = useState<string | null>(null);
  const { contact, tel, wa } = useLinks();
  const service = services.find((s) => s.slug === slug) ?? null;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14 sm:px-8 md:py-20">
      <div className="rounded-3xl border border-brand/10 bg-cream p-7 shadow-[0_30px_60px_-45px_rgba(24,59,50,0.5)] sm:p-10">
        <p className="eyebrow text-gold">Tu cita, en un mensaje</p>
        <h2 className="mt-2 font-display text-2xl leading-snug text-brand sm:text-3xl">
          Elige el servicio y te escribimos por WhatsApp
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          Te damos hora al momento. Si todavía no sabes qué necesita tu rizo, pulsa
          directamente el botón y lo vemos contigo.
        </p>

        {services.length > 0 && (
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {services.map((s) => {
              const active = s.slug === slug;
              return (
                <button
                  key={s.slug}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setSlug(active ? null : s.slug)}
                  className={`cursor-pointer rounded-2xl border p-4 text-left transition-all duration-300 ${
                    active
                      ? "border-gold bg-gold/10 shadow-[0_12px_30px_-20px_rgba(200,168,104,0.9)]"
                      : "border-brand/15 bg-cream-soft hover:border-gold/50"
                  }`}
                >
                  <span className="block font-display text-lg leading-snug text-brand">{s.name}</span>
                  <span className="mt-1 block text-[0.65rem] uppercase tracking-[0.16em] text-ink-soft">
                    {s.tagline}
                  </span>
                  <span className="mt-3 flex items-center justify-between text-sm text-ink-soft">
                    <span>{formatDuration(s.durationMin)}</span>
                    <span className="font-display text-lg text-brand">{formatPrice(s.price)}</span>
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <ButtonLink
            href={service ? wa(bookingMessage(service.name)) : wa()}
            external
            variant="gold"
            size="lg"
            className="flex-1"
          >
            <WhatsAppIcon className="h-4 w-4" />
            {service ? `Reservar ${service.name}` : "Reservar por WhatsApp"}
          </ButtonLink>
          <ButtonLink href={tel} external variant="outline" size="lg">
            <PhoneIcon className="h-4 w-4" /> {contact.phone}
          </ButtonLink>
        </div>
        <p className="mt-4 text-xs text-ink-soft/80">
          Te contestamos en horario de salón. Los precios y duraciones son orientativos:
          los ajustamos contigo según tu tipo de rizo.
        </p>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-brand/10 bg-cream p-6">
          <p className="eyebrow flex items-center gap-2 text-gold">
            <ClockIcon className="h-4 w-4" /> Horario
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-soft">
            {HORARIO.map((h) => (
              <li key={h.days} className="flex items-baseline justify-between gap-4">
                <span>{h.days}</span>
                <span className={h.closed ? "text-ink-soft/60" : "text-ink"}>{h.value}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-brand/10 bg-cream p-6">
          <p className="eyebrow text-gold">Antes de tu cita</p>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Ven con el pelo limpio, seco y suelto —sin recoger ni planchar— para que
            podamos ver tu rizo natural y hacer un buen diagnóstico.
          </p>
          <a
            href={site.prepVideoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-1 text-[0.72rem] font-medium uppercase tracking-[0.18em] text-brand transition-colors hover:text-gold"
          >
            Ver cómo venir preparada <ArrowIcon className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}
