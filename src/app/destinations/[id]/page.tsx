import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import { FALLBACK_DESTINATIONS, getDestinationsList } from "@/lib/destinations";
import TripConfigurator from "@/components/booking/TripConfigurator";
import { formatCurrency } from "@/lib/utils";
import { MapPin, Star, Building, Wifi, Shield, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DestinationDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function DestinationDetailPage({ params }: DestinationDetailPageProps) {
  const { id } = await params;

  let destination = null;

  try {
    destination = await prisma.destination.findFirst({
      where: {
        OR: [{ id }, { slug: id }],
      },
      include: {
        hotels: true,
      },
    });
  } catch (e) {
    // Buscar en fallback
    destination =
      FALLBACK_DESTINATIONS.find((d) => d.id === id || d.slug === id) || null;
  }

  if (!destination) {
    notFound();
  }

  const allDestinations = await getDestinationsList();

  return (
    <div className="py-10 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Enlace de regreso */}
        <Link
          href="/destinations"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a todos los destinos
        </Link>

        {/* Hero del Destino */}
        <div className="relative rounded-3xl overflow-hidden shadow-xl bg-slate-900 text-white min-h-[380px] flex items-end">
          <img
            src={destination.imageUrl}
            alt={destination.name}
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          <div className="relative z-10 p-6 sm:p-10 max-w-3xl">
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-brand-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {destination.city}, {destination.country}
              </span>
              <span className="bg-amber-400 text-slate-950 text-xs font-black px-2.5 py-1 rounded-full flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950" />
                {destination.rating}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight mb-3">
              {destination.name}
            </h1>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed mb-4">
              {destination.description}
            </p>

            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 text-xs font-semibold">
              <span>Coordenadas GPS: {destination.latitude.toFixed(4)}, {destination.longitude.toFixed(4)}</span>
              <span>•</span>
              <span className="text-amber-300">Tarifa base desde {formatCurrency(destination.basePrice)}</span>
            </div>
          </div>
        </div>

        {/* Sección de Hoteles Asociados */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-black text-slate-900 flex items-center gap-2">
                <Building className="w-6 h-6 text-brand-500" />
                Hoteles y Alojamientos Disponibles
              </h2>
              <p className="text-xs text-slate-500">
                Opciones certificadas con tarifas especiales según tus preferencias de viaje.
              </p>
            </div>
          </div>

          {destination.hotels && destination.hotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {destination.hotels.map((hotel: any) => (
                <div
                  key={hotel.id}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col"
                >
                  <div className="h-44 w-full relative overflow-hidden bg-slate-100">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {hotel.category}
                    </span>
                    <span className="absolute top-3 right-3 bg-amber-400 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                      ★ {hotel.rating}
                    </span>
                  </div>
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base mb-1">
                        {hotel.name}
                      </h4>
                      <p className="text-xs text-slate-500 mb-2">{hotel.address}</p>
                      <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                        {hotel.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {hotel.amenities.split(",").map((a: string, i: number) => (
                          <span
                            key={i}
                            className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium"
                          >
                            {a.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500">Por noche:</span>
                      <span className="text-base font-black text-brand-600">
                        {formatCurrency(hotel.pricePerNight)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
              Hoteles adicionales en proceso de carga para este destino. Puedes cotizar con cualquier preferencia de categoría abajo.
            </div>
          )}
        </div>

        {/* Cotizador Integrado para este destino */}
        <div id="cotizar" className="pt-8 border-t border-slate-200">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-slate-900">
              Cotiza tu Viaje a {destination.name}
            </h2>
            <p className="text-xs text-slate-500">
              Ajusta tus fechas, pasajeros (adultos y niños) y confirma tu reserva al instante.
            </p>
          </div>

          <TripConfigurator
            destinations={allDestinations}
            initialDestinationId={destination.id}
            initialHotels={destination.hotels}
          />
        </div>
      </div>
    </div>
  );
}
