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
          <div className="mb-5 rounded-md border border-emerald-300/50 bg-emerald-50 px-4 py-2.5 text-xs text-emerald-800">
            Conectado a la base de datos real · los cambios se guardan de verdad y se comparten entre todos los dispositivos.
          </div>
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
function Reservas({ role }: { role: Role }) {
  const data = useStoreData();
  const [filter, setFilter] = useState<"todas" | ReservationStatus>("todas");
  const [day, setDay] = useState<string>("");
  if (!data) return null;

  let list = [...data.reservations];
  if (filter !== "todas") list = list.filter((r) => r.status === filter);
  if (day) list = list.filter((r) => r.date === day);
  list.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  const isWorker = role === "worker";

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-brand">Agenda de citas</h1>
        <div className="flex flex-wrap items-center gap-2">
          <input type="date" value={day} onChange={(e) => setDay(e.target.value)} className="border border-brand/20 bg-white px-3 py-1.5 text-sm" />
          <select value={filter} onChange={(e) => setFilter(e.target.value as typeof filter)} className="border border-brand/20 bg-white px-3 py-1.5 text-sm">
            <option value="todas">Todas</option>
            <option value="pendiente">Pendientes</option>
            <option value="confirmada">Confirmadas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>
      </div>

      {isWorker && (
        <p className="mt-3 rounded-md bg-brand/5 px-3 py-2 text-xs text-ink-soft">
          Tu acceso es solo a la <b>agenda</b>: ver, añadir y modificar citas. No puedes editar la web, precios ni configuración.
        </p>
      )}

      <div className="mt-5 space-y-3">
        {list.length === 0 && <p className="text-sm text-ink-soft">No hay citas con estos filtros.</p>}
        {list.map((r) => (
          <div key={r.id} className="rounded-lg border border-brand/10 bg-white p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-xl text-brand">{r.name}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs ${STATUS_STYLE[r.status as ReservationStatus]}`}>{r.status}</span>
                </div>
                <p className="mt-1 text-sm text-ink-soft">
                  {new Date(r.date + "T00:00:00").toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" })} · {r.time} · {r.serviceName}
                  {!isWorker && ` · ${formatPrice(r.price)}`}
                </p>
                <p className="mt-1 text-sm text-ink-soft">📞 {r.phone}{r.email && ` · ✉ ${r.email}`} · 💇 {r.workerName}</p>
                {r.notes && <p className="mt-2 rounded bg-cream px-3 py-2 text-sm text-ink">📝 {r.notes}</p>}
              </div>
              <div className="flex flex-col items-end gap-2">
                <select value={r.status} onChange={(e) => setReservationStatus(r.id, e.target.value as ReservationStatus)} className="border border-brand/20 bg-white px-2 py-1 text-xs">
                  <option value="pendiente">Pendiente</option>
                  <option value="confirmada">Confirmada</option>
                  <option value="completada">Completada</option>
                  <option value="cancelada">Cancelada</option>
                </select>
                <button onClick={() => { if (confirm("¿Eliminar esta cita?")) deleteReservation(r.id); }} className="text-xs text-rose-600 hover:underline">Eliminar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
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
