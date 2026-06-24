"use client";

import type { ReactNode } from "react";
import { trackContact } from "@/app/lib/track";

/**
 * Enlace a WhatsApp que avisa a los soplones (Pixel + CAPI) con un evento
 * "Contact" al hacer clic. Abre en pestaña nueva, así la landing sigue viva
 * y el tracking alcanza a salir. `source` identifica de qué botón salió.
 */
export function WaLink({
  href,
  source,
  className,
  ariaLabel,
  children,
}: {
  href: string;
  source: string;
  className?: string;
  ariaLabel?: string;
  children: ReactNode;
}) {
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackContact(source)}
    >
      {children}
    </a>
  );
}
