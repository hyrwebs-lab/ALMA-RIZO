"use client";

import { useEffect, useRef, useState } from "react";
import Stars from "@/components/ui/Stars";
import type { Review } from "@/lib/site";

function initials(name: string) {
  return name
    .replace(/[^\p{L}\s.]/gu, "")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");
}

export default function ReviewsCarousel({ reviews }: { reviews: Review[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const scrollToCard = (i: number) => {
    const track = trackRef.current;
    if (!track) return;
    const card = track.children[i] as HTMLElement | undefined;
    if (card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
  };

  const nudge = (dir: 1 | -1) => {
    const next = Math.max(0, Math.min(reviews.length - 1, active + dir));
    scrollToCard(next);
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onScroll = () => {
      const cards = Array.from(track.children) as HTMLElement[];
      const center = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let min = Infinity;
      cards.forEach((c, i) => {
        const cc = c.offsetLeft - track.offsetLeft + c.clientWidth / 2;
        const d = Math.abs(cc - center);
        if (d < min) {
          min = d;
          closest = i;
        }
      });
      setActive(closest);
    };
    track.addEventListener("scroll", onScroll, { passive: true });
    return () => track.removeEventListener("scroll", onScroll);
  }, [reviews.length]);

  return (
    <div className="relative">
      {/* Track */}
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {reviews.map((r, i) => (
          <figure
            key={i}
            className="flex min-w-[85%] snap-center flex-col rounded-2xl bg-cream-soft/[0.06] p-8 backdrop-blur-sm ring-1 ring-cream/15 sm:min-w-[46%] lg:min-w-[31%]"
          >
            <span className="font-display text-6xl leading-none text-gold/60">“</span>
            <Stars rating={r.rating} size={18} className="-mt-3" />
            <blockquote className="mt-4 flex-1 text-lg leading-relaxed text-cream/90">
              {r.text}
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3 border-t border-cream/15 pt-5">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gold/20 font-display text-lg text-gold-soft">
                {initials(r.name)}
              </span>
              <span>
                <span className="block text-sm font-medium text-cream">{r.name}</span>
                {r.source && (
                  <span className="block text-xs text-cream/50">vía {r.source}</span>
                )}
              </span>
            </figcaption>
          </figure>
        ))}
      </div>

      {/* Controls */}
      <div className="mt-8 flex items-center justify-center gap-5">
        <button
          onClick={() => nudge(-1)}
          aria-label="Anterior"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
          disabled={active === 0}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>

        <div className="flex items-center gap-2">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollToCard(i)}
              aria-label={`Reseña ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === active ? "w-7 bg-gold" : "w-1.5 bg-cream/30 hover:bg-cream/50"
              }`}
            />
          ))}
        </div>

        <button
          onClick={() => nudge(1)}
          aria-label="Siguiente"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-cream/30 text-cream transition-colors hover:border-gold hover:text-gold disabled:opacity-30"
          disabled={active === reviews.length - 1}
        >
          <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6" /></svg>
        </button>
      </div>
    </div>
  );
}
