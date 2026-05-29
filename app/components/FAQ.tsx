/* eslint-disable @next/next/no-img-element */
import { Spotlight } from "@/app/components/Spotlight";

const FAQS: { q: string; a: string }[] = [
  {
    q: "¿Cuánto cuesta un mueble a medida?",
    a: "Depende del tamaño, materiales y herrajes que elijas. Escríbenos por WhatsApp con fotos y medidas (aunque sean aproximadas) y te enviamos una cotización por escrito en menos de 48 h, sin compromiso.",
  },
  {
    q: "¿La visita técnica tiene costo?",
    a: "Sí, tiene un costo simbólico que después se descuenta de tu cotización si aprobás el proyecto. Dentro de Puerto Montt son $10.000. Fuera de Puerto Montt el costo depende del kilometraje — te lo pasamos antes de coordinar para que decidas sin sorpresas.",
  },
  {
    q: "¿Cuánto tarda en estar listo?",
    a: "Cocinas y clósets: entre 20 y 30 días hábiles desde que aprobás el diseño. La instalación en tu casa toma 2 o 3 días más, según la distancia y el tamaño del proyecto. Te entregamos un cronograma por escrito al firmar.",
  },
  {
    q: "¿Qué materiales y herrajes usan?",
    a: "Melamina premium (Egger, Masisa), cubiertas Galaxy y Fintop, perfiles de aluminio, herrajes Blum y Hafele, e iluminación LED. Te mostramos muestras antes de fabricar.",
  },
  {
    q: "¿La instalación está incluida?",
    a: "Sí, la instalación siempre va incluida en el precio cotizado. Lo único que se cobra aparte es el flete (traslado del mobiliario desde nuestro taller hasta tu domicilio), que varía según la distancia.",
  },
  {
    q: "¿Llegan a mi ciudad?",
    a: "Cubrimos toda la Región de Los Lagos: Puerto Montt, Puerto Varas, Osorno, Los Muermos, Isla de Chiloé y alrededores. Por ahora no salimos de la región — los costos de traslado y viáticos a otras regiones no nos permitirían mantener nuestros precios.",
  },
  {
    q: "¿Cómo es la modalidad de pago?",
    a: "Trabajamos con un esquema simple de 50/50: 50% al aprobar el proyecto (para empezar la fabricación) y el 50% restante al terminar la instalación en tu casa. Sin cuotas escondidas ni sorpresas al final.",
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
