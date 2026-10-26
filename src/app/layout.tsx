import type { Metadata, Viewport } from "next";
import { Archivo, Jost } from "next/font/google";
import "lenis/dist/lenis.css";
import "./globals.css";
import { site } from "@/data/site";
import { Providers } from "@/components/Providers";

/* Jost: geométrica, cercana al trazo del logo; se usa para el texto corrido. */
const body = Jost({ variable: "--font-body", subsets: ["latin"] });

const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  weight: "variable",
});

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
    <html lang="es-AR" className={`${body.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: "document.documentElement.classList.add('js')" }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
