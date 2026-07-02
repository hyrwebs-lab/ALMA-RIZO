"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  useAdminData as useStoreData,
  useSession,
  login,
  logout,
  setReservationStatus,
  deleteReservation,
  createReservationAdmin,
  getAvailability,
  saveServices,
  saveReviews,
  saveGallery,
  saveBeforeAfter,
  saveWorkers,
  saveProducts,
  saveNews,
  saveSettings,
  markMessageRead,
  loadData,
} from "@/lib/adminClient";
import {
  uid,
  can,
  ROLE_LABEL,
  type Role,
  type Worker,
  type ReservationStatus,
  type Settings,
} from "@/lib/store";
import type { Service, Review, Product, News } from "@/lib/site";
import { formatDuration, formatPrice } from "@/lib/utils";
import { WhatsAppIcon, PhoneIcon } from "@/components/ui/Icons";

type View =
  | "resumen"
  | "reservas"
  | "servicios"
  | "antesdespues"
  | "productos"
  | "novedades"
  | "resenas"
  | "galeria"
  | "trabajadores"
  | "mensajes"
  | "ajustes"
  | "usuarios";

type Pair = { before: string; after: string; label: string };

const PHOTO_POOL = [
  "/photos/real-portrait.jpg",
  "/photos/real-despues-rizo.jpg",
  "/photos/real-antes-rizo.jpg",
  "/photos/real-definicion.jpg",
  "/photos/real-diagnostico.jpg",
  "/photos/real-elasticidad.jpg",
  "/photos/real-proteina.jpg",
  "/photos/real-salon.jpg",
];

const STATUS_STYLE: Record<ReservationStatus, string> = {
  pendiente: "bg-amber-100 text-amber-800",
  confirmada: "bg-emerald-100 text-emerald-800",
  completada: "bg-[#c8a868]/20 text-[#8a6d2f]",
  cancelada: "bg-rose-100 text-rose-700 line-through",
};

const inputCls =
  "w-full border border-brand/20 bg-cream-soft px-3 py-2 text-ink outline-none transition-colors focus:border-gold";

export default function AdminApp() {
  const { session, ready } = useSession();
  if (!ready) return <div className="grid min-h-screen place-items-center text-ink-soft">Cargando…</div>;
  if (!session) return <LoginScreen />;
  return <Dashboard role={session.role} name={session.name} />;
}

/* ----------------- LOGIN ----------------- */
function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const ok = await login(email, password);
    if (!ok) setError("Email o contraseña incorrectos.");
  }

  return (
    <div className="grid min-h-screen place-items-center bg-brand px-6 py-16">
      <div className="w-full max-w-md">
        <div className="text-center">
          <p className="gold-rule eyebrow mb-3 justify-center text-gold">Panel de gestión</p>
          <h1 className="font-display text-4xl text-cream">Alma Rizo · Admin</h1>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4 bg-cream-soft p-7">
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">Email</span>
            <input className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@almarizo.com" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">Contraseña</span>
            <input type="password" className={inputCls} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••" />
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button className="w-full bg-brand px-6 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-cream transition-colors hover:bg-brand-soft">
            Entrar
          </button>
        </form>

        <p className="mt-5 text-center text-xs text-cream/50">
          <Link href="/" className="hover:text-gold">← Volver a la web</Link>
        </p>
      </div>
    </div>
  );
}

