"use client";

import { useEffect, useState } from "react";
import { loadData, getSession, CHANGE_EVENT, type Session } from "./store";

type Data = ReturnType<typeof loadData>;

/** Subscribe to the localStorage store. Returns null until mounted
 *  (prevents SSR hydration mismatch — render a loader meanwhile). */
export function useStoreData(): Data | null {
  const [data, setData] = useState<Data | null>(null);
  useEffect(() => {
    const sync = () => setData(loadData());
    sync();
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return data;
}

export function useSession(): { session: Session | null; ready: boolean } {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setSession(getSession());
    sync();
    setReady(true);
    window.addEventListener(CHANGE_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { session, ready };
}
