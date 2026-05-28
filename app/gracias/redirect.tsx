"use client";

import { useEffect } from "react";

export function GraciasRedirect({ waUrl, score }: { waUrl: string; score: number }) {
  useEffect(() => {
    // Eventos de conversión
    // @ts-expect-error fbq global
    window.fbq?.("track", "CompleteRegistration", { value: score, currency: "CLP" });
    // @ts-expect-error fbq global
    window.fbq?.("track", "Lead", { value: score, currency: "CLP" });
    // @ts-expect-error gtag global
    window.gtag?.("event", "form_submit", { score });
    // @ts-expect-error gtag global
    window.gtag?.("event", "whatsapp_click");

    const t = window.setTimeout(() => {
      window.location.href = waUrl;
    }, 1800);
    return () => window.clearTimeout(t);
  }, [waUrl, score]);

  return null;
}
