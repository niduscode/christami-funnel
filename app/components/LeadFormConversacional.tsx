"use client";

/**
 * Form conversacional estilo Typeform — NATIVO, sin dependencias ni suscripción.
 * Una pregunta a la vez, barra de progreso, Enter para avanzar, autoavance en
 * selección única. Usa el MISMO server action `submitLead`, así conserva intacto
 * todo el tracking: CAPI, dedup por event_id, score, WhatsApp prellenado y /gracias.
 *
 * Los valores viven en estado de React y se reflejan en inputs ocultos con los
 * nombres reales → la submission al server action funciona idéntica al form clásico.
 */
import { useActionState, useEffect, useRef, useState } from "react";
import { submitLead, type SubmitState } from "@/app/actions/submit-lead";
import { normalizeTelefono } from "@/app/lib/schemas";

const initialState: SubmitState = { ok: false };

const TIPOS: { id: string; label: string; icon: string }[] = [
  { id: "cocina", label: "Cocina", icon: "🍳" },
  { id: "dormitorio", label: "Closet / Dormitorio", icon: "👔" },
  { id: "living", label: "Living / TV", icon: "🛋️" },
  { id: "oficina", label: "Oficina", icon: "🏢" },
  { id: "otro", label: "Otro", icon: "📐" },
];
const PLAZO_OPTS: [string, string][] = [
  ["inmediato", "Lo antes posible"],
  ["1_3_meses", "Dentro de los próximos 2 meses"],
  ["3_6_meses", "Más adelante este año"],
];
const PRESUP_OPTS: [string, string][] = [
  ["menos_1m", "Menos de $1.000.000"],
  ["1m_3m", "$1.000.000 – $3.000.000"],
  ["3m_5m", "$3.000.000 – $5.000.000"],
  ["mas_5m", "Más de $5.000.000"],
];

const TOTAL = 8;
const LAST = TOTAL - 1;

