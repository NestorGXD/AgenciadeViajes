"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { DestinationData, HotelData, HotelCategoryType } from "@/types";
import { formatCurrency, calculateNights } from "@/lib/utils";
import {
  Calendar,
  Users,
  Baby,
  Building,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  PlaneTakeoff,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Loader2,
  X,
  User,
  Mail,
  Phone,
} from "lucide-react";

interface TripConfiguratorProps {
  destinations: DestinationData[];
  initialDestinationId?: string;
  initialHotels?: HotelData[];
}

const CATEGORY_DETAILS: Record<
  HotelCategoryType,
  { label: string; icon: string; desc: string; avgRate: number }
> = {
  ALL_INCLUSIVE: {
    label: "Todo Incluido",
    icon: "🍹",
    desc: "Comidas ilimitadas, bebidas y actividades",
    avgRate: 190,
  },
  BOUTIQUE: {
    label: "Hotel Boutique",
    icon: "🏛️",
    desc: "Diseño exclusivo, íntimo y atención personalizada",
    avgRate: 140,
  },
  BUDGET: {
    label: "Económico",
    icon: "🎒",
    desc: "Alojamiento limpio, accesible y céntrico",
    avgRate: 50,
  },
  BEACHFRONT: {
    label: "Frente al Mar",
    icon: "🌊",
    desc: "Vistas directas al océano y acceso privado a la playa",
    avgRate: 175,
  },
  PET_FRIENDLY: {
    label: "Pet-Friendly",
    icon: "🐾",
    desc: "Amenidades especiales para viajar con mascotas",
    avgRate: 105,
  },
};

