import HeroSection from "@/components/home/HeroSection";
import AgencyAboutSection from "@/components/home/AgencyAboutSection";
import AgencyServicesSection from "@/components/home/AgencyServicesSection";
import InformativeDestinationsCatalog from "@/components/home/InformativeDestinationsCatalog";
import DestinationsMap from "@/components/map/DestinationsMap";
import TrustAndSecuritySection from "@/components/home/TrustAndSecuritySection";
import Testimonials from "@/components/home/Testimonials";
import FAQSection from "@/components/home/FAQSection";
import { getDestinationsList } from "@/lib/destinations";
import { GraduationCap, Phone, Mail, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const revalidate = 60; // Regenerar cada minuto

export default async function HomePage() {
  const destinations = await getDestinationsList();

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section con Bienvenida a la Agencia y Módulo Integrado de Inicio de Sesión */}
      <HeroSection />

      {/* 2. ¿Quiénes Somos? - Historia, Misión, Visión y Compromisos de Contigo Tours */}
      <AgencyAboutSection />

      {/* 3. Portafolio de Servicios (Vacacionales, Escolares, Culturales, Corporativos) */}
      <AgencyServicesSection />

      {/* 4. Catálogo Informativo de Destinos Turísticos (Solo Información, sin generador) */}
      <InformativeDestinationsCatalog destinations={destinations} />

      {/* 5. Mapa Interactivo Geográfico de Destinos (OpenStreetMap / Leaflet) */}
      <section id="mapa" className="py-20 bg-white border-t border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-black text-brand-600 uppercase tracking-widest bg-brand-50 px-3 py-1 rounded-full">
              Ubicación Geográfica
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-3">
              Mapa Interactivo de Destinos
            </h2>
            <p className="text-slate-500 text-sm mt-2">
              Haz clic en los marcadores del mapa para conocer las coordenadas reales, descripción cultural y hoteles aliados de cada destino.
            </p>
          </div>

          <DestinationsMap destinations={destinations} />
        </div>
      </section>

      {/* 6. Banner de Contacto Especial: Viajes Escolares y de Graduación */}
      <section className="py-14 bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-950 text-xs font-black px-3 py-1 rounded-full">
                <GraduationCap className="w-4 h-4" />
                Módulo Especial para Escuelas y Colegios
              </div>
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight">
                ¿Planeas un Viaje Escolar o de Graduación?
              </h2>
              <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
                Diseñamos itinerarios escolares completos con transporte turístico certificado, hoteles seguros, seguro de viajero y facilidades de pago para padres de familia.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-brand-200">
                <span className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  WhatsApp: <strong className="text-white">+52 443 186 6129</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-300" />
                  Correo: <strong className="text-white">hugoalex.riverab@gmail.com</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <Link
                href="/viajes-escolares"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs py-3.5 px-6 rounded-2xl shadow-lg shadow-amber-400/20 transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <span>Ver Paquetes Escolares</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="https://wa.me/524431866129?text=Hola%20Contigo%20Tours,%20quisiera%20solicitar%20informes%20para%20un%20viaje%20escolar."
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs py-3.5 px-6 rounded-2xl transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                <span>Pedir Informes por WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Garantías, Seguridad Bancaria Stripe y Respaldo al Viajero */}
      <TrustAndSecuritySection />

      {/* 8. Testimonios de Clientes */}
      <Testimonials />

      {/* 9. Preguntas Frecuentes (FAQ) */}
      <FAQSection />
    </div>
  );
}
