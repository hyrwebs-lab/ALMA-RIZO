"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, ArrowIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { telUrl, whatsappUrl } from "@/lib/utils";
import { site, news as seedNews, type News } from "@/lib/site";
import { useT } from "@/lib/i18n";

// Duración en pantalla de cada diapositiva (ms). Novedades dura más (hay que leerla).
const DURATIONS = [8000, 10500, 8000];

export default function Hero({ news }: { news?: News[] }) {
  const t = useT();
  const newsList = news ?? seedNews;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const go = (n: number) => setI(((n % 3) + 3) % 3);

  useEffect(() => {
    if (paused) return;
    const timer = setTimeout(() => setI((v) => (v + 1) % 3), DURATIONS[i]);
    return () => clearTimeout(timer);
  }, [paused, i]);

  const slideLabels = [t.hero.slides.portada, t.hero.slides.novedades, t.hero.slides.contacto];

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-brand-deep text-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
    >
      <Slide active={i === 0}><Portada /></Slide>
      <Slide active={i === 1}><Novedades news={newsList} /></Slide>
      <Slide active={i === 2}><Contacto /></Slide>

      <button onClick={() => go(i - 1)} aria-label="Anterior" className="absolute left-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-cream/25 p-2.5 text-cream/80 transition-colors hover:border-gold hover:text-gold md:block">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button onClick={() => go(i + 1)} aria-label="Siguiente" className="absolute right-3 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-cream/25 p-2.5 text-cream/80 transition-colors hover:border-gold hover:text-gold md:block">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
      </button>

      <div className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 items-center gap-5">
        {slideLabels.map((lbl, idx) => (
          <button key={idx} onClick={() => go(idx)} className="group flex items-center gap-2" aria-label={lbl}>
            <span className={`h-1.5 rounded-full transition-all duration-300 ${idx === i ? "w-8 bg-gold" : "w-1.5 bg-cream/35 group-hover:bg-cream/60"}`} />
            <span className={`hidden text-[0.7rem] uppercase tracking-widest transition-colors sm:inline ${idx === i ? "text-cream" : "text-cream/40"}`}>{lbl}</span>
          </button>
        ))}
      </div>
    </section>
  );
}

