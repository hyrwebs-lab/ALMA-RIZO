"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { formatDuration, formatPrice, whatsappUrl } from "@/lib/utils";
import { site } from "@/lib/site";
import { Button } from "@/components/ui/Button";
import { ArrowIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { getBookingDataAction, getAvailabilityAction, createReservationAction } from "@/app/actions";

type Svc = { slug: string; name: string; tagline: string; description: string; durationMin: number; price: number; image: string };

const STEPS = ["Servicio", "Estilista", "Fecha y hora", "Tus datos", "Confirmar"];

function upcomingDates(count = 21) {
  const out: Date[] = [];
  const today = new Date();
  for (let i = 0; i < 70 && out.length < count; i++) {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() + i);
    if (d.getDay() !== 0) out.push(d); // domingo cerrado
  }
  return out;
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function prettyDate(dStr: string) {
  const d = new Date(dStr + "T00:00:00");
  return d.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
}

export default function ReservarClient() {
  const params = useSearchParams();
  const preselect = params.get("servicio");

  const [step, setStep] = useState(0);
  const [serviceSlug, setServiceSlug] = useState<string | null>(preselect);
  const [workerId, setWorkerId] = useState<string>("sin-preferencia");
  const [date, setDate] = useState<string>("");
  const [time, setTime] = useState<string>("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", notes: "" });
  const [done, setDone] = useState<null | { id: string }>(null);

  const [services, setServices] = useState<Svc[]>([]);
  const [workers, setWorkers] = useState<{ id: string; name: string }[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    getBookingDataAction().then((d) => {
      setServices(d.services as unknown as Svc[]);
      setWorkers((d.workers as { id: string; name: string }[]).map((w) => ({ id: w.id, name: w.name })));
      setLoaded(true);
    });
  }, []);

  const service = services.find((s) => s.slug === serviceSlug) || null;
  const dates = useMemo(() => upcomingDates(), []);

  useEffect(() => {
    if (!date || !service) {
      setSlots([]);
      return;
    }
    setSlotsLoading(true);
    let alive = true;
    getAvailabilityAction(date, workerId, service.durationMin).then((s) => {
      if (alive) {
        setSlots(s);
        setSlotsLoading(false);
        setTime((prev) => (s.includes(prev) ? prev : ""));
      }
    });
    return () => {
      alive = false;
    };
  }, [date, service, workerId]);

  if (!loaded) {
    return <div className="py-32 text-center text-ink-soft">Cargando…</div>;
  }

  const canNext =
    (step === 0 && !!service) ||
    (step === 1 && !!workerId) ||
    (step === 2 && !!date && !!time) ||
    (step === 3 && form.name.trim().length > 1 && form.phone.trim().length >= 6) ||
    step === 4;

  const workerName =
    workerId === "sin-preferencia"
      ? "Sin preferencia"
      : workers.find((w) => w.id === workerId)?.name ?? "Sin preferencia";

  async function confirm() {
    if (!service || submitting) return;
    setSubmitting(true);
    setError("");
    const res = await createReservationAction({
      serviceSlug: service.slug,
      workerId,
      date,
      time,
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      notes: form.notes.trim(),
    });
    setSubmitting(false);
    if (res.ok) {
      setDone({ id: res.reservation.id });
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setError(res.error);
      setStep(2); // volver a fecha/hora para reelegir
    }
  }

  /* ---------- SUCCESS ---------- */
  if (done) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-20 text-center sm:px-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-gold/20 text-gold">
          <svg viewBox="0 0 24 24" className="h-8 w-8" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h1 className="mt-6 font-display text-4xl text-brand">¡Reserva recibida!</h1>
        <p className="mt-3 text-ink-soft">
          Hemos registrado tu solicitud. Te confirmaremos la cita por WhatsApp lo antes posible.
        </p>

        <div className="mt-8 rounded-2xl border border-brand/10 bg-cream-soft p-6 text-left">
          <Row k="Servicio" v={service?.name ?? ""} />
          <Row k="Estilista" v={workerName} />
          <Row k="Fecha" v={prettyDate(date)} />
          <Row k="Hora" v={time} />
          <Row k="A nombre de" v={form.name} />
        </div>

        {/* Vídeo "cómo venir preparada" */}
        <div className="mt-8 rounded-2xl border border-gold/40 bg-cream p-6 text-left">
          <p className="eyebrow text-gold">Antes de tu cita</p>
          <h2 className="mt-2 font-display text-2xl text-brand">Cómo venir preparada</h2>
          <p className="mt-2 text-sm text-ink-soft">
            Mira este vídeo corto para sacar el máximo partido a tu cita. También te lo enviaremos por WhatsApp.
          </p>
          {site.prepVideoUrl ? (
            <a href={site.prepVideoUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block">
              <Button variant="solid" size="sm">Ver el vídeo</Button>
            </a>
          ) : (
            <div className="mt-4 flex aspect-video items-center justify-center rounded-lg border border-dashed border-brand/30 bg-cream-soft text-center text-xs text-ink-soft/70">
              ▶ Vídeo pendiente de recibir
            </div>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-4">
          <a href={whatsappUrl(`Hola, acabo de reservar ${service?.name} para el ${prettyDate(date)} a las ${time}.`)} target="_blank" rel="noopener noreferrer">
            <Button variant="gold" size="md"><WhatsAppIcon className="h-4 w-4" /> Escribir por WhatsApp</Button>
          </a>
          <Link href="/"><Button variant="outline" size="md">Volver al inicio</Button></Link>
        </div>
      </div>
    );
  }

  /* ---------- WIZARD ---------- */
  return (
    <div className="mx-auto max-w-3xl px-6 py-12 sm:px-8 md:py-16">
      {/* Progress */}
      <ol className="mb-10 flex flex-wrap items-center justify-center gap-2 text-xs sm:gap-3">
        {STEPS.map((label, i) => (
          <li key={label} className="flex items-center gap-2">
            <span
              className={`flex h-7 w-7 items-center justify-center rounded-full text-[0.7rem] font-medium transition-colors ${
                i < step ? "bg-gold text-brand-deep" : i === step ? "bg-brand text-cream" : "bg-brand/10 text-ink-soft"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            <span className={`hidden sm:inline ${i === step ? "text-brand" : "text-ink-soft"}`}>{label}</span>
            {i < STEPS.length - 1 && <span className="h-px w-4 bg-brand/20 sm:w-6" />}
          </li>
        ))}
      </ol>

      <div className="min-h-[320px] rounded-3xl border border-brand/10 bg-white/60 p-6 shadow-[0_1px_0_0_rgba(200,168,104,0.25)] sm:p-8">
        {/* STEP 1: Servicio */}
        {step === 0 && (
          <div>
            <h2 className="font-display text-3xl text-brand">Elige tu servicio</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {services.map((s) => (
                <button
                  key={s.slug}
                  onClick={() => setServiceSlug(s.slug)}
                  className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
                    serviceSlug === s.slug ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-brand/15 hover:border-brand/40"
                  }`}
                >
                  <span className="font-display text-xl text-brand">{s.name}</span>
                  <span className="mt-1 text-sm text-ink-soft">{s.tagline}</span>
                  <span className="mt-3 flex w-full items-center justify-between text-sm">
                    <span className="text-ink-soft">{formatDuration(s.durationMin)}</span>
                    <span className="font-display text-lg text-brand">{formatPrice(s.price)}</span>
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Estilista */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-3xl text-brand">¿Con quién prefieres?</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <ChoiceCard active={workerId === "sin-preferencia"} onClick={() => setWorkerId("sin-preferencia")} title="Sin preferencia" subtitle="La primera disponible" />
              {workers.map((w) => (
                <ChoiceCard key={w.id} active={workerId === w.id} onClick={() => setWorkerId(w.id)} title={w.name} subtitle="Especialista en rizo" />
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Fecha y hora */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-3xl text-brand">Fecha y hora</h2>
            <p className="mt-1 text-sm text-ink-soft">Domingos cerrado. Horarios según disponibilidad.</p>
            {error && <p className="mt-3 rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
            <div className="mt-5 flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {dates.map((d) => {
                const ds = ymd(d);
                const sel = ds === date;
                return (
                  <button
                    key={ds}
                    onClick={() => { setDate(ds); setTime(""); }}
                    className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-all ${
                      sel ? "border-gold bg-brand text-cream" : "border-brand/15 hover:border-brand/40"
                    }`}
                  >
                    <span className="text-[0.65rem] uppercase tracking-wide opacity-70">{d.toLocaleDateString("es-ES", { weekday: "short" })}</span>
                    <span className="font-display text-xl">{d.getDate()}</span>
                    <span className="text-[0.65rem] opacity-70">{d.toLocaleDateString("es-ES", { month: "short" })}</span>
                  </button>
                );
              })}
            </div>

            {date && (
              <div className="mt-6">
                <p className="text-sm text-ink-soft">Horas disponibles para <span className="text-brand">{prettyDate(date)}</span>:</p>
                {slotsLoading ? (
                  <p className="mt-3 text-sm text-ink-soft/70">Cargando horas disponibles…</p>
                ) : slots.length === 0 ? (
                  <p className="mt-3 text-sm text-ink-soft/70">No quedan huecos ese día. Prueba otra fecha o escríbenos por WhatsApp.</p>
                ) : (
                  <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
                    {slots.map((t) => (
                      <button
                        key={t}
                        onClick={() => setTime(t)}
                        className={`rounded-lg border py-2 text-sm transition-all ${
                          time === t ? "border-gold bg-gold/10 text-brand" : "border-brand/15 hover:border-brand/40"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* STEP 4: Datos + notas */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-3xl text-brand">Tus datos</h2>
            <div className="mt-6 grid gap-4">
              <Field label="Nombre y apellidos *">
                <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Teléfono *">
                  <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="600 000 000" inputMode="tel" />
                </Field>
                <Field label="Email">
                  <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" inputMode="email" />
                </Field>
              </div>
              <Field label="Notas sobre tu cabello o preferencias">
                <textarea className={`${inputCls} h-28 resize-none`} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Tipo de rizo, lo que buscas, alergias, etc." />
              </Field>
            </div>
          </div>
        )}

        {/* STEP 5: Confirmar */}
        {step === 4 && service && (
          <div>
            <h2 className="font-display text-3xl text-brand">Revisa y confirma</h2>
            <div className="mt-6 rounded-2xl border border-brand/10 bg-cream-soft p-6">
              <Row k="Servicio" v={`${service.name} · ${formatDuration(service.durationMin)}`} />
              <Row k="Precio" v={formatPrice(service.price)} />
              <Row k="Estilista" v={workerName} />
              <Row k="Fecha" v={prettyDate(date)} />
              <Row k="Hora" v={time} />
              <Row k="Nombre" v={form.name} />
              <Row k="Teléfono" v={form.phone} />
              {form.email && <Row k="Email" v={form.email} />}
              {form.notes && <Row k="Notas" v={form.notes} />}
            </div>
            <p className="mt-4 text-xs text-ink-soft/70">
              Al confirmar, registramos tu solicitud. Te avisaremos por WhatsApp para confirmar el hueco.
            </p>
          </div>
        )}
      </div>

      {/* Nav */}
      <div className="mt-10 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`text-sm uppercase tracking-widest text-ink-soft transition-colors hover:text-brand ${step === 0 ? "invisible" : ""}`}
        >
          ← Atrás
        </button>
        {step < STEPS.length - 1 ? (
          <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext} variant="gold" size="md">
            Continuar <ArrowIcon className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={confirm} disabled={submitting} variant="gold" size="lg">
            {submitting ? "Confirmando…" : "Confirmar reserva"}
          </Button>
        )}
      </div>
    </div>
  );
}

const inputCls =
  "w-full rounded-lg border border-brand/20 bg-cream-soft px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">{label}</span>
      {children}
    </label>
  );
}

function ChoiceCard({ active, onClick, title, subtitle }: { active: boolean; onClick: () => void; title: string; subtitle: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-start rounded-2xl border p-5 text-left transition-all ${
        active ? "border-gold bg-gold/5 ring-1 ring-gold" : "border-brand/15 hover:border-brand/40"
      }`}
    >
      <span className="font-display text-xl text-brand">{title}</span>
      <span className="mt-1 text-sm text-ink-soft">{subtitle}</span>
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-brand/10 py-2 text-sm last:border-0">
      <span className="text-ink-soft">{k}</span>
      <span className="text-right font-medium text-ink">{v}</span>
    </div>
  );
}
