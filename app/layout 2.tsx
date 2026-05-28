import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import { GA4, MetaPixel } from "@/app/components/Pixel";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://muebleriachristami.cl"),
  title: "Mueblería Christami — Muebles a medida en Los Lagos",
  description:
    "Cocinas, closets y mobiliario a medida en la Región de Los Lagos. 6 años diseñando y fabricando con maderas nobles. Cotiza por WhatsApp.",
  openGraph: {
    title: "Mueblería Christami — Muebles a medida en Los Lagos",
    description: "Cocinas, closets y mobiliario a medida. Cotiza tu proyecto por WhatsApp.",
    type: "website",
    locale: "es_CL",
    images: ["/portafolio/cocina-1.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <MetaPixel />
        <GA4 />
        {children}
      </body>
    </html>
  );
}
