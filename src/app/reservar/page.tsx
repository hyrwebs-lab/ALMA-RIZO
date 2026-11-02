import type { Metadata } from "next";
import ReservarWhatsApp from "@/components/reservar/ReservarWhatsApp";
import { getServices } from "@/lib/content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Reservar cita · Cabello rizado en Tarragona",
  description:
    "Pide tu cita en Alma Rizo por WhatsApp: elige servicio, escríbenos y te damos hora al momento.",
};

export default async function ReservarPage() {
  const services = await getServices();

  return (
    <section className="min-h-[60vh] bg-cream-soft pt-24 md:pt-28">
      <div className="border-b border-brand/10 bg-brand py-10 text-center text-cream">
        <p className="gold-rule eyebrow mb-3 justify-center text-gold">Reservas</p>
        <h1 className="font-display text-4xl sm:text-5xl">Reserva tu cita</h1>
        <p className="mx-auto mt-3 max-w-xl px-6 text-cream/75">
          Escríbenos por WhatsApp y te damos hora. Así valoramos tu rizo antes de la
          cita y te reservamos el tiempo que necesitas.
        </p>
      </div>
      <ReservarWhatsApp services={services} />
    </section>
  );
}
