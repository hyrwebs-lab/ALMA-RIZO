"use client";

import { useEffect, useState } from "react";
import { whatsappUrl } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/Icons";

export default function WhatsAppFloat() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      className={`group fixed bottom-5 right-5 z-50 flex items-center gap-3 transition-all duration-500 ${
        show ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
      }`}
    >
      <span className="pointer-events-none absolute right-16 hidden whitespace-nowrap rounded-full bg-brand px-4 py-2 text-xs font-medium text-cream opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100 md:block">
        ¿Hablamos? Escríbenos
      </span>
      <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_30px_-8px_rgba(37,211,102,0.8)] transition-transform duration-300 group-hover:scale-105">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </a>
  );
}
