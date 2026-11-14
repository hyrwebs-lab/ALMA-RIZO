"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { ButtonLink } from "@/components/ui/Button";
import { PhoneIcon, ClockIcon } from "@/components/ui/Icons";
import ReservarButton from "@/components/site/ReservarButton";
import { site, news as seedNews, type News } from "@/lib/site";
import { useLinks } from "@/lib/contact";
import { useT } from "@/lib/i18n";

// Duración en pantalla de cada diapositiva (ms). Novedades dura más (hay que leerla).
const DURATIONS = [9000, 10500, 9000];

export default function Hero({ news }: { news?: News[] }) {
  const t = useT();
  const newsList = news ?? seedNews;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const [videoOpen, setVideoOpen] = useState(false);
  const go = (n: number) => setI(((n % 3) + 3) % 3);

  useEffect(() => {
    if (paused || videoOpen) return;
    const timer = setTimeout(() => setI((v) => (v + 1) % 3), DURATIONS[i]);
    return () => clearTimeout(timer);
  }, [paused, videoOpen, i]);

  const slideLabels = [t.hero.slides.portada, t.hero.slides.novedades, t.hero.slides.contacto];

  return (
    <section
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-brand-deep text-cream"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carrusel"
    >
      {/* Fondos por diapositiva (cross-fade). Cada uno con su capa oliva translúcida. */}
      <Bg active={i === 0}><VideoColumns active={i === 0} /></Bg>
      <Bg active={i === 1}><NovedadesBg /></Bg>
      <Bg active={i === 2}><ForestBg /></Bg>

      <Slide active={i === 0}><Portada /></Slide>
      <Slide active={i === 1}><Novedades news={newsList} /></Slide>
      <Slide active={i === 2}><Contacto active={i === 2} onVideo={setVideoOpen} /></Slide>

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

/* ---------- Contenedor de fondo con cross-fade ---------- */
function Bg({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div className={`absolute inset-0 z-0 transition-opacity duration-[900ms] ease-out ${active ? "opacity-100" : "opacity-0"}`} aria-hidden>
      {children}
    </div>
  );
}

/* Tres columnas de vídeo vertical (portada). Se reproducen solo cuando el slide está activo. */
function VideoColumns({ active }: { active: boolean }) {
  const refs = useRef<(HTMLVideoElement | null)[]>([]);
  useEffect(() => {
    refs.current.forEach((v) => {
      if (!v) return;
      if (active) v.play?.().catch(() => {});
      else v.pause?.();
    });
  }, [active]);
  return (
    <div className="absolute inset-0">
      <div className="grid h-full grid-cols-3 gap-px bg-brand-deep">
        {site.heroVideos.map((v, idx) => (
          <video
            key={v.src}
            ref={(el) => { refs.current[idx] = el; }}
            src={v.src}
            poster={v.poster}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-label={v.alt}
            className="h-full w-full object-cover"
          />
        ))}
      </div>
      {/* Overlays: verde bosque + oliva translúcido (efecto transparente de la guía) */}
      <div className="absolute inset-0 bg-brand-deep/50" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/75 via-olive/25 to-brand-deep/85" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(58% 48% at 50% 42%, rgba(0,0,0,0.45), transparent 72%)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(60% 50% at 50% 38%, rgba(200,168,104,0.12), transparent 70%)" }} />
    </div>
  );
}

/* Fondo de Novedades: foto editorial con capa de marca. */
function NovedadesBg() {
  return (
    <div className="absolute inset-0">
      <Image src="/photos/portrait-window.jpg" alt="" fill sizes="100vw" className="object-cover object-center" />
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/85 via-brand-deep/80 to-brand-deep/92" />
      <div className="absolute inset-0 bg-olive/15" />
    </div>
  );
}

/* Fondo de Contacto: verde bosque de marca con un toque oliva. */
function ForestBg() {
  return (
    <div className="absolute inset-0">
      <div className="absolute inset-0 bg-gradient-to-br from-brand-deep via-brand to-brand-deep" />
      <div className="absolute inset-0 bg-olive/12" />
      <div className="absolute inset-0" style={{ background: "radial-gradient(50% 60% at 78% 40%, rgba(200,168,104,0.14), transparent 70%)" }} />
    </div>
  );
}

/* pt-28 deja sitio a la cabecera fija y pb-14 a los puntos del carrusel, para
   que en móvil el contenido no se meta debajo de ninguno de los dos. */
