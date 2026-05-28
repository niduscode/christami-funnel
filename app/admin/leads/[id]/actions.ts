"use server";

import { revalidatePath } from "next/cache";
import { getSupabaseServer } from "@/app/lib/supabase/server";

const ESTADOS = ["nuevo", "contactado", "calificado", "ganado", "perdido"] as const;
const TIPOS = ["whatsapp", "email", "llamada", "visita"] as const;

export async function updateEstado(id: string, formData: FormData) {
  const estado = String(formData.get("estado") ?? "");
  if (!ESTADOS.includes(estado as (typeof ESTADOS)[number])) return;
  const supabase = await getSupabaseServer();
  await supabase.from("leads").update({ estado }).eq("id", id);
  revalidatePath(`/admin/leads/${id}`);
  revalidatePath("/admin");
}

export async function addInteraccion(id: string, formData: FormData) {
  const tipo = String(formData.get("tipo") ?? "");
  const contenido = String(formData.get("contenido") ?? "").trim();
  if (!TIPOS.includes(tipo as (typeof TIPOS)[number]) || !contenido) return;
  const supabase = await getSupabaseServer();
  await supabase.from("interacciones").insert({ lead_id: id, tipo, contenido });
  revalidatePath(`/admin/leads/${id}`);
}
