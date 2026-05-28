/* eslint-disable @next/next/no-img-element */
import { Spotlight } from "@/app/components/Spotlight";

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cuánto cuesta un mueble a medida?",
    a: "Depende del tamaño, materiales y herrajes que elijas. Escríbenos por WhatsApp con fotos y medidas (aunque sean aproximadas) y te enviamos una cotización por escrito en menos de 48 h, sin compromiso.",
  },
  {
    q: "¿Hacen visita técnica gratis?",
    a: "Sí. Coordinamos visita en sitio sin costo en toda la Región de Los Lagos para tomar medidas exactas y entender cómo aprovechar mejor tu espacio.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "Cocinas y closets grandes: 4–6 semanas desde que apruebas el diseño. Muebles individuales (vanitorios, racks de TV, escritorios): 2–3 semanas. Te entregamos cronograma por escrito.",
  },
  {
    q: "¿Qué materiales y herrajes usan?",
    a: "Melamina premium (Egger, Masisa), cubiertas Galaxy y Fintop, perfiles de aluminio, herrajes Blum y Hafele, e iluminación LED. Te mostramos muestras antes de fabricar.",
  },
  {
    q: "¿La instalación está incluida?",
    a: "Sí. Diseño, fabricación, traslado e instalación están dentro del precio cotizado. Sin costos sorpresa al final.",
  },
  {
    q: "¿Llegan a mi ciudad?",
    a: "Cubrimos toda la Región de Los Lagos: Puerto Montt, Puerto Varas, Osorno, Los Muermos, Isla de Chiloé y alrededores. Si tu zona está fuera, consúltanos igual — solemos llegar.",
  },
  {
    q: "¿Puedo pagar en cuotas?",
    a: "Sí. Trabajamos con un anticipo al confirmar el diseño y el resto se reparte hasta la entrega. Acordamos un esquema que te acomode.",
  },
  {
    q: "¿Y si no me gusta el diseño?",
    a: "Antes de fabricar nada te mostramos render 3D y plano técnico. Iteramos las veces que haga falta hasta que estés conforme. Solo cuando das el visto bueno pasamos a taller.",
  },
];

export function FAQ() {
  return (
    <section className="block faq" id="faq">
      <div className="container">
        <div className="section-header reveal">
          <div className="section-eyebrow">Preguntas frecuentes</div>
          <h2 className="section-title">
            Todo lo que <em>quieres saber</em> antes de cotizar
          </h2>
          <p className="section-sub">
            Si tu duda no está aquí, escríbenos por WhatsApp — respondemos en menos de 1 hora hábil.
          </p>
        </div>

        <Spotlight mode="card" className="faq-list reveal-stagger">
          {FAQS.map((f, i) => (
            <details key={f.q} className="faq-item spot-target" name="christami-faq">
              <summary>
                <span className="faq-q-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="faq-q-text">{f.q}</span>
                <span className="faq-q-icon" aria-hidden>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </span>
              </summary>
              <div className="faq-a">{f.a}</div>
            </details>
          ))}
        </Spotlight>
      </div>
    </section>
  );
}
