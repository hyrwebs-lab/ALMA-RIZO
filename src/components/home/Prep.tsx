"use client";

import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";

// ⚠️ Consejos de ejemplo — revisar/ajustar con Maricruz.
const COPY: Record<string, { eyebrow: string; title: string; cta: string; tips: string[] }> = {
  es: {
    eyebrow: "Antes de tu cita",
    title: "Cómo prepararte para tu visita",
    cta: "Ver el vídeo",
    tips: [
      "Ven con el pelo suelto, sin recoger.",
      "Tráelo limpio y seco, sin productos de peinado.",
      "Si puedes, evita plancha o secador los días previos.",
      "Ven sin prisas: el diagnóstico se toma su tiempo.",
    ],
  },
  ca: {
    eyebrow: "Abans de la teva cita",
    title: "Com preparar-te per a la teva visita",
    cta: "Veure el vídeo",
    tips: [
      "Vine amb els cabells solts, sense recollir.",
      "Porta'ls nets i secs, sense productes de pentinat.",
      "Si pots, evita planxa o assecador els dies previs.",
      "Vine sense presses: el diagnòstic es pren el seu temps.",
    ],
  },
  en: {
    eyebrow: "Before your appointment",
    title: "How to prepare for your visit",
    cta: "Watch the video",
    tips: [
      "Come with your hair down, not tied up.",
      "Bring it clean and dry, without styling products.",
      "If you can, avoid flat irons or blow-dryers beforehand.",
      "Take your time: the diagnosis is never rushed.",
    ],
  },
  fr: {
    eyebrow: "Avant votre rendez-vous",
    title: "Comment préparer votre visite",
    cta: "Voir la vidéo",
    tips: [
      "Venez cheveux détachés, non attachés.",
      "Apportez-les propres et secs, sans produits coiffants.",
      "Si possible, évitez lisseur ou sèche-cheveux avant.",
      "Venez sans hâte : le diagnostic prend son temps.",
    ],
  },
};

export default function Prep() {
  const { locale } = useLang();
  const t = COPY[locale] ?? COPY.es;
  return (
    <section className="bg-cream-soft py-20 md:py-24">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.eyebrow}</p>
          <h2 className="font-display text-3xl leading-tight text-brand sm:text-4xl">{t.title}</h2>
        </Reveal>
        <Reveal delay={100}>
          <ul className="mx-auto mt-10 grid max-w-2xl gap-x-8 gap-y-4 text-left sm:grid-cols-2">
            {t.tips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-medium text-cream">{i + 1}</span>
                <span className="text-ink-soft">{tip}</span>
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <ButtonLink href={site.comoVenir.link} variant="outline" size="md" external>
              ▶ {t.cta}
            </ButtonLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