function Slide({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        active ? "opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-4"
      }`}
      aria-hidden={!active}
    >
      {children}
    </div>
  );
}

/* ---------- SLIDE 1: PORTADA ---------- */
function Portada() {
  const t = useT();
  return (
    <>
      <div className="absolute inset-0 z-0">
        {site.heroVideo ? (
          <a href={site.heroVideoLink} target="_blank" rel="noopener noreferrer" className="block h-full w-full" aria-label={t.hero.verVideo}>
            <video src={site.heroVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </a>
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-deep via-brand to-brand-deep" style={site.heroVideo ? { opacity: 0.55 } : undefined} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(60% 55% at 78% 26%, rgba(200,168,104,0.22), transparent 70%)" }} />
        {!site.heroVideo && (
          <svg aria-hidden viewBox="0 0 600 600" className="pointer-events-none absolute -right-24 top-1/2 hidden h-[120%] -translate-y-1/2 text-gold/15 md:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M120 40c80 30 60 110-10 120s-90 80-10 110 110 60 40 130" />
            <path d="M300 0c90 50 50 130-30 140s-70 90 20 120 90 80 10 150" />
            <path d="M470 30c70 40 50 120-20 135s-60 95 25 125 80 75 5 150" />
          </svg>
        )}
      </div>

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center sm:px-8">
        <h1 className="sr-only">Alma Rizo · {t.hero.subtitle}</h1>
        <Image src="/logos/logo-light.png" alt="Alma Rizo · Curly Studio by MariCruz" width={1242} height={594} priority sizes="(min-width: 640px) 540px, 84vw" className="h-auto w-[84vw] max-w-[520px] drop-shadow-[0_8px_40px_rgba(0,0,0,0.35)]" />
        <p className="mx-auto mt-6 max-w-xl text-lg text-cream/85 sm:text-xl">{t.hero.subtitle}</p>
        <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/reservar" variant="gold" size="lg">{t.cta.reservar} <ArrowIcon className="h-4 w-4" /></ButtonLink>
          <ButtonLink href={telUrl()} variant="outlineLight" size="lg" external><PhoneIcon className="h-4 w-4" /> {t.cta.llamar}</ButtonLink>
        </div>
        {site.heroVideo && (
          <a href={site.heroVideoLink} target="_blank" rel="noopener noreferrer" className="pointer-events-auto mt-6 inline-flex items-center gap-2 text-xs uppercase tracking-widest text-cream/70 transition-colors hover:text-gold">
            ▶ {t.hero.verVideo}
          </a>
        )}
      </div>
    </>
  );
}

/* ---------- SLIDE 2: NOVEDADES ---------- */
function Sparkle({ className = "h-3.5 w-3.5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden>
      <path d="M12 2l1.6 6.4L20 10l-6.4 1.6L12 18l-1.6-6.4L4 10l6.4-1.6L12 2z" />
    </svg>
  );
}
function Novedades({ news }: { news: News[] }) {
  const t = useT();
  const [featured, ...rest] = news;
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-br from-brand via-brand-deep to-brand" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(58% 55% at 20% 32%, rgba(200,168,104,0.20), transparent 70%)" }} />
      <svg aria-hidden viewBox="0 0 600 600" className="pointer-events-none absolute -right-40 top-1/2 hidden h-[135%] -translate-y-1/2 text-gold/[0.06] lg:block" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <path d="M120 40c80 30 60 110-10 120s-90 80-10 110 110 60 40 130" />
        <path d="M300 0c90 50 50 130-30 140s-70 90 20 120 90 80 10 150" />
        <path d="M470 30c70 40 50 120-20 135s-60 95 25 125 80 75 5 150" />
      </svg>

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 py-14 sm:px-8 sm:py-24">
        <div className="mb-6 flex items-center gap-4 sm:mb-10">
          <span className="eyebrow flex items-center gap-2 whitespace-nowrap text-gold"><Sparkle className="h-3.5 w-3.5" /> {t.hero.novedadesTitle}</span>
          <span className="h-px flex-1 bg-gradient-to-r from-gold/50 to-transparent" />
        </div>

        <div className="grid items-center gap-6 sm:gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14">
          {/* Destacado — titular editorial grande */}
          {featured && (
            <div className="relative border-l-2 border-gold/60 pl-5 sm:pl-8">
              <span className="text-[0.62rem] font-medium uppercase tracking-[0.25em] text-gold-soft">{featured.tag}</span>
              <h2 className="mt-2.5 font-display text-[1.7rem] leading-[1.05] sm:mt-3 sm:text-5xl sm:leading-[1.03] md:text-6xl">{featured.title}</h2>
              <p className="mt-3.5 max-w-lg text-sm leading-relaxed text-cream/80 line-clamp-2 sm:mt-5 sm:text-lg sm:line-clamp-3">{featured.text}</p>
              <div className="mt-6 flex flex-wrap gap-3 sm:mt-8">
                <ButtonLink href="/reservar" variant="gold" size="md">{t.cta.reservarAhora}</ButtonLink>
                <ButtonLink href="/productos" variant="outlineLight" size="md">{t.cta.verProductos}</ButtonLink>
              </div>
            </div>
          )}

          {/* Secundarias — panel elegante con índice */}
          {rest.length > 0 && (
            <div className="rounded-3xl border border-cream/12 bg-gradient-to-b from-cream-soft/[0.09] to-cream-soft/[0.02] p-5 backdrop-blur-sm sm:p-8">
              <ul className="divide-y divide-cream/10">
                {rest.map((n, idx) => (
                  <li key={n.title} className="group flex gap-4 py-3 first:pt-0 last:pb-0 sm:py-4">
                    <span className="font-display text-2xl leading-none text-gold/55 transition-colors group-hover:text-gold">0{idx + 2}</span>
                    <div className="min-w-0">
                      <span className="text-[0.58rem] font-medium uppercase tracking-[0.2em] text-gold">{n.tag}</span>
                      <h3 className="mt-1 font-display text-lg leading-snug text-cream">{n.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-cream/65 line-clamp-2">{n.text}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

/* ---------- SLIDE 3: CONTACTO ---------- */
function Contacto() {
  const t = useT();
  return (
    <>
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep via-brand to-brand-deep" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(50% 50% at 50% 40%, rgba(200,168,104,0.14), transparent 70%)" }} />
      <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
        <p className="gold-rule eyebrow mb-6 justify-center text-gold">{t.hero.contactoEyebrow}</p>
        <h2 className="font-display text-4xl leading-tight sm:text-6xl">{t.hero.contactoTitle}</h2>
        <p className="mx-auto mt-4 max-w-md text-lg text-cream/80">
          {t.hero.contactoSub.replace("{addr}", site.contact.address).replace("{city}", site.contact.cityRegion)}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/reservar" variant="gold" size="lg">{t.cta.reservarCorto}</ButtonLink>
          <ButtonLink href={telUrl()} variant="outlineLight" size="lg" external><PhoneIcon className="h-4 w-4" /> {t.cta.llamar}</ButtonLink>
          <ButtonLink href={whatsappUrl()} variant="outlineLight" size="lg" external><WhatsAppIcon className="h-4 w-4" /> WhatsApp</ButtonLink>
        </div>
        <p className="mt-8 text-sm text-cream/55">{t.hero.hours}</p>
      </div>
    </>
  );
}
