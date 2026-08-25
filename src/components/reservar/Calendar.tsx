"use client";

import { useState } from "react";

const WEEKDAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/**
 * Calendario mensual para elegir el día de la cita.
 * Domingos cerrados y días pasados bloqueados; se puede avanzar de mes
 * para reservar con semanas o meses de antelación.
 */
export default function Calendar({
  value,
  onChange,
  monthsAhead = 6,
}: {
  value: string;
  onChange: (date: string) => void;
  monthsAhead?: number;
}) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const firstOfThisMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  const [view, setView] = useState(() => {
    const base = value ? new Date(`${value}T00:00:00`) : today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const lastAllowed = new Date(today.getFullYear(), today.getMonth() + monthsAhead, 1);
  const canGoBack = view > firstOfThisMonth;
  const canGoForward = view < lastAllowed;
  const move = (delta: number) => setView((v) => new Date(v.getFullYear(), v.getMonth() + delta, 1));

  // Lunes primero: convertimos el domingo (0) en la última columna.
  const offset = (new Date(view.getFullYear(), view.getMonth(), 1).getDay() + 6) % 7;
  const daysInMonth = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array.from({ length: offset }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(view.getFullYear(), view.getMonth(), i + 1)),
  ];

  return (
    <div className="rounded-2xl border border-brand/15 bg-cream-soft p-4 sm:p-5">
      {/* Cabecera con navegación de mes */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => move(-1)}
          disabled={!canGoBack}
          aria-label="Mes anterior"
          className="rounded-full border border-brand/20 p-2 text-brand transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <p className="font-display text-xl capitalize text-brand">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </p>
        <button
          type="button"
          onClick={() => move(1)}
          disabled={!canGoForward}
          aria-label="Mes siguiente"
          className="rounded-full border border-brand/20 p-2 text-brand transition-colors hover:border-gold hover:text-gold disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>

      {/* Días de la semana */}
      <div className="mt-4 grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((w) => (
          <span key={w} className="py-1 text-[0.65rem] font-medium uppercase tracking-wide text-ink-soft/70">
            {w}
          </span>
        ))}
      </div>

      {/* Cuadrícula del mes */}
      <div className="mt-1 grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={`empty-${i}`} />;
          const ds = ymd(d);
          const isSunday = d.getDay() === 0;
          const isPast = d < today;
          const disabled = isSunday || isPast;
          const selected = ds === value;
          const isToday = ds === ymd(today);

          return (
            <button
              key={ds}
              type="button"
              disabled={disabled}
              onClick={() => onChange(ds)}
              aria-label={`${d.getDate()} de ${MONTHS[d.getMonth()]}`}
              aria-pressed={selected}
              className={[
                "relative flex aspect-square items-center justify-center rounded-lg text-sm transition-all",
                selected
                  ? "bg-brand font-medium text-cream ring-2 ring-gold"
                  : disabled
                    ? "cursor-not-allowed text-ink-soft/25"
                    : "text-ink hover:bg-brand/10 hover:text-brand",
              ].join(" ")}
            >
              {d.getDate()}
              {isToday && !selected && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-gold" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      <p className="mt-3 border-t border-brand/10 pt-3 text-xs text-ink-soft/70">
        Los domingos cerramos. Usa las flechas para reservar en meses siguientes.
      </p>
    </div>
  );
}
