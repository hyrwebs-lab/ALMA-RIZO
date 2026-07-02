import { site } from "./site";

/** Tiny className joiner (no extra deps). */
export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

/** Build a wa.me link with the prefilled message. */
export function whatsappUrl(message?: string) {
  const msg = encodeURIComponent(message ?? site.contact.whatsappMsg);
  return `https://wa.me/${site.contact.whatsapp}?text=${msg}`;
}

export function telUrl() {
  return `tel:${site.contact.phoneHref}`;
}

export function formatPrice(n: number) {
  return `${n} €`;
}

export function formatDuration(min: number) {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h} h ${m} min` : `${h} h`;
}
