import type { Lead } from "./schemas";

export function renderLeadEmail(lead: Lead): string {
  const rows: Array<[string, string]> = [
    ["Nombre", lead.nombre],
    ["Teléfono", lead.telefono],
    ["Email", lead.email || "—"],
    ["Ciudad", lead.ciudad ?? "—"],
    ["Tipo", lead.tipo_proyecto],
    ["Plazo", lead.plazo],
    ["Presupuesto", lead.presupuesto_rango],
    ["Score", String(lead.score)],
    ["Origen", [lead.utm_source, lead.utm_campaign, lead.utm_medium].filter(Boolean).join(" / ") || "directo"],
  ];

  const tier = lead.score >= 80 ? "🔥 CALIENTE" : lead.score >= 50 ? "🌤️ Tibio" : "❄️ Frío";

  return `<!doctype html>
<html><body style="font-family:system-ui,sans-serif;background:#F5EBDC;margin:0;padding:24px;">
  <div style="max-width:560px;margin:0 auto;background:#FAF5EE;border:1px solid #E5D9C7;border-radius:12px;padding:28px;">
    <div style="font-size:12px;letter-spacing:.08em;color:#7A8450;text-transform:uppercase;">Nuevo lead · ${tier}</div>
    <h1 style="font-family:Georgia,serif;color:#3A2614;margin:6px 0 18px;">${lead.nombre}</h1>
    <table style="width:100%;border-collapse:collapse;font-size:14px;color:#2A1F18;">
      ${rows.map(([k, v]) => `<tr><td style="padding:6px 0;color:#6F5E50;width:120px;">${k}</td><td style="padding:6px 0;font-weight:600;">${v}</td></tr>`).join("")}
    </table>
    <p style="margin-top:24px;font-size:13px;color:#6F5E50;">
      Atendé este lead en ${lead.score >= 80 ? "menos de 1 hora" : lead.score >= 50 ? "el mismo día" : "esta semana"}.
    </p>
  </div>
</body></html>`;
}
