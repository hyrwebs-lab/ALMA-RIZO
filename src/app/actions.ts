"use server";

import { cookies } from "next/headers";
import * as db from "@/lib/db";

const COOKIE = "alma_session";

/* ---------------- Auth helpers ---------------- */
export async function getSessionAction() {
  const token = (await cookies()).get(COOKIE)?.value;
  if (!token) return null;
  return db.readSession(token);
}
async function requireSession() {
  const s = await getSessionAction();
  if (!s) throw new Error("No autorizado");
  return s;
}
async function requireContent() {
  const s = await requireSession();
  if (s.role !== "admin" && s.role !== "owner") throw new Error("Sin permiso");
  return s;
}

export async function loginAction(email: string, password: string) {
  const user = await db.authenticate(email, password);
  if (!user) return { ok: false as const, error: "Email o contraseña incorrectos." };
  const token = await db.createSession(user.email, user.role, user.name);
  (await cookies()).set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 7 * 24 * 3600,
  });
  return { ok: true as const, session: user };
}

export async function logoutAction() {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (token) await db.destroySession(token);
  jar.delete(COOKIE);
  return { ok: true as const };
}

/* ---------------- Public: booking ---------------- */
export async function getAvailabilityAction(date: string, workerId: string, durationMin: number) {
  return db.slotsForDate(date, workerId, durationMin);
}

export async function createReservationAction(input: db.NewReservation) {
  try {
    const r = await db.createReservation(input);
    return { ok: true as const, reservation: r };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "No se pudo crear la reserva" };
  }
}

export async function getBookingDataAction() {
  const [services, workers] = await Promise.all([db.allServices(), db.allWorkers()]);
  return { services, workers: workers.filter((w) => w.active === 1) };
}

export async function sendMessageAction(input: { name: string; email: string; phone: string; text: string }) {
  await db.addMessage(input);
  return { ok: true as const };
}

/* ---------------- Admin: data ---------------- */
export async function getAdminDataAction() {
  await requireSession();
  const [reservations, services, workers, reviews, products, news, messages, gallery, beforeAfter, contact] = await Promise.all([
    db.allReservations(),
    db.allServices(),
    db.allWorkers(),
    db.allReviews(),
    db.allProducts(),
    db.allNews(),
    db.allMessages(),
    db.getSetting("gallery"),
    db.getSetting("beforeAfter"),
    db.getSetting("contact"),
  ]);
  return { reservations, services, workers, reviews, products, news, messages, gallery: gallery ?? [], beforeAfter: beforeAfter ?? [], contact: contact ?? {} };
}

/* ---------------- Admin: reservations (all roles) ---------------- */
export async function adminSetStatusAction(id: string, status: db.ReservationStatus) {
  await requireSession();
  await db.setReservationStatus(id, status);
  return { ok: true as const };
}
export async function adminDeleteReservationAction(id: string) {
  await requireSession();
  await db.deleteReservation(id);
  return { ok: true as const };
}
export async function adminCreateReservationAction(input: db.NewReservation, force = false) {
  await requireSession();
  try {
    const r = await db.createReservation(input, { status: "confirmada", force });
    return { ok: true as const, reservation: r };
  } catch (e) {
    return { ok: false as const, error: e instanceof Error ? e.message : "Error" };
  }
}
export async function adminMarkMessageReadAction(id: string) {
  await requireContent();
  await db.markMessageRead(id);
  return { ok: true as const };
}

/* ---------------- Admin: content (admin + owner) ---------------- */
export async function saveServicesAction(items: Parameters<typeof db.replaceServices>[0]) {
  await requireContent();
  await db.replaceServices(items);
  return { ok: true as const };
}
export async function saveWorkersAction(items: Parameters<typeof db.replaceWorkers>[0]) {
  await requireContent();
  await db.replaceWorkers(items);
  return { ok: true as const };
}
export async function saveReviewsAction(items: Parameters<typeof db.replaceReviews>[0]) {
  await requireContent();
  await db.replaceReviews(items);
  return { ok: true as const };
}
export async function saveProductsAction(items: Parameters<typeof db.replaceProducts>[0]) {
  await requireContent();
  await db.replaceProducts(items);
  return { ok: true as const };
}
export async function saveNewsAction(items: Parameters<typeof db.replaceNews>[0]) {
  await requireContent();
  await db.replaceNews(items);
  return { ok: true as const };
}
export async function saveGalleryAction(items: unknown) {
  await requireContent();
  await db.setSetting("gallery", items);
  return { ok: true as const };
}
export async function saveBeforeAfterAction(items: unknown) {
  await requireContent();
  await db.setSetting("beforeAfter", items);
  return { ok: true as const };
}
export async function saveContactAction(contact: unknown) {
  await requireContent();
  await db.setSetting("contact", contact);
  return { ok: true as const };
}
