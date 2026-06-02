import type { Lead } from "./schemas";

// Labels en español natural — matchean los de la UI del form para que el
// dueño vea exactamente lo que el cliente vio al elegir, no códigos internos.
const TIPO_LABELS: Record<string, string> = {
  cocina: "Cocina",
  dormitorio: "Closet / Dormitorio",
  living: "Living / TV",
  oficina: "Oficina",
  otro: "Otro",
};

const PLAZO_LABELS: Record<Lead["plazo"], string> = {
  inmediato: "Lo antes posible",
  "1_3_meses": "Dentro de los próximos 2 meses",
  "3_6_meses": "Más adelante este año",
};

const PRESUP_LABELS: Record<Lead["presupuesto_rango"], string> = {
  menos_1m: "Menos de $1.000.000",
  "1m_3m": "$1.000.000 – $3.000.000",
  "3m_5m": "$3.000.000 – $5.000.000",
  mas_5m: "Más de $5.000.000",
};

/** "cocina,living" → "Cocina + Living / TV" */
function formatTipos(csv: string): string {
  return csv
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => TIPO_LABELS[t] ?? t)
    .join(" + ");
}

/** UTMs → texto humano. Sin UTMs = entrada directa o referido. */
function formatOrigen(lead: Lead): string {
  const parts = [lead.utm_source, lead.utm_campaign, lead.utm_medium].filter(Boolean) as string[];
  if (parts.length === 0) return "Búsqueda directa o referido";
  // Si vino por Meta Ads, lo marcamos lindo
  if (lead.utm_source === "meta" || lead.utm_source === "facebook" || lead.utm_source === "instagram") {
    return `Anuncio en ${lead.utm_source}${lead.utm_campaign ? ` · ${lead.utm_campaign}` : ""}`;
  }
  return parts.join(" · ");
}

