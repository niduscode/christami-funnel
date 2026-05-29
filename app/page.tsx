/* eslint-disable @next/next/no-img-element */
import { SiteNav } from "@/app/components/SiteNav";
import { HeroCarousel } from "@/app/components/HeroCarousel";
import { Catalogo } from "@/app/components/Catalogo";
import { AboutCarousel } from "@/app/components/AboutCarousel";
import { LeadForm } from "@/app/components/LeadForm";
import { SiteFooter, WhatsAppFloat, CONTACT } from "@/app/components/SiteFooter";
import { Reveal } from "@/app/components/Reveal";
import { Spotlight } from "@/app/components/Spotlight";
import { FAQ } from "@/app/components/FAQ";
import { CursorGlow } from "@/app/components/CursorGlow";
import { MarqueeBand } from "@/app/components/MarqueeBand";

/* ============================================================
   Iconos SVG line-art para los servicios
   ============================================================ */
const ICONS = {
  cocina: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <circle cx="7" cy="6" r="0.6" fill="currentColor" />
      <circle cx="12" cy="6" r="0.6" fill="currentColor" />
      <circle cx="17" cy="6" r="0.6" fill="currentColor" />
      <rect x="8" y="13" width="8" height="4" rx="0.5" />
    </svg>
  ),
  closet: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="4" y="3" width="16" height="18" rx="1" />
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="8" y1="11" x2="9" y2="11" />
      <line x1="15" y1="11" x2="16" y2="11" />
      <path d="M6 7h2" />
      <path d="M16 7h2" />
    </svg>
  ),
  dormitorio: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18v-4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
      <line x1="3" y1="18" x2="21" y2="18" />
      <line x1="3" y1="18" x2="3" y2="20" />
      <line x1="21" y1="18" x2="21" y2="20" />
      <rect x="5" y="9" width="4" height="3" rx="0.5" />
      <rect x="15" y="9" width="4" height="3" rx="0.5" />
    </svg>
  ),
  living: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 17a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3H3z" />
      <path d="M6 15v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4" />
      <line x1="9" y1="9" x2="15" y2="9" />
    </svg>
  ),
  oficina: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="3" y1="11" x2="21" y2="11" />
      <line x1="6" y1="11" x2="6" y2="20" />
      <line x1="18" y1="11" x2="18" y2="20" />
      <rect x="9" y="14" width="6" height="5" rx="0.5" />
      <path d="M15 4l3 4M18 4l-3 4" transform="translate(-2 -1)" />
      <rect x="14" y="3" width="4" height="4" rx="0.5" />
    </svg>
  ),
  bano: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 13h16v3a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4z" />
      <path d="M12 13V6" />
      <path d="M9 6h6" />
      <path d="M12 3v2" />
      <line x1="7" y1="20" x2="6" y2="22" />
      <line x1="17" y1="20" x2="18" y2="22" />
    </svg>
  ),
  diseno: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="6" r="2.2" />
      <path d="M10.5 8l-4 12" />
      <path d="M13.5 8l4 12" />
      <line x1="8" y1="17" x2="16" y2="17" />
    </svg>
  ),
  truck: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="12" height="9" rx="1" />
      <path d="M14 11h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.7" />
      <circle cx="17" cy="18" r="1.7" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.4 14.9 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z"/>
    </svg>
  ),
  email: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="5" width="18" height="14" rx="2"/>
      <path d="M3 7.5l9 6 9-6"/>
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="5"/>
      <circle cx="12" cy="12" r="4"/>
      <circle cx="17.3" cy="6.7" r="0.9" fill="currentColor"/>
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 21s-7-7-7-12a7 7 0 0 1 14 0c0 5-7 12-7 12z"/>
      <circle cx="12" cy="9" r="2.5"/>
    </svg>
  ),
  clock: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9"/>
      <path d="M12 7v5l3 2"/>
    </svg>
  ),
};

