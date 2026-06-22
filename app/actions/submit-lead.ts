"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/app/lib/supabase/admin";
import { leadInputSchema, normalizeTelefono } from "@/app/lib/schemas";
import { calcScore } from "@/app/lib/score";
import { renderLeadEmail } from "@/app/lib/email";
import { createHash } from "crypto";
import { headers } from "next/headers";

/** SHA-256 en hex. Meta exige hashear el PII (teléfono/email) antes de enviarlo por CAPI. */
function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

export type SubmitState = {
  ok: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
};

export async function submitLead(_prev: SubmitState | null, formData: FormData): Promise<SubmitState> {
  const raw = Object.fromEntries(formData.entries());

  // Normalizar teléfono antes de validar
  if (typeof raw.telefono === "string") {
    raw.telefono = normalizeTelefono(raw.telefono);
  }

  const parsed = leadInputSchema.safeParse(raw);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { ok: false, error: "Revisa los campos marcados.", fieldErrors };
  }

  const input = parsed.data;
  const score = calcScore(input);

  // Service-role: el form es público pero el insert corre server-side, así
  // evitamos darle GRANT SELECT a anon (que requeriría PostgREST cuando
  // hacés .select() después del INSERT) sin abrir el read a anon.
  const supabase = getSupabaseAdmin();
  const { data: inserted, error } = await supabase
    .from("leads")
    .insert({
      nombre: input.nombre,
      email: input.email || null,
      telefono: input.telefono,
      ciudad: input.ciudad,
      tipo_proyecto: input.tipo_proyecto,
      presupuesto_rango: input.presupuesto_rango,
      plazo: input.plazo,
      score,
      utm_source: input.utm_source || null,
      utm_campaign: input.utm_campaign || null,
      utm_medium: input.utm_medium || null,
    })
    .select()
    .single();

  if (error || !inserted) {
    console.error("[submit-lead] insert error:", error);
    return { ok: false, error: "No pudimos guardar tu solicitud. Intenta de nuevo o escríbenos por WhatsApp." };
  }

  // Email best-effort: si Resend falla, el lead ya está guardado.
  if (process.env.RESEND_API_KEY) {
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.RESEND_FROM ?? "leads@christami.cl",
        to: process.env.RESEND_TO ?? "mueblechristami@gmail.com",
        subject: `Nuevo lead · score ${score} · ${input.nombre}`,
        html: renderLeadEmail(inserted),
      });
    } catch (e) {
      console.error("[submit-lead] resend error:", e);
    }
  }

  // CAPI (Conversions API) best-effort: evento Lead server-side. Mejora el matching
  // de Meta y resiste iOS 14.5+/Safari ITP/bloqueadores que matan al Pixel del
  // navegador. Si falla, el lead ya está guardado (igual que Resend).
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const capiToken = process.env.META_CAPI_ACCESS_TOKEN;
  if (pixelId && capiToken) {
    try {
      const h = await headers();
      const userData: Record<string, unknown> = {
        ph: [sha256(input.telefono.replace(/\D/g, ""))],
      };
      if (input.email) userData.em = [sha256(input.email.trim().toLowerCase())];
      const ua = h.get("user-agent");
      if (ua) userData.client_user_agent = ua;
      const ip = h.get("x-forwarded-for")?.split(",")[0]?.trim();
      if (ip) userData.client_ip_address = ip;

      const event: Record<string, unknown> = {
        event_name: "Lead",
        event_time: Math.floor(Date.now() / 1000),
        event_id: inserted.id, // permite deduplicar con el Pixel del navegador
        action_source: "website",
        user_data: userData,
        custom_data: { value: score, currency: "CLP" },
      };
      const src = h.get("referer") ?? process.env.NEXT_PUBLIC_SITE_URL;
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
      console.error("[submit-lead] capi error:", e);
    }
  }

  const params = new URLSearchParams({
    id: inserted.id,
    nombre: input.nombre,
    tipo: input.tipo_proyecto,
    plazo: input.plazo,
    presup: input.presupuesto_rango,
    ciudad: input.ciudad,
    score: String(score),
  });
  redirect(`/gracias?${params.toString()}`);
}
