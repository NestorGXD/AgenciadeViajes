import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import SchoolTripChatWidget from "@/components/chat/SchoolTripChatWidget";

export const metadata: Metadata = {
  title: "Contigo Tours | Agencia de Viajes y Paquetes Turísticos",
  description:
    "Descubre los mejores destinos turísticos con Contigo Tours. Mapa interactivo, cotizador en tiempo real con descuento para niños, hoteles certificados y reservas seguras con confirmación instantánea.",
  keywords: [
    "agencia de viajes",
    "contigo tours",
    "cancun",
    "medellin",
    "bogota",
    "cdmx",
    "paquetes turisticos",
    "viajes familiares",
    "hoteles todo incluido",
    "vuelos y hoteles",
  ],
  authors: [{ name: "Contigo Tours" }],
  openGraph: {
    title: "Contigo Tours | Tu Próxima Aventura Comienza Aquí",
    description:
      "Cotiza y reserva tus vacaciones soñadas en Cancún, CDMX, Medellín, Cartagena y más con tarifas transparentes para adultos y niños.",
    type: "website",
    locale: "es_MX",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-screen flex flex-col antialiased selection:bg-brand-500 selection:text-white">
        {/* Integración GA4 */}
        <GoogleAnalytics />

        {/* Barra de Navegación Principal */}
        <Navbar />

        {/* Contenido Principal */}
        <main className="flex-1">{children}</main>

        {/* Pie de Página */}
        <Footer />

        {/* Chat de Informes y Viajes Escolares */}
        <SchoolTripChatWidget />
      </body>
    </html>
  );
}
