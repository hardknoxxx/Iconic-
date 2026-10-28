import type { Metadata, Viewport } from "next";
import { Barlow_Condensed, Hanken_Grotesk, Instrument_Serif } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/data/site";
import { Providers } from "@/components/Providers";

/* Texto de interfaz: grotesk neutra y legible (nombres, precios, navegación, párrafos). */
const body = Hanken_Grotesk({ variable: "--font-body", subsets: ["latin"] });

/* Titulares: sans condensada y pesada, siempre en mayúsculas (ver .t-display). */
const display = Barlow_Condensed({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["600", "800"],
});

/* Voz editorial para los textos de apertura: serif de alto contraste, a tamaño grande. */
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400", style: ["normal", "italic"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "ICONIC — Ropa urbana en Puerto Iguazú",
    template: "%s · ICONIC",
  },
  description: site.description,
  openGraph: {
    type: "website",
    locale: site.locale,
    siteName: site.name,
    title: "ICONIC — Ropa urbana en Puerto Iguazú",
    description: site.description,
    images: [{ url: "/images/products/cadena-cruces.webp", width: 1500, height: 1500, alt: "Remera ICONIC con cruces y cadena" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es-AR" className={`${body.variable} ${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