export function renderLeadEmail(lead: Lead): string {
  const isHot = lead.score >= 80;
  const isWarm = lead.score >= 50 && lead.score < 80;

  const tierLabel = isHot ? "🔥 CALIENTE" : isWarm ? "🌤️ TIBIO" : "❄️ FRÍO";
  const tierColor = isHot ? "#C0392B" : isWarm ? "#B97A1D" : "#5A7AA8";
  const tierBg = isHot ? "#FBEAE7" : isWarm ? "#FBF1E2" : "#E9F0F8";

  const urgencia = isHot
    ? "Te recomendamos contactarlo en menos de 1 hora — las primeras horas son las que cierran ventas."
    : isWarm
    ? "Te recomendamos contactarlo durante el día de hoy."
    : "Te recomendamos contactarlo durante esta semana.";

  // Construir links de acción rápida — el dueño aprieta y abre WhatsApp/marcador
  const phoneDigits = lead.telefono.replace(/\D/g, "");
  const tipos = formatTipos(lead.tipo_proyecto);
  const waMessage = `Hola ${lead.nombre}, soy de Mueblería Christami. Recibí tu solicitud para cotizar ${tipos.toLowerCase()} y quería conversar contigo cuanto antes.`;
  const waUrl = `https://wa.me/${phoneDigits}?text=${encodeURIComponent(waMessage)}`;
  const telUrl = `tel:${lead.telefono.replace(/\s/g, "")}`;

  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Nuevo lead · ${lead.nombre}</title>
</head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#F5EBDC;margin:0;padding:24px 12px;color:#2A1F18;">
  <div style="max-width:580px;margin:0 auto;background:#FFFFFF;border:1px solid #E5D9C7;border-radius:14px;overflow:hidden;box-shadow:0 4px 16px rgba(58,38,20,0.08);">

    <!-- TIER BANNER -->
    <div style="background:${tierBg};padding:16px 24px;border-bottom:1px solid #E5D9C7;">
      <div style="font-size:11px;letter-spacing:0.12em;color:#6F5E50;text-transform:uppercase;font-weight:600;">Nuevo lead recibido</div>
      <div style="font-size:18px;color:${tierColor};font-weight:700;margin-top:4px;">${tierLabel} · ${lead.score} puntos</div>
    </div>

    <!-- LEAD NAME + RESUMEN -->
    <div style="padding:24px 24px 16px;">
      <h1 style="font-family:Georgia,serif;color:#3A2614;margin:0 0 6px;font-size:28px;font-weight:600;line-height:1.2;">${lead.nombre}</h1>
      <div style="color:#6F5E50;font-size:14px;line-height:1.5;">
        Quiere cotizar <strong style="color:#3A2614;">${tipos}</strong> en <strong style="color:#3A2614;">${lead.ciudad}</strong>
      </div>
    </div>

    <!-- BOTONES DE ACCIÓN RÁPIDA -->
    <div style="padding:0 24px 22px;">
      <table cellspacing="0" cellpadding="0" border="0" style="width:100%;">
        <tr>
          <td style="padding-right:6px;width:50%;">
            <a href="${waUrl}" style="display:block;text-align:center;background:#25D366;color:#FFFFFF;padding:13px 16px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
              💬 Responder por WhatsApp
            </a>
          </td>
          <td style="padding-left:6px;width:50%;">
            <a href="${telUrl}" style="display:block;text-align:center;background:#3A2614;color:#FFFFFF;padding:13px 16px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">
              📞 Llamar ahora
            </a>
          </td>
        </tr>
      </table>
    </div>

    <!-- DATOS DEL CLIENTE -->
    <div style="padding:20px 24px;border-top:1px solid #E5D9C7;">
      <div style="font-size:11px;letter-spacing:0.12em;color:#6F5E50;text-transform:uppercase;font-weight:600;margin-bottom:14px;">Datos de contacto</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#6F5E50;width:38%;vertical-align:top;">Teléfono</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;"><a href="${telUrl}" style="color:#3A2614;text-decoration:none;">${lead.telefono}</a></td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6F5E50;border-top:1px solid #F0E5D2;vertical-align:top;">Email</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;border-top:1px solid #F0E5D2;">${lead.email ? `<a href="mailto:${lead.email}" style="color:#3A2614;">${lead.email}</a>` : '<span style="color:#A8978A;font-weight:400;">No lo dejó</span>'}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6F5E50;border-top:1px solid #F0E5D2;vertical-align:top;">Ciudad</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;border-top:1px solid #F0E5D2;">${lead.ciudad}</td>
        </tr>
      </table>
    </div>

    <!-- DETALLES DEL PROYECTO -->
    <div style="padding:20px 24px;border-top:1px solid #E5D9C7;background:#FAF5EE;">
      <div style="font-size:11px;letter-spacing:0.12em;color:#6F5E50;text-transform:uppercase;font-weight:600;margin-bottom:14px;">Sobre lo que quiere</div>
      <table style="width:100%;border-collapse:collapse;font-size:14px;">
        <tr>
          <td style="padding:8px 0;color:#6F5E50;width:38%;vertical-align:top;">Tipo de mueble</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;">${tipos}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6F5E50;border-top:1px solid #F0E5D2;vertical-align:top;">Cuándo lo quiere</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;border-top:1px solid #F0E5D2;">${PLAZO_LABELS[lead.plazo]}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6F5E50;border-top:1px solid #F0E5D2;vertical-align:top;">Presupuesto</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;border-top:1px solid #F0E5D2;">${PRESUP_LABELS[lead.presupuesto_rango]}</td>
        </tr>
        <tr>
          <td style="padding:8px 0;color:#6F5E50;border-top:1px solid #F0E5D2;vertical-align:top;">Cómo llegó al sitio</td>
          <td style="padding:8px 0;color:#2A1F18;font-weight:600;border-top:1px solid #F0E5D2;">${formatOrigen(lead)}</td>
        </tr>
      </table>
    </div>

    <!-- URGENCIA FOOTER -->
    <div style="padding:18px 24px;background:${tierBg};border-top:1px solid #E5D9C7;">
      <div style="color:${tierColor};font-size:13px;font-weight:600;line-height:1.5;">
        ${urgencia}
      </div>
    </div>

  </div>

  <div style="text-align:center;color:#A8978A;font-size:11px;margin-top:16px;font-family:-apple-system,BlinkMacSystemFont,sans-serif;">
    Recibido a través del formulario en <a href="https://muebleriachristami.cl" style="color:#A8978A;text-decoration:none;">muebleriachristami.cl</a>
  </div>
</body>
</html>`;
}
