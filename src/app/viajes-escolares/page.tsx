import { Metadata } from "next";
import Link from "next/link";
import { GraduationCap, ShieldCheck, Bus, Award, Phone, Mail, CheckCircle2, Clock, Sparkles, ArrowRight, HeartHandshake, MapPin } from "lucide-react";
import SchoolTripForm from "@/components/school/SchoolTripForm";

export const metadata: Metadata = {
  title: "Viajes Escolares y de Graduación | Contigo Tours",
  description: "Organiza tu viaje escolar o de graduación con Contigo Tours. Paquetes completos, seguridad garantizada, transporte turístico certificado y atención directa por WhatsApp al 4431866129 o al correo hugoalex.riverab@gmail.com.",
};

export default function SchoolTripsPage() {
  const WHATSAPP_NUMBER = "4431866129";
  const WHATSAPP_DISPLAY = "443 186 6129";
  const ADMIN_EMAIL = "hugoalex.riverab@gmail.com";

  const benefits = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Seguridad y Póliza 100% Certificada",
      desc: "Seguro integral de viajero con cobertura médica completa, pulseras de identificación y protocolos certificados para menores de edad.",
    },
    {
      icon: <Bus className="w-6 h-6 text-brand-600" />,
      title: "Transporte Turístico de Alta Gama",
      desc: "Autobuses Irizar/Volvo último modelo con rastreo GPS satelital, operadores certificados, aire acondicionado y pantallas multimedia.",
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      title: "Coordinadores y Guías Especializados",
      desc: "Personal capacitado de Contigo Tours asignado exclusivamente a tu grupo las 24 horas del día durante todo el itinerario.",
    },
    {
      icon: <HeartHandshake className="w-6 h-6 text-purple-600" />,
      title: "Facilidades y Cortesías para Profesores",
      desc: "Plazas de cortesía completas para maestros acompañantes y planes de pago diferido sin intereses para los padres de familia.",
    },
  ];

  const packages = [
    {
      title: "Graduación y Playa Todo Incluido",
      destinations: "Cancún • Riviera Maya • Puerto Vallarta",
      desc: "El viaje soñado de fin de cursos. Hoteles resort 5 estrellas frente al mar, alimentos y bebidas ilimitadas, eventos privados y tours a cenotes/parques.",
      tag: "Más Popular",
      tagColor: "bg-amber-400 text-slate-950",
      image: "https://images.unsplash.com/photo-1510097467424-192d713fd8c2?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Rutas Culturales e Históricas",
      destinations: "CDMX • Oaxaca • Guanajuato • Teotihuacán",
      desc: "Enfoque formativo y recreativo con entradas a los museos y zonas arqueológicas más representativas, talleres artesanales y gastronomía típica.",
      tag: "Educativo y Cultural",
      tagColor: "bg-brand-500 text-white",
      image: "https://images.unsplash.com/photo-1518105779142-d975f22f1b0a?auto=format&fit=crop&w=800&q=80",
    },
    {
      title: "Aventura y Ecoturismo Escolar",
      destinations: "Huasteca Potosina • Chiapas • Valle de Bravo",
      desc: "Campamentos ecológicos, senderismo, tirolesas, cascadas y dinámicas de integración grupal dirigidas por instructores certificados.",
      tag: "Naturaleza",
      tagColor: "bg-emerald-600 text-white",
      image: "https://images.unsplash.com/photo-1565342894537-8e6d5e1ef932?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Hero Section Viajes Escolares */}
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-brand-900 via-brand-800 to-slate-900 text-white p-8 sm:p-14 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-brand-500/30 backdrop-blur-md border border-brand-300/30 text-brand-200 text-xs font-bold px-3.5 py-1.5 rounded-full mb-4">
              <GraduationCap className="w-4 h-4 text-amber-300" />
              Especialistas en Viajes Escolares, Graduaciones y Excursiones
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
              Arma el Viaje Escolar Perfecto con <span className="text-amber-400">Contigo Tours</span>
            </h1>

            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-8">
              Ofrecemos experiencias educativas y de graduación diseñadas a la medida para colegios, secundarias, preparatorias y universidades. Seguridad total, asesoría integral y facilidades para comités escolares y padres de familia.
            </p>

            {/* Accesos directos de contacto requeridos */}
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`https://wa.me/52${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola Contigo Tours, me interesa recibir informes y cotizar un viaje escolar.")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-lg shadow-emerald-500/25 transition flex items-center gap-2"
              >
                <Phone className="w-4 h-4 fill-slate-950" />
                <span>WhatsApp Directo: {WHATSAPP_DISPLAY}</span>
              </a>

              <a
                href={`mailto:${ADMIN_EMAIL}?subject=Solicitud%20de%20Informes%20de%20Viaje%20Escolar`}
                className="bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl border border-white/20 transition flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>{ADMIN_EMAIL}</span>
              </a>

              <a
                href="#formulario-escolar"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm py-3.5 px-6 rounded-2xl transition shadow-md"
              >
                Solicitar Cotización por Formulario
              </a>
            </div>
          </div>
        </div>

        {/* Tarjeta de Contacto Directo */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-2xl flex-shrink-0">
              📞
            </div>
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider block">
                Atención Directa a Directores y Comités
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Coordinación de Viajes Escolares Contigo Tours
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Comunícate con nuestro asesor <strong>Hugo Alex Rivera</strong> para una presentación en tu colegio o cotización inmediata.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <a
              href={`https://wa.me/52${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="flex-1 md:flex-initial bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-200 text-xs font-bold py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-4 h-4" />
              <span>{ADMIN_EMAIL}</span>
            </a>
          </div>
        </div>

        {/* Pilares de Tranquilidad para Colegios y Padres */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">
              Garantía y Confianza
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              ¿Por qué confiar el viaje de tus alumnos a Contigo Tours?
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Sabemos que la seguridad de los estudiantes es la máxima prioridad para los padres de familia y las instituciones educativas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
                    {b.icon}
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-sm mb-2">{b.title}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">{b.desc}</p>
                </div>
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-600">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Incluido en contrato
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Paquetes Escolares Destacados */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-1">
              Modalidades
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Tipos de Viajes Escolares Disponibles
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {packages.map((pkg, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition flex flex-col"
              >
                <div className="relative h-48 w-full overflow-hidden">
                  <img src={pkg.image} alt={pkg.title} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold px-2.5 py-1 rounded-full shadow ${pkg.tagColor}`}>
                    {pkg.tag}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg mb-1">{pkg.title}</h3>
                    <p className="text-xs font-semibold text-brand-600 mb-3 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {pkg.destinations}
                    </p>
                    <p className="text-xs text-slate-500 leading-relaxed">{pkg.desc}</p>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <a
                      href="#formulario-escolar"
                      className="w-full bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-800 font-bold text-xs py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-1"
                    >
                      Solicitar propuesta para este paquete
                      <ArrowRight className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulario Completo de Solicitud de Informes */}
        <div id="formulario-escolar" className="pt-8 border-t border-slate-200">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">
                Cotización Sin Compromiso
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Pide Informes y Arma tu Viaje Escolar
              </h2>
              <p className="text-slate-500 text-xs sm:text-sm mt-1">
                Llena el formulario a continuación. Los datos se enviarán directamente a <strong>{ADMIN_EMAIL}</strong> y te responderemos a la brevedad por WhatsApp o correo.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-xl">
              <SchoolTripForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
