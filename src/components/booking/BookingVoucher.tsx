"use client";

import { BookingData } from "@/types";
import { formatCurrency, formatDate, calculateNights } from "@/lib/utils";
import { Printer, CheckCircle, Clock, Plane, MapPin, Building, ShieldCheck } from "lucide-react";

interface BookingVoucherProps {
  booking: BookingData;
}

export default function BookingVoucher({ booking }: BookingVoucherProps) {
  const isPaid = booking.status === "PAID";
  const nights = calculateNights(booking.checkIn, booking.checkOut);

  return (
    <div className="w-full max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden print-area">
      {/* Barra superior de acción de impresión (no-print) */}
      <div className="no-print bg-slate-900 text-white px-6 py-3 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-300">
          Comprobante Oficial de Reserva
        </span>
        <button
          onClick={() => window.print()}
          className="bg-brand-500 hover:bg-brand-400 text-white text-xs font-bold py-1.5 px-4 rounded-xl flex items-center gap-2 transition"
        >
          <Printer className="w-4 h-4" />
          Imprimir / Guardar como PDF
        </button>
      </div>

      <div className="p-8 sm:p-10 space-y-8">
        {/* Cabecera del Voucher con Logo y Código */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">✈️</span>
              <span className="text-2xl font-black text-brand-600 tracking-tight">
                Contigo Tours
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Voucher de Viaje y Confirmación de Servicios Turísticos
            </p>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block font-semibold uppercase">
              Código de Reserva
            </span>
            <span className="font-mono text-2xl font-black text-slate-900">
              {booking.bookingCode}
            </span>
            <div className="mt-1">
              {isPaid ? (
                <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5" /> PAGADO Y CONFIRMADO
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                  <Clock className="w-3.5 h-3.5" /> PAGO PENDIENTE
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Datos del Pasajero Principal y Fecha de Emisión */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-400 block font-medium">Titular del Viaje:</span>
            <span className="font-bold text-slate-800 text-sm">
              {booking.user?.name || "Cliente Contigo Tours"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Correo Electrónico:</span>
            <span className="font-bold text-slate-800">
              {booking.user?.email || "Sin registrar"}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Pasajeros:</span>
            <span className="font-bold text-slate-800">
              {booking.adults} Adulto(s)
              {booking.children > 0 ? `, ${booking.children} Niño(s)` : ""}
            </span>
          </div>
          <div>
            <span className="text-slate-400 block font-medium">Fecha de Emisión:</span>
            <span className="font-bold text-slate-800">
              {formatDate(booking.createdAt)}
            </span>
          </div>
        </div>

        {/* Detalle del Itinerario y Destino */}
        <div className="space-y-4">
          <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
            <Plane className="w-5 h-5 text-brand-500" />
            Itinerario del Viaje
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Destino */}
            <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs uppercase font-bold text-brand-600 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> Destino Turístico
              </span>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {booking.destination?.name || "Destino Turístico"}
              </h4>
              <p className="text-xs text-slate-500">
                {booking.destination?.city}, {booking.destination?.country}
              </p>
              <div className="pt-2 text-xs text-slate-600 border-t border-slate-100 flex justify-between">
                <span>Check-in: <strong>{formatDate(booking.checkIn)}</strong></span>
                <span>Check-out: <strong>{formatDate(booking.checkOut)}</strong></span>
              </div>
            </div>

            {/* Hotel */}
            <div className="p-4 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs uppercase font-bold text-brand-600 flex items-center gap-1">
                <Building className="w-3.5 h-3.5" /> Hospedaje Asignado
              </span>
              <h4 className="font-extrabold text-slate-900 text-lg">
                {booking.hotel?.name || "Alojamiento Preferencial Seleccionado"}
              </h4>
              <p className="text-xs text-slate-500">
                {booking.hotel?.address || "Dirección céntrica en destino"}
              </p>
              <div className="pt-2 text-xs text-slate-600 border-t border-slate-100 flex justify-between">
                <span>Duración: <strong>{nights} noche(s)</strong></span>
                <span>Categoría: <strong>{booking.hotel?.category || "Estándar"}</strong></span>
              </div>
            </div>
          </div>
        </div>

        {/* Resumen Financiero y Pago */}
        <div className="p-5 rounded-2xl bg-brand-50/60 border border-brand-200/60">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-slate-600 font-medium">Método de Pago:</span>
            <span className="font-bold text-slate-800">
              {booking.payment?.paymentMethod || "Pasarela Stripe Checkout"}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mb-3">
            <span className="text-slate-600 font-medium">Estado de Transacción:</span>
            <span className={`font-bold ${isPaid ? "text-emerald-700" : "text-amber-700"}`}>
              {isPaid ? "Aprobado (Transacción completada)" : "Esperando pago"}
            </span>
          </div>
          <div className="pt-3 border-t border-brand-200 flex items-center justify-between">
            <span className="text-base font-extrabold text-slate-900">Total Liquidado:</span>
            <span className="text-2xl font-black text-brand-700">
              {formatCurrency(booking.totalPrice)} USD
            </span>
          </div>
        </div>

        {/* Términos y Soporte */}
        <div className="border-t border-slate-200 pt-6 text-xs text-slate-500 space-y-2">
          <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Asistencia al Viajero Contigo Tours 24 Horas
          </div>
          <p>
            Presenta este comprobante junto a tu identificación oficial o pasaporte al momento de realizar el check-in en el hotel o con el guía asignado en el aeropuerto.
          </p>
          <p>
            Línea de emergencia en viaje: WhatsApp +52 (998) 123-4567 • soporte@contigotours.com
          </p>
        </div>
      </div>
    </div>
  );
}
