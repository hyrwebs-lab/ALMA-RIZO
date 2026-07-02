import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import WhatsAppFloat from "@/components/site/WhatsAppFloat";
import HideOnAdmin from "@/components/site/HideOnAdmin";
import CookieBanner from "@/components/site/CookieBanner";
import { LanguageProvider } from "@/lib/i18n";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://almarizo.com"),
  title: {
    default: "Alma Rizo · Peluquería especializada en cabello rizado en Tarragona",
    template: "%s · Alma Rizo",
  },
  description:
    "Peluquería curly en Tarragona especializada en cabello rizado: corte en seco, diagnóstico y definición personalizada. Empieza a entender tu rizo y reserva tu cita.",
  keywords: [
    "peluquería cabello rizado Tarragona",
    "peluquería curly Tarragona",
    "corte rizo Tarragona",
    "especialistas en cabello rizado",
    "corte en seco rizos",
    "método curly Tarragona",
  ],
  openGraph: {
    type: "website",
    locale: "es_ES",
    url: "https://almarizo.com",
    title: "Alma Rizo · Especialistas en cabello rizado en Tarragona",
    description:
      "Corte, diagnóstico y definición personalizada para tu rizo. Reserva tu cita en Tarragona.",
    siteName: "Alma Rizo",
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Alma Rizo · Curly Studio by MariCruz" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Alma Rizo · Peluquería curly en Tarragona",
    description: "Especialistas en cabello rizado. Reserva tu cita en Tarragona.",
    images: ["/og.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: true, address: true },
  alternates: { canonical: "/" },
  // GEO / SEO local — Tarragona
  other: {
    "geo.region": "ES-T",
    "geo.placename": "Tarragona",
    "geo.position": "41.118;1.245",
    ICBM: "41.118, 1.245",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="es"
      className={`${cormorant.variable} ${inter.variable} h-full`}
    >
      <body className="min-h-full flex flex-col bg-cream-soft text-ink">
        <LanguageProvider>
        <HideOnAdmin>
          <Header />
        </HideOnAdmin>
        <main className="flex-1">{children}</main>
        <HideOnAdmin>
          <Footer />
        </HideOnAdmin>
        <HideOnAdmin>
          <WhatsAppFloat />
        </HideOnAdmin>
        <HideOnAdmin>
          <CookieBanner />
        </HideOnAdmin>
        </LanguageProvider>
      </body>
    </html>
  );
}
