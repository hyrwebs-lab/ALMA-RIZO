"use client";

import { useCallback, useRef, useState } from "react";
import Image from "next/image";

export default function BeforeAfterSlider({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(50);
  const dragging = useRef(false);

  const setFromClientX = useCallback((clientX: number) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(2, Math.min(98, pct)));
  }, []);

  return (
    <div
      ref={ref}
      className="group relative aspect-[4/5] w-full cursor-ew-resize select-none overflow-hidden"
      onPointerDown={(e) => {
        dragging.current = true;
        (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
        setFromClientX(e.clientX);
      }}
      onPointerMove={(e) => dragging.current && setFromClientX(e.clientX)}
      onPointerUp={() => (dragging.current = false)}
    >
      {/* After (full) */}
      <Image src={after} alt="Después" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
      <span className="absolute right-3 top-3 bg-brand/85 px-3 py-1 eyebrow text-cream">Después</span>

      {/* Before (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <Image src={before} alt="Antes" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
        <span className="absolute left-3 top-3 bg-ink/80 px-3 py-1 eyebrow text-cream">Antes</span>
      </div>

      {/* Handle */}
      <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
        <div className="absolute inset-y-0 -translate-x-1/2 border-l border-cream/90" />
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-cream text-brand shadow-lg">
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 6l-6 6 6 6M15 6l6 6-6 6" />
          </svg>
        </div>
      </div>

      {label && (
        <span className="absolute bottom-3 left-3 font-display text-lg text-cream drop-shadow">
          {label}
        </span>
      )}
    </div>
  );
}
