"use client";

import { useState } from "react";

/* ============================================================
   COTIZADOR — herramienta interna del dueño.
   PRECIOS FICTICIOS — reemplazar con valores reales del taller.
   ============================================================ */

const TYPES = [
  { id: "cocina", label: "Cocina", icon: "🍳" },
  { id: "closet", label: "Closet", icon: "👔" },
  { id: "dormitorio", label: "Dormitorio", icon: "🛏️" },
  { id: "vitrina", label: "Vitrina/Living", icon: "🛋️" },
  { id: "vanitorio", label: "Vanitorio", icon: "🛁" },
  { id: "otro", label: "Otro", icon: "📐" },
] as const;

const PRICING = {
  base: {
    cocina: { rate: 320000, unit: "metro lineal" },
    closet: { rate: 185000, unit: "m² de frente" },
    dormitorio: { rate: 185000, unit: "m² de frente" },
    vitrina: { rate: 210000, unit: "m² de frente" },
    vanitorio: { rate: 420000, unit: "unidad base" },
    otro: { rate: 190000, unit: "m² de frente" },
  } as Record<string, { rate: number; unit: string }>,
  materials: [
    { id: "estandar", label: "Melamina estándar", desc: "Blanco, madera clara, beige", mult: 1.0 },
    { id: "intermedio", label: "Melamina texturada", desc: "Roble, Tuare, Pacífico, Colina", mult: 1.15 },
    { id: "premium", label: "Melamina premium", desc: "Roble Antracita, mates exclusivos", mult: 1.3 },
  ],
  finishes: [
    { id: "mate", label: "Mate", mult: 1.0 },
    { id: "brillante", label: "Brillante", mult: 1.18 },
  ],
  cubiertas: [
    { id: "postformada", label: "Postformada", rate: 42000 },
    { id: "granito", label: "Granito", rate: 135000 },
    { id: "fintop", label: "Fintop", rate: 158000 },
    { id: "cuarzo", label: "Cuarzo (Galaxy/Estelar)", rate: 195000 },
  ],
  extras: { cajon: 28000, puerta: 22000, led: 52000, aluminio: 32000 },
};

type QState = {
  tipo: string | null;
  largo: string;
  ancho: string;
  alto: string;
  profundidad: string;
  material: string;
  acabado: string;
  cubierta: string | null;
  cajones: string;
  puertas: string;
  led: boolean;
  aluminio: boolean;
};

const INITIAL: QState = {
  tipo: null,
  largo: "",
  ancho: "",
  alto: "",
  profundidad: "",
  material: "estandar",
  acabado: "mate",
  cubierta: null,
  cajones: "",
  puertas: "",
  led: false,
  aluminio: false,
};

const fmtCLP = (n: number) => "$" + Math.round(n).toLocaleString("es-CL");

type Result = { total: number; breakdown: { label: string; value: number }[] };

function calcular(q: QState): Result | null {
  if (!q.tipo) return null;
  const matMult = (PRICING.materials.find((m) => m.id === q.material) ?? PRICING.materials[0]).mult;
  const finMult = (PRICING.finishes.find((f) => f.id === q.acabado) ?? PRICING.finishes[0]).mult;
  const baseRate = PRICING.base[q.tipo].rate;
  const cajones = parseInt(q.cajones, 10) || 0;
  const puertas = parseInt(q.puertas, 10) || 0;
  let total = 0;
  const breakdown: Result["breakdown"] = [];

  if (q.tipo === "cocina") {
    const largo = parseFloat(q.largo) || 0;
    if (largo <= 0) return null;
    const body = baseRate * largo * matMult * finMult;
    total += body;
    breakdown.push({ label: `Mueblería · ${largo} m lineal`, value: body });
    if (q.cubierta) {
      const c = PRICING.cubiertas.find((x) => x.id === q.cubierta)!;
      const v = c.rate * largo;
      total += v;
      breakdown.push({ label: `Cubierta ${c.label}`, value: v });
    }
    if (q.led) {
      const v = PRICING.extras.led * largo;
      total += v;
      breakdown.push({ label: "Iluminación LED", value: v });
    }
    if (q.aluminio) {
      const v = PRICING.extras.aluminio * largo;
      total += v;
      breakdown.push({ label: "Perfil aluminio", value: v });
    }
  } else if (q.tipo === "vanitorio") {
    const ancho = parseFloat(q.ancho) || 0;
    if (ancho <= 0) return null;
    const body = baseRate * matMult * finMult * Math.max(ancho / 1.0, 0.7);
    total += body;
    breakdown.push({ label: `Vanitorio · ${ancho} m`, value: body });
    if (q.cubierta) {
      const c = PRICING.cubiertas.find((x) => x.id === q.cubierta)!;
      const v = c.rate * ancho;
      total += v;
      breakdown.push({ label: `Cubierta ${c.label}`, value: v });
    }
    if (cajones > 0) {
      const v = cajones * PRICING.extras.cajon;
      total += v;
      breakdown.push({ label: `${cajones} cajones`, value: v });
    }
    if (puertas > 0) {
      const v = puertas * PRICING.extras.puerta;
      total += v;
      breakdown.push({ label: `${puertas} puertas`, value: v });
    }
  } else {
    const ancho = parseFloat(q.ancho) || 0;
    const alto = parseFloat(q.alto) || 0;
    if (ancho <= 0 || alto <= 0) return null;
    const m2 = ancho * alto;
    const body = baseRate * m2 * matMult * finMult;
    total += body;
    breakdown.push({ label: `Frente ${m2.toFixed(2)} m²`, value: body });
    if (cajones > 0) {
      const v = cajones * PRICING.extras.cajon;
      total += v;
      breakdown.push({ label: `${cajones} cajones`, value: v });
    }
    if (puertas > 0) {
      const v = puertas * PRICING.extras.puerta;
      total += v;
      breakdown.push({ label: `${puertas} puertas`, value: v });
    }
  }
  return { total, breakdown };
}

