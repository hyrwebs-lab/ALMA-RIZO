"use client";

import Image from "next/image";
import { InstagramIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { formatPrice, whatsappUrl } from "@/lib/utils";
import { site } from "@/lib/site";
import type { Product } from "@/lib/site";
import { useT } from "@/lib/i18n";

export default function ProductCard({ product }: { product: Product }) {
  const t = useT();
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-brand/10 bg-cream-soft transition-all duration-500 hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_30px_60px_-30px_rgba(24,59,50,0.4)]">
      <div className="relative aspect-square overflow-hidden bg-cream">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(min-width:1024px) 24vw, (min-width:640px) 45vw, 100vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-xl leading-tight text-brand">{product.name}</h3>
          <span className="shrink-0 font-display text-xl text-gold">{formatPrice(product.price)}</span>
        </div>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">{product.description}</p>
        <div className="mt-4 flex gap-2">
          <a
            href={whatsappUrl(`Hola, me interesa el producto: ${product.name}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 bg-brand px-4 py-2.5 text-[0.7rem] font-medium uppercase tracking-[0.16em] text-cream transition-colors hover:bg-brand-soft"
          >
            <WhatsAppIcon className="h-4 w-4" /> {t.cta.consultar}
          </a>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="inline-flex items-center justify-center border border-brand/20 px-3 text-brand transition-colors hover:border-gold hover:text-gold"
          >
            <InstagramIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </article>
  );
}
