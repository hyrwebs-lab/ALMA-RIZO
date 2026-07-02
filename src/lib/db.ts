import "server-only";
import { createClient, type Client, type InArgs } from "@libsql/client";
import { scryptSync, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import {
  services as seedServices,
  reviews as seedReviews,
  products as seedProducts,
  news as seedNews,
  gallery as seedGallery,
  beforeAfter as seedBeforeAfter,
} from "./site";

export type Role = "admin" | "owner" | "worker";
export type ReservationStatus = "pendiente" | "confirmada" | "cancelada" | "completada";
export type Row = Record<string, unknown>;

// Business hours per weekday (0=Sun..6=Sat): [openMin, closeMin] or null
const HOURS: (number[] | null)[] = [null, [570, 1110], [570, 1110], [570, 1110], [570, 1170], [570, 1170], [570, 810]];

const g = globalThis as unknown as { __almaClient?: Client; __almaInit?: Promise<void> };

function rawClient(): Client {
  if (!g.__almaClient) {
    g.__almaClient = createClient({
      url: process.env.DATABASE_URL || "file:./data/almarizo.db",
      authToken: process.env.DATABASE_AUTH_TOKEN,
      intMode: "number",
    });
  }
  return g.__almaClient;
}

async function ready(): Promise<Client> {
  const c = rawClient();
  if (!g.__almaInit) g.__almaInit = initDb(c);
  await g.__almaInit;
  return c;
}

async function q(sql: string, args: InArgs = []) {
  return (await ready()).execute({ sql, args });
}
// Devuelve filas como objetos PLANOS (los Row de libSQL llevan métodos y no se
// pueden pasar del servidor a componentes cliente en React).
async function rows(sql: string, args: InArgs = []): Promise<Row[]> {
  const rs = await (await ready()).execute({ sql, args });
  return rs.rows.map((r) => {
    const o: Row = {};
    for (const c of rs.columns) o[c] = (r as unknown as Record<string, unknown>)[c];
    return o;
  });
}

/* ---------- helpers ---------- */
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function hashPassword(pw: string) {
  const salt = randomBytes(16).toString("hex");
  return `${salt}:${scryptSync(pw, salt, 64).toString("hex")}`;
}
function verifyPassword(pw: string, stored: string) {
  const [salt, key] = stored.split(":");
  if (!salt || !key) return false;
  const a = Buffer.from(key, "hex");
  const b = scryptSync(pw, salt, 64);
  return a.length === b.length && timingSafeEqual(a, b);
}
const pwEnv = (k: string, def: string) => process.env[k] || def;

/* ---------- schema + seed ---------- */
async function initDb(c: Client) {
  await c.executeMultiple(`
    CREATE TABLE IF NOT EXISTS services (slug TEXT PRIMARY KEY, name TEXT, tagline TEXT, description TEXT, durationMin INTEGER, price INTEGER, featured INTEGER, image TEXT, sort INTEGER);
    CREATE TABLE IF NOT EXISTS workers (id TEXT PRIMARY KEY, name TEXT, role TEXT, active INTEGER, sort INTEGER);
    CREATE TABLE IF NOT EXISTS reservations (id TEXT PRIMARY KEY, serviceSlug TEXT, serviceName TEXT, price INTEGER, durationMin INTEGER, workerId TEXT, workerName TEXT, date TEXT, time TEXT, name TEXT, phone TEXT, email TEXT, notes TEXT, status TEXT, createdAt TEXT);
    CREATE UNIQUE INDEX IF NOT EXISTS uniq_slot ON reservations(workerId, date, time) WHERE status != 'cancelada';
    CREATE TABLE IF NOT EXISTS reviews (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, rating REAL, text TEXT, source TEXT, sort INTEGER);
    CREATE TABLE IF NOT EXISTS products (slug TEXT PRIMARY KEY, name TEXT, description TEXT, price INTEGER, image TEXT, active INTEGER, sort INTEGER);
    CREATE TABLE IF NOT EXISTS news (id INTEGER PRIMARY KEY AUTOINCREMENT, tag TEXT, title TEXT, text TEXT, sort INTEGER);
    CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, name TEXT, email TEXT, phone TEXT, text TEXT, createdAt TEXT, read INTEGER);
    CREATE TABLE IF NOT EXISTS settings (key TEXT PRIMARY KEY, value TEXT);
    CREATE TABLE IF NOT EXISTS users (email TEXT PRIMARY KEY, name TEXT, role TEXT, passHash TEXT);
    CREATE TABLE IF NOT EXISTS sessions (token TEXT PRIMARY KEY, email TEXT, role TEXT, name TEXT, expires INTEGER);
  `);

  const seeded = (await c.execute("SELECT COUNT(*) c FROM services")).rows[0].c as number;
  if (seeded > 0) return;

  const stmts: { sql: string; args: InArgs }[] = [];
  seedServices.forEach((s, i) =>
    stmts.push({ sql: "INSERT OR IGNORE INTO services (slug,name,tagline,description,durationMin,price,featured,image,sort) VALUES (?,?,?,?,?,?,?,?,?)", args: [s.slug, s.name, s.tagline, s.description, s.durationMin, s.price, s.featured ? 1 : 0, s.image ?? "", i] }),
  );
  [
    { id: "maricruz", name: "Maricruz", role: "owner" },
    { id: "lucia", name: "Lucía", role: "worker" },
  ].forEach((w, i) => stmts.push({ sql: "INSERT OR IGNORE INTO workers (id,name,role,active,sort) VALUES (?,?,?,1,?)", args: [w.id, w.name, w.role, i] }));
  seedReviews.forEach((r, i) => stmts.push({ sql: "INSERT INTO reviews (name,rating,text,source,sort) VALUES (?,?,?,?,?)", args: [r.name, r.rating, r.text, r.source ?? "", i] }));
  seedProducts.forEach((p, i) => stmts.push({ sql: "INSERT OR IGNORE INTO products (slug,name,description,price,image,active,sort) VALUES (?,?,?,?,?,?,?)", args: [p.slug, p.name, p.description, p.price, p.image, p.active ? 1 : 0, i] }));
  seedNews.forEach((n, i) => stmts.push({ sql: "INSERT INTO news (tag,title,text,sort) VALUES (?,?,?,?)", args: [n.tag, n.title, n.text, i] }));
  stmts.push({ sql: "INSERT OR IGNORE INTO settings (key,value) VALUES ('gallery',?)", args: [JSON.stringify(seedGallery)] });
  stmts.push({ sql: "INSERT OR IGNORE INTO settings (key,value) VALUES ('beforeAfter',?)", args: [JSON.stringify(seedBeforeAfter)] });
  stmts.push({ sql: "INSERT OR IGNORE INTO settings (key,value) VALUES ('contact',?)", args: [JSON.stringify({ phone: "+34 977 23 84 38", email: "hola@almarizo.com", address: "Carrer de Bonaventura Hernández i Sanahuja, 19, 43002 Tarragona", instagram: "https://www.instagram.com/mimasbymaricruz/", tiktok: "https://www.tiktok.com/@mimasbymaricruz", whatsapp: "" })] });
  stmts.push({ sql: "INSERT OR IGNORE INTO users (email,name,role,passHash) VALUES (?,?,?,?)", args: ["admin@almarizo.com", "Administración", "admin", hashPassword(pwEnv("ADMIN_PASSWORD", "admin"))] });
  stmts.push({ sql: "INSERT OR IGNORE INTO users (email,name,role,passHash) VALUES (?,?,?,?)", args: ["maricruz@almarizo.com", "Maricruz", "owner", hashPassword(pwEnv("OWNER_PASSWORD", "alma"))] });
  stmts.push({ sql: "INSERT OR IGNORE INTO users (email,name,role,passHash) VALUES (?,?,?,?)", args: ["equipo@almarizo.com", "Equipo", "worker", hashPassword(pwEnv("WORKER_PASSWORD", "equipo"))] });
  await c.batch(stmts, "write");
}

/* ---------- availability & reservations ---------- */
const toMin = (t: string) => { const [h, m] = t.split(":").map(Number); return h * 60 + m; };

export async function slotsForDate(dateStr: string, workerId: string, durationMin: number): Promise<string[]> {
  const wd = new Date(dateStr + "T00:00:00").getDay();
  const range = HOURS[wd];
  if (!range) return [];
  const [open, close] = range;
  const active = (await q("SELECT id FROM workers WHERE active = 1")).rows as unknown as { id: string }[];
  const dayRes = (await q("SELECT workerId, time, durationMin FROM reservations WHERE date = ? AND status != 'cancelada'", [dateStr])).rows as unknown as { workerId: string; time: string; durationMin: number }[];
  // Una estilista está ocupada en [inicio, inicio+duración). Un hueco vale si el
  // nuevo servicio [s,e) NO se solapa con ninguna cita suya (se tiene en cuenta
  // la duración real de cada cita, no solo la hora de inicio).
  const overlaps = (wid: string, s: number, e: number) =>
    dayRes.some((r) => r.workerId === wid && s < toMin(r.time) + (Number(r.durationMin) || 30) && toMin(r.time) < e);

  // Si la fecha es hoy, no ofrecer horas que ya han pasado.
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const nowMin = dateStr === todayStr ? now.getHours() * 60 + now.getMinutes() : -1;

  const out: string[] = [];
  for (let mt = open; mt + durationMin <= close; mt += 30) {
    if (mt <= nowMin) continue;
    const label = `${pad(Math.floor(mt / 60))}:${pad(mt % 60)}`;
    if (workerId === "sin-preferencia") {
      if (active.some((w) => !overlaps(w.id, mt, mt + durationMin))) out.push(label);
    } else if (!overlaps(workerId, mt, mt + durationMin)) {
      out.push(label);
    }
  }
  return out;
}

export type NewReservation = { serviceSlug: string; workerId: string; date: string; time: string; name: string; phone: string; email: string; notes: string };

export async function createReservation(input: NewReservation, opts?: { status?: ReservationStatus; force?: boolean }) {
  const svc = (await q("SELECT name, price, durationMin FROM services WHERE slug = ?", [input.serviceSlug])).rows[0] as unknown as { name: string; price: number; durationMin: number } | undefined;
  if (!svc) throw new Error("Servicio no válido");

  // `force` (solo admin) permite citas fuera de horario; el bloqueo de doble
  // reserva (por solapamiento) se mantiene siempre más abajo.
  if (!opts?.force) {
    const avail = await slotsForDate(input.date, input.workerId, svc.durationMin);
    if (!avail.includes(input.time)) throw new Error("Esa hora ya no está disponible");
  }

  const active = (await q("SELECT id, name FROM workers WHERE active = 1")).rows as unknown as { id: string; name: string }[];
  // Bloqueo de doble reserva por SOLAPAMIENTO (respeta la duración de cada cita).
  // Se aplica siempre, también con `force`.
  const newStart = toMin(input.time);
  const newEnd = newStart + svc.durationMin;
  const dayRes = (await q("SELECT workerId, time, durationMin FROM reservations WHERE date = ? AND status != 'cancelada'", [input.date])).rows as unknown as { workerId: string; time: string; durationMin: number }[];
  const overlaps = (wid: string) =>
    dayRes.some((r) => r.workerId === wid && newStart < toMin(r.time) + (Number(r.durationMin) || 30) && toMin(r.time) < newEnd);

  let candidates: { id: string; name: string }[];
  if (input.workerId === "sin-preferencia") {
    candidates = active.filter((w) => !overlaps(w.id));
    if (!candidates.length) throw new Error("No hay disponibilidad a esa hora");
  } else {
    const w = active.find((x) => x.id === input.workerId);
    if (!w) throw new Error("Estilista no válida");
    if (overlaps(w.id)) throw new Error("Esa hora ya no está disponible");
    candidates = [w];
  }

  for (const w of candidates) {
    const id = randomUUID();
    try {
      // The UNIQUE index on (workerId,date,time) is the ultimate guard against
      // two concurrent bookings landing on the same slot.
      await q(
        "INSERT INTO reservations (id,serviceSlug,serviceName,price,durationMin,workerId,workerName,date,time,name,phone,email,notes,status,createdAt) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
        [id, input.serviceSlug, svc.name, svc.price, svc.durationMin, w.id, w.name, input.date, input.time, input.name, input.phone, input.email, input.notes, opts?.status ?? "pendiente", new Date().toISOString()],
      );
      return { ...input, id, serviceName: svc.name, price: svc.price, durationMin: svc.durationMin, workerId: w.id, workerName: w.name };
    } catch {
      continue; // slot got taken concurrently → try next candidate
    }
  }
  throw new Error("Esa hora ya no está disponible");
}

/* ---------- reads ---------- */
export const allReservations = async () => rows("SELECT * FROM reservations ORDER BY date, time");
export const allServices = async () => rows("SELECT * FROM services ORDER BY sort");
export const allWorkers = async () => rows("SELECT * FROM workers ORDER BY sort");
export const allReviews = async () => rows("SELECT * FROM reviews ORDER BY sort");
export const allProducts = async () => rows("SELECT * FROM products ORDER BY sort");
export const allNews = async () => rows("SELECT * FROM news ORDER BY sort");
export const allMessages = async () => rows("SELECT * FROM messages ORDER BY createdAt DESC");
export async function getSetting(key: string) {
  const r = (await q("SELECT value FROM settings WHERE key = ?", [key])).rows[0] as unknown as { value: string } | undefined;
  return r ? JSON.parse(r.value) : null;
}

/* ---------- mutations ---------- */
export async function setSetting(key: string, value: unknown) {
  await q("INSERT INTO settings (key,value) VALUES (?,?) ON CONFLICT(key) DO UPDATE SET value = excluded.value", [key, JSON.stringify(value)]);
}
export async function setReservationStatus(id: string, status: ReservationStatus) {
  await q("UPDATE reservations SET status = ? WHERE id = ?", [status, id]);
}
export async function deleteReservation(id: string) {
  await q("DELETE FROM reservations WHERE id = ?", [id]);
}
export async function addMessage(m: { name: string; email: string; phone: string; text: string }) {
  await q("INSERT INTO messages (id,name,email,phone,text,createdAt,read) VALUES (?,?,?,?,?,?,0)", [randomUUID(), m.name, m.email, m.phone, m.text, new Date().toISOString()]);
}
export async function markMessageRead(id: string) {
  await q("UPDATE messages SET read = 1 WHERE id = ?", [id]);
}

async function replaceAll(table: string, cols: string, rows: InArgs[]) {
  const client = await ready();
  const placeholders = cols.split(",").map(() => "?").join(",");
  const stmts = [{ sql: `DELETE FROM ${table}`, args: [] as InArgs }, ...rows.map((args) => ({ sql: `INSERT INTO ${table} (${cols}) VALUES (${placeholders})`, args }))];
  await client.batch(stmts, "write");
}
type ServiceInput = { slug: string; name: string; tagline: string; description: string; durationMin: number; price: number; featured: boolean; image: string };
export const replaceServices = (items: ServiceInput[]) => replaceAll("services", "slug,name,tagline,description,durationMin,price,featured,image,sort", items.map((s, i) => [s.slug, s.name, s.tagline, s.description, s.durationMin, s.price, s.featured ? 1 : 0, s.image ?? "", i]));
type WorkerInput = { id: string; name: string; role: string; active: boolean };
export const replaceWorkers = (items: WorkerInput[]) => replaceAll("workers", "id,name,role,active,sort", items.map((w, i) => [w.id, w.name, w.role, w.active ? 1 : 0, i]));
type ReviewInput = { name: string; rating: number; text: string; source: string };
export const replaceReviews = (items: ReviewInput[]) => replaceAll("reviews", "name,rating,text,source,sort", items.map((r, i) => [r.name, r.rating, r.text, r.source ?? "", i]));
type ProductInput = { slug: string; name: string; description: string; price: number; image: string; active: boolean };
export const replaceProducts = (items: ProductInput[]) => replaceAll("products", "slug,name,description,price,image,active,sort", items.map((p, i) => [p.slug, p.name, p.description, p.price, p.image, p.active ? 1 : 0, i]));
type NewsInput = { tag: string; title: string; text: string };
export const replaceNews = (items: NewsInput[]) => replaceAll("news", "tag,title,text,sort", items.map((n, i) => [n.tag, n.title, n.text, i]));

/* ---------- auth ---------- */
export async function authenticate(email: string, password: string) {
  const u = (await q("SELECT * FROM users WHERE email = ?", [email.trim().toLowerCase()])).rows[0] as unknown as { email: string; name: string; role: Role; passHash: string } | undefined;
  if (!u || !verifyPassword(password, u.passHash)) return null;
  return { email: u.email, name: u.name, role: u.role };
}
export async function createSession(email: string, role: string, name: string) {
  const token = randomUUID() + randomUUID();
  const expires = Date.now() + 7 * 24 * 3600 * 1000;
  await q("INSERT INTO sessions (token,email,role,name,expires) VALUES (?,?,?,?,?)", [token, email, role, name, expires]);
  return token;
}
export async function readSession(token: string) {
  const s = (await q("SELECT * FROM sessions WHERE token = ?", [token])).rows[0] as unknown as { email: string; role: Role; name: string; expires: number } | undefined;
  if (!s || Number(s.expires) < Date.now()) return null;
  return { email: s.email, role: s.role, name: s.name };
}
export async function destroySession(token: string) {
  await q("DELETE FROM sessions WHERE token = ?", [token]);
}