function buildWaLink(q: QState, result: Result): string {
  const tipoLabel = TYPES.find((t) => t.id === q.tipo)!.label;
  const matLabel = PRICING.materials.find((m) => m.id === q.material)!.label;
  const finLabel = PRICING.finishes.find((f) => f.id === q.acabado)!.label;
  const cajones = parseInt(q.cajones, 10) || 0;
  const puertas = parseInt(q.puertas, 10) || 0;

  const lines = [
    "Hola Mueblería Christami!",
    "Cotización interna de un proyecto:",
    "",
    `• Tipo: ${tipoLabel}`,
  ];
  if (q.tipo === "cocina") lines.push(`• Largo: ${q.largo} m lineal`);
  else if (q.tipo === "vanitorio") lines.push(`• Ancho: ${q.ancho} m`);
  else
    lines.push(
      `• Medidas: ${q.ancho}m ancho × ${q.alto}m alto${
        q.profundidad ? " × " + q.profundidad + "m fondo" : ""
      }`
    );
  lines.push(`• Material: ${matLabel}`);
  lines.push(`• Acabado: ${finLabel}`);
  if (q.cubierta) {
    const cub = PRICING.cubiertas.find((c) => c.id === q.cubierta)!;
    lines.push(`• Cubierta: ${cub.label}`);
  }
  if (cajones > 0) lines.push(`• Cajones: ${cajones}`);
  if (puertas > 0) lines.push(`• Puertas: ${puertas}`);
  if (q.led) lines.push("• Con iluminación LED");
  if (q.aluminio) lines.push("• Con perfil de aluminio");
  lines.push("");
  lines.push(`Estimación referencial: ${fmtCLP(result.total)}`);

  return "https://api.whatsapp.com/send?phone=56953041094&text=" + encodeURIComponent(lines.join("\n"));
}

