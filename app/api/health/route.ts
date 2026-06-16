import { getSupabaseAdmin } from "@/app/lib/supabase/admin";

/**
 * Health check + KEEP-ALIVE de Supabase.
 *
 * El plan gratuito de Supabase PAUSA el proyecto tras ~7 días sin actividad,
 * lo que rompe el formulario de leads (el insert falla y el usuario ve
 * "No pudimos guardar tu solicitud"). Este endpoint hace un query trivial
 * a la base, lo que cuenta como actividad y resetea ese contador.
 *
 * Lo invoca un Vercel Cron una vez al día (ver vercel.json) → la base nunca
 * se duerme. También sirve como endpoint de monitoreo de uptime: devuelve
 * 200 si la DB responde, 503 si no.
 *
 * No expone datos del negocio (no devuelve cantidad de leads ni contenido).
 */

// Evita que Next lo cachee/optimice como estático: debe ejecutarse de verdad
// en cada invocación para que el query a la DB ocurra.
export const dynamic = "force-dynamic";

export async function GET() {
  const startedAt = Date.now();
  try {
    const supabase = getSupabaseAdmin();
    // Query mínimo: head=true no trae filas, solo confirma que la DB responde.
    const { error } = await supabase
      .from("leads")
      .select("id", { head: true, count: "exact" })
      .limit(1);

    if (error) {
      console.error("[health] supabase error:", error);
      return Response.json(
        { ok: false, db: "down", error: error.message },
        { status: 503 }
      );
    }

    return Response.json({ ok: true, db: "up", ms: Date.now() - startedAt });
  } catch (e) {
    console.error("[health] unexpected error:", e);
    return Response.json(
      { ok: false, db: "down", error: e instanceof Error ? e.message : "unknown" },
      { status: 503 }
    );
  }
}
