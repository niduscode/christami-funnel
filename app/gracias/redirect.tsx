"use client";

import { useEffect } from "react";

export function GraciasRedirect({
  waUrl,
  score,
  eventId,
}: {
  waUrl: string;
  score: number;
  eventId?: string;
}) {
  useEffect(() => {
    const w = window as unknown as {
      fbq?: (...a: unknown[]) => void;
      gtag?: (...a: unknown[]) => void;
    };
    // Eventos de conversión. El Lead lleva eventID = id del lead → deduplica
    // con el Lead server-side de CAPI (submit-lead.ts), así Meta cuenta UN Lead.
    w.fbq?.("track", "CompleteRegistration", { value: score, currency: "CLP" });
    w.fbq?.(
      "track",
      "Lead",
      { value: score, currency: "CLP" },
      eventId ? { eventID: eventId } : undefined
    );
    w.gtag?.("event", "form_submit", { score });
    w.gtag?.("event", "whatsapp_click");

    const t = window.setTimeout(() => {
      window.location.href = waUrl;
    }, 1800);
    return () => window.clearTimeout(t);
  }, [waUrl, score, eventId]);

  return null;
}
