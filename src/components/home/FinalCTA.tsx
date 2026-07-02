"use client";

import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon, ArrowIcon } from "@/components/ui/Icons";
import { whatsappUrl } from "@/lib/utils";
import { useT } from "@/lib/i18n";

export default function FinalCTA() {
  const t = useT();
  return (
    <section className="relative overflow-hidden bg-brand-deep py-24 text-cream md:py-32">
      <Image
        src="/photos/brand-blur.jpg"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-20"
      />
      <div className="absolute inset-0 bg-brand-deep/70" />

      <Reveal className="relative z-10 mx-auto max-w-2xl px-6 text-center sm:px-8">
        <p className="gold-rule eyebrow mb-6 justify-center text-gold">
          {t.finalcta.eyebrow}
        </p>
        <h2 className="font-display text-4xl leading-tight sm:text-6xl">
          {t.finalcta.title}
        </h2>
        <p className="mt-5 text-lg text-cream/75">
          {t.finalcta.sub}
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
          <ButtonLink href="/reservar" variant="gold" size="lg">
            {t.cta.reservarCorto} <ArrowIcon className="h-4 w-4" />
          </ButtonLink>
          <ButtonLink href={whatsappUrl()} variant="outlineLight" size="lg" external>
            <WhatsAppIcon className="h-4 w-4" /> WhatsApp
          </ButtonLink>
        </div>
      </Reveal>
    </section>
  );
}
