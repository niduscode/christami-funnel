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
      <main className="bg-[var(--cream)]">
        <section className="mx-auto flex max-w-3xl flex-col items-center px-6 pb-24 pt-36 text-center">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--olive)]">¡Gracias!</div>
          <h1 className="mt-3 font-serif text-4xl text-[var(--brown-deep)] sm:text-5xl">
            Recibimos tu solicitud{sp.nombre ? `, ${sp.nombre}` : ""}
          </h1>
          <p className="mt-5 max-w-xl text-lg text-[var(--muted)]">
            En segundos te redirigimos a WhatsApp con tu mensaje listo para enviar. Si no se abre, presiona el botón abajo.
          </p>

          <a
            href={waUrl}
            target="_blank"
            rel="noopener"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-7 py-3.5 text-base font-semibold text-white shadow-[0_12px_30px_rgba(37,211,102,0.35)] transition hover:bg-[#1eaa53]"
          >
            Abrir WhatsApp
          </a>

          <p className="mt-10 text-sm text-[var(--muted)]">
            <Link href="/" className="underline decoration-[var(--olive)] underline-offset-2">Volver al inicio</Link>
          </p>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
