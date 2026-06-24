import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";

/**
 * CAPI server-side para el evento "Contact" (clic en WhatsApp sin llenar el form).
 * Espejo del Lead de submit-lead.ts: mismo formato form-urlencoded y v21.0.
 * Como no hay PII (no llenó nada), matchea por cookies _fbp/_fbc + IP + user-agent.
 * Deduplica con el Pixel del navegador vía event_id. Best-effort: nunca rompe.
 */
export async function POST(req: Request) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (!pixelId || !capiToken) return NextResponse.json({ ok: false });

  let body: { event_id?: string; source?: string; url?: string } = {};
  try {
    body = await req.json();
  } catch {}

  try {
    const h = await headers();
    const c = await cookies();

    const userData: Record<string, unknown> = {};
    const ua = h.get("user-agent");
    if (ua) userData.client_user_agent = ua;
    const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim();
    if (ip) userData.client_ip_address = ip;
    const fbp = c.get("_fbp")?.value;
    if (fbp) userData.fbp = fbp;
    const fbc = c.get("_fbc")?.value;
    if (fbc) userData.fbc = fbc;

    const event: Record<string, unknown> = {
      event_name: "Contact",
      event_time: Math.floor(Date.now() / 1000),
      action_source: "website",
      user_data: userData,
      custom_data: { content_name: body.source ?? "whatsapp" },
    };
    if (body.event_id) event.event_id = body.event_id; // dedup con el Pixel
    const src = body.url ?? h.get("referer") ?? process.env.NEXT_PUBLIC_SITE_URL;
    if (src) event.event_source_url = src;

    const capiBody = new URLSearchParams();
    capiBody.set("data", JSON.stringify([event]));
    capiBody.set("access_token", capiToken);
    if (process.env.META_CAPI_TEST_EVENT_CODE) {
      capiBody.set("test_event_code", process.env.META_CAPI_TEST_EVENT_CODE);
    }

    await fetch(`https://graph.facebook.com/v21.0/${pixelId}/events`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: capiBody.toString(),
    });
  } catch (e) {
    console.error("[track-contact] capi error:", e);
  }

  return NextResponse.json({ ok: true });
}
