import Link from "next/link";
import { DestinationData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Star, MapPin, ArrowRight } from "lucide-react";

interface FeaturedDestinationsProps {
  destinations: DestinationData[];
}

export default function FeaturedDestinations({ destinations }: FeaturedDestinationsProps) {
  const featured = destinations.filter((d) => d.featured).slice(0, 6);
  const items = featured.length > 0 ? featured : destinations.slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs font-bold text-brand-600 uppercase tracking-widest block mb-1">
              Paquetes Exclusivos
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Destinos Destacados
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Seleccionados minuciosamente para ofrecerte las mejores experiencias con tarifas insuperables.
            </p>
          </div>
          <Link
            href="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 px-4 py-2.5 rounded-xl transition"
          >
            Ver todos los destinos
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((dest) => (
            <div
              key={dest.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative h-60 w-full overflow-hidden bg-slate-100">
                <img
                  src={dest.imageUrl}
                  alt={dest.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md text-slate-800 text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <MapPin className="w-3.5 h-3.5 text-brand-500" />
                  {dest.city}, {dest.country}
                </div>
                <div className="absolute top-4 right-4 bg-amber-400 text-slate-950 text-xs font-extrabold px-2.5 py-1 rounded-full flex items-center gap-1 shadow">
                  <Star className="w-3.5 h-3.5 fill-slate-950" />
                  {dest.rating}
                </div>
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-xl group-hover:text-brand-600 transition mb-2">
                    {dest.name}
                  </h3>
                  <p className="text-slate-500 text-xs line-clamp-2 leading-relaxed mb-4">
                    {dest.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Precio base por persona
                    </span>
                    <span className="text-xl font-black text-brand-600">
                      {formatCurrency(dest.basePrice)}
                    </span>
                  </div>
                  <Link
                    href={`/destinations/${dest.slug || dest.id}`}
                    className="bg-brand-500 hover:bg-brand-600 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-1"
                  >
                    Cotizar
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
