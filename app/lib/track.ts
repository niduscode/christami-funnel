// Helper client-side para avisarle a los "soplones" (Meta Pixel + CAPI) que
// alguien hizo clic en WhatsApp SIN llenar el form = evento estándar "Contact".
// Dispara el Pixel del navegador y, en paralelo, pega al endpoint server-side
// para que CAPI mande el MISMO evento con el mismo event_id → Meta no lo cuenta
// doble. Resiste iOS/Safari/bloqueadores igual que el Lead del form.
//
// Funciona porque los botones de WhatsApp abren en pestaña nueva (target=_blank):
// la landing sigue viva, así el Pixel y el fetch a CAPI alcanzan a salir.

type Fbq = (...args: unknown[]) => void;
type Gtag = (...args: unknown[]) => void;

export function trackContact(source: string): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as { fbq?: Fbq; gtag?: Gtag };

  // event_id compartido entre Pixel y CAPI para deduplicar.
  let eventId: string;
  try {
    eventId = crypto.randomUUID();
  } catch {
    eventId = `ct-${Date.now()}-${Math.round(Math.random() * 1e9)}`;
  }

  // Pixel (navegador)
  try {
    w.fbq?.("track", "Contact", { content_name: source }, { eventID: eventId });
  } catch {}
  // GA (micro-evento opcional)
  try {
    w.gtag?.("event", "whatsapp_click", { source });
  } catch {}

  // CAPI (server) — best effort. keepalive: que sobreviva aunque la pestaña navegue.
  try {
    void fetch("/api/track-contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event_id: eventId, source, url: window.location.href }),
      keepalive: true,
    }).catch(() => {});
  } catch {}
}
