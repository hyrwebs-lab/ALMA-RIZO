"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { nav, site } from "@/lib/site";
import { cn, telUrl } from "@/lib/utils";
import {
  PhoneIcon,
  InstagramIcon,
  TikTokIcon,
  MenuIcon,
  CloseIcon,
  CalendarIcon,
} from "@/components/ui/Icons";
import { ButtonLink } from "@/components/ui/Button";
import { useT } from "@/lib/i18n";
import LanguageSwitcher from "@/components/site/LanguageSwitcher";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const overHero = pathname === "/" && !scrolled;
  const t = useT();
  const label = (href: string): string =>
    ({
      "/": t.nav.inicio,
      "/servicios": t.nav.servicios,
      "/galeria": t.nav.transformaciones,
      "/productos": t.nav.productos,
      "/sobre-mi": t.nav.sobremi,
      "/contacto": t.nav.contacto,
    })[href] ?? "";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        overHero
          ? "bg-transparent py-5"
          : "bg-cream-soft/92 backdrop-blur-md py-3 shadow-[0_1px_0_0_rgba(200,168,104,0.4)]",
      )}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 sm:px-8">
        {/* Logo */}
        <Link href="/" className="relative z-50 shrink-0 justify-self-start" aria-label="Alma Rizo, inicio">
          <Image
            src={overHero ? "/logos/logo-light.png" : "/logos/logo-green.png"}
            alt="Alma Rizo · Curly Studio"
            width={1242}
            height={594}
            priority
            sizes="(min-width: 640px) 200px, 160px"
            className="h-16 w-auto sm:h-[4.5rem]"
          />
        </Link>

        {/* Desktop nav (centrado, píldora en el activo) */}
        <nav className="hidden items-center justify-center gap-0.5 md:flex lg:gap-1">
          {nav.filter((item) => item.href !== "/").map((item) => {
            const base = item.href.split("#")[0];
            const active =
              item.href === "/" ? pathname === "/" : base !== "/" && pathname.startsWith(base);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-full px-3 py-2 text-[0.82rem] font-medium transition-colors lg:px-4 lg:text-[0.88rem]",
                  active
                    ? overHero
                      ? "bg-cream/15 text-cream"
                      : "bg-brand/10 text-brand"
                    : overHero
                      ? "text-cream/85 hover:text-gold"
                      : "text-ink hover:text-gold",
                )}
              >
                {label(item.href)}
              </Link>
            );
          })}
        </nav>

        {/* Right actions */}
        <div className="flex items-center justify-self-end gap-2 sm:gap-3">
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className={cn(
              "hidden transition-colors hover:text-gold xl:inline-flex",
              overHero ? "text-cream/90" : "text-ink",
            )}
          >
            <InstagramIcon className="h-5 w-5" />
          </a>

          <span className="hidden md:block">
            <LanguageSwitcher light={overHero} />
          </span>
          <ButtonLink href="/reservar" variant="gold" size="sm" className="hidden sm:inline-flex">
            <CalendarIcon className="h-4 w-4" /> {t.cta.reserva}
          </ButtonLink>
          <ButtonLink
            href={telUrl()}
            variant={overHero ? "outlineLight" : "outline"}
            size="sm"
            external
            className="hidden lg:inline-flex"
          >
            <PhoneIcon className="h-4 w-4" /> {t.cta.llamar}
          </ButtonLink>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            className={cn(
              "relative z-50 p-1 md:hidden",
              open ? "text-cream" : overHero ? "text-cream" : "text-ink",
            )}
          >
            {open ? <CloseIcon className="h-7 w-7" /> : <MenuIcon className="h-7 w-7" />}
          </button>
        </div>
      </div>

      {/* Mobile overlay menu */}
      <div
        className={cn(
          "fixed inset-0 z-40 flex flex-col bg-brand transition-[opacity,visibility] duration-400 md:hidden",
          open ? "visible opacity-100" : "invisible opacity-0",
        )}
      >
        <nav className="flex flex-1 flex-col items-center justify-center gap-6">
          {nav.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="font-display text-3xl text-cream transition-colors hover:text-gold"
              style={{
                transitionDelay: open ? `${100 + i * 50}ms` : "0ms",
                transform: open ? "none" : "translateY(10px)",
                opacity: open ? 1 : 0,
                transitionProperty: "opacity, transform, color",
                transitionDuration: "500ms",
              }}
            >
              {label(item.href)}
            </Link>
          ))}
          <ButtonLink href="/reservar" variant="gold" size="lg" className="mt-4">
            {t.cta.reservar}
          </ButtonLink>
          <div className="mt-5 text-cream">
            <LanguageSwitcher light />
          </div>
          <div className="mt-4 flex items-center gap-6 text-cream/80">
            <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <InstagramIcon className="h-6 w-6" />
            </a>
            <a href={site.social.tiktok} target="_blank" rel="noopener noreferrer" aria-label="TikTok">
              <TikTokIcon className="h-6 w-6" />
            </a>
            <a href={telUrl()} aria-label="Llamar">
              <PhoneIcon className="h-6 w-6" />
            </a>
          </div>
        </nav>
      </div>
    </header>
  );
}
