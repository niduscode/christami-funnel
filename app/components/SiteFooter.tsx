import Link from "next/link";
import { plainWaLink } from "@/app/lib/whatsapp";

export const CONTACT = {
  whatsappE164: "+56 9 5304 1094",
  email: "mueblechristami@gmail.com",
  instagram: "https://www.instagram.com/muebleriachristami/",
  facebook: "https://www.facebook.com/share/1JP1RXSiuS/?mibextid=wwXIfr",
  tiktok: "https://www.tiktok.com/@christamidelgado",
  direccion: "Via Romana 1812, Parque Cardonal, Los Lagos, Chile 5480000",
  maps: "https://maps.app.goo.gl/MSEnir6LmJPcsJQ78",
  // Usamos COORDENADAS (no dirección) para que Google Maps NO abra el
  // "place card" blanco arriba a la izquierda. Con `q=lat,lng` se ve solo
  // el marker, sin pop-up. El enlace para "Cómo llegar" (CONTACT.maps)
  // sigue apuntando a la ubicación real con todos sus datos.
  // Parque Cardonal, Puerto Montt — aprox.
  mapEmbed:
    "https://www.google.com/maps?q=-41.4612,-72.9387&z=15&hl=es&output=embed",
};

export function SiteFooter() {
  return (
    <footer>
      <div className="container">
        <div className="footer-brand">Mueblería Christami</div>
        <div className="footer-tag">
          Diseño y carpintería con alma artesanal · Región de Los Lagos
        </div>
        <div className="footer-social">
          <a href={CONTACT.instagram} target="_blank" rel="noopener" aria-label="Instagram">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M12 2.2c3.2 0 3.6 0 4.8.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.2.1 1.6.1 4.8s0 3.6-.1 4.8c-.1 1.2-.2 1.8-.4 2.2-.2.6-.5 1-.9 1.4-.4.4-.8.7-1.4.9-.4.2-1 .4-2.2.4-1.2.1-1.6.1-4.8.1s-3.6 0-4.8-.1c-1.2-.1-1.8-.2-2.2-.4-.6-.2-1-.5-1.4-.9-.4-.4-.7-.8-.9-1.4-.2-.4-.4-1-.4-2.2-.1-1.2-.1-1.6-.1-4.8s0-3.6.1-4.8c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4 1.2-.1 1.6-.1 4.8-.1zm0 2c-3.2 0-3.5 0-4.7.1-1.1.1-1.7.2-2 .4-.5.2-.9.4-1.2.7-.3.3-.5.7-.7 1.2-.2.3-.3.9-.4 2-.1 1.2-.1 1.5-.1 4.7s0 3.5.1 4.7c.1 1.1.2 1.7.4 2 .2.5.4.9.7 1.2.3.3.7.5 1.2.7.3.2.9.3 2 .4 1.2.1 1.5.1 4.7.1s3.5 0 4.7-.1c1.1-.1 1.7-.2 2-.4.5-.2.9-.4 1.2-.7.3-.3.5-.7.7-1.2.2-.3.3-.9.4-2 .1-1.2.1-1.5.1-4.7s0-3.5-.1-4.7c-.1-1.1-.2-1.7-.4-2-.2-.5-.4-.9-.7-1.2-.3-.3-.7-.5-1.2-.7-.3-.2-.9-.3-2-.4-1.2-.1-1.5-.1-4.7-.1zm0 3.4a4.4 4.4 0 1 1 0 8.8 4.4 4.4 0 0 1 0-8.8zm0 7.3a2.9 2.9 0 1 0 0-5.8 2.9 2.9 0 0 0 0 5.8zm5.6-7.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
          </a>
          <a href={plainWaLink()} target="_blank" rel="noopener" aria-label="WhatsApp">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
              <path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6.1-.1.3-.3.4-.5.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5 0-.1-.7-1.6-.9-2.2-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.3.3-1 1-1 2.4 0 1.4 1 2.8 1.2 3 .1.2 2 3 4.8 4.2.7.3 1.2.5 1.6.6.7.2 1.3.2 1.8.1.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.5-.3zM12 2C6.5 2 2 6.5 2 12c0 1.7.4 3.4 1.3 4.9L2 22l5.3-1.4c1.4.8 3 1.2 4.7 1.2 5.5 0 10-4.5 10-10S17.5 2 12 2zm0 18c-1.5 0-3-.4-4.3-1.2l-.3-.2-3.1.8.8-3-.2-.3C4.4 14.9 4 13.5 4 12c0-4.4 3.6-8 8-8s8 3.6 8 8-3.6 8-8 8z" />
            </svg>
          </a>
        </div>
        <div className="footer-bottom">
          © {new Date().getFullYear()} Mueblería Christami · Todos los derechos reservados ·{" "}
          <Link href="/privacidad">Política de privacidad</Link>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFloat() {
  return (
    <a
      href={plainWaLink()}
      className="whatsapp-float"
      target="_blank"
      rel="noopener"
      aria-label="Contactar por WhatsApp"
    >
      {/* Logo oficial de WhatsApp: bubble con cola + auricular detallado */}
      <svg viewBox="0 0 32 32" fill="currentColor" aria-hidden>
        <path d="M27.302 4.633A15.86 15.86 0 0 0 16.012.001C7.246.001.114 7.13.111 15.892c-.001 2.801.731 5.535 2.123 7.945L0 32l8.345-2.182a15.918 15.918 0 0 0 7.658 1.948h.006c8.766 0 15.898-7.13 15.901-15.892a15.798 15.798 0 0 0-4.608-11.241zM16.012 29.075h-.005a13.21 13.21 0 0 1-6.731-1.84l-.483-.286-5.003 1.31 1.336-4.876-.314-.5a13.139 13.139 0 0 1-2.018-7.001c.003-7.28 5.931-13.205 13.221-13.205a13.13 13.13 0 0 1 9.345 3.872 13.117 13.117 0 0 1 3.871 9.342c-.003 7.28-5.931 13.184-13.219 13.184zm7.252-9.881c-.397-.199-2.35-1.159-2.715-1.291-.364-.133-.629-.199-.894.199-.265.397-1.026 1.291-1.258 1.556-.231.265-.463.298-.86.099-.397-.199-1.677-.617-3.195-1.969-1.181-1.052-1.978-2.353-2.21-2.75-.231-.397-.024-.612.175-.81.179-.178.397-.464.595-.696.198-.232.265-.397.397-.662.133-.265.066-.497-.033-.696-.099-.199-.894-2.151-1.225-2.945-.323-.773-.651-.669-.894-.681-.231-.011-.496-.014-.761-.014a1.46 1.46 0 0 0-1.059.497c-.364.397-1.391 1.358-1.391 3.309 0 1.952 1.424 3.838 1.622 4.104.198.265 2.802 4.279 6.788 6 .949.41 1.689.654 2.266.836.952.302 1.819.26 2.504.158.764-.115 2.35-.961 2.682-1.889.331-.927.331-1.722.231-1.889-.099-.166-.364-.265-.761-.464z" />
      </svg>
    </a>
  );
}