const SERVICIOS: { icon: React.ReactNode; title: string; desc: string }[] = [
  { icon: ICONS.cocina, title: "Cocinas a medida", desc: "Cocinas integrales con cubiertas premium, aéreos iluminados, islas y penínsulas diseñadas para tu espacio." },
  { icon: ICONS.closet, title: "Closets y vestidores", desc: "Closets que aprovechan cada centímetro. Sistemas modulares, espejos integrados y herrajes de calidad." },
  { icon: ICONS.dormitorio, title: "Dormitorios", desc: "Camas, respaldos, veladores y muebles de dormitorio coordinados con el estilo de tu habitación." },
  { icon: ICONS.living, title: "Living & Comedor", desc: "Vitrinas, racks de TV, mesas y muebles para los espacios que comparte tu familia día a día." },
  { icon: ICONS.oficina, title: "Muebles de oficina", desc: "Escritorios, estanterías y muebles funcionales para tu home office o espacio de trabajo." },
  { icon: ICONS.bano, title: "Baños & Logia", desc: "Vanitorios, repisas y muebles funcionales con materiales resistentes a la humedad." },
  { icon: ICONS.diseno, title: "Diseño personalizado", desc: "¿Tienes una idea distinta? Diseñamos cualquier mueble desde cero, adaptado a tus medidas y gustos." },
  { icon: ICONS.truck, title: "Instalación incluida", desc: "Nos encargamos de todo: medición, fabricación, traslado e instalación final en tu hogar." },
];

// Degradado cream → marrón oscuro. Los colores fg están ELEGIDOS para
// dar contraste WCAG ≥ 4.5:1 sobre cada bg — saltamos el rango tan
// medio que opacaba el texto en la versión anterior.
const SERVICE_GRADIENT: { bg: string; fg: string }[] = [
  { bg: "#FAF5EE", fg: "#2B1B0E" }, // 1 cream-soft       → tinta muy oscura
  { bg: "#EFE0C2", fg: "#2B1B0E" }, // 2 crema cálido
  { bg: "#D9BE92", fg: "#2B1B0E" }, // 3 tan claro
  { bg: "#8C5C2E", fg: "#FAF5EE" }, // 4 marrón medio (salto fuerte para contraste)
  { bg: "#714621", fg: "#FAF5EE" }, // 5
  { bg: "#573419", fg: "#FAF5EE" }, // 6
  { bg: "#3E2410", fg: "#FAF5EE" }, // 7 brown-deep
  { bg: "#1F1308", fg: "#FAF5EE" }, // 8 casi negro
];

