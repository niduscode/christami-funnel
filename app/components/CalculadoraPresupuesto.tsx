"use client";

/* eslint-disable @next/next/no-img-element */
import { useMemo, useState } from "react";
import { proyectos, categoryLabels } from "@/app/lib/proyectos";
import {
  RANGOS,
  proyectosParaPresupuesto,
  precioMinimoDe,
  formatCLP,
  featuresDe,
} from "@/app/lib/precios";
import { plainWaLink } from "@/app/lib/whatsapp";

// Tipos presentes en el catálogo (mismas categorías que usa el catálogo real)
const TIPOS = Array.from(new Set(proyectos.map((p) => p.category))).map((c) => ({
  id: c,
  label: categoryLabels[c] ?? c,
}));

const TIPO_ICON: Record<string, string> = {
  cocinas: "🍳",
  closets: "🚪",
  living: "🛋️",
  banos: "🚿",
  dormitorios: "🛏️",
  oficina: "🏢",
  otros: "📐",
};

export function CalculadoraPresupuesto() {
  const [tipo, setTipo] = useState<string | null>(null);
  const [rangoId, setRangoId] = useState<string | null>(null);

  const rango = useMemo(() => RANGOS.find((r) => r.id === rangoId) ?? null, [rangoId]);
  const resultados = useMemo(() => proyectosParaPresupuesto(tipo, rango), [tipo, rango]);

  const listo = Boolean(tipo && rango);
  const tipoLabel =
    tipo === "all" ? "muebles" : (categoryLabels[tipo ?? ""] ?? "proyectos").toLowerCase();
  const minTipo = tipo ? precioMinimoDe(tipo) : 0;

  return (
    <div className="calc">
      {/* PASO 1 — Tipo */}
      <div className="calc-step">
        <div className="calc-step-head">
          <span className="calc-step-num">1</span>
          <h2 className="calc-q">¿Qué quieres para tu hogar?</h2>
        </div>
        <div className="calc-options" role="group" aria-label="Tipo de mueble">
          {TIPOS.map((t) => (
            <button
              key={t.id}
              type="button"
              className={`calc-chip${tipo === t.id ? " selected" : ""}`}
              aria-pressed={tipo === t.id}
              onClick={() => setTipo(t.id)}
            >
              <span className="calc-chip-icon" aria-hidden>
                {TIPO_ICON[t.id] ?? "🪵"}
              </span>
              {t.label}
            </button>
          ))}
          <button
            type="button"
            className={`calc-chip${tipo === "all" ? " selected" : ""}`}
            aria-pressed={tipo === "all"}
            onClick={() => setTipo("all")}
          >
            <span className="calc-chip-icon" aria-hidden>
              ✨
            </span>
            Aún no lo sé
          </button>
        </div>
      </div>

      {/* PASO 2 — Presupuesto */}
      <div className={`calc-step${tipo ? "" : " calc-step--locked"}`}>
        <div className="calc-step-head">
          <span className="calc-step-num">2</span>
          <h2 className="calc-q">¿Cuánto tienes pensado invertir?</h2>
        </div>
        <p className="calc-hint">No te preocupes por ser exacto — es solo para orientarte.</p>
        <div className="calc-rangos" role="group" aria-label="Presupuesto">
          {RANGOS.map((r) => (
            <button
              key={r.id}
              type="button"
              className={`calc-rango${rangoId === r.id ? " selected" : ""}`}
              aria-pressed={rangoId === r.id}
              disabled={!tipo}
              onClick={() => setRangoId(r.id)}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* RESULTADOS */}
      {listo && (
        <div className="calc-results" aria-live="polite">
          <div className="calc-results-head">
            <h2 className="calc-results-title">
              Con tu presupuesto puedes lograr <em>esto</em>
            </h2>
            <p className="calc-results-sub">
              {resultados.length > 0
                ? `Ejemplos reales de ${tipoLabel} que hemos hecho y que entran en tu rango. Tu mueble se diseña a tu medida — estos te dan una idea de lo posible.`
                : `Todavía no tenemos un ejemplo de ${tipoLabel} en este rango fotografiado.`}
            </p>
          </div>

          {resultados.length > 0 ? (
            <div className="calc-grid">
              {resultados.map((p) => {
                const feats = featuresDe(p);
                return (
                  <article key={p.id} className="calc-card">
                    <div className="calc-card-media">
                      <img src={p.cover} alt={p.tag} loading="lazy" />
                      <span className="calc-card-precio">≈ {formatCLP(p.precio)}</span>
                    </div>
                    <div className="calc-card-body">
                      <span className="calc-card-tag">{p.tag}</span>
                      <h3 className="calc-card-title">{p.title}</h3>
                      {feats.length > 0 && (
                        <ul className="calc-feats">
                          {feats.map((f) => (
                            <li key={f} className="calc-feat">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                                <path d="M20 6 9 17l-5-5" />
                              </svg>
                              {f}
                            </li>
                          ))}
                        </ul>
                      )}
                      <a className="calc-card-link" href="/#catalogo">
                        Ver en el catálogo →
                      </a>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="calc-empty">
              <p>
                {minTipo > 0 ? (
                  <>
                    Un proyecto de <strong>{tipoLabel}</strong> a medida normalmente parte desde
                    aprox <strong>{formatCLP(minTipo)}</strong>. Con tu presupuesto podemos ver una
                    versión más acotada — lo conversamos en una visita sin costo.
                  </>
                ) : (
                  <>Cuéntanos tu idea y te orientamos con un valor referencial en una visita.</>
                )}
              </p>
            </div>
          )}

          {/* Disclaimer + CTA */}
          <div className="calc-disclaimer">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4M12 8h.01" />
            </svg>
            <span>
              <strong>Valores referenciales.</strong> El precio final depende de las medidas y los
              materiales de tu espacio. Te lo afinamos sin compromiso en una visita.
            </span>
          </div>

          <div className="calc-cta">
            <h3>¿Te gustó alguno? Llevémoslo a tu medida.</h3>
            <div className="calc-cta-actions">
              <a className="calc-cta-btn calc-cta-primary" href="/#cotizar">
                Cotizar mi proyecto
              </a>
              <a
                className="calc-cta-btn calc-cta-ghost"
                href={plainWaLink(
                  "Hola Mueblería Christami, usé la calculadora de presupuesto en su sitio y quiero cotizar."
                )}
                target="_blank"
                rel="noopener noreferrer"
              >
                Escribir por WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
