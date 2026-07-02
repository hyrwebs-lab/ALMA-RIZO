"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/site/ProductCard";
import { ArrowIcon } from "@/components/ui/Icons";
import { products as seedProducts, type Product } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function ProductsPreview({ products }: { products?: Product[] }) {
  const t = useT();
  const active = (products ?? seedProducts).filter((p) => p.active).slice(0, 4);
  return (
    <section id="productos" className="bg-cream-deep py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-6 sm:px-8">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="gold-rule eyebrow mb-5 justify-center text-gold">{t.products.eyebrow}</p>
          <h2 className="font-display text-4xl text-brand sm:text-5xl">{t.products.title}</h2>
          <p className="mt-4 text-lg text-ink-soft">
            {t.products.sub}
          </p>
        </Reveal>

        <div className="mt-14 grid gap-7 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((p, i) => (
            <Reveal key={p.slug} delay={i * 90}>
              <ProductCard product={p} />
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-12 text-center">
          <Link href="/productos" className="inline-flex items-center gap-2 text-[0.78rem] font-medium uppercase tracking-[0.2em] text-brand transition-colors hover:text-gold">
            {t.products.verTodos} <ArrowIcon className="h-4 w-4" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
