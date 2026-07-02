"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { useLang } from "@/lib/i18n";

// Logos reales de las marcas con las que trabaja el salón (de su carta).
const BRANDS = [
  { name: "Actyva", src: "/brands/actyva.png", w: 200, h: 254 },
  { name: "Schwarzkopf Professional", src: "/brands/schwarzkopf.png", w: 261, h: 145 },
  { name: "Every Green", src: "/brands/everygreen.png", w: 250, h: 88 },
  { name: "Salerm Cosmetics", src: "/brands/salerm.png", w: 227, h: 58 },
  { name: "Montibello", src: "/brands/montibello.png", w: 241, h: 94 },
  { name: "Argabeta", src: "/brands/argabeta.png", w: 158, h: 121 },
  { name: "Aunt Jackie's", src: "/brands/auntjackies.png", w: 189, h: 97 },
  { name: "As I Am", src: "/brands/asiam.png", w: 230, h: 152 },
];

const COPY: Record<string, { eyebrow: string; title: string }> = {
  es: { eyebrow: "Marcas", title: "Seleccionamos lo mejor de cada marca para tu cabello" },
  ca: { eyebrow: "Marques", title: "Seleccionem el millor de cada marca per al teu cabell" },
  en: { eyebrow: "Brands", title: "We select the best of every brand for your hair" },
  fr: { eyebrow: "Marques", title: "Nous choisissons le meilleur de chaque marque pour vos cheveux" },
};

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center gap-x-12 pr-12 sm:gap-x-16 sm:pr-16" aria-hidden={hidden}>
      {BRANDS.map((b) => (
        <li key={b.name} className="flex h-9 shrink-0 items-center sm:h-11">
          <Image
            src={b.src}
            alt={b.name}
            width={b.w}
            height={b.h}
            className="h-full w-auto object-contain opacity-60 grayscale transition duration-300 hover:opacity-100 hover:grayscale-0"
          />
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
