"use client";

import { useLang } from "@/lib/i18n";

const WORDS: Record<string, string[]> = {
  es: ["Entiende tu rizo", "Diagnóstico personalizado", "Corte en seco", "Definición rizo a rizo", "Especialistas en Tarragona"],
  ca: ["Entén el teu rínxol", "Diagnòstic personalitzat", "Tall en sec", "Definició rínxol a rínxol", "Especialistes a Tarragona"],
  en: ["Understand your curls", "Personalised diagnosis", "Dry cut", "Curl-by-curl definition", "Specialists in Tarragona"],
  fr: ["Comprends ta boucle", "Diagnostic personnalisé", "Coupe à sec", "Définition boucle à boucle", "Spécialistes à Tarragone"],
};

function Row({ words, hidden = false }: { words: string[]; hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden}>
      {words.map((w, i) => (
        <li key={i} className="flex shrink-0 items-center whitespace-nowrap">
          <span className="font-display text-2xl text-cream/90 sm:text-4xl">{w}</span>
          <span className="mx-6 text-gold sm:mx-9" aria-hidden>✦</span>
        </li>
      ))}
    </ul>
  );
}

export default function ClaimMarquee() {
  const { locale } = useLang();
  const words = WORDS[locale] ?? WORDS.es;
  return (
    <section className="bg-brand-deep py-7 sm:py-9" aria-label={words.join(" · ")}>
      <div className="marquee-mask relative flex w-full overflow-hidden">
        <div className="flex w-max animate-marquee">
          <Row words={words} />
          <Row words={words} hidden />
        </div>
      </div>
    </section>
  );
}
