import { Star, Quote } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      name: "Mariana Silva & Familia",
      city: "Bogotá, Colombia",
      destination: "Cancún y Riviera Maya",
      comment:
        "El cotizador con descuento para niños nos facilitó planear nuestras vacaciones familiares sin sorpresas. El hotel todo incluido superó nuestras expectativas y el proceso de pago con confirmación por correo fue súper rápido.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Rodrigo Morales",
      city: "Ciudad de México",
      destination: "Medellín y Guatapé",
      comment:
        "El mapa interactivo me ayudó a ubicar exactamente los hoteles cercanos a El Poblado. El hotel boutique fue fabuloso y poder descargar mi voucher directamente en el panel de cliente me dio total tranquilidad.",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    },
    {
      name: "Camila & Sebastián",
      city: "Santiago de Chile",
      destination: "Cartagena de Indias",
      comment:
        "Contigo Tours fue la mejor elección para nuestro viaje de aniversario. La atención personalizada y las recomendaciones de hoteles frente al mar hicieron que todo saliera perfecto. ¡100% recomendados!",
      rating: 5,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block mb-2">
            Opiniones Reales
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Viajeros que confían en Contigo Tours
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Conoce las vivencias de quienes ya recorrieron el mundo con nuestro respaldo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.map((rev, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-8 rounded-3xl border border-slate-200/80 flex flex-col justify-between relative shadow-xs"
            >
              <Quote className="w-10 h-10 text-brand-200 absolute top-6 right-6 pointer-events-none" />
              <div>
                <div className="flex items-center gap-1 mb-4 text-amber-400">
                  {Array.from({ length: rev.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-700 leading-relaxed italic mb-6">
                  "{rev.comment}"
                </p>
              </div>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-200/60">
                <img
                  src={rev.avatar}
                  alt={rev.name}
                  className="w-11 h-11 rounded-full object-cover border-2 border-brand-500"
                />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">{rev.name}</h4>
                  <p className="text-[11px] text-slate-400">{rev.city}</p>
                  <span className="inline-block text-[10px] font-semibold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-md mt-0.5">
                    📍 {rev.destination}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