/* ----------------- DASHBOARD ----------------- */
function Dashboard({ role, name }: { role: Role; name: string }) {
  const [view, setView] = useState<View>(role === "worker" ? "reservas" : "resumen");
  const [menuOpen, setMenuOpen] = useState(false);
  const loaded = useStoreData();

  const allNav: { id: View; label: string; show: boolean }[] = [
    { id: "resumen", label: "Resumen", show: true },
    { id: "reservas", label: "Agenda (citas)", show: can.manageReservations(role) },
    { id: "servicios", label: "Servicios y precios", show: can.manageContent(role) },
    { id: "antesdespues", label: "Antes / Después", show: can.manageContent(role) },
    { id: "productos", label: "Productos", show: can.manageContent(role) },
    { id: "novedades", label: "Novedades", show: can.manageContent(role) },
    { id: "resenas", label: "Reseñas", show: can.manageContent(role) },
    { id: "galeria", label: "Galería", show: can.manageContent(role) },
    { id: "trabajadores", label: "Trabajadores", show: can.manageWorkers(role) },
    { id: "mensajes", label: "Mensajes", show: can.manageContent(role) },
    { id: "ajustes", label: "Datos de contacto", show: can.manageContent(role) },
    { id: "usuarios", label: "Usuarios y roles", show: can.manageUsers(role) },
  ];
  const nav = allNav.filter((n) => n.show);

  if (!loaded) {
    return <div className="grid min-h-screen place-items-center text-ink-soft">Cargando datos…</div>;
  }

  return (
    <div className="min-h-screen bg-cream-soft text-ink">
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-brand/10 bg-cream-soft/95 px-5 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <button onClick={() => setMenuOpen((v) => !v)} className="lg:hidden" aria-label="Menú">
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
          </button>
          <span className="font-display text-xl text-brand">Alma Rizo · Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden rounded-full bg-brand/10 px-3 py-1 text-xs text-brand sm:inline">{name} · {ROLE_LABEL[role]}</span>
          <Link href="/" className="text-xs uppercase tracking-widest text-ink-soft hover:text-brand">Ver web</Link>
          <button onClick={logout} className="text-xs uppercase tracking-widest text-rose-600 hover:underline">Salir</button>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl gap-6 px-4 py-6 sm:px-6">
        <aside className={`${menuOpen ? "block" : "hidden"} lg:block`}>
          <nav className="sticky top-20 w-56 shrink-0 space-y-1">
            {nav.map((n) => (
              <button
                key={n.id}
                onClick={() => { setView(n.id); setMenuOpen(false); }}
                className={`block w-full rounded-md px-4 py-2.5 text-left text-sm transition-colors ${
                  view === n.id ? "bg-brand text-cream" : "text-ink-soft hover:bg-brand/5 hover:text-brand"
                }`}
              >
                {n.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 flex-1">
          {view === "resumen" && <Resumen role={role} onGo={setView} />}
          {view === "reservas" && <Reservas role={role} />}
          {view === "servicios" && <ServiciosEditor />}
          {view === "antesdespues" && <AntesDespuesEditor />}
          {view === "productos" && <ProductosEditor />}
          {view === "novedades" && <NovedadesEditor />}
          {view === "resenas" && <ResenasEditor />}
          {view === "galeria" && <GaleriaEditor />}
          {view === "trabajadores" && <TrabajadoresEditor />}
          {view === "mensajes" && <Mensajes />}
          {view === "ajustes" && <AjustesEditor />}
          {view === "usuarios" && <Usuarios />}
        </main>
      </div>
    </div>
  );
}

/* ----------------- SHARED ----------------- */
function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function SaveBar({ onSave, saved }: { onSave: () => void; saved: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <button onClick={onSave} className="bg-brand px-5 py-2.5 text-xs uppercase tracking-widest text-cream hover:bg-brand-soft">Guardar cambios</button>
      {saved && <span className="text-sm text-emerald-600">✓ Guardado</span>}
    </div>
  );
}
function PhotoSelect({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex items-center gap-2">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={value} alt="" className="h-12 w-10 shrink-0 rounded object-cover" />
      <select className={inputCls} value={value} onChange={(e) => onChange(e.target.value)}>
        {PHOTO_POOL.map((p) => (
          <option key={p} value={p}>{p.replace("/photos/", "").replace(".jpg", "")}</option>
        ))}
      </select>
    </div>
  );
}

/* ----------------- RESUMEN ----------------- */
function Resumen({ role, onGo }: { role: Role; onGo: (v: View) => void }) {
  const data = useStoreData();
  if (!data) return null;
  const today = todayStr();
  const citasHoy = data.reservations.filter((r) => r.date === today && r.status !== "cancelada");
  const pendientes = data.reservations.filter((r) => r.status === "pendiente");
  const proximas = data.reservations.filter((r) => r.date >= today && r.status !== "cancelada");
  const sinLeer = data.messages.filter((m) => !m.read);

  const cards = [
    { label: "Citas hoy", value: citasHoy.length, go: "reservas" as View, show: true },
    { label: "Pendientes de confirmar", value: pendientes.length, go: "reservas" as View, show: true },
    { label: "Próximas citas", value: proximas.length, go: "reservas" as View, show: true },
    { label: "Mensajes sin leer", value: sinLeer.length, go: "mensajes" as View, show: can.manageContent(role) },
  ].filter((c) => c.show);

  return (
    <div>
      <h1 className="font-display text-3xl text-brand">Hola de nuevo 👋</h1>
      <p className="mt-1 text-ink-soft">Este es el resumen de tu salón.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <button key={c.label} onClick={() => onGo(c.go)} className="rounded-lg border border-brand/10 bg-white p-5 text-left transition-shadow hover:shadow-md">
            <div className="font-display text-4xl text-brand">{c.value}</div>
            <div className="mt-1 text-sm text-ink-soft">{c.label}</div>
          </button>
        ))}
      </div>

      <h2 className="mt-10 font-display text-2xl text-brand">Citas de hoy</h2>
      {citasHoy.length === 0 ? (
        <p className="mt-3 text-sm text-ink-soft">No hay citas para hoy.</p>
      ) : (
        <div className="mt-3 divide-y divide-brand/10 rounded-lg border border-brand/10 bg-white">
          {citasHoy.sort((a, b) => a.time.localeCompare(b.time)).map((r) => (
            <div key={r.id} className="flex items-center justify-between px-4 py-3">
              <div>
                <span className="font-medium text-ink">{r.time}</span>
                <span className="mx-2 text-ink-soft">·</span>
                <span className="text-ink">{r.name}</span>
                <span className="mx-2 text-ink-soft">·</span>
                <span className="text-sm text-ink-soft">{r.serviceName}</span>
              </div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[r.status as ReservationStatus]}`}>{r.status}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ----------------- AGENDA / RESERVAS ----------------- */
type Cita = {
  id: string; name: string; phone: string; email?: string;
  serviceName: string; serviceSlug: string; price: number; durationMin: number;
  workerId: string; workerName: string; date: string; time: string; notes?: string; status: string;
};

const pad2 = (n: number) => String(n).padStart(2, "0");
const todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const shiftISO = (iso: string, days: number) => { const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + days); return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`; };
const fmtLong = (iso: string) => new Date(iso + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" });
// Horario del salón — espejo de HOURS en db.ts (0=Dom..6=Sáb), en minutos desde medianoche.
const BUSINESS_HOURS: ([number, number] | null)[] = [null, [570, 1110], [570, 1110], [570, 1110], [570, 1170], [570, 1170], [570, 810]];
function daySlots(iso: string): string[] {
  const h = BUSINESS_HOURS[new Date(iso + "T00:00:00").getDay()];
  if (!h) return [];
  const out: string[] = [];
  for (let m = h[0]; m < h[1]; m += 30) out.push(`${pad2(Math.floor(m / 60))}:${pad2(m % 60)}`);
  return out;
}
function waReminderUrl(phone: string, r: { name: string; date: string; time: string; serviceName: string }): string {
  const digits = (phone || "").replace(/\D/g, "");
  const num = digits.length === 9 ? "34" + digits : digits;
  const msg = `Hola ${r.name}, te recordamos tu cita en Alma Rizo el ${fmtLong(r.date)} a las ${r.time} (${r.serviceName}). ¡Te esperamos! Si necesitas cambiarla, responde a este mensaje 🌿`;
  return `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
}

const STATUS_BAR: Record<ReservationStatus, string> = {
  pendiente: "border-amber-400 bg-amber-50",
  confirmada: "border-emerald-400 bg-emerald-50",
  completada: "border-[#c8a868] bg-[#c8a868]/10",
  cancelada: "border-rose-300 bg-rose-50",
};

function Reservas({ role }: { role: Role }) {
  const data = useStoreData();
  const [mode, setMode] = useState<"calendario" | "lista">("calendario");
  const [day, setDay] = useState<string>(todayISO());
  const [filter, setFilter] = useState<"todas" | ReservationStatus>("todas");
  const [detail, setDetail] = useState<Cita | null>(null);
  const [add, setAdd] = useState<{ open: boolean; workerId?: string; time?: string; date?: string }>({ open: false });
  const isWorker = role === "worker";
  if (!data) return null;

  const workers: { id: string; name: string }[] = data.workers.filter((w) => w.active).map((w) => ({ id: w.id, name: w.name }));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Agenda de citas</h1>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-full border border-brand/20 text-sm">
            <button onClick={() => setMode("calendario")} className={`px-3.5 py-1.5 transition-colors ${mode === "calendario" ? "bg-brand text-cream" : "bg-white text-ink-soft hover:text-brand"}`}>Calendario</button>
            <button onClick={() => setMode("lista")} className={`px-3.5 py-1.5 transition-colors ${mode === "lista" ? "bg-brand text-cream" : "bg-white text-ink-soft hover:text-brand"}`}>Lista</button>
          </div>
          <button onClick={() => setAdd({ open: true, date: day })} className="rounded-full bg-gold px-4 py-1.5 text-sm font-medium text-brand-deep transition-colors hover:bg-gold-soft">+ Añadir cita</button>
        </div>
      </div>

      {isWorker && (
        <p className="mt-3 rounded-md bg-brand/5 px-3 py-2 text-xs text-ink-soft">
          Tu acceso es solo a la <b>agenda</b>: ver, añadir y confirmar citas. No puedes editar la web, precios ni configuración.
        </p>
      )}

      {mode === "calendario" ? (
        <DayCalendar
          reservations={data.reservations as Cita[]}
          day={day}
          setDay={setDay}
          workers={workers}
          onOpenDetail={setDetail}
          onAddAt={(workerId, time) => setAdd({ open: true, workerId, time, date: day })}
        />
      ) : (
        <ListaCitas reservations={data.reservations as Cita[]} filter={filter} setFilter={setFilter} isWorker={isWorker} onOpenDetail={setDetail} />
      )}

      {detail && <CitaDetailModal cita={detail} isWorker={isWorker} onClose={() => setDetail(null)} />}
      {add.open && (
        <AddCitaModal
          services={data.services}
          workers={workers}
          defaultDate={add.date ?? day}
          presetWorkerId={add.workerId}
          presetTime={add.time}
          onClose={() => setAdd({ open: false })}
        />
      )}
    </div>
  );
}

function DayCalendar({ reservations, day, setDay, workers, onOpenDetail, onAddAt }: {
  reservations: Cita[]; day: string; setDay: (v: string) => void;
  workers: { id: string; name: string }[];
  onOpenDetail: (c: Cita) => void; onAddAt: (workerId: string, time: string) => void;
}) {
  const dayRes = reservations.filter((r) => r.date === day && r.status !== "cancelada");
  const cols = [...workers];
  const known = new Set(workers.map((w) => w.id));
  for (const r of dayRes) if (!known.has(r.workerId)) { known.add(r.workerId); cols.push({ id: r.workerId, name: r.workerName }); }
  const base = daySlots(day);
  const extra = [...new Set(dayRes.map((r) => r.time))].filter((t) => !base.includes(t));
  const rows = [...base, ...extra].sort();
  const grid = { gridTemplateColumns: `64px repeat(${cols.length}, minmax(140px, 1fr))` };

  return (
    <div className="mt-5">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setDay(shiftISO(day, -1))} aria-label="Día anterior" className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-ink-soft hover:text-brand">‹</button>
          <input type="date" value={day} onChange={(e) => setDay(e.target.value || todayISO())} className="border border-brand/20 bg-white px-3 py-1.5 text-sm" />
          <button onClick={() => setDay(shiftISO(day, 1))} aria-label="Día siguiente" className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-ink-soft hover:text-brand">›</button>
          <button onClick={() => setDay(todayISO())} className="rounded-full border border-brand/20 bg-white px-3 py-1.5 text-xs text-ink-soft hover:text-brand">Hoy</button>
        </div>
        <p className="text-sm capitalize text-ink-soft">{fmtLong(day)}</p>
      </div>

      {cols.length === 0 ? (
        <p className="rounded-lg border border-brand/10 bg-white p-6 text-sm text-ink-soft">No hay estilistas activas. Añádelas en la sección «Trabajadores».</p>
      ) : rows.length === 0 ? (
        <div className="rounded-lg border border-brand/10 bg-white p-8 text-center text-sm text-ink-soft">
          El salón no abre este día. Puedes añadir una cita igualmente con <b>+ Añadir cita</b> (marca «fuera de horario»).
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-brand/10 bg-white">
          <div className="min-w-[560px]">
            <div className="sticky top-0 grid border-b border-brand/10 bg-cream-soft/60" style={grid}>
              <div className="p-2" />
              {cols.map((w) => (
                <div key={w.id} className="border-l border-brand/10 p-2 text-center text-sm font-medium text-brand">{w.name}</div>
              ))}
            </div>
            {rows.map((time) => (
              <div key={time} className="grid border-b border-brand/5 last:border-b-0" style={grid}>
                <div className="p-2 text-right text-xs text-ink-soft">{time}</div>
                {cols.map((w) => {
                  const r = dayRes.find((x) => x.workerId === w.id && x.time === time);
                  return (
                    <div key={w.id} className="border-l border-brand/10 p-1.5">
                      {r ? (
                        <button onClick={() => onOpenDetail(r)} className={`w-full rounded-md border-l-4 px-2 py-1.5 text-left text-xs transition-shadow hover:shadow-sm ${STATUS_BAR[r.status as ReservationStatus]}`}>
                          <span className="block truncate font-medium text-ink">{r.name}</span>
                          <span className="block truncate text-ink-soft">{r.serviceName}</span>
                        </button>
                      ) : (
                        <button onClick={() => onAddAt(w.id, time)} className="flex h-full min-h-[2.4rem] w-full items-center justify-center rounded-md text-lg text-ink-soft/25 transition-colors hover:bg-cream hover:text-gold" aria-label={`Añadir cita ${time} ${w.name}`}>+</button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink-soft">
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-l-4 border-amber-400 bg-amber-50" /> Pendiente</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-l-4 border-emerald-400 bg-emerald-50" /> Confirmada</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm border-l-4 border-[#c8a868] bg-[#c8a868]/10" /> Completada</span>
        <span>· Toca una cita para confirmar o gestionar · Toca «+» para añadir</span>
      </p>
    </div>
  );
}

function ListaCitas({ reservations, filter, setFilter, isWorker, onOpenDetail }: {
  reservations: Cita[]; filter: "todas" | ReservationStatus;
  setFilter: (v: "todas" | ReservationStatus) => void; isWorker: boolean; onOpenDetail: (c: Cita) => void;
}) {
  let list = [...reservations];
  if (filter !== "todas") list = list.filter((r) => r.status === filter);
  list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));
  return (
    <div className="mt-5">
      <div className="mb-4 flex justify-end">
        <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="border border-brand/20 bg-white px-3 py-1.5 text-sm">
          <option value="todas">Todas</option>
          <option value="pendiente">Pendientes</option>
          <option value="confirmada">Confirmadas</option>
          <option value="completada">Completadas</option>
          <option value="cancelada">Canceladas</option>
        </select>
      </div>
      <div className="space-y-3">
        {list.length === 0 && <p className="text-sm text-ink-soft">No hay citas con estos filtros.</p>}
        {list.map((r) => (
          <button key={r.id} onClick={() => onOpenDetail(r)} className="block w-full rounded-lg border border-brand/10 bg-white p-4 text-left transition-shadow hover:shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-display text-xl text-brand">{r.name}</span>
              <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[r.status as ReservationStatus]}`}>{r.status}</span>
            </div>
            <p className="mt-1 text-sm capitalize text-ink-soft">
              {fmtLong(r.date)} · {r.time} · {r.serviceName}{!isWorker && ` · ${formatPrice(r.price)}`}
            </p>
            <p className="mt-1 text-sm text-ink-soft">📞 {r.phone}{r.email && ` · ✉ ${r.email}`} · 💇 {r.workerName}</p>
            {r.notes && <p className="mt-2 rounded bg-cream px-3 py-2 text-sm text-ink">📝 {r.notes}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-brand-deep/50 backdrop-blur-sm sm:items-center sm:p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-cream-soft p-6 shadow-2xl sm:rounded-2xl" onClick={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-brand">{title}</h2>
          <button onClick={onClose} aria-label="Cerrar" className="text-lg text-ink-soft hover:text-brand">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

function CitaDetailModal({ cita, isWorker, onClose }: { cita: Cita; isWorker: boolean; onClose: () => void }) {
  return (
    <ModalShell title="Detalle de la cita" onClose={onClose}>
      <div className="flex items-center gap-2">
        <span className="font-display text-2xl text-brand">{cita.name}</span>
        <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[cita.status as ReservationStatus]}`}>{cita.status}</span>
      </div>
      <p className="mt-2 text-sm capitalize text-ink-soft">{fmtLong(cita.date)} · {cita.time} · {cita.serviceName}{!isWorker && ` · ${formatPrice(cita.price)}`}</p>
      <p className="mt-1 text-sm text-ink-soft">💇 {cita.workerName}</p>
      <p className="mt-1 text-sm text-ink-soft">📞 {cita.phone}{cita.email && ` · ✉ ${cita.email}`}</p>
      {cita.notes && <p className="mt-2 rounded bg-cream px-3 py-2 text-sm text-ink">📝 {cita.notes}</p>}

      <div className="mt-5 flex flex-wrap items-center gap-2">
        <a href={waReminderUrl(cita.phone, cita)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-3.5 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90">
          <WhatsAppIcon className="h-4 w-4" /> Recordatorio
        </a>
        <a href={`tel:${(cita.phone || "").replace(/\s/g, "")}`} className="inline-flex items-center gap-2 rounded-full border border-brand/25 px-3.5 py-2 text-sm text-brand transition-colors hover:border-gold">
          <PhoneIcon className="h-4 w-4" /> Llamar
        </a>
      </div>

      <div className="mt-5 border-t border-brand/10 pt-4">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">Cambiar estado</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {(["pendiente", "confirmada", "completada", "cancelada"] as ReservationStatus[]).map((st) => (
            <button key={st} onClick={() => { setReservationStatus(cita.id, st); onClose(); }}
              className={`rounded-full px-3 py-1.5 text-xs capitalize transition-colors ${cita.status === st ? "bg-brand text-cream" : "border border-brand/20 bg-white text-ink-soft hover:border-gold"}`}>
              {st}
            </button>
          ))}
        </div>
        <button onClick={() => { if (confirm("¿Eliminar esta cita definitivamente?")) { deleteReservation(cita.id); onClose(); } }} className="mt-4 text-xs text-rose-600 hover:underline">Eliminar cita</button>
      </div>
    </ModalShell>
  );
}

function AddCitaModal({ services, workers, defaultDate, presetWorkerId, presetTime, onClose }: {
  services: { slug: string; name: string; durationMin: number; price: number }[];
  workers: { id: string; name: string }[];
  defaultDate: string; presetWorkerId?: string; presetTime?: string; onClose: () => void;
}) {
  const [serviceSlug, setServiceSlug] = useState(services[0]?.slug ?? "");
  const [workerId, setWorkerId] = useState(presetWorkerId ?? "sin-preferencia");
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(presetTime ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [force, setForce] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const dur = services.find((s) => s.slug === serviceSlug)?.durationMin ?? 60;

  useEffect(() => {
    if (force) return;
    let alive = true;
    setLoadingSlots(true);
    getAvailability(date, workerId, dur)
      .then((s) => { if (!alive) return; setSlots(s); setLoadingSlots(false); setTime((cur) => (cur && s.includes(cur) ? cur : s[0] ?? "")); })
      .catch(() => { if (alive) { setSlots([]); setLoadingSlots(false); } });
    return () => { alive = false; };
  }, [serviceSlug, workerId, date, dur, force]);

  const submit = async () => {
    setError("");
    if (!serviceSlug) { setError("Elige un servicio."); return; }
    if (!name.trim() || !phone.trim()) { setError("Nombre y teléfono son obligatorios."); return; }
    if (!time) { setError("Elige una hora."); return; }
    setSaving(true);
    const r = await createReservationAdmin({ serviceSlug, workerId, date, time, name: name.trim(), phone: phone.trim(), email: email.trim(), notes: notes.trim() }, force);
    setSaving(false);
    if (r.ok) onClose();
    else setError(r.error ?? "No se pudo crear la cita.");
  };

  return (
    <ModalShell title="Añadir cita" onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs text-ink-soft">Servicio</label>
          <select value={serviceSlug} onChange={(e) => setServiceSlug(e.target.value)} className={inputCls}>
            {services.map((s) => <option key={s.slug} value={s.slug}>{s.name} · {formatDuration(s.durationMin)}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Estilista</label>
            <select value={workerId} onChange={(e) => setWorkerId(e.target.value)} className={inputCls}>
              <option value="sin-preferencia">Sin preferencia</option>
              {workers.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Fecha</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-soft">Hora {!force && loadingSlots && <span className="text-ink-soft/60">· cargando…</span>}</label>
          {force ? (
            <input type="time" value={time} onChange={(e) => setTime(e.target.value)} className={inputCls} />
          ) : slots.length === 0 && !loadingSlots ? (
            <p className="rounded bg-amber-50 px-3 py-2 text-xs text-amber-800">No hay horas libres ese día para esa estilista. Prueba otra fecha/estilista o marca «fuera de horario».</p>
          ) : (
            <select value={time} onChange={(e) => setTime(e.target.value)} className={inputCls}>
              {slots.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          )}
          <label className="mt-2 flex items-center gap-2 text-xs text-ink-soft">
            <input type="checkbox" checked={force} onChange={(e) => { setForce(e.target.checked); if (e.target.checked && !time) setTime("10:00"); }} />
            Fuera de horario (petición especial por teléfono)
          </label>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Nombre*</label>
            <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} placeholder="Nombre de la clienta" />
          </div>
          <div>
            <label className="mb-1 block text-xs text-ink-soft">Teléfono*</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder="600 000 000" />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-soft">Email (opcional)</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className={inputCls} placeholder="correo@ejemplo.com" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-ink-soft">Notas (opcional)</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className={inputCls} placeholder="Petición por teléfono, alergias, etc." />
        </div>
        {error && <p className="rounded bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="flex justify-end gap-2 pt-1">
          <button onClick={onClose} className="rounded-full border border-brand/20 px-4 py-2 text-sm text-ink-soft transition-colors hover:text-brand">Cancelar</button>
          <button onClick={submit} disabled={saving} className="rounded-full bg-gold px-5 py-2 text-sm font-medium text-brand-deep transition-colors hover:bg-gold-soft disabled:opacity-60">{saving ? "Guardando…" : "Crear cita"}</button>
        </div>
      </div>
    </ModalShell>
  );
}

/* ----------------- SERVICIOS (CRUD) ----------------- */
function slugify(s: string) {
  const base = s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  return base || `servicio-${uid()}`;
}
function ServiciosEditor() {
  const [items, setItems] = useState<Service[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().services), []);

  const update = (i: number, patch: Partial<Service>) => { setItems((p) => p.map((s, idx) => (idx === i ? { ...s, ...patch } : s))); setSaved(false); };
  const add = () => { setItems((p) => [...p, { slug: `servicio-${uid()}`, name: "Nuevo servicio", tagline: "", description: "", durationMin: 60, price: 0, featured: false, image: PHOTO_POOL[0] }]); setSaved(false); };
  const remove = (i: number) => { if (confirm("¿Eliminar este servicio?")) { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); } };
  const persist = () => { saveServices(items.map((s) => ({ ...s, slug: s.slug || slugify(s.name) }))); setSaved(true); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Servicios y precios</h1>
        <SaveBar onSave={persist} saved={saved} />
      </div>
      <div className="mt-5 space-y-3">
        {items.map((s, i) => (
          <div key={i} className="rounded-lg border border-brand/10 bg-white p-4">
            <div className="grid gap-3 md:grid-cols-[120px_1fr]">
              <div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image || PHOTO_POOL[0]} alt="" className="aspect-[3/4] w-full rounded object-cover" />
                <select className={`${inputCls} mt-1 text-xs`} value={s.image} onChange={(e) => update(i, { image: e.target.value })}>
                  {PHOTO_POOL.map((p) => <option key={p} value={p}>{p.replace("/photos/", "").replace(".jpg", "")}</option>)}
                </select>
              </div>
              <div className="grid gap-2">
                <input className={inputCls} value={s.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nombre" />
                <input className={`${inputCls} text-sm`} value={s.tagline} onChange={(e) => update(i, { tagline: e.target.value })} placeholder="Subtítulo" />
                <textarea className={`${inputCls} h-16 resize-none text-sm`} value={s.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Descripción" />
                <div className="flex flex-wrap items-center gap-3">
                  <label className="text-xs text-ink-soft">Precio €<input type="number" className={`${inputCls} w-24`} value={s.price} onChange={(e) => update(i, { price: Number(e.target.value) })} /></label>
                  <label className="text-xs text-ink-soft">Minutos<input type="number" className={`${inputCls} w-20`} value={s.durationMin} onChange={(e) => update(i, { durationMin: Number(e.target.value) })} /></label>
                  <label className="flex items-center gap-2 text-xs text-ink-soft"><input type="checkbox" checked={!!s.featured} onChange={(e) => update(i, { featured: e.target.checked })} /> En portada (home)</label>
                  <button onClick={() => remove(i)} className="ml-auto text-xs text-rose-600 hover:underline">Eliminar</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 border border-dashed border-brand/40 px-5 py-3 text-sm text-brand hover:bg-brand/5">+ Añadir servicio</button>
    </div>
  );
}

/* ----------------- ANTES / DESPUÉS (CRUD) ----------------- */
function AntesDespuesEditor() {
  const [items, setItems] = useState<Pair[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().beforeAfter), []);

  const update = (i: number, patch: Partial<Pair>) => { setItems((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x))); setSaved(false); };
  const add = () => { setItems((p) => [...p, { before: PHOTO_POOL[2], after: PHOTO_POOL[1], label: "Nueva transformación" }]); setSaved(false); };
  const remove = (i: number) => { if (confirm("¿Eliminar este antes/después?")) { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); } };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Antes / Después</h1>
        <SaveBar onSave={() => { saveBeforeAfter(items); setSaved(true); }} saved={saved} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">Elige la foto de antes y la de después de la galería de fotos del salón.</p>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {items.map((p, i) => (
          <div key={i} className="rounded-lg border border-brand/10 bg-white p-4">
            <div className="grid grid-cols-2 gap-3">
              <div><span className="mb-1 block text-xs uppercase tracking-widest text-ink-soft">Antes</span><PhotoSelect value={p.before} onChange={(v) => update(i, { before: v })} /></div>
              <div><span className="mb-1 block text-xs uppercase tracking-widest text-ink-soft">Después</span><PhotoSelect value={p.after} onChange={(v) => update(i, { after: v })} /></div>
            </div>
            <input className={`${inputCls} mt-3`} value={p.label} onChange={(e) => update(i, { label: e.target.value })} placeholder="Título" />
            <button onClick={() => remove(i)} className="mt-2 text-xs text-rose-600 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 border border-dashed border-brand/40 px-5 py-3 text-sm text-brand hover:bg-brand/5">+ Añadir antes/después</button>
    </div>
  );
}

/* ----------------- RESEÑAS (CRUD) ----------------- */
function ResenasEditor() {
  const [items, setItems] = useState<Review[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().reviews), []);

  const update = (i: number, patch: Partial<Review>) => { setItems((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x))); setSaved(false); };
  const add = () => { setItems((p) => [...p, { name: "Nueva clienta", rating: 5, text: "", source: "Google" }]); setSaved(false); };
  const remove = (i: number) => { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Reseñas</h1>
        <SaveBar onSave={() => { saveReviews(items); setSaved(true); }} saved={saved} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">En la web solo se muestran las reseñas de 4,5★ o más, en carrusel.</p>
      <div className="mt-5 space-y-3">
        {items.map((r, i) => (
          <div key={i} className="rounded-lg border border-brand/10 bg-white p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <input className={`${inputCls} max-w-[220px]`} value={r.name} onChange={(e) => update(i, { name: e.target.value })} />
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                Estrellas
                <input type="number" step="0.5" min="0" max="5" className={`${inputCls} w-20`} value={r.rating} onChange={(e) => update(i, { rating: Number(e.target.value) })} />
                {r.rating >= 4.5 ? <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs text-emerald-700">Se muestra</span> : <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs text-rose-600">Oculta</span>}
              </label>
              <button onClick={() => remove(i)} className="text-xs text-rose-600 hover:underline">Eliminar</button>
            </div>
            <textarea className={`${inputCls} mt-2 h-20 resize-none text-sm`} value={r.text} onChange={(e) => update(i, { text: e.target.value })} />
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 border border-dashed border-brand/40 px-5 py-3 text-sm text-brand hover:bg-brand/5">+ Añadir reseña</button>
    </div>
  );
}

/* ----------------- GALERÍA (CRUD) ----------------- */
function GaleriaEditor() {
  const [items, setItems] = useState<{ src: string; alt: string; real?: boolean }[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().gallery), []);

  const remove = (i: number) => { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); };
  const addFrom = (src: string) => { setItems((p) => [...p, { src, alt: "Foto del salón", real: true }]); setSaved(false); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Galería</h1>
        <SaveBar onSave={() => { saveGallery(items); setSaved(true); }} saved={saved} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">La subida de fotos nuevas se conectará al publicar la web; por ahora puedes ordenar y elegir de las fotos del salón.</p>
      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-5">
        {items.map((g, i) => (
          <div key={i} className="group relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={g.src} alt={g.alt} className="aspect-[3/4] w-full rounded object-cover" />
            <button onClick={() => remove(i)} className="absolute right-1 top-1 rounded-full bg-rose-600 px-2 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">✕</button>
          </div>
        ))}
      </div>
      <div className="mt-5">
        <p className="mb-2 text-xs uppercase tracking-widest text-ink-soft">Añadir a la galería</p>
        <div className="flex flex-wrap gap-2">
          {PHOTO_POOL.map((p) => (
            // eslint-disable-next-line @next/next/no-img-element
            <button key={p} onClick={() => addFrom(p)} title="Añadir"><img src={p} alt="" className="h-16 w-12 rounded object-cover ring-1 ring-brand/10 transition hover:ring-gold" /></button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ----------------- TRABAJADORES (CRUD) ----------------- */
function TrabajadoresEditor() {
  const [items, setItems] = useState<Worker[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().workers), []);

  const update = (i: number, patch: Partial<Worker>) => { setItems((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x))); setSaved(false); };
  const add = () => { setItems((p) => [...p, { id: uid(), name: "Nueva trabajadora", role: "worker", active: true }]); setSaved(false); };
  const remove = (i: number) => { if (confirm("¿Eliminar a esta trabajadora?")) { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); } };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Trabajadores</h1>
        <SaveBar onSave={() => { saveWorkers(items); setSaved(true); }} saved={saved} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">Las trabajadoras aparecen al elegir estilista en la reserva. Solo la dueña y el superadmin pueden gestionarlas.</p>
      <div className="mt-5 space-y-3">
        {items.map((w, i) => (
          <div key={w.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-brand/10 bg-white p-4">
            <input className={`${inputCls} max-w-[240px]`} value={w.name} onChange={(e) => update(i, { name: e.target.value })} />
            <select className={`${inputCls} max-w-[180px]`} value={w.role} onChange={(e) => update(i, { role: e.target.value as Role })}>
              <option value="owner">Dueña</option>
              <option value="worker">Trabajadora (agenda)</option>
              <option value="admin">Superadmin</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={w.active} onChange={(e) => update(i, { active: e.target.checked })} /> Activa</label>
            <button onClick={() => remove(i)} className="ml-auto text-xs text-rose-600 hover:underline">Eliminar</button>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 border border-dashed border-brand/40 px-5 py-3 text-sm text-brand hover:bg-brand/5">+ Añadir trabajadora</button>
    </div>
  );
}

/* ----------------- PRODUCTOS (CRUD) ----------------- */
const PRODUCT_POOL = ["/products/champu.jpg", "/products/acondicionador.jpg", "/products/crema.jpg", "/products/mascarilla.jpg"];
function ProductosEditor() {
  const [items, setItems] = useState<Product[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().products), []);

  const update = (i: number, patch: Partial<Product>) => { setItems((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x))); setSaved(false); };
  const add = () => { setItems((p) => [...p, { slug: `producto-${uid()}`, name: "Nuevo producto", description: "", price: 0, image: PRODUCT_POOL[0], active: true }]); setSaved(false); };
  const remove = (i: number) => { if (confirm("¿Eliminar este producto?")) { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); } };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Productos</h1>
        <SaveBar onSave={() => { saveProducts(items); setSaved(true); }} saved={saved} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">La subida de fotos nuevas se conectará al publicar; por ahora elige entre las de ejemplo.</p>
      <div className="mt-5 space-y-3">
        {items.map((p, i) => (
          <div key={i} className="grid gap-3 rounded-lg border border-brand/10 bg-white p-4 md:grid-cols-[110px_1fr]">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.image} alt="" className="aspect-square w-full rounded object-cover" />
              <select className={`${inputCls} mt-1 text-xs`} value={p.image} onChange={(e) => update(i, { image: e.target.value })}>
                {PRODUCT_POOL.map((x) => <option key={x} value={x}>{x.replace("/products/", "").replace(".jpg", "")}</option>)}
              </select>
            </div>
            <div className="grid gap-2">
              <input className={inputCls} value={p.name} onChange={(e) => update(i, { name: e.target.value })} placeholder="Nombre" />
              <textarea className={`${inputCls} h-16 resize-none text-sm`} value={p.description} onChange={(e) => update(i, { description: e.target.value })} placeholder="Descripción" />
              <div className="flex flex-wrap items-center gap-3">
                <label className="text-xs text-ink-soft">Precio €<input type="number" className={`${inputCls} w-24`} value={p.price} onChange={(e) => update(i, { price: Number(e.target.value) })} /></label>
                <label className="flex items-center gap-2 text-xs text-ink-soft"><input type="checkbox" checked={p.active} onChange={(e) => update(i, { active: e.target.checked })} /> Visible</label>
                <button onClick={() => remove(i)} className="ml-auto text-xs text-rose-600 hover:underline">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 border border-dashed border-brand/40 px-5 py-3 text-sm text-brand hover:bg-brand/5">+ Añadir producto</button>
    </div>
  );
}

/* ----------------- NOVEDADES (CRUD) ----------------- */
function NovedadesEditor() {
  const [items, setItems] = useState<News[]>([]);
  const [saved, setSaved] = useState(false);
  useEffect(() => setItems(loadData().news), []);

  const update = (i: number, patch: Partial<News>) => { setItems((p) => p.map((x, idx) => (idx === i ? { ...x, ...patch } : x))); setSaved(false); };
  const add = () => { setItems((p) => [...p, { tag: "Novedad", title: "Nuevo aviso", text: "" }]); setSaved(false); };
  const remove = (i: number) => { setItems((p) => p.filter((_, idx) => idx !== i)); setSaved(false); };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Novedades y promociones</h1>
        <SaveBar onSave={() => { saveNews(items); setSaved(true); }} saved={saved} />
      </div>
      <p className="mt-2 text-xs text-ink-soft">Aparecen en el carrusel de la portada. La primera es la destacada.</p>
      <div className="mt-5 space-y-3">
        {items.map((n, i) => (
          <div key={i} className="rounded-lg border border-brand/10 bg-white p-4">
            <div className="flex flex-wrap items-center gap-2">
              <input className={`${inputCls} max-w-[160px]`} value={n.tag} onChange={(e) => update(i, { tag: e.target.value })} placeholder="Etiqueta" />
              <input className={`${inputCls} flex-1`} value={n.title} onChange={(e) => update(i, { title: e.target.value })} placeholder="Título" />
              <button onClick={() => remove(i)} className="text-xs text-rose-600 hover:underline">Eliminar</button>
            </div>
            <textarea className={`${inputCls} mt-2 h-16 resize-none text-sm`} value={n.text} onChange={(e) => update(i, { text: e.target.value })} placeholder="Texto" />
          </div>
        ))}
      </div>
      <button onClick={add} className="mt-4 border border-dashed border-brand/40 px-5 py-3 text-sm text-brand hover:bg-brand/5">+ Añadir novedad</button>
    </div>
  );
}

/* ----------------- MENSAJES ----------------- */
function Mensajes() {
  const data = useStoreData();
  if (!data) return null;
  return (
    <div>
      <h1 className="font-display text-3xl text-brand">Mensajes</h1>
      <div className="mt-5 space-y-3">
        {data.messages.length === 0 && <p className="text-sm text-ink-soft">No hay mensajes.</p>}
        {data.messages.map((m) => (
          <div key={m.id} className={`rounded-lg border bg-white p-4 ${m.read ? "border-brand/10" : "border-gold/50"}`}>
            <div className="flex items-center justify-between">
              <span className="font-medium text-ink">{m.name} {!m.read && <span className="ml-2 rounded-full bg-gold/20 px-2 py-0.5 text-xs text-[#8a6d2f]">nuevo</span>}</span>
              <span className="text-xs text-ink-soft">{new Date(m.createdAt).toLocaleDateString("es-ES")}</span>
            </div>
            <p className="mt-1 text-xs text-ink-soft">{m.email} {m.phone && `· ${m.phone}`}</p>
            <p className="mt-2 text-sm text-ink">{m.text}</p>
            {!m.read && <button onClick={() => markMessageRead(m.id)} className="mt-2 text-xs text-brand hover:underline">Marcar como leído</button>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ----------------- AJUSTES ----------------- */
function AjustesEditor() {
  const [s, setS] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);
  useEffect(() => setS(loadData().settings), []);
  if (!s) return null;

  const field = (k: keyof Settings, label: string) => (
    <label className="block">
      <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">{label}</span>
      <input className={inputCls} value={s[k]} onChange={(e) => { setS({ ...s, [k]: e.target.value }); setSaved(false); }} />
    </label>
  );

  return (
    <div className="max-w-xl">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-3xl text-brand">Datos de contacto</h1>
        <SaveBar onSave={() => { saveSettings(s); setSaved(true); }} saved={saved} />
      </div>
      <div className="mt-5 grid gap-4">
        {field("phone", "Teléfono")}
        {field("email", "Email")}
        {field("address", "Dirección")}
        {field("whatsapp", "WhatsApp")}
        {field("instagram", "Instagram")}
        {field("tiktok", "TikTok")}
      </div>
    </div>
  );
}

/* ----------------- USUARIOS Y ROLES ----------------- */
function Usuarios() {
  const perms = [
    { area: "Agenda: ver, añadir y modificar citas", admin: true, owner: true, worker: true },
    { area: "Servicios, precios y antes/después", admin: true, owner: true, worker: false },
    { area: "Reseñas, galería y datos de contacto", admin: true, owner: true, worker: false },
    { area: "Gestión de trabajadores", admin: true, owner: true, worker: false },
    { area: "Usuarios, roles y configuración técnica", admin: true, owner: false, worker: false },
  ];
  return (
    <div>
      <h1 className="font-display text-3xl text-brand">Usuarios y roles</h1>
      <p className="mt-2 text-sm text-ink-soft">Solo el superadmin (administración) ve esta sección.</p>

      <div className="mt-5 grid gap-3 sm:grid-cols-3">
        {[
          { email: "admin@almarizo.com", role: "admin" as Role },
          { email: "maricruz@almarizo.com", role: "owner" as Role },
          { email: "equipo@almarizo.com", role: "worker" as Role },
        ].map((a) => (
          <div key={a.email} className="rounded-lg border border-brand/10 bg-white p-4">
            <div className="font-medium text-brand">{ROLE_LABEL[a.role]}</div>
            <div className="mt-1 text-xs text-ink-soft">{a.email}</div>
          </div>
        ))}
      </div>

      <h2 className="mt-8 font-display text-2xl text-brand">Permisos por rol</h2>
      <div className="mt-3 overflow-x-auto rounded-lg border border-brand/10 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-brand/10 text-left text-ink-soft">
              <th className="px-4 py-3 font-medium">Área</th>
              <th className="px-4 py-3 text-center font-medium">Superadmin</th>
              <th className="px-4 py-3 text-center font-medium">Dueña</th>
              <th className="px-4 py-3 text-center font-medium">Trabajadora</th>
            </tr>
          </thead>
          <tbody>
            {perms.map((p) => (
              <tr key={p.area} className="border-b border-brand/5 last:border-0">
                <td className="px-4 py-3 text-ink">{p.area}</td>
                <td className="px-4 py-3 text-center">{p.admin ? "✅" : "—"}</td>
                <td className="px-4 py-3 text-center">{p.owner ? "✅" : "—"}</td>
                <td className="px-4 py-3 text-center">{p.worker ? "✅" : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
