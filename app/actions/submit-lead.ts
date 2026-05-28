"use server";

import { redirect } from "next/navigation";
import { Resend } from "resend";
import { getSupabaseAdmin } from "@/app/lib/supabase/admin";
import { leadInputSchema, normalizeTelefono } from "@/app/lib/schemas";
import { calcScore } from "@/app/lib/score";
import { renderLeadEmail } from "@/app/lib/email";

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
