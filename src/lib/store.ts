"use client";

/* ============================================================
   ALMA RIZO — Demo data store (localStorage)
   Makes reservas + panel admin fully functional for demos
   WITHOUT any backend. Designed to be swapped for Supabase
   later (same shapes). All access is SSR-safe.
   ============================================================ */

import {
  services as seedServices,
  reviews as seedReviews,
  gallery as seedGallery,
  beforeAfter as seedBeforeAfter,
  products as seedProducts,
  news as seedNews,
} from "./site";

export type Role = "admin" | "owner" | "worker";

export type Worker = {
  id: string;
  name: string;
  role: Role;
  active: boolean;
  example?: boolean;
};

export type ReservationStatus = "pendiente" | "confirmada" | "cancelada" | "completada";

export type Reservation = {
  id: string;
  serviceSlug: string;
  serviceName: string;
  price: number;
  durationMin: number;
  workerId: string; // "sin-preferencia" allowed
  workerName: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: ReservationStatus;
  createdAt: string;
};

export type Message = {
  id: string;
  name: string;
  email: string;
  phone: string;
  text: string;
  createdAt: string;
  read: boolean;
};

export type Settings = {
  phone: string;
  email: string;
  address: string;
  instagram: string;
  tiktok: string;
  whatsapp: string;
};

type DataShape = {
  services: typeof seedServices;
  reviews: typeof seedReviews;
  gallery: typeof seedGallery;
  beforeAfter: typeof seedBeforeAfter;
  products: typeof seedProducts;
  news: typeof seedNews;
  workers: Worker[];
  reservations: Reservation[];
  messages: Message[];
  settings: Settings;
};

const KEY = "almarizo_data_v1";
const AUTH_KEY = "almarizo_auth_v1";
const EVT = "almarizo:change";

export const WORKERS_SEED: Worker[] = [
  { id: "maricruz", name: "Maricruz", role: "owner", active: true },
  { id: "lucia", name: "Lucía (ejemplo)", role: "worker", active: true, example: true },
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}
function ymd(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function plusDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
export function uid() {
  return Math.random().toString(36).slice(2, 10);
}

function seed(): DataShape {
  const sampleService = seedServices[0];
  const mk = (
    over: Partial<Reservation> & Pick<Reservation, "name" | "date" | "time">,
  ): Reservation => ({
    id: uid(),
    serviceSlug: sampleService.slug,
    serviceName: sampleService.name,
    price: sampleService.price,
    durationMin: sampleService.durationMin,
    workerId: "maricruz",
    workerName: "Maricruz",
    phone: "600 000 000",
    email: "cliente@email.com",
    notes: "",
    status: "confirmada",
    createdAt: new Date().toISOString(),
    ...over,
  });

  return {
    services: seedServices,
    reviews: seedReviews,
    gallery: seedGallery,
    beforeAfter: seedBeforeAfter,
    products: seedProducts,
    news: seedNews,
    workers: WORKERS_SEED,
    reservations: [
      mk({ name: "Laura Martínez", date: ymd(plusDays(0)), time: "10:30", serviceSlug: "corte-curly", serviceName: "Corte Curly", price: 45, durationMin: 75, notes: "Rizo 3A, primera vez aquí." }),
      mk({ name: "Cristina Ruiz", date: ymd(plusDays(0)), time: "12:30", serviceSlug: "metodo-alma-rizo", serviceName: "Método Alma Rizo", price: 75, durationMin: 120, status: "pendiente" }),
      mk({ name: "Núria Pons", date: ymd(plusDays(1)), time: "16:00", serviceSlug: "ritual-alma-rizo", serviceName: "Ritual Alma Rizo", price: 60, durationMin: 90, workerId: "lucia", workerName: "Lucía (ejemplo)" }),
      mk({ name: "Marta Soler", date: ymd(plusDays(2)), time: "11:00", serviceSlug: "diagnostico", serviceName: "Diagnóstico capilar", price: 25, durationMin: 45, status: "pendiente", notes: "Quiere asesoramiento de producto." }),
      mk({ name: "Elena Gómez", date: ymd(plusDays(3)), time: "17:30", serviceSlug: "hidratacion-profunda", serviceName: "Hidratación profunda", price: 40, durationMin: 60 }),
    ],
    messages: [
      {
        id: uid(),
        name: "Paula Vidal",
        email: "paula@email.com",
        phone: "611 222 333",
        text: "Hola, ¿hacéis corte para peques con rizo? Gracias.",
        createdAt: new Date().toISOString(),
        read: false,
      },
    ],
    settings: {
      phone: "+34 977 23 84 38",
      email: "hola@almarizo.com",
      address: "Carrer de Bonaventura Hernández i Sanahuja, 19, 43002 Tarragona",
      instagram: "https://www.instagram.com/mimasbymaricruz/",
      tiktok: "https://www.tiktok.com/@mimasbymaricruz",
      whatsapp: "",
    },
  };
}

export function loadData(): DataShape {
  if (typeof window === "undefined") return seed();
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    // Merge with seed so new fields added later (e.g. beforeAfter) never break older saved data.
    return { ...seed(), ...(JSON.parse(raw) as Partial<DataShape>) } as DataShape;
  } catch {
    return seed();
  }
}

function saveData(d: DataShape) {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, JSON.stringify(d));
  window.dispatchEvent(new Event(EVT));
}

export function resetDemo() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(KEY);
  loadData();
  window.dispatchEvent(new Event(EVT));
}

