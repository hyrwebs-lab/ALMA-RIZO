"use client";

import { useState } from "react";
import { addMessage } from "@/lib/store";
import { Button } from "@/components/ui/Button";
import { whatsappUrl } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/ui/Icons";

const inputCls =
  "w-full border border-brand/20 bg-cream-soft px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-gold";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", text: "" });
  const [sent, setSent] = useState(false);

  const valid = form.name.trim().length > 1 && form.text.trim().length > 3;

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid) return;
    addMessage({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      text: form.text.trim(),
    });
    setSent(true);
  }

  if (sent) {
    return (
      <div className="border border-gold/40 bg-cream p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/20 text-gold">
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
        </div>
        <h3 className="mt-4 font-display text-2xl text-brand">¡Mensaje enviado!</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Te responderemos lo antes posible. Si prefieres, escríbenos directamente por WhatsApp.
        </p>
        <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block">
          <Button variant="gold" size="sm"><WhatsAppIcon className="h-4 w-4" /> Abrir WhatsApp</Button>
        </a>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-4">
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">Nombre *</span>
        <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tu nombre" />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">Email</span>
          <input className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="tu@email.com" inputMode="email" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">Teléfono</span>
          <input className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="600 000 000" inputMode="tel" />
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-xs uppercase tracking-widest text-ink-soft">Mensaje *</span>
        <textarea className={`${inputCls} h-32 resize-none`} value={form.text} onChange={(e) => setForm({ ...form, text: e.target.value })} placeholder="¿En qué podemos ayudarte?" />
      </label>
      <div>
        <Button type="submit" disabled={!valid} variant="gold" size="md">Enviar mensaje</Button>
      </div>
    </form>
  );
}
