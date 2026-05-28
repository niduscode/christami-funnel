import { CotizadorTool } from "./CotizadorTool";

export const metadata = { title: "Cotizador · Admin Christami" };

export default function CotizadorPage() {
  return (
    <div>
      <div className="mb-6">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--olive)]">
          Herramienta interna
        </div>
        <h1 className="font-serif text-3xl text-[var(--brown-deep)]">Cotizador</h1>
        <p className="mt-1 max-w-2xl text-sm text-[var(--muted)]">
          Estima el valor de un mueble a partir de medidas y materiales, y envía el detalle por
          WhatsApp. Los precios son referenciales y esta herramienta sólo es visible para el equipo.
        </p>
      </div>
      <CotizadorTool />
    </div>
  );
}
