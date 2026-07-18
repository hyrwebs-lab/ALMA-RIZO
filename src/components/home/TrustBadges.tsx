"use client";

import { useLang } from "@/lib/i18n";

type Item = { icon: React.ReactNode; label: Record<string, string> };

const curl = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <path d="M6 20c0-4 4-4 4-8s-4-4-4-8" />
    <path d="M13 20c0-4 4-4 4-8s-4-4-4-8" />
  </svg>
);
const lens = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
    <circle cx="11" cy="11" r="6" /><path d="M20 20l-3.5-3.5" />
  </svg>
);
const drop = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3s6 6.5 6 10.5a6 6 0 0 1-12 0C6 9.5 12 3 12 3z" /><path d="M9.5 14a2.5 2.5 0 0 0 2.5 2.5" />
  </svg>
);
const scissors = (
  <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="7" r="2.4" /><circle cx="6" cy="17" r="2.4" /><path d="M8 8.5L20 17M8 15.5L20 7" />
  </svg>
);

const ITEMS: Item[] = [
  { icon: curl, label: { es: "Especialistas en rizo", ca: "Especialistes en rínxol", en: "Curl specialists", fr: "Spécialistes du bouclé" } },
  { icon: lens, label: { es: "Diagnóstico personalizado", ca: "Diagnòstic personalitzat", en: "Personalised diagnosis", fr: "Diagnostic personnalisé" } },
  { icon: drop, label: { es: "Productos sin sulfatos", ca: "Productes sense sulfats", en: "Sulfate-free products", fr: "Produits sans sulfates" } },
  { icon: scissors, label: { es: "Corte en seco, rizo a rizo", ca: "Tall en sec, rínxol a rínxol", en: "Dry cut, curl by curl", fr: "Coupe à sec, boucle à boucle" } },
];

export default function TrustBadges() {
  const { locale } = useLang();
  return (
    <section className="border-b border-brand/10 bg-cream-soft">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-5 px-6 py-8 sm:px-8 md:grid-cols-4 md:py-6">
        {ITEMS.map((it, i) => (
          <div key={i} className="flex items-center justify-center gap-3 text-center md:justify-start md:text-left">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
              {it.icon}
            </span>
            <span className="text-sm font-medium leading-tight text-brand">{it.label[locale] ?? it.label.es}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