function Slide({ active, children }: { active: boolean; children: React.ReactNode }) {
  return (
    <div
      className={`absolute inset-0 z-10 flex items-center justify-center pb-14 pt-28 transition-all duration-[900ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
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
  const { tel } = useLinks();
  return (
    <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center px-6 text-center sm:px-8">
      <h1 className="sr-only">Alma Rizo · {t.hero.subtitle}</h1>
      <Image src="/logos/logo-light.png" alt="Alma Rizo · Curly Studio by MariCruz" width={1242} height={594} priority sizes="(min-width: 640px) 520px, 84vw" className="h-auto w-[84vw] max-w-[520px] drop-shadow-[0_10px_45px_rgba(0,0,0,0.55)]" />
      <p className="mx-auto mt-6 max-w-xl text-lg text-cream/90 drop-shadow sm:text-xl">{t.hero.subtitle}</p>
      <div className="pointer-events-auto mt-9 flex flex-wrap items-center justify-center gap-4">
        <ReservarButton variant="gold" size="lg" label={t.cta.reservar} />
        <ButtonLink href={tel} variant="outlineLight" size="lg" external><PhoneIcon className="h-4 w-4" /> {t.cta.llamar}</ButtonLink>
      </div>
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
    <div className="relative z-10 mx-auto w-full max-w-3xl px-6 text-center sm:px-8">
      <p className="gold-rule eyebrow mb-5 justify-center text-gold sm:mb-8">{t.hero.novedadesTitle}</p>

      {/* Destacado — tarjeta central tipo cristal */}
      {featured && (
        <div className="overflow-hidden rounded-[1.6rem] border border-cream/15 bg-brand-deep/40 shadow-[0_24px_70px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md sm:rounded-[2.2rem]">
          {featured.image && (
            <div className="relative h-28 w-full sm:h-36 lg:h-44">
              <Image src={featured.image} alt={featured.title} fill sizes="(min-width:640px) 42rem, 90vw" className="object-cover object-[center_28%]" />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 to-transparent" />
            </div>
          )}
          <div className="px-6 py-6 sm:px-12 sm:py-8">
          <span className="inline-flex items-center gap-2 rounded-full bg-gold/25 px-3.5 py-1 text-[0.6rem] font-medium uppercase tracking-[0.22em] text-gold-soft">
            <Sparkle className="h-3 w-3" /> {featured.tag}
          </span>
          <h2 className="mt-4 font-display text-[1.7rem] leading-[1.08] sm:mt-5 sm:text-4xl lg:text-[2.6rem]">{featured.title}</h2>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-cream/85 line-clamp-3 sm:text-base">{featured.text}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <ReservarButton
              variant="gold"
              size="md"
              label={featured.cta || t.cta.reservarAhora}
              service={featured.cta ? featured.tag : undefined}
              className="whitespace-nowrap px-5! tracking-[0.1em]! sm:px-7! sm:tracking-[0.16em]!"
            />
          </div>
          </div>
        </div>
      )}

      {/* Secundarias — dos tarjetas simétricas. Solo en pantallas anchas Y altas:
          en móvil o en un portátil de 800 px no caben junto a la destacada. */}
      {rest.length > 0 && (
        <div className="mt-5 hidden grid-cols-2 gap-4 text-left [@media(min-width:640px)_and_(min-height:900px)]:grid">
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

/* ---------- SLIDE 3: CONTACTO + VÍDEO "CÓMO VENIR" ---------- */
// Botones en una sola línea en móvil (menos relleno y espaciado entre letras).
const compactBtn = "whitespace-nowrap px-5! tracking-[0.1em]! sm:px-7! sm:tracking-[0.16em]!";
/*
 * En móvil todo tiene que caber entre la cabecera y los puntos del carrusel,
 * así que el horario va en columna al lado de un vídeo pequeño. En escritorio
 * el vídeo ocupa la columna derecha entera.
 */
function Contacto({ active, onVideo }: { active: boolean; onVideo: (open: boolean) => void }) {
  const t = useT();
  const { contact, tel } = useLinks();
  const groups = [
    { days: "Lun · Mar · Mié", value: "9:30 – 18:30" },
    { days: "Jue · Vie", value: "9:30 – 19:30" },
    { days: "Sáb", value: "9:30 – 13:30" },
  ];
  return (
    <div className="relative z-10 mx-auto grid w-full max-w-5xl grid-cols-[1fr_auto] items-center gap-x-5 px-6 [grid-template-areas:'head_head''hours_video''btns_btns'] sm:px-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-x-12 lg:[grid-template-areas:'head_video''hours_video''btns_video']">
      <div className="text-center [grid-area:head] lg:self-end lg:text-left">
        <p className="gold-rule eyebrow mb-3 justify-center text-gold sm:mb-5 lg:justify-start">{t.hero.contactoEyebrow}</p>
        <h2 className="font-display text-[2rem] leading-tight sm:text-5xl">{t.hero.contactoTitle}</h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-cream/85 sm:mt-4 sm:text-base lg:mx-0">
          {contact.address} · {contact.cityRegion}
        </p>
      </div>

      <div className="mt-5 flex flex-col gap-2.5 justify-self-center text-sm text-cream/75 [grid-area:hours] sm:mt-6 lg:mx-0 lg:justify-self-start lg:flex-row lg:flex-wrap lg:gap-x-6 lg:gap-y-2">
        {groups.map((g) => (
          <span key={g.days} className="flex items-start gap-2 lg:items-center">
            <ClockIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold lg:mt-0" />
            <span className="flex flex-col lg:flex-row lg:gap-1">
              <span>{g.days}<span className="hidden lg:inline"> ·</span></span>
              <span className="text-cream">{g.value}</span>
            </span>
          </span>
        ))}
      </div>

      <div className="mt-5 flex justify-center gap-3 [grid-area:btns] sm:mt-8 lg:self-start lg:justify-start">
        <ReservarButton variant="gold" size="md" label={t.cta.reservarCorto} className={compactBtn} />
        <ButtonLink href={tel} variant="outlineLight" size="md" external className={compactBtn}><PhoneIcon className="h-4 w-4" /> {t.cta.llamar}</ButtonLink>
      </div>

      {/* Vídeo "cómo venir" — al tocarlo se ve en grande aquí mismo, con sonido */}
      <div className="mt-5 [grid-area:video] sm:mt-6 lg:mt-0">
        <ComoVenirCard active={active} onOpenChange={onVideo} />
      </div>
    </div>
  );
}

function ComoVenirCard({ active, onOpenChange }: { active: boolean; onOpenChange: (open: boolean) => void }) {
  const ref = useRef<HTMLVideoElement | null>(null);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active && !open) v.play?.().catch(() => {});
    else v.pause?.();
  }, [active, open]);
  const toggle = (value: boolean) => {
    setOpen(value);
    onOpenChange(value);
  };
  return (
    <>
      <button
        type="button"
        onClick={() => toggle(true)}
        aria-label="Ver el vídeo «Cómo venir a la peluquería»"
        className="group relative mx-auto block aspect-[9/16] w-[112px] overflow-hidden rounded-[1.1rem] border border-cream/20 shadow-[0_28px_80px_-32px_rgba(0,0,0,0.85)] transition-transform duration-300 hover:scale-[1.02] focus-visible:outline focus-visible:outline-2 focus-visible:outline-gold sm:w-[150px] lg:w-full lg:max-w-[248px] lg:rounded-[1.6rem]"
      >
        <video
          ref={ref}
          src={site.comoVenir.src}
          poster={site.comoVenir.poster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-deep/70 via-transparent to-brand-deep/10" />
        <span className="absolute left-1/2 top-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-cream/15 backdrop-blur-md ring-1 ring-cream/40 transition-colors group-hover:bg-gold/90 lg:h-14 lg:w-14">
          <svg viewBox="0 0 24 24" className="ml-0.5 h-5 w-5 text-cream group-hover:text-ink lg:h-6 lg:w-6" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>
        </span>
        <span className="absolute inset-x-0 bottom-0 px-2 py-2 text-center text-[0.55rem] font-medium uppercase tracking-[0.16em] text-cream lg:py-3 lg:text-[0.7rem] lg:tracking-[0.18em]">
          Cómo venir<span className="hidden lg:inline"> · Ver vídeo</span>
        </span>
      </button>
      {open && <VideoLightbox src={site.comoVenir.src} poster={site.comoVenir.poster} onClose={() => toggle(false)} />}
    </>
  );
}

/* Vídeo a pantalla completa, con sonido y controles. Va en un portal porque las
   diapositivas tienen transform/opacity y lo recortarían. */
function VideoLightbox({ src, poster, onClose }: { src: string; poster?: string; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [onClose]);
  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Cómo venir a la peluquería"
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/90 p-4 backdrop-blur-sm"
    >
      <video
        src={src}
        poster={poster}
        autoPlay
        controls
        playsInline
        onClick={(e) => e.stopPropagation()}
        className="max-h-[86svh] w-auto max-w-full rounded-2xl shadow-2xl"
      />
      <button
        type="button"
        onClick={onClose}
        aria-label="Cerrar vídeo"
        className="absolute right-4 top-4 rounded-full bg-cream/15 p-2.5 text-cream ring-1 ring-cream/30 transition-colors hover:bg-gold hover:text-ink"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6L6 18" /></svg>
      </button>
    </div>,
    document.body,
  );
}
