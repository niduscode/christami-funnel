import type { LeadInput } from "./schemas";

type TipoKey = "cocina" | "dormitorio" | "living" | "oficina" | "otro";

const TIPO_PTS: Record<TipoKey, number> = {
  cocina: 15,
  dormitorio: 12,
  living: 10,
  oficina: 8,
  otro: 5,
};

export function calcScore(lead: LeadInput): number {
  let score = 0;

  const plazoPts: Record<LeadInput["plazo"], number> = {
    inmediato: 40,
    "1_3_meses": 28,
    "3_6_meses": 12,
    solo_cotizando: 4,
  };
  score += plazoPts[lead.plazo] ?? 0;

  const presupPts: Record<LeadInput["presupuesto_rango"], number> = {
    mas_5m: 35,
    "3m_5m": 25,
    "1m_3m": 15,
    menos_1m: 5,
  };
  score += presupPts[lead.presupuesto_rango] ?? 0;

  // tipo_proyecto ahora puede ser CSV ("cocina,living"): tomamos los puntos
  // del tipo MÁS VALIOSO seleccionado (no sumamos para no inflar el score).
  const tipos = lead.tipo_proyecto.split(",").map((t) => t.trim()) as TipoKey[];
  const tipoScore = tipos.reduce((max, t) => Math.max(max, TIPO_PTS[t] ?? 0), 0);
  score += tipoScore;

  if (lead.email) score += 5;
  if (lead.utm_source === "meta") score += 5;

  return Math.min(score, 100);
}

export function scoreTier(score: number): "caliente" | "tibio" | "frio" {
  if (score >= 80) return "caliente";
  if (score >= 50) return "tibio";
  return "frio";
}
