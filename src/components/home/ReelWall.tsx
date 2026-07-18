"use client";

import { useEffect, useRef } from "react";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/lib/site";
import { useLang } from "@/lib/i18n";

const COPY: Record<string, { eyebrow: string; title: string; text: string; cta: string }> = {
  es: { eyebrow: "En vídeo", title: "Míranos en acción", text: "Transformaciones reales de nuestras clientas. Toca un vídeo para verlo en Instagram.", cta: "Ver más en Instagram" },
  ca: { eyebrow: "En vídeo", title: "Mira'ns en acció", text: "Transformacions reals de les nostres clientes. Toca un vídeo per veure'l a Instagram.", cta: "Veure més a Instagram" },
  en: { eyebrow: "On video", title: "See us in action", text: "Real transformations from our clients. Tap a video to watch it on Instagram.", cta: "See more on Instagram" },
  fr: { eyebrow: "En vidéo", title: "Voyez-nous à l'œuvre", text: "Transformations réelles de nos clientes. Touchez une vidéo pour la voir sur Instagram.", cta: "Voir plus sur Instagram" },
};

export default function ReelWall() {
  const { locale } = useLang();
  const t = COPY[locale] ?? COPY.es;
  const sectionRef = useRef<HTMLElement | null>(null);
  const vids = useRef<(HTMLVideoElement | null)[]>([]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        vids.current.forEach((v) => {
          if (!v) return;
          if (entry.isIntersecting) v.play?.().catch(() => {});
          else v.pause?.();
        });
      },
      { threshold: 0.15 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={sectionRef} className="overflow-hidden bg-brand-deep py-20 text-cream md:py-28">
      <div className="mx-auto max-w-3xl px-6 text-center sm:px-8">
        <Reveal>
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.eyebrow}</p>
          <h2 className="font-display text-3xl leading-tight sm:text-4xl">{t.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-cream/75">{t.text}</p>
        </Reveal>
      </div>

      <div className="mt-12 flex snap-x gap-4 overflow-x-auto px-6 pb-4 sm:gap-5 sm:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <span className="shrink-0 sm:w-[calc((100%-73rem)/2)]" aria-hidden />
        {site.reels.map((r, i) => (
          <a
            key={r.src}
            href={r.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Ver el vídeo en Instagram"
            className="group relative aspect-[9/16] w-[62vw] max-w-[230px] shrink-0 snap-center overflow-hidden rounded-[1.4rem] border border-cream/15 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:w-[220px]"
          >
            <video
              ref={(el) => { vids.current[i] = el; }}
              src={r.src}
              poster={r.poster}
              muted
              loop
              playsInline
              preload="none"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/60 via-transparent to-transparent opacity-80 transition-opacity group-hover:opacity-50" />
            <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-brand-deep/50 text-cream backdrop-blur-md ring-1 ring-cream/30">
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden>
                <rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
              </svg>
            </span>
          </a>
        ))}
        <span className="shrink-0 sm:w-[calc((100%-73rem)/2)]" aria-hidden />
      </div>

      <div className="mt-8 text-center">
        <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm uppercase tracking-widest text-cream/70 transition-colors hover:text-gold">
          {t.cta}
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 12h14M13 5l7 7-7 7" /></svg>
        </a>
      </div>
    </section>
  );
}
