import { createClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase con SERVICE_ROLE (bypassa RLS).
 *
 * ⚠️ USAR SOLO EN SERVER ACTIONS / ROUTE HANDLERS — nunca importar desde
 * un componente cliente. La key vive en SUPABASE_SERVICE_ROLE_KEY que
 * NO tiene prefijo NEXT_PUBLIC_, así Next nunca la bundlea al browser.
 *
 * Se usa para operaciones que necesitan saltarse la RLS, como insertar
 * leads desde un formulario público (la `anon` key sirve, pero PostgREST
 * con .select() después del INSERT requiere también GRANT SELECT, y
 * preferimos no abrirle SELECT a anon ni siquiera filtrado por RLS).
 */
export function getSupabaseAdmin() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      "Supabase admin client: falta NEXT_PUBLIC_SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
    );
  }
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
