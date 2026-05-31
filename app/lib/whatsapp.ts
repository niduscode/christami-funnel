import type { Lead } from "./schemas";

const NUMERO = process.env.NEXT_PUBLIC_WA_NUMBER ?? "56953041094";

const TIPO_LABELS: Record<string, string> = {
  cocina: "Cocina",
  dormitorio: "Dormitorio",
  living: "Living",
  oficina: "Oficina",
  otro: "Otro",
};

/** Une los labels de un CSV de tipos: "cocina,living" → "Cocina + Living". */
function formatTipos(csv: string): string {
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => TIPO_LABELS[t] ?? t)
    .join(" + ");
}

const PLAZO_LABELS: Record<Lead["plazo"], string> = {
  inmediato: "Lo antes posible",
  "1_3_meses": "Dentro de los próximos 2 meses",
  "3_6_meses": "Más adelante este año",
};

const PRESUP_LABELS: Record<Lead["presupuesto_rango"], string> = {
  menos_1m: "Menos de $1M",
  "1m_3m": "$1M – $3M",
  "3m_5m": "$3M – $5M",
  mas_5m: "Más de $5M",
};

export function buildWaLink(lead: Pick<Lead, "nombre" | "tipo_proyecto" | "plazo" | "presupuesto_rango" | "ciudad">) {
  const msg = [
    `Hola Mueblería Christami, soy ${lead.nombre}.`,
    `Completé el formulario en su sitio.`,
    ``,
    `Proyecto: ${formatTipos(lead.tipo_proyecto)}`,
    `Plazo: ${PLAZO_LABELS[lead.plazo]}`,
    `Presupuesto: ${PRESUP_LABELS[lead.presupuesto_rango]}`,
    `Ciudad: ${lead.ciudad}`,
  ].join("\n");
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(msg)}`;
}

export function plainWaLink(text = "Hola Mueblería Christami, quiero cotizar un mueble a medida.") {
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(text)}`;
}
