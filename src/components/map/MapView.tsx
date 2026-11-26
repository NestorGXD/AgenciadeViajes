"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { DestinationData } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface MapViewProps {
  destinations: DestinationData[];
  selectedDestination: DestinationData | null;
  onSelectDestination: (dest: DestinationData) => void;
}

export default function MapView({
  destinations,
  selectedDestination,
  onSelectDestination,
}: MapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);

  // 1. Inicializar el mapa UNA SOLA VEZ y prevenir "Map container is already initialized"
  useEffect(() => {
    if (!containerRef.current) return;

    // Si ya existía una instancia de mapa en memoria (React StrictMode o Fast Refresh), destruirla limpiamente
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }

    // Limpiar el ID interno que Leaflet asigna al contenedor DOM
    if ((containerRef.current as any)._leaflet_id) {
      delete (containerRef.current as any)._leaflet_id;
    }

    const initialCenter: [number, number] = selectedDestination
      ? [selectedDestination.latitude, selectedDestination.longitude]
      : [15.5, -83.5];

    const map = L.map(containerRef.current, {
      center: initialCenter,
      zoom: selectedDestination ? 7 : 4,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    mapRef.current = map;

    // Función de limpieza al desmontar
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (containerRef.current && (containerRef.current as any)._leaflet_id) {
        delete (containerRef.current as any)._leaflet_id;
      }
    };
  }, []); // Montar únicamente al inicio

  // 2. Gestionar marcadores y popups
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remover marcadores anteriores
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current = [];

    destinations.forEach((dest) => {
      const isSelected = selectedDestination?.id === dest.id;

      const customIcon = L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div style="
            width: ${isSelected ? "38px" : "32px"};
            height: ${isSelected ? "38px" : "32px"};
            background: ${isSelected ? "#f59e0b" : "#0284c7"};
            border: 3px solid #ffffff;
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: ${isSelected ? "18px" : "15px"};
            transition: all 0.3s ease;
          ">
            ✈️
          </div>
        `,
        iconSize: [isSelected ? 38 : 32, isSelected ? 38 : 32],
        iconAnchor: [isSelected ? 19 : 16, isSelected ? 19 : 16],
        popupAnchor: [0, -20],
      });

      const marker = L.marker([dest.latitude, dest.longitude], {
        icon: customIcon,
      }).addTo(map);

      // Contenido del popup
      const popupHtml = `
        <div style="width: 250px; font-family: inherit;">
          <div style="position: relative; width: 100%; height: 120px; overflow: hidden; border-radius: 8px 8px 0 0;">
            <img src="${dest.imageUrl}" alt="${dest.name}" style="width: 100%; height: 100%; object-fit: cover;" />
            <div style="position: absolute; top: 8px; right: 8px; background: #0284c7; color: white; font-size: 11px; font-weight: bold; padding: 2px 8px; border-radius: 9999px; box-shadow: 0 2px 4px rgba(0,0,0,0.2);">
              Desde ${formatCurrency(dest.basePrice)}
            </div>
          </div>
          <div style="padding: 12px;">
            <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #0f172a;">${dest.name}</h4>
            <p style="margin: 4px 0 8px 0; font-size: 12px; color: #64748b;">📍 ${dest.city}, ${dest.country}</p>
            <p style="margin: 0 0 12px 0; font-size: 11px; color: #475569; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.4;">${dest.description}</p>
            <div style="display: flex; gap: 8px;">
              <button id="btn-select-${dest.id}" style="flex: 1; background: #f0f9ff; color: #0284c7; font-size: 11px; font-weight: 600; padding: 6px 8px; border-radius: 6px; border: 1px solid #bae6fd; cursor: pointer;">
                Ver info
              </button>
              <a href="/destinations/${dest.slug || dest.id}" style="flex: 1; background: #0284c7; color: white; font-size: 11px; font-weight: 600; padding: 6px 8px; border-radius: 6px; text-decoration: none; text-align: center; display: inline-block;">
                Cotizar
              </a>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml, { maxWidth: 280 });

      // Click sobre el marcador selecciona el destino
      marker.on("click", () => {
        onSelectDestination(dest);
      });

      // Asignar evento al botón interno del popup cuando se abre
      marker.on("popupopen", () => {
        const btn = document.getElementById(`btn-select-${dest.id}`);
        if (btn) {
          btn.onclick = () => onSelectDestination(dest);
        }
      });

      markersRef.current.push(marker);
    });
  }, [destinations, selectedDestination, onSelectDestination]);

  // 3. Volar suavemente al destino cuando cambia la selección
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !selectedDestination) return;

    map.flyTo([selectedDestination.latitude, selectedDestination.longitude], 8, {
      duration: 1.2,
    });
  }, [selectedDestination]);

  return (
    <div className="relative w-full h-[520px] rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      <div ref={containerRef} className="w-full h-full z-0" />
    </div>
  );
}
