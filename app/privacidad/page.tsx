import Link from "next/link";
import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter, CONTACT } from "@/app/components/SiteFooter";

export const metadata = { title: "Política de privacidad · Mueblería Christami" };

/** Cada sección como tarjeta numerada. El body acepta JSX para enlaces. */
const SECTIONS: { id: string; title: string; icon: React.ReactNode; body: React.ReactNode }[] = [
  {
    id: "quienes-somos",
    title: "Quiénes somos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 9h1M9 13h1M9 17h1M14 9h1M14 13h1M14 17h1" />
      </svg>
    ),
    body: (
      <p>
        Mueblería Christami, ubicada en {CONTACT.direccion}, opera este sitio para presentar
        su trabajo y recibir solicitudes de cotización.
      </p>
    ),
  },
  {
    id: "que-datos",
    title: "Qué datos recolectamos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6" />
        <path d="M8 13h8M8 17h8M8 9h2" />
      </svg>
    ),
    body: (
      <p>
        Cuando completas el formulario de cotización guardamos tu <strong>nombre</strong>,{" "}
        <strong>teléfono</strong>, <strong>email</strong> (opcional), <strong>ciudad</strong> y los{" "}
        <strong>detalles del proyecto</strong>. Además registramos parámetros UTM si llegaste
        desde una campaña, para saber qué publicación te trajo.
      </p>
    ),
  },
  {
    id: "para-que",
    title: "Para qué los usamos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <path d="m9 11 3 3 9-9" />
      </svg>
    ),
    body: (
      <p>
        Únicamente para <strong>contactarte y avanzar con tu cotización</strong>. No
        compartimos tus datos con terceros salvo proveedores técnicos necesarios para hacer
        funcionar el sitio (Supabase para guardar tu solicitud, Resend para email, Vercel
        para hosting).
      </p>
    ),
  },
  {
    id: "cookies",
    title: "Cookies y analítica",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21.5 11.5A10 10 0 1 1 11 2a4 4 0 0 0 4 4 4 4 0 0 0 4 4 4 4 0 0 0 2.5 1.5z" />
        <circle cx="9" cy="9" r="0.6" fill="currentColor" />
        <circle cx="14" cy="14" r="0.6" fill="currentColor" />
        <circle cx="8" cy="16" r="0.6" fill="currentColor" />
      </svg>
    ),
    body: (
      <p>
        Usamos <strong>Meta Pixel</strong> y <strong>Google Analytics 4</strong> para medir
        el desempeño de campañas y mejorar el sitio. Puedes bloquear estas cookies desde la
        configuración de tu navegador en cualquier momento.
      </p>
    ),
  },
  {
    id: "derechos",
    title: "Tus derechos",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    body: (
      <p>
        De acuerdo a la <strong>Ley 19.628</strong> sobre Protección de la Vida Privada,
        puedes solicitar <strong>acceso, rectificación o eliminación</strong> de tus datos
        escribiendo a{" "}
        <a href={`mailto:${CONTACT.email}`} className="priv-link">
          {CONTACT.email}
        </a>
        . Respondemos en menos de 7 días hábiles.
      </p>
    ),
  },
  {
    id: "contacto",
    title: "Contacto",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <path d="m22 6-10 7L2 6" />
      </svg>
    ),
    body: (
      <p>
        Si tienes dudas sobre esta política escríbenos a{" "}
        <a href={`mailto:${CONTACT.email}`} className="priv-link">
          {CONTACT.email}
        </a>
        .
      </p>
    ),
  },
];

export default function PrivacidadPage() {
  const lastUpdated = new Date().toLocaleDateString("es-CL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <>
      <SiteNav solid />
      <main className="priv-page">
        {/* Hero band */}
        <section className="priv-hero">
          <div className="container">
            <div className="priv-eyebrow">Transparencia · Tus datos</div>
            <h1 className="priv-title">
              Política de <em>privacidad</em>
            </h1>
            <p className="priv-intro">
              Mueblería Christami toma tu información con la misma prolijidad con la que trabajamos
              la madera: sólo guardamos lo necesario, sólo lo usamos para lo que dijimos, y
              siempre podés borrarlo si querés.
            </p>
            <div className="priv-meta">
              <span className="priv-chip-pulse" aria-hidden />
              Última actualización: <strong>{lastUpdated}</strong>
            </div>
          </div>
        </section>

        {/* TOC chips */}
        <section className="priv-toc-wrap">
          <div className="container">
            <nav className="priv-toc" aria-label="Índice">
              {SECTIONS.map((s, idx) => (
                <a key={s.id} href={`#${s.id}`} className="priv-toc-chip">
                  <span className="priv-toc-num">{String(idx + 1).padStart(2, "0")}</span>
                  {s.title}
                </a>
              ))}
            </nav>
          </div>
        </section>

        {/* Sections */}
        <section className="priv-sections">
          <div className="container">
            <div className="priv-stack">
              {SECTIONS.map((s, idx) => (
                <article key={s.id} id={s.id} className="priv-card">
                  <div className="priv-card-head">
                    <div className="priv-card-icon" aria-hidden>
                      {s.icon}
                    </div>
                    <div className="priv-card-titles">
                      <div className="priv-card-num">{String(idx + 1).padStart(2, "0")}</div>
                      <h2 className="priv-card-title">{s.title}</h2>
                    </div>
                  </div>
                  <div className="priv-card-body">{s.body}</div>
                </article>
              ))}
            </div>

            {/* Bottom CTA */}
            <aside className="priv-cta">
              <h3>¿Algo no te queda claro?</h3>
              <p>Escribinos y te respondemos en menos de 24 h hábiles.</p>
              <div className="priv-cta-actions">
                <a className="priv-cta-btn priv-cta-primary" href={`mailto:${CONTACT.email}`}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="m22 6-10 7L2 6" />
                  </svg>
                  Escribinos
                </a>
                <Link className="priv-cta-btn priv-cta-ghost" href="/">
                  ← Volver al inicio
                </Link>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
