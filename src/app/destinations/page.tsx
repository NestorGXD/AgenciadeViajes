import { getDestinationsList } from "@/lib/destinations";
import DestinationsMap from "@/components/map/DestinationsMap";
import Link from "next/link";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Star, ArrowRight, Compass } from "lucide-react";

export const metadata = {
  title: "Destinos Turísticos | Contigo Tours",
  description: "Explora nuestro catálogo de destinos turísticos en México, Colombia, Perú y República Dominicana con mapa interactivo y hoteles asociados.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinationsList();

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Compass className="w-4 h-4" />
            Catálogo y Mapa Completo de Destinos
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Descubre a dónde viajar con Contigo Tours
          </h1>
          <p className="text-slate-600 text-sm sm:text-base mt-2">
            Explora las coordenadas en el mapa interactivo o selecciona directamente de la lista para cotizar paquetes con tarifa diferenciada.
          </p>
        </div>

        {/* Mapa Interactivo */}
        <div className="mb-16">
          <DestinationsMap destinations={destinations} />
        </div>

        {/* Cuadrícula de Destinos */}
        <div className="pt-8 border-t border-slate-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black text-slate-900">
              Todos los Destinos ({destinations.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((dest) => (
              <div
                key={dest.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                  <img
                    src={dest.imageUrl}
                    alt={dest.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <MapPin className="w-3.5 h-3.5 text-brand-500" />
                    {dest.city}, {dest.country}
                  </div>
                  <div className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                    <Star className="w-3.5 h-3.5 fill-slate-950" />
                    {dest.rating}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-lg group-hover:text-brand-600 transition mb-2">
                      {dest.name}
                    </h3>
                    <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                      {dest.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">
                        Desde
                      </span>
                      <span className="text-lg font-black text-brand-600">
                        {formatCurrency(dest.basePrice)}
                      </span>
                    </div>
                    <Link
                      href={`/destinations/${dest.slug || dest.id}`}
                      className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold py-2 px-3.5 rounded-xl shadow-xs transition flex items-center gap-1"
                    >
                      Ver Hoteles y Cotizar
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
