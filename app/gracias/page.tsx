import Link from "next/link";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter } from "@/app/components/SiteFooter";
import { GraciasRedirect } from "./redirect";
import { buildWaLink } from "@/app/lib/whatsapp";
import { presupuestoEnum, plazoEnum, tipoProyectoEnum } from "@/app/lib/schemas";

type SP = Promise<Record<string, string | undefined>>;

export default async function GraciasPage({ searchParams }: { searchParams: SP }) {
  const sp = await searchParams;
  const score = Number(sp.score ?? 0);

  // tipo puede venir como CSV ("cocina,living"). Validamos cada parte
  // contra el enum y mantenemos solo las válidas → re-serializamos.
  const tipoCsv = (sp.tipo ?? "")
    .split(",")
    .map((t) => t.trim())
    .map((t) => tipoProyectoEnum.safeParse(t))
    .filter((r) => r.success)
    .map((r) => r.data)
    .join(",");

  const plazo = plazoEnum.safeParse(sp.plazo);
  const presup = presupuestoEnum.safeParse(sp.presup);

  const waUrl = tipoCsv && plazo.success && presup.success
    ? buildWaLink({
        nombre: sp.nombre ?? "",
        tipo_proyecto: tipoCsv,
        plazo: plazo.data,
        presupuesto_rango: presup.data,
        ciudad: sp.ciudad ?? "",
      })
    : "https://wa.me/56953041094";

  return (
    <>
      <SiteNav solid />
      <GraciasRedirect waUrl={waUrl} score={score} />
      <main className="gracias-page">
        <section className="gracias-card reveal">
          <div className="gracias-badge" aria-hidden>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </div>
          <div className="section-eyebrow">¡Gracias!</div>
          <h1 className="gracias-title">
            Recibimos <em>tu solicitud</em>
            {sp.nombre ? <span className="gracias-name">, {sp.nombre}</span> : ""}
          </h1>
          <p className="gracias-sub">
            En segundos te redirigimos a WhatsApp con tu mensaje listo para enviar.
            Si no se abre, presioná el botón abajo.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="gracias-cta"
          >
            <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden width="22" height="22">
              <path d="M27.302 4.633A15.86 15.86 0 0 0 16.012.001C7.246.001.114 7.13.111 15.892c-.001 2.801.731 5.535 2.123 7.945L0 32l8.345-2.182a15.918 15.918 0 0 0 7.658 1.948h.006c8.766 0 15.898-7.13 15.901-15.892a15.798 15.798 0 0 0-4.608-11.241zM16.012 29.075h-.005a13.21 13.21 0 0 1-6.731-1.84l-.483-.286-5.003 1.31 1.336-4.876-.314-.5a13.139 13.139 0 0 1-2.018-7.001c.003-7.28 5.931-13.205 13.221-13.205a13.13 13.13 0 0 1 9.345 3.872 13.117 13.117 0 0 1 3.871 9.342c-.003 7.28-5.931 13.184-13.219 13.184zm7.252-9.881c-.397-.199-2.35-1.159-2.715-1.291-.364-.133-.629-.199-.894.199-.265.397-1.026 1.291-1.258 1.556-.231.265-.463.298-.86.099-.397-.199-1.677-.617-3.195-1.969-1.181-1.052-1.978-2.353-2.21-2.75-.231-.397-.024-.612.175-.81.179-.178.397-.464.595-.696.198-.232.265-.397.397-.662.133-.265.066-.497-.033-.696-.099-.199-.894-2.151-1.225-2.945-.323-.773-.651-.669-.894-.681-.231-.011-.496-.014-.761-.014a1.46 1.46 0 0 0-1.059.497c-.364.397-1.391 1.358-1.391 3.309 0 1.952 1.424 3.838 1.622 4.104.198.265 2.802 4.279 6.788 6 .949.41 1.689.654 2.266.836.952.302 1.819.26 2.504.158.764-.115 2.35-.961 2.682-1.889.331-.927.331-1.722.231-1.889-.099-.166-.364-.265-.761-.464z" />
            </svg>
            Abrir WhatsApp
          </a>

          <div className="gracias-secondary">
            <Link href="/">← Volver al inicio</Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
