"use client";
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import * as A from "@/app/actions";
import type { Role } from "@/lib/store";

export type AdminData = {
  reservations: any[];
  services: any[];
  workers: any[];
  reviews: any[];
  products: any[];
  news: any[];
  messages: any[];
  gallery: any[];
  beforeAfter: any[];
  settings: any;
};

const EMPTY: AdminData = { reservations: [], services: [], workers: [], reviews: [], products: [], news: [], messages: [], gallery: [], beforeAfter: [], settings: {} };

let cache: AdminData | null = null;
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

function normalize(raw: any): AdminData {
  return {
    reservations: raw.reservations ?? [],
    services: (raw.services ?? []).map((s: any) => ({ ...s, featured: !!s.featured })),
    workers: (raw.workers ?? []).map((w: any) => ({ ...w, active: !!w.active })),
    reviews: raw.reviews ?? [],
    products: (raw.products ?? []).map((p: any) => ({ ...p, active: !!p.active })),
    news: raw.news ?? [],
    messages: (raw.messages ?? []).map((m: any) => ({ ...m, read: !!m.read })),
    gallery: raw.gallery ?? [],
    beforeAfter: raw.beforeAfter ?? [],
    settings: raw.contact ?? {},
  };
}

export async function refresh() {
  try {
    cache = normalize(await A.getAdminDataAction());
  } catch {
    /* not authorized */
  }
  notify();
}

export function loadData(): AdminData {
  return cache ?? EMPTY;
}

export function useAdminData(): AdminData | null {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((v) => v + 1);
    listeners.add(l);
    if (!cache) refresh();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return cache;
}

/* ---- session ---- */
export type Session = { email: string; name: string; role: Role } | null;
let session: Session = null;
let sessionReady = false;
const sListeners = new Set<() => void>();
const sNotify = () => sListeners.forEach((l) => l());

export async function login(email: string, password: string): Promise<boolean> {
  const r = await A.loginAction(email, password);
  if (r.ok) {
    session = r.session as Session;
    sNotify();
    await refresh();
    return true;
  }
  return false;
}
export async function logout() {
  await A.logoutAction();
  session = null;
  cache = null;
  sNotify();
  notify();
}
export function useSession(): { session: Session; ready: boolean } {
  const [, force] = useState(0);
  useEffect(() => {
    const l = () => force((v) => v + 1);
    sListeners.add(l);
    if (!sessionReady) {
      A.getSessionAction().then((s) => {
        session = s as Session;
        sessionReady = true;
        sNotify();
      });
    }
    return () => {
      sListeners.delete(l);
    };
  }, []);
  return { session, ready: sessionReady };
}

/* ---- mutations (fire then refresh) ---- */
export const setReservationStatus = (id: string, status: any) => void A.adminSetStatusAction(id, status).then(refresh);
export const deleteReservation = (id: string) => void A.adminDeleteReservationAction(id).then(refresh);
export async function createReservationAdmin(input: any, force = false): Promise<{ ok: boolean; error?: string }> {
  const r = await A.adminCreateReservationAction(input, force);
  if (r.ok) await refresh();
  return r.ok ? { ok: true } : { ok: false, error: (r as any).error };
}
export const getAvailability = (date: string, workerId: string, durationMin: number): Promise<string[]> =>
  A.getAvailabilityAction(date, workerId, durationMin);
export const saveServices = (items: any) => void A.saveServicesAction(items).then(refresh);
export const saveWorkers = (items: any) => void A.saveWorkersAction(items).then(refresh);
export const saveReviews = (items: any) => void A.saveReviewsAction(items).then(refresh);
export const saveProducts = (items: any) => void A.saveProductsAction(items).then(refresh);
export const saveNews = (items: any) => void A.saveNewsAction(items).then(refresh);
export const saveGallery = (items: any) => void A.saveGalleryAction(items).then(refresh);
export const saveBeforeAfter = (items: any) => void A.saveBeforeAfterAction(items).then(refresh);
export const saveSettings = (items: any) => void A.saveContactAction(items).then(refresh);
export const markMessageRead = (id: string) => void A.adminMarkMessageReadAction(id).then(refresh);
