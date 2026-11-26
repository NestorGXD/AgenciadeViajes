import Image from "next/image";
import Link from "next/link";
import { DestinationData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import {
  MapPin,
  Star,
  Sparkles,
  ArrowRight,
  SunMedium,
  CheckCircle,
  Building2,
} from "lucide-react";

interface InformativeDestinationsCatalogProps {
  destinations: DestinationData[];
}

export default function InformativeDestinationsCatalog({
  destinations,
}: InformativeDestinationsCatalogProps) {
  return (
    <section id="destinos" className="py-20 bg-slate-50 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-black uppercase tracking-widest text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Catálogo Turístico Informativo
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mt-3">
              Destinos y Maravillas Disponibles
            </h2>
            <p className="mt-3 text-slate-600 text-sm leading-relaxed">
              Explora nuestra selección de los destinos más codiciados. Cada paquete incluye asesoría de viaje, coordinación logística y las mejores alternativas de hospedaje.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/cotizador"
              className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm px-6 py-3.5 rounded-2xl shadow-md transition flex items-center gap-2 whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              <span>Abrir Cotizador Oficial</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Tarjetas de Destinos Informativas (Sin generadores) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations.map((dest) => (
            <div
              key={dest.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-md hover:shadow-2xl transition duration-300 flex flex-col justify-between group"
            >
              {/* Imagen y badges */}
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <Image
                  src={dest.imageUrl || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80"}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover group-hover:scale-105 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute top-4 left-4 flex gap-2">
                  <span className="bg-white/90 backdrop-blur-md text-slate-900 text-[11px] font-black px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <MapPin className="w-3 h-3 text-brand-600" />
                    {dest.city}, {dest.country}
                  </span>
                </div>

                <div className="absolute top-4 right-4">
                  <span className="bg-amber-400 text-slate-950 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <Star className="w-3 h-3 fill-slate-950" />
                    {dest.rating.toFixed(1)}
                  </span>
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <h3 className="text-2xl font-black tracking-tight drop-shadow-sm">
                    {dest.name}
                  </h3>
                </div>
              </div>

              {/* Contenido Informativo */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed line-clamp-3">
                    {dest.description}
                  </p>

                  {/* Atributos informativos */}
                  <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-100">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <SunMedium className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-[11px]">Clima favorable todo el año</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Building2 className="w-3.5 h-3.5 text-brand-500" />
                      <span className="text-[11px]">{dest.hotels?.length || 3}+ Hoteles aliados</span>
                    </div>
                  </div>

                  {/* Hoteles asociados destacados */}
                  {dest.hotels && dest.hotels.length > 0 && (
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Hoteles Aliados en este Destino:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {dest.hotels.slice(0, 3).map((h) => (
                          <span
                            key={h.id}
                            className="bg-slate-100 text-slate-700 text-[10px] font-semibold px-2 py-0.5 rounded-md"
                          >
                            {h.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer de la tarjeta con precio de referencia y CTA hacia el Cotizador */}
                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Tarifa base desde
                    </span>
                    <span className="text-xl font-black text-brand-700">
                      {formatCurrency(dest.basePrice)}
                    </span>
                    <span className="text-[10px] text-slate-400 block">por persona</span>
                  </div>

                  <Link
                    href={`/cotizador?destination=${dest.slug || dest.id}`}
                    className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow-md transition flex items-center gap-1.5"
                  >
                    <span>Cotizar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Banner Informativo para Cotizar */}
        <div className="mt-14 bg-gradient-to-r from-brand-700 to-sky-700 rounded-3xl p-8 sm:p-10 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="max-w-xl">
            <h3 className="text-2xl font-black tracking-tight">
              ¿Quieres personalizar fechas, adultos, niños y hotel?
            </h3>
            <p className="text-xs sm:text-sm text-brand-100 mt-2 leading-relaxed">
              Nuestro cotizador calcula automáticamente las tarifas exactas diferenciadas para adultos y niños, con selección de categoría de hotel y enlace directo de pago con Stripe.
            </p>
          </div>
          <Link
            href="/cotizador"
            className="bg-white hover:bg-slate-100 text-slate-900 font-black text-xs sm:text-sm py-4 px-8 rounded-2xl shadow-lg transition flex items-center gap-2 whitespace-nowrap"
          >
            <span>Ir al Cotizador y Reservar</span>
            <ArrowRight className="w-4 h-4 text-brand-600" />
          </Link>
        </div>
      </div>
    </section>
  );
}
