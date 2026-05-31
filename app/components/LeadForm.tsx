"use client";

import { useActionState, useEffect, useState } from "react";
import { submitLead, type SubmitState } from "@/app/actions/submit-lead";

const initialState: SubmitState = { ok: false };

const TIPOS: { id: string; label: string; icon: string }[] = [
  { id: "cocina", label: "Cocina", icon: "🍳" },
  { id: "dormitorio", label: "Closet / Dormitorio", icon: "👔" },
  { id: "living", label: "Living / TV", icon: "🛋️" },
  { id: "oficina", label: "Oficina", icon: "🏢" },
  { id: "otro", label: "Otro", icon: "📐" },
];

// Sin "Sólo cotizando" — el que sólo investiga precios no llena 6 campos
// para mandar un mensaje. Las 3 opciones que quedan son compromisos
// concretos a plazo, no abstractos ("inmediato", "1-3 meses").
const PLAZO_OPTS: [string, string][] = [
  ["inmediato", "En las próximas 2 semanas"],
  ["1_3_meses", "Dentro de los próximos 3 meses"],
  ["3_6_meses", "Más adelante este año"],
];

const PRESUP_OPTS: [string, string][] = [
  ["menos_1m", "Menos de $1.000.000"],
  ["1m_3m", "$1.000.000 – $3.000.000"],
  ["3m_5m", "$3.000.000 – $5.000.000"],
  ["mas_5m", "Más de $5.000.000"],
];

export function LeadForm({ utm }: { utm: { source?: string; campaign?: string; medium?: string } }) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);
  // Multi-select: el usuario puede combinar (Cocina + Closet, p. ej.)
  const [tipos, setTipos] = useState<string[]>([]);
  const toggleTipo = (id: string) =>
    setTipos((cur) => (cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id]));

  useEffect(() => {
    const handler = () => {
      if (typeof window === "undefined") return;
      // @ts-expect-error fbq global
      window.fbq?.("track", "Lead");
      // @ts-expect-error gtag global
      window.gtag?.("event", "form_start");
    };
    const form = document.getElementById("lead-form");
    form?.addEventListener("focusin", handler, { once: true });
    return () => form?.removeEventListener("focusin", handler);
  }, []);

  const err = (k: string) => state.fieldErrors?.[k];

  return (
    <form id="lead-form" action={formAction} className="lf-form">
      <input type="hidden" name="utm_source" value={utm.source ?? ""} />
      <input type="hidden" name="utm_campaign" value={utm.campaign ?? ""} />
      <input type="hidden" name="utm_medium" value={utm.medium ?? ""} />
      <input type="hidden" name="tipo_proyecto" value={tipos.join(",")} />

      {/* Tipo de proyecto — multi-toggle (puede combinar varios) */}
      <div className="lf-field">
        <span className="lf-label">
          ¿Qué quieres cotizar?
          <span className="lf-optional"> (puedes elegir varias)</span>
        </span>
        <div className="lf-type-grid" role="group" aria-label="Tipo de proyecto">
          {TIPOS.map((t) => {
            const checked = tipos.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                role="checkbox"
                aria-checked={checked}
                className={`lf-type-card${checked ? " selected" : ""}`}
                onClick={() => toggleTipo(t.id)}
              >
                <span className="lf-type-dot" aria-hidden />
                <span className="lf-type-icon" aria-hidden>
                  {t.icon}
                </span>
                <span className="lf-type-text">{t.label}</span>
              </button>
            );
          })}
        </div>
        {err("tipo_proyecto") && <span className="lf-error-msg">{err("tipo_proyecto")}</span>}
      </div>

      {/* Nombre */}
      <Field
        label="Nombre"
        name="nombre"
        placeholder="Tu nombre completo"
        required
        error={err("nombre")}
      />

      {/* Email */}
      <Field
        label="Email"
        name="email"
        type="email"
        placeholder="tu@email.com"
        optional
        error={err("email")}
      />

      {/* Teléfono con chip de país */}
      <div className="lf-field">
        <label className="lf-label" htmlFor="lf-telefono">
          Teléfono / WhatsApp
        </label>
        <div className={`lf-phone${err("telefono") ? " has-error" : ""}`}>
          <span className="lf-phone-chip" aria-hidden>
            🇨🇱 +56
          </span>
          <input
            id="lf-telefono"
            type="tel"
            name="telefono"
            placeholder="9 1234 5678"
            required
            aria-invalid={!!err("telefono")}
            className="lf-input lf-phone-input"
          />
        </div>
        {err("telefono") && <span className="lf-error-msg">{err("telefono")}</span>}
      </div>

      {/* Ciudad */}
      <Field
        label="Ciudad"
        name="ciudad"
        placeholder="Puerto Montt, Osorno, Chiloé…"
        required
        error={err("ciudad")}
      />

      {/* Plazo */}
      <Select
        label="¿Cuándo lo necesitas?"
        name="plazo"
        options={PLAZO_OPTS}
        required
        error={err("plazo")}
      />

      {/* Presupuesto */}
      <Select
        label="Rango de presupuesto"
        name="presupuesto_rango"
        options={PRESUP_OPTS}
        required
        error={err("presupuesto_rango")}
      />

      {/* Consent */}
      <label className="lf-consent">
        <input type="checkbox" name="consentimiento" required />
        <span>
          Acepto que Mueblería Christami use mis datos para contactarme. Ver{" "}
          <a href="/privacidad">política de privacidad</a>.
        </span>
      </label>

      {state.error && <div className="lf-error">{state.error}</div>}

      {/* Submit */}
      <button type="submit" disabled={pending} className="lf-submit">
        <span>{pending ? "Enviando…" : "Enviar solicitud"}</span>
        <span aria-hidden className="lf-submit-arrow">→</span>
      </button>
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  placeholder,
  required,
  optional,
  error,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
}) {
  return (
    <div className="lf-field">
      <label className="lf-label" htmlFor={`lf-${name}`}>
        {label}
        {optional && <span className="lf-optional"> (opcional)</span>}
      </label>
      <input
        id={`lf-${name}`}
        type={type}
        name={name}
        placeholder={placeholder}
        required={required}
        aria-invalid={!!error}
        className={`lf-input${error ? " has-error" : ""}`}
      />
      {error && <span className="lf-error-msg">{error}</span>}
    </div>
  );
}

function Select({
  label,
  name,
  options,
  required,
  error,
}: {
  label: string;
  name: string;
  options: [string, string][];
  required?: boolean;
  error?: string;
}) {
  return (
    <div className="lf-field">
      <label className="lf-label" htmlFor={`lf-${name}`}>
        {label}
      </label>
      <select
        id={`lf-${name}`}
        name={name}
        required={required}
        defaultValue=""
        aria-invalid={!!error}
        className={`lf-input lf-select${error ? " has-error" : ""}`}
      >
        <option value="" disabled>
          Selecciona…
        </option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
      {error && <span className="lf-error-msg">{error}</span>}
    </div>
  );
}
