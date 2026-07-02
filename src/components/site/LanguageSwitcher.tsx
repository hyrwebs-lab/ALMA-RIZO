"use client";

import { useEffect, useRef, useState } from "react";
import { LOCALES, useLang } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ light }: { light?: boolean }) {
  const { locale, setLocale } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  const current = LOCALES.find((l) => l.code === locale) ?? LOCALES[0];

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Cambiar idioma"
        className={cn(
          "flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium tracking-wide transition-colors hover:text-gold",
          light ? "text-cream/90" : "text-ink",
        )}
      >
        {current.label}
        <svg viewBox="0 0 24 24" className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </button>
      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-xl border border-brand/10 bg-cream-soft py-1 shadow-xl">
          {LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => { setLocale(l.code); setOpen(false); }}
              className={cn(
                "block w-full px-4 py-2 text-left text-sm transition-colors hover:bg-brand/5",
                l.code === locale ? "text-gold" : "text-ink",
              )}
            >
              {l.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
