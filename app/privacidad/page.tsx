import { SiteNav } from "@/app/components/SiteNav";
import { SiteFooter, CONTACT } from "@/app/components/SiteFooter";

export const metadata = { title: "Política de privacidad · Mueblería Christami" };

export default function PrivacidadPage() {
  return (
    <>
      <SiteNav solid />
      <main className="bg-[var(--cream)]">
        <article className="mx-auto max-w-3xl px-6 pb-20 pt-32 text-[var(--ink)]">
          <h1 className="font-serif text-4xl text-[var(--brown-deep)]">Política de privacidad</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Última actualización: {new Date().toLocaleDateString("es-CL")}
          </p>

          <section className="prose mt-8 max-w-none space-y-5 text-[var(--ink)]">
            <h2 className="font-serif text-2xl text-[var(--brown-deep)]">1. Quiénes somos</h2>
            <p>
              Mueblería Christami, ubicada en {CONTACT.direccion}, opera este sitio para presentar
              su trabajo y recibir solicitudes de cotización.
            </p>

            <h2 className="font-serif text-2xl text-[var(--brown-deep)]">
              2. Qué datos recolectamos
            </h2>
            <p>
              Cuando completas el formulario de cotización guardamos tu nombre, teléfono, email
              (opcional), ciudad y detalles del proyecto. Además registramos parámetros UTM si
              llegaste desde una campaña.
            </p>

            <h2 className="font-serif text-2xl text-[var(--brown-deep)]">3. Para qué los usamos</h2>
            <p>
              Únicamente para contactarte y avanzar con tu cotización. No compartimos tus datos con
              terceros salvo proveedores técnicos necesarios para hacer funcionar el sitio
              (Supabase, Resend, Vercel).
            </p>

            <h2 className="font-serif text-2xl text-[var(--brown-deep)]">4. Cookies y analítica</h2>
            <p>
              Usamos Meta Pixel y Google Analytics 4 para medir el desempeño de campañas y mejorar
              el sitio. Puedes bloquear estas cookies desde tu navegador.
            </p>

            <h2 className="font-serif text-2xl text-[var(--brown-deep)]">5. Tus derechos</h2>
            <p>
              De acuerdo a la Ley 19.628 sobre Protección de la Vida Privada, puedes solicitar
              acceso, rectificación o eliminación de tus datos escribiendo a{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="underline decoration-[var(--olive)] underline-offset-2"
              >
                {CONTACT.email}
              </a>
              .
            </p>

            <h2 className="font-serif text-2xl text-[var(--brown-deep)]">6. Contacto</h2>
            <p>
              Si tienes dudas sobre esta política escríbenos a{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="underline decoration-[var(--olive)] underline-offset-2"
              >
                {CONTACT.email}
              </a>
              .
            </p>
          </section>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
