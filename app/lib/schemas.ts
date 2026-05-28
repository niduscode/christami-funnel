import { z } from "zod";

export const tipoProyectoEnum = z.enum(["cocina", "dormitorio", "living", "oficina", "otro"]);
export const presupuestoEnum = z.enum(["menos_1m", "1m_3m", "3m_5m", "mas_5m"]);
export const plazoEnum = z.enum(["inmediato", "1_3_meses", "3_6_meses", "solo_cotizando"]);

/**
 * `tipo_proyecto` ahora acepta MÚLTIPLES tipos (el form lo manda como CSV).
 * Preprocess: "cocina,living" → ["cocina","living"] → valida cada uno con
 * el enum → exige al menos uno → vuelve a serializar como CSV para la DB
 * (que sigue almacenándolo como texto). Si el form solo manda "cocina",
 * funciona igual: 1 elemento.
 */
export const tipoProyectoCsv = z.preprocess(
  (v) => {
    if (typeof v !== "string") return v;
    return v
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  },
  z
    .array(tipoProyectoEnum)
    .min(1, "Selecciona al menos un tipo")
    .transform((arr) => Array.from(new Set(arr)).join(","))
);

const TELEFONO_CL = /^\+?56?\s?9\s?\d{4}\s?\d{4}$/;

export function normalizeTelefono(input: string): string {
  const digits = input.replace(/\D/g, "");
  const tail = digits.startsWith("56") ? digits.slice(2) : digits;
  const nine = tail.startsWith("9") ? tail.slice(1) : tail;
  if (nine.length !== 8) return input.trim();
  return `+56 9 ${nine.slice(0, 4)} ${nine.slice(4)}`;
}

export const leadInputSchema = z.object({
  nombre: z.string().trim().min(2).max(60),
  email: z.string().trim().email().optional().or(z.literal("")),
  telefono: z.string().trim().regex(TELEFONO_CL, "Teléfono chileno inválido"),
  ciudad: z.string().trim().min(2).max(60),
  tipo_proyecto: tipoProyectoCsv,
  presupuesto_rango: presupuestoEnum,
  plazo: plazoEnum,
  utm_source: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_medium: z.string().optional(),
  consentimiento: z.literal("on", { message: "Debes aceptar la política de privacidad" }),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export type Lead = LeadInput & {
  id: string;
  created_at: string;
  score: number;
  estado: "nuevo" | "contactado" | "calificado" | "ganado" | "perdido";
  notas: string | null;
};
