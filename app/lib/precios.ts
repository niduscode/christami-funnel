import { proyectos, type Proyecto } from "./proyectos";

/**
 * PRECIOS REALES por proyecto del catálogo (entregados por Christami el 2026-06-16).
 *
 * Nota: un mueble a medida se cotiza por metros lineales + materiales, así que cada
 * valor corresponde a ESE proyecto tal como fue fabricado (su tamaño puntual). En la
 * calculadora se muestran como "valores referenciales" — el precio final del cliente
 * variará según las medidas de su espacio.
 */
export const PRECIOS: Record<string, number> = {
  p1: 6_900_000, // Cocina Pacífico con isla doble cascada
  p2: 5_400_000, // Cocina Azul Tuare con península
  p3: 4_500_000, // Cocina Roble Antracita (bandeja riñón)
  p4: 670_000, // Closet esquinero Tokai
  p5: 600_000, // Closet Taupe
  p6: 1_200_000, // Closet Taupe con LED
  p7: 2_700_000, // Walk-in Closet Taupe
  p8: 2_800_000, // Mueble living gris y blanco
  p9: 700_000, // Closet con TV integrada
  p10: 7_500_000, // Cocina Verde Jades
  p11: 4_500_000, // Cocina Roble Antracita (contemporáneo)
  p12: 280_000, // Vanitorio Santorini
  p13: 4_380_567, // Cocina Taupe + Valle
  p14: 8_653_210, // Cocina Verde Jade + Valle (salpicadero porcelanato, rotondas, rack cuarzo)
};

export function precioDe(id: string): number {
  return PRECIOS[id] ?? 0;
}

/** "$1.400.000" en formato chileno. */
export function formatCLP(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

/** Rangos de presupuesto ajustados al rango real de precios del catálogo ($280k–$7.5M). */
export type Rango = { id: string; label: string; min: number; max: number };
export const RANGOS: Rango[] = [
  { id: "r1", label: "Hasta $1M", min: 0, max: 1_000_000 },
  { id: "r2", label: "$1M – $2M", min: 1_000_000, max: 2_000_000 },
  { id: "r3", label: "$2M – $3M", min: 2_000_000, max: 3_000_000 },
  { id: "r4", label: "$3M – $5M", min: 3_000_000, max: 5_000_000 },
  { id: "r5", label: "$5M – $7M", min: 5_000_000, max: 7_000_000 },
  { id: "r6", label: "Más de $7M", min: 7_000_000, max: Infinity },
];

/**
 * Características legibles para alguien que NO sabe cómo se cotiza un mueble.
 * A propósito SIN metros lineales — el cliente final no entiende esa unidad.
 * Se infieren del material/descripción de cada proyecto.
 */
const FEATURE_RULES: { re: RegExp; label: string }[] = [
  { re: /doble cascada/i, label: "Isla en doble cascada" },
  { re: /\bisla\b/i, label: "Isla central" },
  { re: /pen[ií]nsula/i, label: "Península" },
  { re: /cuarzo/i, label: "Cubierta de cuarzo" },
  { re: /\bled\b/i, label: "Luz LED integrada" },
  { re: /vitrina/i, label: "Vitrina" },
  { re: /aluminio/i, label: "Perfil de aluminio" },
  { re: /walk-?in|vestidor/i, label: "Estilo vestidor" },
  { re: /\btv\b|televisor/i, label: "Módulo para TV" },
  { re: /bandeja|cajoner|caj[oó]n/i, label: "Cajonería a medida" },
  { re: /esquiner|esquina/i, label: "Aprovecha las esquinas" },
  { re: /enchufe|push/i, label: "Enchufes integrados" },
];

export function featuresDe(p: Proyecto, max = 3): string[] {
  const text = `${p.material ?? ""} ${p.description} ${p.title}`;
  const out: string[] = [];
  for (const { re, label } of FEATURE_RULES) {
    if (re.test(text) && !out.includes(label)) out.push(label);
    if (out.length >= max) break;
  }
  return out;
}

export type ProyectoConPrecio = Proyecto & { precio: number };

/**
 * Proyectos de un tipo cuyo valor "alcanza" para el presupuesto (precio ≤ techo
 * del rango), ordenados del más caro al más barato — así el cliente ve primero
 * lo máximo que puede lograr con su presupuesto. `categoria === "all"` no filtra.
 */
export function proyectosParaPresupuesto(
  categoria: string | null,
  rango: Rango | null
): ProyectoConPrecio[] {
  if (!categoria || !rango) return [];
  const base = categoria === "all" ? proyectos : proyectos.filter((p) => p.category === categoria);
  return base
    .map((p) => ({ ...p, precio: precioDe(p.id) }))
    .filter((p) => p.precio > 0 && p.precio <= rango.max)
    .sort((a, b) => b.precio - a.precio);
}

/** Precio del proyecto más barato de un tipo — para el mensaje "parte desde…". */
export function precioMinimoDe(categoria: string): number {
  const base = categoria === "all" ? proyectos : proyectos.filter((p) => p.category === categoria);
  const precios = base.map((p) => precioDe(p.id)).filter((n) => n > 0);
  return precios.length ? Math.min(...precios) : 0;
}