function validPhone(v: string): boolean {
  const digits = v.replace(/\D/g, "");
  let tail = digits.startsWith("56") ? digits.slice(2) : digits;
  tail = tail.startsWith("9") ? tail.slice(1) : tail;
  return tail.length === 8;
}
function validEmail(v: string): boolean {
  if (!v.trim()) return true; // opcional
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

export function LeadFormConversacional({
  utm,
}: {
  utm: { source?: string; campaign?: string; medium?: string };
}) {
  const [state, formAction, pending] = useActionState(submitLead, initialState);

  const [step, setStep] = useState(0);
  const [tipos, setTipos] = useState<string[]>([]);
  const [nombre, setNombre] = useState("");
  const [telefono, setTelefono] = useState("");
  const [email, setEmail] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [plazo, setPlazo] = useState("");
  const [presup, setPresup] = useState("");
  const [consent, setConsent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const startedRef = useRef(false);

  // Micro-evento GA "form_start" en la primera interacción (paridad con el form viejo).
  function signalStart() {
    if (startedRef.current) return;
    startedRef.current = true;
    (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", "form_start");
  }

  // Al cambiar de paso: limpiar error y enfocar el input de texto (si lo hay).
  useEffect(() => {
    setError(null);
    const t = setTimeout(() => inputRef.current?.focus(), 70);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(
    () => () => {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
    },
    []
  );

  const toggleTipo = (id: string) =>
    setTipos((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]));

  function validate(s: number): string | null {
    switch (s) {
      case 0:
        return tipos.length ? null : "Elige al menos una opción.";
      case 1:
        return nombre.trim().length >= 2 ? null : "Dinos tu nombre (mínimo 2 letras).";
      case 2:
        return validPhone(telefono) ? null : "Escribe un número chileno válido (9 + 8 dígitos).";
      case 3:
        return validEmail(email) ? null : "Ese correo no se ve válido. Puedes dejarlo vacío.";
      case 4:
        return ciudad.trim().length >= 2 ? null : "¿En qué ciudad estás?";
      case 5:
        return plazo ? null : "Elige una opción.";
      case 6:
        return presup ? null : "Elige una opción.";
      case 7:
        return consent ? null : "Necesitamos tu aceptación para contactarte.";
      default:
        return null;
    }
  }

  function next() {
    const err = validate(step);
    if (err) {
      setError(err);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, LAST));
  }
  function back() {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }
  // Selección única → autoavance suave (estilo Typeform).
  function pick(setter: (v: string) => void, value: string, fromStep: number) {
    setter(value);
    setError(null);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(
      () => setStep((s) => (s === fromStep ? s + 1 : s)),
      320
    );
  }
  function onEnter(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      next();
    }
  }

  const tiposLabel = tipos
    .map((id) => TIPOS.find((t) => t.id === id)?.label ?? id)
    .join(" + ");
  const plazoLabel = PLAZO_OPTS.find(([v]) => v === plazo)?.[1] ?? "";
  const presupLabel = PRESUP_OPTS.find(([v]) => v === presup)?.[1] ?? "";
  const isTextStep = step >= 1 && step <= 4;
  const progress = Math.round(((step + 1) / TOTAL) * 100);

  return (
    <form
      action={formAction}
      className="cf"
      onFocusCapture={signalStart}
      onSubmit={(e) => {
        if (step !== LAST || !consent) e.preventDefault();
      }}
    >
      {/* Inputs ocultos con los nombres reales para submitLead */}
      <input type="hidden" name="tipo_proyecto" value={tipos.join(",")} />
      <input type="hidden" name="nombre" value={nombre} />
      <input type="hidden" name="email" value={email} />
      <input type="hidden" name="telefono" value={telefono} />
      <input type="hidden" name="ciudad" value={ciudad} />
      <input type="hidden" name="plazo" value={plazo} />
      <input type="hidden" name="presupuesto_rango" value={presup} />
      <input type="hidden" name="consentimiento" value={consent ? "on" : ""} />
      <input type="hidden" name="utm_source" value={utm.source ?? ""} />
      <input type="hidden" name="utm_campaign" value={utm.campaign ?? ""} />
      <input type="hidden" name="utm_medium" value={utm.medium ?? ""} />

      {/* Progreso */}
      <div className="cf-top">
        <div className="cf-progress">
          <div className="cf-progress-bar" style={{ width: `${progress}%` }} />
        </div>
        <span className="cf-stepcount">
          {step + 1} / {TOTAL}
        </span>
      </div>

      {/* Paso actual (key → re-anima la entrada) */}
      <div className="cf-step" key={step}>
        {step === 0 && (
          <>
            <h2 className="cf-q">¿Qué quieres cotizar?</h2>
            <p className="cf-hint">Puedes elegir varias.</p>
            <div className="cf-options cf-options--multi">
              {TIPOS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={`cf-option${tipos.includes(t.id) ? " selected" : ""}`}
                  aria-pressed={tipos.includes(t.id)}
                  onClick={() => toggleTipo(t.id)}
                >
                  <span className="cf-option-icon" aria-hidden>
                    {t.icon}
                  </span>
                  <span className="cf-option-label">{t.label}</span>
                  <span className="cf-option-check" aria-hidden>
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 1 && (
          <>
            <h2 className="cf-q">¿Cómo te llamas?</h2>
            <p className="cf-hint">Para dirigirnos a ti como corresponde.</p>
            <input
              ref={inputRef}
              className="cf-input"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              onKeyDown={onEnter}
              placeholder="Tu nombre"
              autoComplete="name"
            />
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="cf-q">¿A qué WhatsApp te contactamos?</h2>
            <p className="cf-hint">Te respondemos en menos de 1 hora hábil.</p>
            <div className="cf-phone">
              <span className="cf-phone-chip" aria-hidden>
                🇨🇱 +56
              </span>
              <input
                ref={inputRef}
                className="cf-input cf-phone-input"
                type="tel"
                inputMode="numeric"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                onKeyDown={onEnter}
                placeholder="9 1234 5678"
                autoComplete="tel"
              />
            </div>
          </>
        )}

        {step === 3 && (
          <>
            <h2 className="cf-q">
              ¿Tu correo? <span className="cf-opt">(opcional)</span>
            </h2>
            <p className="cf-hint">Para enviarte la cotización por escrito. Si prefieres, sáltalo.</p>
            <input
              ref={inputRef}
              className="cf-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={onEnter}
              placeholder="tu@email.com"
              autoComplete="email"
            />
          </>
        )}

        {step === 4 && (
          <>
            <h2 className="cf-q">¿En qué ciudad estás?</h2>
            <p className="cf-hint">Llegamos a toda la Región de Los Lagos.</p>
            <input
              ref={inputRef}
              className="cf-input"
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              onKeyDown={onEnter}
              placeholder="Puerto Montt, Osorno, Chiloé…"
              autoComplete="address-level2"
            />
          </>
        )}

        {step === 5 && (
          <>
            <h2 className="cf-q">¿Cuándo lo necesitas?</h2>
            <p className="cf-hint">Fabricamos en 20–30 días hábiles desde que apruebas el diseño.</p>
            <div className="cf-options">
              {PLAZO_OPTS.map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  className={`cf-option${plazo === v ? " selected" : ""}`}
                  aria-pressed={plazo === v}
                  onClick={() => pick(setPlazo, v, 5)}
                >
                  <span className="cf-option-label">{l}</span>
                  <span className="cf-option-check" aria-hidden>
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 6 && (
          <>
            <h2 className="cf-q">¿Cuánto piensas invertir?</h2>
            <p className="cf-hint">Es solo para orientarte — el valor final se afina en la visita.</p>
            <div className="cf-options">
              {PRESUP_OPTS.map(([v, l]) => (
                <button
                  key={v}
                  type="button"
                  className={`cf-option${presup === v ? " selected" : ""}`}
                  aria-pressed={presup === v}
                  onClick={() => pick(setPresup, v, 6)}
                >
                  <span className="cf-option-label">{l}</span>
                  <span className="cf-option-check" aria-hidden>
                    ✓
                  </span>
                </button>
              ))}
            </div>
          </>
        )}

        {step === 7 && (
          <>
            <h2 className="cf-q">
              {nombre ? `Listo, ${nombre.split(" ")[0]} ` : "Casi listo "}🎉
            </h2>
            <p className="cf-hint">Revisa y envía. Te contactamos en menos de 1 hora hábil.</p>
            <ul className="cf-summary">
              <li>
                <span>Proyecto</span>
                <strong>{tiposLabel}</strong>
              </li>
              <li>
                <span>WhatsApp</span>
                <strong>{normalizeTelefono(telefono)}</strong>
              </li>
              {email.trim() && (
                <li>
                  <span>Correo</span>
                  <strong>{email}</strong>
                </li>
              )}
              <li>
                <span>Ciudad</span>
                <strong>{ciudad}</strong>
              </li>
              <li>
                <span>Plazo</span>
                <strong>{plazoLabel}</strong>
              </li>
              <li>
                <span>Presupuesto</span>
                <strong>{presupLabel}</strong>
              </li>
            </ul>
            <label className="cf-consent">
              <input
                type="checkbox"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <span>
                Acepto que Mueblería Christami use mis datos para contactarme. Ver{" "}
                <a href="/privacidad" target="_blank" rel="noopener">
                  política de privacidad
                </a>
                .
              </span>
            </label>
          </>
        )}
      </div>

      {/* Pie: error + navegación */}
      <div className="cf-foot">
        {(error || (state.error && step === LAST)) && (
          <div className="cf-error">{error ?? state.error}</div>
        )}
        <div className="cf-actions">
          {step > 0 ? (
            <button type="button" className="cf-back" onClick={back}>
              ← Atrás
            </button>
          ) : (
            <span />
          )}
          {step < LAST ? (
            <button type="button" className="cf-next" onClick={next}>
              Continuar →
            </button>
          ) : (
            <button type="submit" className="cf-next cf-submit" disabled={pending || !consent}>
              {pending ? "Enviando…" : "Enviar solicitud"} →
            </button>
          )}
        </div>
        {isTextStep && (
          <div className="cf-enter-hint">
            pulsa <kbd>Enter ↵</kbd>
          </div>
        )}
      </div>
    </form>
  );
}