const PROCESO: { num: string; title: string; desc: string }[] = [
  { num: "01", title: "Conversamos", desc: "Nos cuentas tu idea por WhatsApp y agendamos visita técnica o llamada — ambas gratis." },
  { num: "02", title: "Diseñamos", desc: "Levantamos medidas en sitio, te enviamos render y cotización por escrito antes de tocar madera." },
  { num: "03", title: "Fabricamos", desc: "Construimos en nuestro taller propio. Te mandamos avances para que veas el progreso real." },
  { num: "04", title: "Instalamos", desc: "Trasladamos e instalamos en tu casa. Dejamos todo limpio y listo para usar." },
];

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const sp = await searchParams;
  const utm = {
    source: sp.utm_source,
    campaign: sp.utm_campaign,
    medium: sp.utm_medium,
  };

  return (
    <>
      <SiteNav />
      <HeroCarousel />

      {/* ========== MARQUEE de materiales / muebles ========== */}
      <MarqueeBand />

      {/* ========== NOSOTROS ========== */}
      <section className="block about wood-bg" id="nosotros">
        <div className="container">
          <div className="about-grid">
            <div className="about-text reveal">
              <div className="section-eyebrow">Sobre nosotros</div>
              <h2>
                Seis años fabricando los{" "}
                <em style={{ fontStyle: "italic", color: "var(--brown-warm)" }}>
                  muebles soñados
                </em>{" "}
                de la Región de Los Lagos
              </h2>
              <p>
                En Mueblería Christami diseñamos y fabricamos cada mueble desde cero, escuchando lo
                que necesitas y adaptándolo a tu espacio. Cocinas, closets, vitrinas, islas,
                comedores — todo a medida.
              </p>
              <p>
                Trabajamos con cubiertas Galaxy, Fintop, perfiles de aluminio, iluminación LED y los
                mejores acabados del mercado. Lo que sale del taller no es solo un mueble: es una
                pieza pensada para durar y para verse perfecta en tu casa.
              </p>
              <p>
                <strong style={{ color: "var(--brown-deep)" }}>
                  Llegamos a toda la Región de Los Lagos:
                </strong>{" "}
                Puerto Montt, Puerto Varas, Osorno, Los Muermos, Isla de Chiloé y más ciudades.
                Diseñamos, fabricamos, trasladamos e instalamos donde estés.
              </p>
              <div className="stats reveal">
                <div>
                  <div className="stat-num" data-counter="6">0</div>
                  <div className="stat-label">Años de experiencia</div>
                </div>
                <div>
                  <div className="stat-num" data-counter="100">0</div>
                  <div className="stat-label">Proyectos entregados</div>
                </div>
                <div>
                  <div className="stat-num" data-counter="100" data-suffix="%">0</div>
                  <div className="stat-label">A medida</div>
                </div>
              </div>
            </div>
            <AboutCarousel />
          </div>
        </div>
      </section>

      {/* ========== SERVICIOS ========== */}
      <section className="block services" id="servicios">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-eyebrow">Lo que hacemos</div>
            <h2 className="section-title">
              Muebles a medida para <em>cada rincón</em> de tu hogar
            </h2>
            <p className="section-sub">
              Diseñamos y fabricamos todo tipo de muebles. Cuéntanos qué necesitas — lo hacemos
              posible.
            </p>
          </div>
          <Spotlight mode="multi" className="services-grid reveal-stagger">
            {SERVICIOS.map((s, idx) => {
              const g = SERVICE_GRADIENT[idx] ?? SERVICE_GRADIENT[0];
              return (
                <div
                  className="service-card service-card-tinted"
                  key={s.title}
                  style={{ background: g.bg, color: g.fg }}
                >
                  <div className="service-icon service-icon-svg">{s.icon}</div>
                  <h3>{s.title}</h3>
                  <p>{s.desc}</p>
                </div>
              );
            })}
          </Spotlight>
        </div>
      </section>

      {/* ========== CÓMO TRABAJAMOS ========== */}
      <section className="block proceso wood-bg" id="proceso">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-eyebrow">Cómo trabajamos</div>
            <h2 className="section-title">
              De la idea al mueble instalado, <em>sin sorpresas</em>
            </h2>
            <p className="section-sub">
              Cuatro pasos claros. Te acompañamos desde la primera conversación hasta el día que
              dejamos tu mueble armado en casa.
            </p>
          </div>
          <Spotlight mode="border" className="proceso-grid reveal-stagger">
            {PROCESO.map((p) => (
              <div className="proceso-step spot-target" key={p.num}>
                <div className="proceso-num">{p.num}</div>
                <h3 className="proceso-title">{p.title}</h3>
                <p className="proceso-desc">{p.desc}</p>
              </div>
            ))}
          </Spotlight>
        </div>
      </section>

      {/* ========== CATÁLOGO ========== */}
      <Catalogo />

      {/* ========== FAQ ========== */}
      <FAQ />

      {/* ========== COTIZA / FORMULARIO ========== */}
      <section className="block quote" id="cotizar">
        <div className="container">
          <div className="lead-form-wrap">
            {/* Columna izquierda: info y contacto */}
            <aside className="lead-form-info reveal">
              <div className="section-eyebrow">Cotizar</div>
              <h2 className="lead-form-title">
                Cuéntanos sobre <em>tu mueble</em>
              </h2>
              <p className="lead-form-sub">
                Respondemos en menos de 1 hora hábil. Visita técnica gratuita y cotización por
                escrito en menos de 48&nbsp;h — sin compromiso.
              </p>

              <ul className="lead-info-list">
                <li>
                  <span className="lead-info-icon lead-info-icon-wa" aria-hidden>
                    {ICONS.whatsapp}
                  </span>
                  <div>
                    <div className="lead-info-label">WhatsApp · Teléfono</div>
                    <a
                      href="https://api.whatsapp.com/send/?phone=56953041094&text&type=phone_number&app_absent=0&utm_source=ig"
                      target="_blank"
                      rel="noopener"
                    >
                      {CONTACT.whatsappE164}
                    </a>
                  </div>
                </li>
                <li>
                  <span className="lead-info-icon" aria-hidden>{ICONS.email}</span>
                  <div>
                    <div className="lead-info-label">Email</div>
                    <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                  </div>
                </li>
                <li>
                  <span className="lead-info-icon" aria-hidden>{ICONS.pin}</span>
                  <div>
                    <div className="lead-info-label">Oficina</div>
                    <a href={CONTACT.maps} target="_blank" rel="noopener">
                      Vía Romana 1812, Los Lagos
                    </a>
                  </div>
                </li>
                <li>
                  <span className="lead-info-icon lead-info-icon-ig" aria-hidden>
                    {ICONS.instagram}
                  </span>
                  <div>
                    <div className="lead-info-label">Instagram</div>
                    <a href={CONTACT.instagram} target="_blank" rel="noopener">
                      @muebleriachristami
                    </a>
                  </div>
                </li>
              </ul>
            </aside>

            {/* Columna derecha: formulario */}
            <div className="reveal">
              <LeadForm utm={utm} />
            </div>
          </div>
        </div>
      </section>

      {/* ========== CONTACTO ========== */}
      <section className="block contact" id="contacto">
        <div className="container">
          <div className="section-header reveal">
            <div className="section-eyebrow">Contacto</div>
            <h2 className="section-title">
              Hagamos realidad <em>tu próximo mueble</em>
            </h2>
            <p className="section-sub">
              Cuéntanos qué necesitas — pasa por la oficina o escríbenos por WhatsApp.
            </p>
          </div>
          <div className="contact-grid">
            <div className="contact-qr-stack reveal-stagger">
              {/* QR card 1 — Instagram (no clickeable, solo informativo) */}
              <div className="contact-qr-card">
                <div className="contact-qr-card-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=8&bgcolor=FFFFFF&color=1F1308&ecc=H&data=${encodeURIComponent(CONTACT.instagram)}`}
                    alt=""
                    loading="lazy"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt=""
                    className="contact-qr-card-logo"
                    loading="lazy"
                  />
                </div>
                <div className="contact-qr-card-body">
                  <span className="contact-qr-card-badge">Síguenos en Instagram</span>
                  <h3>El taller en vivo</h3>
                  <p>
                    Fotos, videos del proceso y proyectos recién entregados.
                    Te enterás de las nuevas piezas apenas salen.
                  </p>
                  <span className="contact-qr-card-link">
                    <span className="contact-qr-card-link-icon contact-item-icon-ig">
                      {ICONS.instagram}
                    </span>
                    Instagram
                  </span>
                </div>
              </div>

              {/* QR card 2 — WhatsApp (no clickeable, solo informativo) */}
              <div className="contact-qr-card">
                <div className="contact-qr-card-img">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=400x400&margin=8&bgcolor=FFFFFF&color=1F1308&ecc=H&data=https%3A%2F%2Fwa.me%2F56953041094"
                    alt=""
                    loading="lazy"
                  />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/logo.jpg"
                    alt=""
                    className="contact-qr-card-logo"
                    loading="lazy"
                  />
                </div>
                <div className="contact-qr-card-body">
                  <span className="contact-qr-card-badge">Escríbenos por WhatsApp</span>
                  <h3>Respondemos en menos de 1 h</h3>
                  <p>
                    Cotización por escrito en menos de 48 h hábiles.
                    Visita técnica gratuita, sin compromiso.
                  </p>
                  <span className="contact-qr-card-link">
                    <span className="contact-qr-card-link-icon contact-item-icon-wa">
                      {ICONS.whatsapp}
                    </span>
                    WhatsApp
                  </span>
                </div>
              </div>
            </div>

            <div className="map-card reveal">
              <iframe
                src={CONTACT.mapEmbed}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación Mueblería Christami"
              />
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
      <WhatsAppFloat />
      <Reveal />
      <CursorGlow />
    </>
  );
}