/* ---- mutations ---- */
export function addReservation(r: Omit<Reservation, "id" | "createdAt" | "status"> & { status?: ReservationStatus }) {
  const d = loadData();
  const res: Reservation = {
    ...r,
    id: uid(),
    status: r.status ?? "pendiente",
    createdAt: new Date().toISOString(),
  };
  d.reservations.unshift(res);
  saveData(d);
  return res;
}

export function setReservationStatus(id: string, status: ReservationStatus) {
  const d = loadData();
  const r = d.reservations.find((x) => x.id === id);
  if (r) r.status = status;
  saveData(d);
}

export function deleteReservation(id: string) {
  const d = loadData();
  d.reservations = d.reservations.filter((x) => x.id !== id);
  saveData(d);
}

export function saveServices(services: DataShape["services"]) {
  const d = loadData();
  d.services = services;
  saveData(d);
}

export function saveReviews(reviews: DataShape["reviews"]) {
  const d = loadData();
  d.reviews = reviews;
  saveData(d);
}

export function saveGallery(gallery: DataShape["gallery"]) {
  const d = loadData();
  d.gallery = gallery;
  saveData(d);
}

export function saveBeforeAfter(beforeAfter: DataShape["beforeAfter"]) {
  const d = loadData();
  d.beforeAfter = beforeAfter;
  saveData(d);
}

export function saveWorkers(workers: Worker[]) {
  const d = loadData();
  d.workers = workers;
  saveData(d);
}

export function saveProducts(products: DataShape["products"]) {
  const d = loadData();
  d.products = products;
  saveData(d);
}

export function saveNews(news: DataShape["news"]) {
  const d = loadData();
  d.news = news;
  saveData(d);
}

export function saveSettings(settings: Settings) {
  const d = loadData();
  d.settings = settings;
  saveData(d);
}

export function addMessage(m: Omit<Message, "id" | "createdAt" | "read">) {
  const d = loadData();
  d.messages.unshift({ ...m, id: uid(), createdAt: new Date().toISOString(), read: false });
  saveData(d);
}

export function markMessageRead(id: string) {
  const d = loadData();
  const m = d.messages.find((x) => x.id === id);
  if (m) m.read = true;
  saveData(d);
}

/* ---- availability ---- */
// Business hours per weekday (0=Sun..6=Sat): [openMin, closeMin] or null
const HOURS: (number[] | null)[] = [
  null, // Sun
  [570, 1110], // Mon 9:30-18:30
  [570, 1110], // Tue
  [570, 1110], // Wed
  [570, 1170], // Thu 9:30-19:30
  [570, 1170], // Fri
  [570, 810], // Sat 9:30-13:30
];

export function slotsForDate(dateStr: string, workerId: string, durationMin: number): string[] {
  const d = new Date(dateStr + "T00:00:00");
  const wd = d.getDay();
  const range = HOURS[wd];
  if (!range) return [];
  const [open, close] = range;
  const data = loadData();
  const taken = new Set(
    data.reservations
      .filter(
        (r) =>
          r.date === dateStr &&
          r.status !== "cancelada" &&
          (workerId === "sin-preferencia" || r.workerId === workerId),
      )
      .map((r) => r.time),
  );
  const out: string[] = [];
  for (let t = open; t + durationMin <= close; t += 30) {
    const hh = pad(Math.floor(t / 60));
    const mm = pad(t % 60);
    const label = `${hh}:${mm}`;
    if (!taken.has(label)) out.push(label);
  }
  return out;
}

/* ---- auth (demo) ---- */
export type Session = { email: string; name: string; role: Role };

const ACCOUNTS: { email: string; password: string; name: string; role: Role }[] = [
  { email: "admin@almarizo.com", password: "admin", name: "Héctor / Raúl", role: "admin" },
  { email: "maricruz@almarizo.com", password: "alma", name: "Maricruz", role: "owner" },
  { email: "equipo@almarizo.com", password: "equipo", name: "Lucía", role: "worker" },
];

export const DEMO_ACCOUNTS = ACCOUNTS.map(({ email, password, role }) => ({ email, password, role }));

export function login(email: string, password: string): Session | null {
  const a = ACCOUNTS.find(
    (x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password,
  );
  if (!a) return null;
  const s: Session = { email: a.email, name: a.name, role: a.role };
  if (typeof window !== "undefined") {
    localStorage.setItem(AUTH_KEY, JSON.stringify(s));
    window.dispatchEvent(new Event(EVT));
  }
  return s;
}

export function logout() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_KEY);
  window.dispatchEvent(new Event(EVT));
}

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

/* ---- permissions ---- */
export const can = {
  // La agenda (ver/añadir/modificar citas) la usan todos los roles.
  manageReservations: (_role: Role) => true,
  // Editar la web (servicios, antes/después, reseñas, galería, datos): solo dueña + superadmin.
  manageContent: (role: Role) => role === "admin" || role === "owner",
  // Editar trabajadores: solo dueña + superadmin.
  manageWorkers: (role: Role) => role === "admin" || role === "owner",
  // Usuarios, roles y configuración técnica: solo superadmin.
  manageUsers: (role: Role) => role === "admin",
};

export const ROLE_LABEL: Record<Role, string> = {
  admin: "Superadmin",
  owner: "Dueña",
  worker: "Trabajadora",
};

export const CHANGE_EVENT = EVT;
