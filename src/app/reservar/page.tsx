import type { Metadata } from "next";
import { Suspense } from "react";
import ReservarClient from "@/components/reservar/ReservarClient";

export const metadata: Metadata = {
  title: "Reservar cita · Cabello rizado en Tarragona",
  description:
    "Reserva tu cita en Alma Rizo en pocos pasos: elige servicio, estilista, fecha y hora.",
};

export default function ReservarPage() {
  return (
    <section className="min-h-[60vh] bg-cream-soft pt-24 md:pt-28">
      <div className="border-b border-brand/10 bg-brand py-10 text-center text-cream">
        <p className="gold-rule eyebrow mb-3 justify-center text-gold">Reservas</p>
        <h1 className="font-display text-4xl sm:text-5xl">Reserva tu cita</h1>
        <p className="mt-2 text-cream/70">Empieza a entender tu rizo en pocos pasos.</p>
      </div>
      <Suspense fallback={<div className="py-32 text-center text-ink-soft">Cargando…</div>}>
        <ReservarClient />
      </Suspense>
    </section>
  );
}
