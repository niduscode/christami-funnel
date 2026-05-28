import type { Metadata } from "next";
import { GA4, MetaPixel } from "@/app/components/Pixel";
import "./globals.css";
import "./catalogo.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://muebleriachristami.cl"),
  title: "Mueblería Christami — Diseño y carpintería con alma artesanal",
  description:
    "Mueblería Christami en la Región de Los Lagos. 6 años creando muebles a medida: cocinas, closets, dormitorios y más. Catálogo de proyectos reales.",
  openGraph: {
    title: "Mueblería Christami — Muebles a medida en Los Lagos",
    description: "Cocinas, closets y mobiliario a medida. Mira nuestro catálogo y cotiza tu proyecto.",
    type: "website",
    locale: "es_CL",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <MetaPixel />
        <GA4 />
        {children}
      </body>
    </html>
  );
}
