import Link from "next/link";
import { getSupabaseServer } from "@/app/lib/supabase/server";
import type { Lead } from "@/app/lib/schemas";
import { scoreTier } from "@/app/lib/score";

export const dynamic = "force-dynamic";

const ESTADO_LABEL: Record<Lead["estado"], string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  calificado: "Calificado",
  ganado: "Ganado",
  perdido: "Perdido",
};

export default async function AdminPage({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const supabase = await getSupabaseServer();
  let query = supabase.from("leads").select("*").order("created_at", { ascending: false }).limit(200);
  if (sp.estado) query = query.eq("estado", sp.estado);

  const { data: leads, error } = await query;

  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--olive)]">Bandeja</div>
          <h1 className="font-serif text-3xl text-[var(--brown-deep)]">Leads</h1>
        </div>
        <div className="flex gap-2 text-xs">
          <FiltroBtn current={sp.estado} value={undefined}>Todos</FiltroBtn>
          {(["nuevo", "contactado", "calificado", "ganado", "perdido"] as const).map((e) => (
            <FiltroBtn key={e} current={sp.estado} value={e}>{ESTADO_LABEL[e]}</FiltroBtn>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">{error.message}</div>
      )}

      <div className="overflow-hidden rounded-2xl border border-[var(--line)] bg-[var(--cream-soft)]">
        <table className="w-full text-sm">
          <thead className="bg-[var(--cream)] text-left text-xs uppercase tracking-wider text-[var(--muted)]">
            <tr>
              <th className="px-4 py-3">Fecha</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Proyecto</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Origen</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {(leads ?? []).map((l) => (
              <tr key={l.id} className="border-t border-[var(--line)]">
                <td className="px-4 py-3 text-[var(--muted)]">{new Date(l.created_at).toLocaleString("es-CL", { dateStyle: "short", timeStyle: "short" })}</td>
                <td className="px-4 py-3 font-semibold text-[var(--brown-deep)]">{l.nombre}</td>
                <td className="px-4 py-3 capitalize">{l.tipo_proyecto}</td>
                <td className="px-4 py-3"><ScoreBadge value={l.score} /></td>
                <td className="px-4 py-3 capitalize">{l.estado}</td>
                <td className="px-4 py-3 text-xs text-[var(--muted)]">{l.utm_source ?? "directo"}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/leads/${l.id}`} className="text-[var(--olive)] underline">Ver</Link>
                </td>
              </tr>
            ))}
            {!leads?.length && (
              <tr><td colSpan={7} className="px-4 py-10 text-center text-[var(--muted)]">Sin leads aún.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ScoreBadge({ value }: { value: number }) {
  const tier = scoreTier(value);
  const cls =
    tier === "caliente" ? "bg-[var(--olive)] text-[var(--cream-soft)]" :
    tier === "tibio" ? "bg-[var(--wood-light)] text-[var(--cream-soft)]" :
    "bg-[var(--line)] text-[var(--brown)]";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${cls}`}>{value}</span>;
}

function FiltroBtn({ current, value, children }: { current?: string; value?: string; children: React.ReactNode }) {
  const active = (current ?? undefined) === value;
  const href = value ? `/admin?estado=${value}` : "/admin";
  return (
    <Link
      href={href}
      className={`rounded-full px-3 py-1 transition ${active ? "bg-[var(--brown-deep)] text-[var(--cream-soft)]" : "border border-[var(--line)] text-[var(--brown)] hover:bg-[var(--cream-soft)]"}`}
    >
      {children}
    </Link>
  );
}