export default function TripConfigurator({
  destinations,
  initialDestinationId,
  initialHotels = [],
}: TripConfiguratorProps) {
  const router = useRouter();

  // 1. Estados principales del configurador
  const [selectedDestinationId, setSelectedDestinationId] = useState<string>(
    initialDestinationId || (destinations[0]?.id ?? "")
  );

  // Fechas: por defecto viaje de 5 días dentro de 2 semanas
  const today = new Date();
  const defaultCheckIn = new Date(today.setDate(today.getDate() + 14))
    .toISOString()
    .split("T")[0];
  const defaultCheckOut = new Date(today.setDate(today.getDate() + 5))
    .toISOString()
    .split("T")[0];

  const [checkIn, setCheckIn] = useState<string>(defaultCheckIn);
  const [checkOut, setCheckOut] = useState<string>(defaultCheckOut);

  // Pasajeros divididos explícitamente en Adultos y Niños
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  // Preferencia de categoría de hotel
  const [selectedCategory, setSelectedCategory] =
    useState<HotelCategoryType>("ALL_INCLUSIVE");

  // Hotel seleccionado específico (opcional)
  const [selectedHotelId, setSelectedHotelId] = useState<string>("");

  // Requerimientos adicionales
  const [specialRequests, setSpecialRequests] = useState<string>("");

  // Estados de proceso y feedback
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Modal para capturar datos de reserva antes de ir a Stripe
  const [showGuestModal, setShowGuestModal] = useState<boolean>(false);
  const [guestName, setGuestName] = useState<string>("");
  const [guestEmail, setGuestEmail] = useState<string>("");
  const [guestPhone, setGuestPhone] = useState<string>("");

  // Destino seleccionado actualmente
  const activeDestination = useMemo(() => {
    return destinations.find((d) => d.id === selectedDestinationId) || destinations[0];
  }, [destinations, selectedDestinationId]);

  // Hoteles disponibles para el destino activo
  const availableHotels = useMemo(() => {
    if (initialHotels.length > 0 && activeDestination?.id === initialDestinationId) {
      return initialHotels;
    }
    return activeDestination?.hotels || [];
  }, [activeDestination, initialHotels, initialDestinationId]);

  // Hoteles filtrados por la preferencia seleccionada
  const filteredHotelsByCategory = useMemo(() => {
    return availableHotels.filter((h) => h.category === selectedCategory);
  }, [availableHotels, selectedCategory]);

  // Hotel específico activo (si fue elegido)
  const activeHotel = useMemo(() => {
    return availableHotels.find((h) => h.id === selectedHotelId) || null;
  }, [availableHotels, selectedHotelId]);

  // Cálculo en tiempo real de noches y precios
  const nights = useMemo(() => {
    return calculateNights(checkIn, checkOut);
  }, [checkIn, checkOut]);

  // Tarifa diferenciada: Niños pagan el 65% de la tarifa base
  const destinationCost = useMemo(() => {
    if (!activeDestination) return 0;
    const adultTotal = activeDestination.basePrice * adults;
    const childTotal = activeDestination.basePrice * 0.65 * children;
    return adultTotal + childTotal;
  }, [activeDestination, adults, children]);

  // Costo de hospedaje según hotel específico o categoría elegida
  const hotelRatePerNight = useMemo(() => {
    if (activeHotel) {
      return activeHotel.pricePerNight;
    }
    return CATEGORY_DETAILS[selectedCategory]?.avgRate || 100;
  }, [activeHotel, selectedCategory]);

  const hotelTotalCost = useMemo(() => {
    return hotelRatePerNight * nights;
  }, [hotelRatePerNight, nights]);

  // Total estimado general
  const totalEstimatedCost = useMemo(() => {
    return Math.round((destinationCost + hotelTotalCost) * 100) / 100;
  }, [destinationCost, hotelTotalCost]);

  // Disparar reserva y pago
  const executeBooking = async (guestDetails?: { name: string; email: string; phone: string }) => {
    setErrorMsg(null);
    setIsSubmitting(true);
    setStatusMessage("Generando tu reservación y conectando con Stripe Checkout...");

    try {
      const destId = activeDestination?.id || selectedDestinationId || destinations[0]?.id || "dest-cancun";
      const chosenCategory = selectedCategory || "ALL_INCLUSIVE";
      const chosenCatInfo = CATEGORY_DETAILS[chosenCategory] || CATEGORY_DETAILS["ALL_INCLUSIVE"];

      const payload: any = {
        destinationId: destId,
        hotelId: selectedHotelId || (filteredHotelsByCategory[0]?.id ?? null),
        checkIn,
        checkOut,
        adults: Math.max(1, adults),
        children: Math.max(0, children),
        preferences: {
          category: chosenCategory,
          hotelName: activeHotel?.name || chosenCatInfo.label,
          specialRequests,
        },
      };

      if (guestDetails) {
        payload.guestName = guestDetails.name;
        payload.guestEmail = guestDetails.email;
        payload.guestPhone = guestDetails.phone;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401 && !guestDetails) {
          // Si no está autenticado, solicitar datos rápidos para no bloquear el pago
          setShowGuestModal(true);
          setIsSubmitting(false);
          setStatusMessage(null);
          return;
        }
        throw new Error(data.error || "No se pudo procesar la reservación.");
      }

      // Si Stripe devolvió la URL de Checkout, redirigir DIRECTAMENTE al pago
      if (data.stripeUrl) {
        setStatusMessage("¡Reservación lista! Redirigiendo a la pasarela de pagos Stripe...");
        window.location.href = data.stripeUrl;
        return;
      }

      // Fallback: Si no hay URL directa, ir a la vista de voucher de reserva
      router.push(`/client/bookings/${data.booking.bookingCode}`);
    } catch (err: any) {
      setErrorMsg(err.message || "Error al procesar la cotización.");
      setIsSubmitting(false);
      setStatusMessage(null);
    }
  };

  const handleProceedToBooking = () => {
    executeBooking();
  };

  const handleGuestModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestName || !guestEmail) {
      setErrorMsg("Nombre y correo son obligatorios para enviar tu comprobante.");
      return;
    }
    setShowGuestModal(false);
    executeBooking({ name: guestName, email: guestEmail, phone: guestPhone });
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden relative">
      {/* Modal Rápido para datos de reserva antes de ir a Stripe */}
      {showGuestModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xl">💳</span>
                <h4 className="font-black text-slate-900 text-base">
                  Datos para tu Reservación y Pago
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setShowGuestModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 mb-4">
              Ingresa los datos del titular para emitir tu código de reservación y enviarte el comprobante tras pagar en Stripe.
            </p>

            <form onSubmit={handleGuestModalSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Nombre Completo *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Ej. Roberto Morales"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Correo Electrónico *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={guestEmail}
                    onChange={(e) => setGuestEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Teléfono o WhatsApp (Opcional)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={guestPhone}
                    onChange={(e) => setGuestPhone(e.target.value)}
                    placeholder="Ej. 443 186 6129"
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Continuar al Pago Seguro con Stripe</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cabecera del Cotizador */}
      <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 text-white p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-brand-800/60 text-brand-200 text-xs px-3 py-1 rounded-full mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Cotizador Inteligente con Tarifa Diferenciada
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Diseña y Cotiza tu Viaje a la Medida
            </h2>
            <p className="text-brand-100 text-sm mt-1">
              Precios transparentes en tiempo real según pasajeros y preferencias de hospedaje.
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/20 text-right">
            <span className="text-xs text-brand-200 block uppercase font-medium">
              Presupuesto Estimado
            </span>
            <span className="text-2xl sm:text-3xl font-black text-amber-300">
              {formatCurrency(totalEstimatedCost)}
            </span>
            <span className="text-xs text-brand-100 block">
              {nights} noche(s) • {adults + children} pasajero(s)
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 sm:p-8 space-y-8">
        {/* PASO 1: SELECCIÓN DE DESTINO Y FECHAS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Destino */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <PlaneTakeoff className="w-4 h-4 text-brand-500" />
              1. Destino Turístico
            </label>
            <select
              value={selectedDestinationId}
              onChange={(e) => {
                setSelectedDestinationId(e.target.value);
                setSelectedHotelId("");
              }}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.city}, {d.country}) — desde {formatCurrency(d.basePrice)}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-400">
              Tarifa base: {formatCurrency(activeDestination?.basePrice || 0)} por adulto.
            </p>
          </div>

          {/* Fecha Check-In */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-500" />
              2. Fecha de Salida (Check-in)
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setCheckIn(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Fecha Check-Out */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-brand-500" />
              Fecha de Regreso (Check-out)
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-semibold text-slate-800 focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
            <p className="text-[11px] text-brand-600 font-semibold">
              Duración: {nights} noche{nights > 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* PASO 2: CONTADOR DE PASAJEROS (ADULTOS Y NIÑOS) */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-4 h-4 text-brand-500" />
            3. Pasajeros (Tarifa Diferenciada)
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Adultos */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">Adultos</h4>
                  <p className="text-xs text-slate-500">12 años en adelante (Tarifa 100%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setAdults((prev) => Math.max(1, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="font-extrabold text-slate-900 w-6 text-center text-base">
                  {adults}
                </span>
                <button
                  type="button"
                  onClick={() => setAdults((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-brand-500 hover:bg-brand-600 font-bold text-white flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Niños */}
            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                  <Baby className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-slate-800 text-sm">Niños</h4>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.2 rounded">
                      35% DCTO
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">0 a 11 años (Tarifa reducida 65%)</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setChildren((prev) => Math.max(0, prev - 1))}
                  className="w-8 h-8 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 font-bold text-slate-700 flex items-center justify-center transition"
                >
                  -
                </button>
                <span className="font-extrabold text-slate-900 w-6 text-center text-base">
                  {children}
                </span>
                <button
                  type="button"
                  onClick={() => setChildren((prev) => prev + 1)}
                  className="w-8 h-8 rounded-lg bg-amber-500 hover:bg-amber-600 font-bold text-white flex items-center justify-center transition"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* PASO 3: PREFERENCIAS DE HOTEL */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
            <Building className="w-4 h-4 text-brand-500" />
            4. Preferencias de Alojamiento (Ajuste en Tiempo Real)
          </label>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {(Object.keys(CATEGORY_DETAILS) as HotelCategoryType[]).map((catKey) => {
              const cat = CATEGORY_DETAILS[catKey];
              const isSelected = selectedCategory === catKey;

              return (
                <button
                  key={catKey}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(catKey);
                    setSelectedHotelId("");
                  }}
                  className={`p-3.5 rounded-2xl text-left border transition-all duration-200 relative ${
                    isSelected
                      ? "bg-brand-50 border-brand-500 ring-2 ring-brand-500/30 shadow-md"
                      : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  <div className="text-2xl mb-1.5">{cat.icon}</div>
                  <h4 className="font-bold text-xs text-slate-900 mb-0.5">{cat.label}</h4>
                  <p className="text-[10px] text-slate-500 line-clamp-2 leading-tight">
                    {cat.desc}
                  </p>
                  <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">Prom./noche</span>
                    <span className="font-bold text-xs text-brand-700">
                      ~${cat.avgRate}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Hoteles reales asociados a este destino */}
          {filteredHotelsByCategory.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
              <span className="text-xs font-bold text-slate-700 block mb-2">
                Hoteles recomendados en {activeDestination?.name} con categoría {CATEGORY_DETAILS[selectedCategory].label}:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredHotelsByCategory.map((h) => {
                  const isChecked = selectedHotelId === h.id;
                  return (
                    <div
                      key={h.id}
                      onClick={() => setSelectedHotelId(isChecked ? "" : h.id)}
                      className={`cursor-pointer p-3 rounded-xl border flex items-center justify-between transition ${
                        isChecked
                          ? "bg-white border-brand-500 shadow-sm ring-1 ring-brand-500"
                          : "bg-white/60 border-slate-200 hover:bg-white"
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-xs text-slate-800">{h.name}</h5>
                        <p className="text-[11px] text-slate-500">{h.amenities}</p>
                      </div>
                      <div className="text-right flex-shrink-0 ml-2">
                        <span className="text-xs font-extrabold text-brand-600 block">
                          ${h.pricePerNight}/noche
                        </span>
                        {isChecked && (
                          <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Seleccionado
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Desglose de Costos y Botón Final */}
        <div className="pt-6 border-t border-slate-200 bg-slate-50 -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Desglose detallado */}
            <div className="lg:col-span-7 space-y-2">
              <h4 className="font-bold text-slate-900 text-sm">Resumen de la Cotización:</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-600">
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Tarifa Destino Base:</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(destinationCost)}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    ({adults} adultos, {children} niños)
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Alojamiento ({nights} noches):</span>
                  <span className="font-semibold text-slate-800">
                    {formatCurrency(hotelTotalCost)}
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    (~${hotelRatePerNight}/noche)
                  </span>
                </div>
                <div className="bg-white p-2.5 rounded-xl border border-slate-200 col-span-2 sm:col-span-1">
                  <span className="text-slate-400 block text-[10px]">Garantía Contigo Tours:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Incluida 100%
                  </span>
                  <span className="block text-[10px] text-slate-400">
                    Pasarela Stripe Segura
                  </span>
                </div>
              </div>
            </div>

            {/* Total y Botón de Pago Directo */}
            <div className="lg:col-span-5 flex flex-col gap-2">
              <div className="text-right">
                <span className="text-xs text-slate-500">Total a Liquidar</span>
                <div className="text-3xl font-black text-brand-700">
                  {formatCurrency(totalEstimatedCost)}
                </div>
              </div>

              {/* Mensajes de Estado o Error DIRECTAMENTE SOBRE EL BOTÓN */}
              {statusMessage && (
                <div className="bg-brand-50 border border-brand-200 text-brand-800 text-xs rounded-xl p-2.5 flex items-center gap-2 animate-pulse">
                  <Loader2 className="w-4 h-4 animate-spin text-brand-600 flex-shrink-0" />
                  <span>{statusMessage}</span>
                </div>
              )}

              {errorMsg && (
                <div className="bg-rose-50 border border-rose-300 text-rose-800 text-xs rounded-xl p-2.5 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleProceedToBooking}
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 px-6 rounded-2xl shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/40 transition flex items-center justify-center gap-2 text-sm sm:text-base disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Conectando con Stripe...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    <span>Generar Reservación e Ir a Pagar con Stripe</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-slate-400">
                🔒 Cobro seguro procesado directamente por Stripe Checkout
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
