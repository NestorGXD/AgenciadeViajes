"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { DestinationData } from "@/types";
import { formatCurrency } from "@/lib/utils";
import Link from "next/link";
import { MapPin, Navigation, ArrowRight } from "lucide-react";

// Importación dinámica para evitar errores de renderizado en el servidor (SSR) con Leaflet
const DynamicMapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] bg-slate-100 rounded-2xl flex flex-col items-center justify-center border border-slate-200 animate-pulse">
      <div className="text-brand-500 text-3xl mb-2">🌍</div>
      <p className="text-slate-600 font-medium">Cargando mapa interactivo de destinos...</p>
      <p className="text-xs text-slate-400 mt-1">Conectando con OpenStreetMap</p>
    </div>
  ),
});

interface DestinationsMapProps {
  destinations: DestinationData[];
  onSelectForTrip?: (destination: DestinationData) => void;
}

export default function DestinationsMap({
  destinations,
  onSelectForTrip,
}: DestinationsMapProps) {
  const [selectedDestination, setSelectedDestination] = useState<DestinationData | null>(
    destinations[0] || null
  );

  const handleSelectDestination = useCallback((dest: DestinationData) => {
    setSelectedDestination(dest);
  }, []);

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Columna Izquierda: Mapa Interactivo (7 cols) */}
        <div className="lg:col-span-7 w-full">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-500 animate-ping" />
              <span className="text-xs font-semibold text-slate-600 uppercase tracking-wider">
                {destinations.length} Destinos disponibles en el mapa
              </span>
            </div>
            {selectedDestination && (
              <span className="text-xs bg-amber-100 text-amber-800 font-medium px-2.5 py-1 rounded-full">
                Destino activo: {selectedDestination.name}
              </span>
            )}
          </div>

          <DynamicMapView
            destinations={destinations}
            selectedDestination={selectedDestination}
            onSelectDestination={handleSelectDestination}
          />
        </div>

        {/* Columna Derecha: Lista Sincronizada y Tarjeta Activa (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 text-lg mb-1 flex items-center gap-2">
              <Navigation className="w-5 h-5 text-brand-500" />
              Explora y Selecciona tu Destino
            </h3>
            <p className="text-slate-500 text-xs mb-4">
              Haz clic en cualquier punto del mapa o en la lista sincronizada para centrar y ver opciones de viaje.
            </p>

            {/* Lista con scroll sincronizada */}
            <div className="max-h-[300px] overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {destinations.map((dest) => {
                const isSelected = selectedDestination?.id === dest.id;
                return (
                  <button
                    key={dest.id}
                    onClick={() => setSelectedDestination(dest)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-200 flex items-center justify-between border ${
                      isSelected
                        ? "bg-brand-50 border-brand-500 shadow-sm ring-1 ring-brand-500"
                        : "bg-white border-slate-100 hover:border-slate-300 hover:bg-slate-50"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-xs ${
                          isSelected
                            ? "bg-brand-500 text-white"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        <MapPin className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">
                          {dest.name}
                        </h4>
                        <p className="text-xs text-slate-500">
                          {dest.city}, {dest.country}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block">Desde</span>
                      <span className="font-extrabold text-brand-600 text-sm">
                        {formatCurrency(dest.basePrice)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tarjeta del destino seleccionado para acción rápida */}
          {selectedDestination && (
            <div className="bg-gradient-to-br from-brand-900 to-slate-900 text-white rounded-2xl p-5 shadow-lg relative overflow-hidden">
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs uppercase tracking-wider text-brand-300 font-semibold">
                    📍 {selectedDestination.country}
                  </span>
                  <span className="bg-amber-400 text-slate-950 font-bold text-xs px-2.5 py-0.5 rounded-full">
                    ★ {selectedDestination.rating}
                  </span>
                </div>
                <h4 className="text-xl font-bold mb-1 text-white">
                  {selectedDestination.name}
                </h4>
                <p className="text-slate-300 text-xs mb-4 line-clamp-2">
                  {selectedDestination.description}
                </p>
                <div className="flex items-center justify-between pt-3 border-t border-slate-700/60">
                  <div>
                    <span className="text-xs text-slate-400 block">Tarifa base / persona</span>
                    <span className="text-xl font-black text-amber-400">
                      {formatCurrency(selectedDestination.basePrice)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {onSelectForTrip ? (
                      <button
                        onClick={() => onSelectForTrip(selectedDestination)}
                        className="bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1.5"
                      >
                        Configurar Viaje
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href={`/destinations/${selectedDestination.slug || selectedDestination.id}`}
                        className="bg-brand-500 hover:bg-brand-400 text-white font-semibold text-xs py-2 px-4 rounded-xl transition flex items-center gap-1.5"
                      >
                        Ver Paquetes
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
