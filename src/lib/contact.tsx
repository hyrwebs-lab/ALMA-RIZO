"use client";

import { createContext, useContext } from "react";
import { defaultContact, telHref, waHref, type Contact } from "./site";

/**
 * Reparte por toda la web los datos de contacto que la dueña guarda en el
 * panel («Datos de contacto»). El layout los lee de la base de datos y los
 * inyecta aquí, así cualquier cambio del panel se refleja en la web pública.
 */
const ContactCtx = createContext<Contact>(defaultContact);

export function ContactProvider({ value, children }: { value: Contact; children: React.ReactNode }) {
  return <ContactCtx.Provider value={value}>{children}</ContactCtx.Provider>;
}

export const useContact = () => useContext(ContactCtx);

/** Atajos para los enlaces de llamar y WhatsApp con los datos actuales. */
export function useLinks() {
  const contact = useContact();
  return {
    contact,
    tel: telHref(contact),
    wa: (message?: string) => waHref(contact, message),
  };
}
