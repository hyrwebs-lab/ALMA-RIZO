"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, ArrowIcon, WhatsAppIcon, ClockIcon } from "@/components/ui/Icons";
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
      {/* Fondo compartido: vídeo (cuando lo envíen) o foto editorial B/N, con capa oscura */}
      <div className="absolute inset-0 z-0">
        {site.heroVideo ? (
          <a href={site.heroVideoLink} target="_blank" rel="noopener noreferrer" className="block h-full w-full" aria-label={t.hero.verVideo}>
            <video src={site.heroVideo} autoPlay muted loop playsInline className="h-full w-full object-cover" />
          </a>
        ) : (
          <Image src="/photos/portrait-window.jpg" alt="" fill priority sizes="100vw" className="object-cover object-center" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/82 via-brand-deep/72 to-brand-deep/90" />
        <div className="absolute inset-0" style={{ background: "radial-gradient(62% 55% at 72% 26%, rgba(200,168,104,0.18), transparent 70%)" }} />
      </div>

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
      className={`absolute inset-0 z-10 flex items-center justify-center transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
    <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center sm:px-8">
      <h1 className="sr-only">Alma Rizo · {t.hero.subtitle}</h1>
      <Image src="/logos/logo-light.png" alt="Alma Rizo · Curly Studio by MariCruz" width={1242} height={594} priority sizes="(min-width: 640px) 520px, 84vw" className="h-auto w-[84vw] max-w-[520px] drop-shadow-[0_10px_45px_rgba(0,0,0,0.5)]" />
      <p className="mx-auto mt-6 max-w-xl text-lg text-cream/90 drop-shadow sm:text-xl">{t.hero.subtitle}</p>
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
    <div className="relative z-10 mx-auto w-full max-w-3xl px-6 py-14 text-center sm:px-8 sm:py-24">
      <p className="gold-rule eyebrow mb-7 justify-center text-gold sm:mb-8">{t.hero.novedadesTitle}</p>

      {/* Destacado — tarjeta central tipo cristal */}
      {featured && (
        <div className="overflow-hidden rounded-[1.6rem] border border-cream/15 bg-brand-deep/40 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md sm:rounded-[2.2rem]">
          {featured.image && (
            <div className="relative h-40 w-full sm:h-56">
              <Image src={featured.image} alt={featured.title} fill sizes="(min-width:640px) 42rem, 90vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 to-transparent" />
            </div>
          )}
          <div className="px-6 py-8 sm:px-12 sm:py-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-3.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-gold-soft">
            <Sparkle className="h-3 w-3" /> {featured.tag}
          </span>
          <h2 className="mt-5 font-display text-[1.9rem] leading-[1.08] sm:text-5xl">{featured.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/85 line-clamp-3 sm:text-base">{featured.text}</p>
          <div className="mt-7 flex flex-wrap justify-center gap-3 sm:mt-8">
            <ButtonLink href="/reservar" variant="gold" size="md">{t.cta.reservarAhora}</ButtonLink>
            <ButtonLink href="/productos" variant="outlineLight" size="md">{t.cta.verProductos}</ButtonLink>
          </div>
          </div>
        </div>
      )}

      {/* Secundarias — dos tarjetas simétricas */}
      {rest.length > 0 && (
        <div className="mt-4 grid grid-cols-2 gap-3 text-left sm:mt-5 sm:gap-4">
          {rest.map((n) => (
            <div key={n.title} className="rounded-2xl border border-cream/12 bg-brand-deep/35 p-4 backdrop-blur-md transition-colors duration-300 hover:border-gold/40 sm:p-5">
              <span className="text-[0.55rem] font-medium uppercase tracking-[0.2em] text-gold sm:text-[0.6rem]">{n.tag}</span>
              <h3 className="mt-1 font-display text-base leading-snug text-cream sm:text-lg">{n.title}</h3>
              <p className="mt-1 text-xs leading-relaxed text-cream/70 line-clamp-2 sm:text-sm">{n.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------- SLIDE 3: CONTACTO + HORARIOS ---------- */
function Contacto() {
  const t = useT();
  const groups = [
    { days: "Lun · Mar · Mié", value: "9:30 – 18:30" },
    { days: "Jue · Vie", value: "9:30 – 19:30" },
    { days: "Sáb", value: "9:30 – 13:30" },
  ];
  return (
    <div className="relative z-10 mx-auto grid w-full max-w-5xl items-center gap-8 px-6 py-14 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-12">
      {/* Izquierda: llamada a la acción */}
      <div className="text-center lg:text-left">
        <p className="gold-rule eyebrow mb-5 justify-center text-gold lg:justify-start">{t.hero.contactoEyebrow}</p>
        <h2 className="font-display text-4xl leading-tight sm:text-5xl">{t.hero.contactoTitle}</h2>
        <p className="mx-auto mt-4 max-w-md text-cream/85 lg:mx-0">
          {site.contact.address} · {site.contact.cityRegion}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
          <ButtonLink href="/reservar" variant="gold" size="lg">{t.cta.reservarCorto}</ButtonLink>
          <ButtonLink href={telUrl()} variant="outlineLight" size="md" external><PhoneIcon className="h-4 w-4" /> {t.cta.llamar}</ButtonLink>
          <ButtonLink href={whatsappUrl()} variant="outlineLight" size="md" external><WhatsAppIcon className="h-4 w-4" /> WhatsApp</ButtonLink>
        </div>
      </div>

      {/* Derecha: tarjeta de horarios tipo cristal */}
      <div className="mx-auto w-full max-w-sm rounded-[1.75rem] border border-cream/15 bg-brand-deep/40 px-8 py-9 text-center shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full border border-gold/40 text-gold">
          <ClockIcon className="h-5 w-5" />
        </span>
        <h3 className="mt-4 font-display text-2xl text-cream">Horarios de atención</h3>
        <ul className="mt-6 space-y-4">
          {groups.map((g) => (
            <li key={g.days}>
              <p className="text-sm text-cream/70">{g.days}</p>
              <p className="font-display text-xl text-gold-soft">{g.value}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 border-t border-cream/10 pt-4 text-sm text-cream/60">Con atención al mediodía</p>
      </div>
    </div>
  );
}
