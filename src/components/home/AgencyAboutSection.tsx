import {
  Compass,
  ShieldCheck,
  Award,
  Users2,
  HeartHandshake,
  Clock,
  Sparkles,
} from "lucide-react";

export default function AgencyAboutSection() {
  return (
    <section id="nosotros" className="py-20 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera de la sección */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-800 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            <Compass className="w-4 h-4 text-brand-600" />
            Conoce Contigo Tours
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Más de una década creando recuerdos que perduran
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Nacimos con una misión clara: convertir el anhelo de viajar en experiencias seguras, transparentes y diseñadas a la medida de cada familia, estudiante y viajero.
          </p>
        </div>

        {/* Tarjetas de Historia, Misión y Visión */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition relative">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-brand-500/20">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Nuestra Historia</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Fundada por apasionados del turismo en México, Contigo Tours ha evolucionado de ser un operador local a una agencia integral con presencia en los principales destinos de playa, ciudades históricas y rutas ecoturísticas de Latinoamérica.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-amber-500/20">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Nuestra Misión</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Brindar asesoría personalizada, tarifas justas sin cargos ocultos y una logística impecable para que nuestros clientes viajen con absoluta tranquilidad, respaldados por convenios con las mejores cadenas hoteleras y transportistas certificados.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-md hover:shadow-xl transition relative">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold mb-6 shadow-md shadow-emerald-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-black text-slate-900 mb-3">Nuestra Visión</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Consolidarnos como la plataforma digital líder en turismo accesible y viajes escolares en América Latina, combinando la calidez del trato humano con tecnología de vanguardia y pasarelas de pago seguras.
            </p>
          </div>
        </div>

        {/* Pilares y Valores de la Agencia */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 shadow-lg">
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 text-center mb-8">
            Nuestros Cuatro Compromisos Inquebrantables
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Seguridad Total</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Todos los pagos están cifrados y procesados con certificación internacional Stripe Checkout.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Cero Sorpresas</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Precios finales transparentes, desglosando impuestos, hospedaje y seguro de viaje.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
                <Users2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Atención Humana</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Agentes reales disponibles vía WhatsApp y correo antes, durante y después de tu viaje.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm mb-1">Disponibilidad 24/7</h4>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Línea de soporte activa y monitoreo constante ante cualquier eventualidad durante tu estancia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
