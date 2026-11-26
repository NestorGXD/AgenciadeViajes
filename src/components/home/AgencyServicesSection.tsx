import Link from "next/link";
import {
  Palmtree,
  GraduationCap,
  Landmark,
  Briefcase,
  Plane,
  CreditCard,
  ArrowRight,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function AgencyServicesSection() {
  const services = [
    {
      icon: Palmtree,
      color: "from-amber-500 to-orange-500",
      bgColor: "bg-amber-50 text-amber-600",
      title: "Paquetes de Playa y Todo Incluido",
      desc: "Convenios con cadenas hoteleras 4 y 5 estrellas en Cancún, Riviera Maya, Los Cabos, Vallarta y Punta Cana. Bebidas, alimentos gourmet y actividades incluidas.",
      features: ["Resorts todo incluido", "Transportación aeropuerto-hotel", "Tours acuáticos opcionales"],
      link: "/destinations",
      linkText: "Explorar Playas",
    },
    {
      icon: GraduationCap,
      color: "from-brand-600 to-indigo-600",
      bgColor: "bg-brand-50 text-brand-600",
      badge: "Especialidad de la Casa",
      title: "Viajes Escolares y de Graduación",
      desc: "Itinerarios pedagógicos y de celebración para primarias, secundarias, preparatorias y universidades. Coordinadores en sitio, autobuses certificados y seguro de viajero escolar.",
      features: ["Autobuses con GPS y choferes certificados", "Planes de pago para padres", "Seguro médico escolar total"],
      contact: {
        whatsapp: "443 186 6129",
        email: "hugoalex.riverab@gmail.com",
      },
      link: "/viajes-escolares",
      linkText: "Ver Módulo Escolar",
    },
    {
      icon: Landmark,
      color: "from-rose-500 to-pink-500",
      bgColor: "bg-rose-50 text-rose-600",
      title: "Rutas Culturales y Pueblos Mágicos",
      desc: "Experiencias inmersivas en el patrimonio histórico y gastronómico de México: Oaxaca, Ciudad de México, Guanajuato, Chiapas y Mérida con guías locales certificados.",
      features: ["Guías bilingües autorizados", "Talleres artesanales y catas", "Hospedaje en casonas y boutiques"],
      link: "/destinations",
      linkText: "Ver Rutas Culturales",
    },
    {
      icon: Briefcase,
      color: "from-slate-700 to-slate-900",
      bgColor: "bg-slate-100 text-slate-700",
      title: "Viajes Corporativos y Grupos de Trabajo",
      desc: "Logística integral para convenciones de empresa, congresos médicos, viajes de incentivo y team building con facturación fiscal mexicana (CFDI).",
      features: ["Salas de convenciones equipadas", "Facturación deducible", "Tarifas corporativas preferenciales"],
      link: "/contacto",
      linkText: "Solicitar Propuesta",
    },
    {
      icon: Plane,
      color: "from-sky-500 to-blue-600",
      bgColor: "bg-sky-50 text-sky-600",
      title: "Vuelos, Alojamiento y Traslados",
      desc: "Reserva boletos de avión con las mejores aerolíneas, habitaciones en hoteles seleccionados y transportación privada ejecutiva puerta a puerta.",
      features: ["Vuelos nacionales e internacionales", "Traslados privados sin escalas", "Asistencia de equipaje"],
      link: "/cotizador",
      linkText: "Cotizar en Línea",
    },
    {
      icon: CreditCard,
      color: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50 text-emerald-600",
      title: "Pagos Flexibles con Stripe",
      desc: "Realiza tus pagos con tarjeta de crédito, débito y meses sin intereses a través de la infraestructura bancaria de Stripe, con comprobante digital inmediato.",
      features: ["Cifrado bancario SSL 256 bits", "Comprobante con código de reserva", "Recepción de pagos 24/7"],
      link: "/cotizador",
      linkText: "Ir a Pagar Seguro",
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
            Catálogo de Soluciones Turísticas
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
            Nuestros Servicios de Viaje
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Conoce todo lo que en Contigo Tours podemos coordinar para tus vacaciones familiares, viajes de graduación o escapadas de fin de semana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((serv, index) => {
            const Icon = serv.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-7 border border-slate-200/80 shadow-md hover:shadow-xl transition flex flex-col justify-between relative overflow-hidden group"
              >
                {serv.badge && (
                  <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full tracking-wider shadow-xs">
                    {serv.badge}
                  </div>
                )}

                <div>
                  <div className={`w-12 h-12 rounded-2xl ${serv.bgColor} flex items-center justify-center font-bold mb-5 shadow-xs`}>
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-xl font-extrabold text-slate-900 mb-2">
                    {serv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                    {serv.desc}
                  </p>

                  {/* Lista de características */}
                  <ul className="space-y-2 mb-6">
                    {serv.features.map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Datos de contacto especiales si es viaje escolar */}
                  {serv.contact && (
                    <div className="bg-brand-50/70 border border-brand-100 rounded-2xl p-3.5 mb-6 text-xs space-y-1.5">
                      <div className="font-extrabold text-brand-900 text-[11px] uppercase tracking-wider">
                        Atención directa a escuelas:
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Phone className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp: <strong>+52 {serv.contact.whatsapp}</strong></span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-700">
                        <Mail className="w-3.5 h-3.5 text-brand-600" />
                        <span>Correo: <strong>{serv.contact.email}</strong></span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <Link
                    href={serv.link}
                    className="inline-flex items-center gap-2 text-xs font-bold text-brand-600 group-hover:text-brand-700 transition"
                  >
                    <span>{serv.linkText}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
