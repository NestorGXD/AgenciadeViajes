import { getDestinationsList } from "@/lib/destinations";
import TripConfigurator from "@/components/booking/TripConfigurator";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Cotizador de Viajes | Contigo Tours",
  description: "Configura tu viaje ideal con cálculo en tiempo real para adultos y niños, selección de hoteles y confirmación inmediata.",
};

export default async function CotizadorPage() {
  const destinations = await getDestinationsList();

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Cotizador Oficial en Tiempo Real
          </div>
          <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Personaliza tu Próximo Viaje
          </h1>
          <p className="text-slate-600 text-sm mt-2">
            Selecciona tu destino, define fechas, pasajeros diferenciados (adultos y niños) y preferencias de hotel.
          </p>
        </div>

        <TripConfigurator destinations={destinations} />
      </div>
    </div>
  );
}
