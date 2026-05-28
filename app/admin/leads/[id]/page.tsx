import Link from "next/link";
import { notFound } from "next/navigation";
import { getSupabaseServer } from "@/app/lib/supabase/server";
import { updateEstado, addInteraccion } from "./actions";

export const dynamic = "force-dynamic";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await getSupabaseServer();

  const { data: lead } = await supabase.from("leads").select("*").eq("id", id).single();
  if (!lead) notFound();

  const { data: interacciones } = await supabase
    .from("interacciones")
    .select("*")
    .eq("lead_id", id)
    .order("fecha", { ascending: false });

  return (
    <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
      <section>
        <Link href="/admin" className="text-xs text-[var(--olive)] underline">← Volver</Link>
        <h1 className="mt-2 font-serif text-3xl text-[var(--brown-deep)]">{lead.nombre}</h1>
        <p className="text-sm text-[var(--muted)]">{new Date(lead.created_at).toLocaleString("es-CL")}</p>

        <dl className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-[var(--line)] bg-[var(--cream-soft)] p-6 text-sm">
          <Row k="Teléfono" v={<a href={`tel:${lead.telefono.replace(/\s/g, "")}`} className="underline">{lead.telefono}</a>} />
          <Row k="Email" v={lead.email ? <a href={`mailto:${lead.email}`} className="underline">{lead.email}</a> : "—"} />
          <Row k="Ciudad" v={lead.ciudad ?? "—"} />
          <Row k="Tipo" v={<span className="capitalize">{lead.tipo_proyecto}</span>} />
          <Row k="Plazo" v={lead.plazo} />
          <Row k="Presupuesto" v={lead.presupuesto_rango} />
          <Row k="Score" v={<strong className="text-[var(--brown-deep)]">{lead.score}</strong>} />
          <Row k="Estado" v={<span className="capitalize">{lead.estado}</span>} />
          <Row k="UTM source" v={lead.utm_source ?? "—"} />
          <Row k="UTM campaign" v={lead.utm_campaign ?? "—"} />
        </dl>

        <div className="mt-6 rounded-2xl border border-[var(--line)] bg-[var(--cream-soft)] p-6">
          <h2 className="font-serif text-xl text-[var(--brown-deep)]">Cambiar estado</h2>
          <form action={updateEstado.bind(null, lead.id)} className="mt-3 flex gap-2">
            <select name="estado" defaultValue={lead.estado} className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
              {["nuevo", "contactado", "calificado", "ganado", "perdido"].map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
            <button className="rounded-full bg-[var(--olive)] px-4 py-2 text-sm font-semibold text-[var(--cream-soft)] hover:bg-[var(--olive-deep)]">Guardar</button>
          </form>
        </div>
      </section>

      <aside>
        <h2 className="font-serif text-xl text-[var(--brown-deep)]">Interacciones</h2>

        <form action={addInteraccion.bind(null, lead.id)} className="mt-3 grid gap-2 rounded-2xl border border-[var(--line)] bg-[var(--cream-soft)] p-5">
          <select name="tipo" required className="rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm">
            <option value="whatsapp">WhatsApp</option>
            <option value="email">Email</option>
            <option value="llamada">Llamada</option>
            <option value="visita">Visita</option>
          </select>
          <textarea name="contenido" required placeholder="Resumen…" className="min-h-24 rounded-lg border border-[var(--line)] bg-white px-3 py-2 text-sm" />
          <button className="rounded-full bg-[var(--brown-deep)] px-4 py-2 text-sm font-semibold text-[var(--cream-soft)] hover:opacity-90">Agregar</button>
        </form>

        <ul className="mt-4 space-y-3">
          {(interacciones ?? []).map((it) => (
            <li key={it.id} className="rounded-xl border border-[var(--line)] bg-[var(--cream-soft)] p-4 text-sm">
              <div className="flex items-center justify-between text-xs text-[var(--muted)]">
                <span className="capitalize">{it.tipo}</span>
                <span>{new Date(it.fecha).toLocaleString("es-CL")}</span>
              </div>
              <p className="mt-1 text-[var(--ink)]">{it.contenido}</p>
            </li>
          ))}
          {!interacciones?.length && <li className="text-sm text-[var(--muted)]">Sin interacciones todavía.</li>}
        </ul>
      </aside>
    </div>
  );
}

function Row({ k, v }: { k: string; v: React.ReactNode }) {
  return (
    <>
      <dt className="text-[var(--muted)]">{k}</dt>
      <dd className="font-medium">{v}</dd>
    </>
  );
}
