"use client";

import Reveal from "@/components/ui/Reveal";
import ReviewsCarousel from "@/components/site/ReviewsCarousel";
import Stars from "@/components/ui/Stars";
import { reviews as seedReviews, type Review } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function Reviews({ reviews }: { reviews?: Review[] }) {
  const t = useT();
  // Requisito de la dueña: mostrar solo reseñas de 4.5★ o más.
  const filtered = (reviews ?? seedReviews).filter((r) => r.rating >= 4.5);
  const avg =
    filtered.reduce((a, r) => a + r.rating, 0) / (filtered.length || 1);

  return (
    <section id="resenas" className="bg-brand py-20 text-cream md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.reviews.eyebrow}</p>
          <h2 className="font-display text-4xl sm:text-5xl">
            {t.reviews.title}
          </h2>
          <div className="mt-5 flex items-center justify-center gap-3">
            <Stars rating={avg} size={20} />
            <span className="text-sm text-cream/70">
              {avg.toFixed(1)} · {filtered.length} {t.reviews.destacadas}
            </span>
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <ReviewsCarousel reviews={filtered} />
        </Reveal>
      </div>
    </section>
  );
}
