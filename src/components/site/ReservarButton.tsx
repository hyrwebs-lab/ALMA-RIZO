"use client";

import type { ComponentProps, ReactNode } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { WhatsAppIcon } from "@/components/ui/Icons";
import { useLinks } from "@/lib/contact";
import { useT } from "@/lib/i18n";
import { bookingMessage } from "@/lib/booking";

type Props = Omit<ComponentProps<typeof ButtonLink>, "href" | "children" | "external"> & {
  /** Nombre del servicio, para que el mensaje vaya ya escrito. */
  service?: string;
  /** Texto del botón (por defecto, el del idioma activo). */
  label?: ReactNode;
  /** Icono de WhatsApp delante del texto. */
  icon?: boolean;
};

/**
 * Botón de «Reservar». Las citas ya no se cierran desde la web: la dueña
 * prefiere hablarlo antes por WhatsApp, así que todos estos botones abren la
 * conversación con el mensaje escrito.
 */
export default function ReservarButton({ service, label, icon = true, ...rest }: Props) {
  const { wa } = useLinks();
  const t = useT();
  return (
    <ButtonLink href={service ? wa(bookingMessage(service)) : wa()} external {...rest}>
      {icon && <WhatsAppIcon className="h-4 w-4" />}
      {label ?? t.cta.reservar}
    </ButtonLink>
  );
}