export function CotizadorTool() {
  const [q, setQ] = useState<QState>(INITIAL);
  const set = (patch: Partial<QState>) => setQ((prev) => ({ ...prev, ...patch }));

  function selectTipo(tipo: string) {
    setQ({ ...INITIAL, tipo, material: q.material, acabado: q.acabado });
  }

  const result = calcular(q);
  const tipoLabel = q.tipo ? TYPES.find((t) => t.id === q.tipo)!.label : null;
  const showCubierta = q.tipo === "cocina" || q.tipo === "vanitorio";
  const showDetalles = q.tipo !== null && q.tipo !== "cocina";
  const showExtras = q.tipo === "cocina";

  return (
    <div className="quote-grid">
      <div className="quote-form">
        {/* Paso 1: Tipo */}
        <div className="form-step always-visible">
          <label className="form-label">
            <span className="step-num">1</span>¿Qué mueble necesitas?
          </label>
          <div className="type-grid">
            {TYPES.map((t) => (
              <button
                key={t.id}
                type="button"
                className={`type-card${q.tipo === t.id ? " selected" : ""}`}
                onClick={() => selectTipo(t.id)}
              >
                <span className="type-icon">{t.icon}</span>
                <span className="type-label">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        {q.tipo && (
          <>
            {/* Paso 2: Medidas */}
            <div className="form-step visible">
              <label className="form-label">
                <span className="step-num">2</span>Medidas aproximadas
              </label>
              <div className="field-row">
                {q.tipo === "cocina" && (
                  <div className="field">
                    <span className="field-label-sm">Largo total (metros lineales)</span>
                    <input
                      className="field-input"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Ej: 4"
                      value={q.largo}
                      onChange={(e) => set({ largo: e.target.value })}
                    />
                  </div>
                )}
                {q.tipo === "vanitorio" && (
                  <div className="field">
                    <span className="field-label-sm">Ancho (m)</span>
                    <input
                      className="field-input"
                      type="number"
                      min="0"
                      step="0.1"
                      placeholder="Ej: 1.2"
                      value={q.ancho}
                      onChange={(e) => set({ ancho: e.target.value })}
                    />
                  </div>
                )}
                {q.tipo !== "cocina" && q.tipo !== "vanitorio" && (
                  <>
                    <div className="field">
                      <span className="field-label-sm">Ancho (m)</span>
                      <input
                        className="field-input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Ej: 2.5"
                        value={q.ancho}
                        onChange={(e) => set({ ancho: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <span className="field-label-sm">Alto (m)</span>
                      <input
                        className="field-input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Ej: 2.4"
                        value={q.alto}
                        onChange={(e) => set({ alto: e.target.value })}
                      />
                    </div>
                    <div className="field">
                      <span className="field-label-sm">Profundidad (m)</span>
                      <input
                        className="field-input"
                        type="number"
                        min="0"
                        step="0.1"
                        placeholder="Ej: 0.6"
                        value={q.profundidad}
                        onChange={(e) => set({ profundidad: e.target.value })}
                      />
                    </div>
                  </>
                )}
              </div>
              <p className="form-hint">
                {q.tipo === "cocina"
                  ? "Medida total del frente de cocina contra muros y/o isla."
                  : q.tipo === "vanitorio"
                  ? "Ancho aproximado del vanitorio."
                  : "Medidas aproximadas del frente y profundidad del mueble."}
              </p>
            </div>

            {/* Paso 3: Material */}
            <div className="form-step visible">
              <label className="form-label">
                <span className="step-num">3</span>Material principal
              </label>
              <div className="pill-stack">
                {PRICING.materials.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    className={`pill-block${q.material === m.id ? " selected" : ""}`}
                    onClick={() => set({ material: m.id })}
                  >
                    <span className="pill-block-title">{m.label}</span>
                    <span className="pill-block-desc">{m.desc}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 4: Acabado */}
            <div className="form-step visible">
              <label className="form-label">
                <span className="step-num">4</span>Acabado
              </label>
              <div className="pill-group">
                {PRICING.finishes.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    className={`pill${q.acabado === f.id ? " selected" : ""}`}
                    onClick={() => set({ acabado: f.id })}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Paso 5: Cubierta */}
            {showCubierta && (
              <div className="form-step visible">
                <label className="form-label">
                  <span className="step-num">5</span>Cubierta
                </label>
                <div className="pill-group">
                  {PRICING.cubiertas.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      className={`pill${q.cubierta === c.id ? " selected" : ""}`}
                      onClick={() => set({ cubierta: q.cubierta === c.id ? null : c.id })}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Paso 6: Detalles */}
            {showDetalles && (
              <div className="form-step visible">
                <label className="form-label">
                  <span className="step-num">{showCubierta ? 6 : 5}</span>Cajones y puertas
                </label>
                <div className="field-row">
                  <div className="field">
                    <span className="field-label-sm">N° de cajones</span>
                    <input
                      className="field-input"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={q.cajones}
                      onChange={(e) => set({ cajones: e.target.value })}
                    />
                  </div>
                  <div className="field">
                    <span className="field-label-sm">N° de puertas</span>
                    <input
                      className="field-input"
                      type="number"
                      min="0"
                      step="1"
                      placeholder="0"
                      value={q.puertas}
                      onChange={(e) => set({ puertas: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Paso 7: Extras */}
            {showExtras && (
              <div className="form-step visible">
                <label className="form-label">
                  <span className="step-num">6</span>Extras
                </label>
                <div className="toggle-group">
                  <div
                    className={`toggle-row${q.led ? " on" : ""}`}
                    onClick={() => set({ led: !q.led })}
                  >
                    <span>Iluminación LED en aéreo</span>
                    <div className="toggle-switch" />
                  </div>
                  <div
                    className={`toggle-row${q.aluminio ? " on" : ""}`}
                    onClick={() => set({ aluminio: !q.aluminio })}
                  >
                    <span>Perfil de aluminio negro</span>
                    <div className="toggle-switch" />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <aside className="quote-summary">
        <div className="summary-card">
          <div className="summary-eyebrow">Cotización aproximada</div>
          <div className={`summary-amount${result ? "" : " placeholder"}`}>
            {result ? fmtCLP(result.total) : q.tipo ? "Ingresa las medidas" : "Selecciona el mueble"}
          </div>
          <div className="summary-detail">
            {result
              ? `${tipoLabel} · valor estimado`
              : tipoLabel
              ? `${tipoLabel} — completa los campos para ver el valor.`
              : "Empieza eligiendo el tipo y completa los pasos."}
          </div>
          {result && (
            <div className="summary-breakdown" style={{ display: "block" }}>
              <ul>
                {result.breakdown.map((b) => (
                  <li key={b.label}>
                    <span>{b.label}</span>
                    <span>{fmtCLP(b.value)}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="summary-disclaimer">
            <strong>Valor referencial.</strong> El precio final depende del diseño, herrajes
            específicos e instalación. Se confirma tras visita técnica.
          </div>
          <a
            href={result ? buildWaLink(q, result) : "#"}
            className={`summary-cta${result ? "" : " disabled"}`}
            target="_blank"
            rel="noopener"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2z" />
            </svg>
            Enviar por WhatsApp
          </a>
        </div>
      </aside>
    </div>
  );
}
