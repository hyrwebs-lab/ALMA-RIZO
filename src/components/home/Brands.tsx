"use client";

import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";

// Marcas con las que trabaja el salón (de la info facilitada).
const BRANDS = [
  "Actyva",
  "Schwarzkopf Professional",
  "Every Green",
  "Salerm Cosmetics",
  "Montibello",
  "Argabeta",
  "Aunt Jackie's",
  "As I Am",
];

const COPY: Record<string, { eyebrow: string; title: string }> = {
  es: { eyebrow: "Marcas", title: "Seleccionamos lo mejor de cada marca para tu cabello" },
  ca: { eyebrow: "Marques", title: "Seleccionem el millor de cada marca per al teu cabell" },
  en: { eyebrow: "Brands", title: "We select the best of every brand for your hair" },
  fr: { eyebrow: "Marques", title: "Nous choisissons le meilleur de chaque marque pour vos cheveux" },
};

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-x-12 pr-12 sm:gap-x-20 sm:pr-20" aria-hidden={hidden}>
      {BRANDS.map((b) => (
        <li
          key={b}
          className="whitespace-nowrap font-display text-xl uppercase tracking-[0.16em] text-brand/50 transition-colors duration-300 hover:text-brand sm:text-[1.7rem]"
        >
          {b}
        </li>
      ))}
    </ul>
  );
}

export default function Brands() {
  const { locale } = useLang();
  const t = COPY[locale] ?? COPY.es;
  return (
    <section className="border-y border-brand/10 bg-cream-soft py-16 md:py-20">
      <div className="mx-auto max-w-3xl px-6 sm:px-8">
        <Reveal className="text-center">
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.eyebrow}</p>
          <h2 className="font-display text-3xl text-brand sm:text-4xl">{t.title}</h2>
        </Reveal>
      </div>

      <div className="marquee-mask relative mt-12 flex w-full overflow-hidden">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
