import { ShieldCheck, HeartHandshake, Compass, Clock, Sparkles, CheckCircle2 } from "lucide-react";

export default function WhyChooseUs() {
  const pillars = [
    {
      icon: <Compass className="w-6 h-6 text-brand-600" />,
      title: "Mapa y Selección Interactiva",
      desc: "Navega con precisión geográfica por los destinos turísticos más codiciados y conoce al instante costos y atracciones locales.",
    },
    {
      icon: <Sparkles className="w-6 h-6 text-amber-600" />,
      title: "Tarifas Transparentes para Familias",
      desc: "Cotizador inteligente con descuento especial del 35% en tarifa base para niños menores de 12 años y ajuste por categoría hotelera en tiempo real.",
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      title: "Seguridad y Pagos Protegidos",
      desc: "Transacciones encriptadas con Stripe Checkout, verificación de cuenta por correo electrónico y emisión inmediata de comprobante digital.",
    },
    {
      icon: <Clock className="w-6 h-6 text-sky-600" />,
      title: "Asistencia Continua 24/7",
      desc: "Nuestro equipo de asesores expertos te acompaña antes, durante y después de tu viaje por WhatsApp, teléfono y correo electrónico.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-y border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-2">
            La Experiencia Contigo
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ¿Por qué viajar con Contigo Tours?
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Diseñamos cada itinerario para que solo te preocupes por coleccionar recuerdos inolvidables.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => (
            <div
              key={idx}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-5">
                  {item.icon}
                </div>
                <h3 className="font-extrabold text-slate-900 text-base mb-2">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-bold text-brand-600">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Garantizado
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
