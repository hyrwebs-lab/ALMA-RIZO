"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const KEY = "almarizo_cookies_ok";

export default function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {
      /* ignore */
    }
  }, []);

  if (!show) return null;

  const accept = () => {
    try {
      localStorage.setItem(KEY, "1");
    } catch {
      /* ignore */
    }
    setShow(false);
  };

  return (
    <div className="fixed inset-x-3 bottom-24 z-40 mx-auto max-w-2xl rounded-2xl border border-gold/30 bg-brand/95 p-4 text-cream shadow-2xl backdrop-blur sm:inset-x-4 sm:bottom-4 sm:flex sm:items-center sm:gap-4">
      <p className="text-sm text-cream/85">
        Usamos cookies necesarias para el funcionamiento de la web. Consulta
        nuestra{" "}
        <Link href="/cookies" className="text-gold underline">política de cookies</Link>.
      </p>
      <button
        onClick={accept}
        className="mt-3 w-full shrink-0 rounded-full bg-gold px-5 py-2.5 text-[0.72rem] font-medium uppercase tracking-[0.16em] text-brand-deep transition-colors hover:bg-gold-soft sm:mt-0 sm:w-auto"
      >
        Aceptar
      </button>
    </div>
  );
}
