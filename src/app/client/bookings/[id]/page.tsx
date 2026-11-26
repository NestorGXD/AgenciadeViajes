"use client";

import { useEffect, useState, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { BookingData } from "@/types";
import BookingVoucher from "@/components/booking/BookingVoucher";
import { CreditCard, CheckCircle2, AlertCircle, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";

function BookingDetailContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const bookingId = params.id as string;

  const [booking, setBooking] = useState<BookingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentSuccessNotice, setPaymentSuccessNotice] = useState(false);

  useEffect(() => {
    async function fetchBooking() {
      try {
        const res = await fetch(`/api/bookings/${bookingId}`);
        if (!res.ok) throw new Error("No se pudo cargar la reserva.");
        const data = await res.json();
        setBooking(data.booking);

        // Si regresó de Stripe con éxito
        if (searchParams.get("payment_success") === "true") {
          setPaymentSuccessNotice(true);
        }
      } catch (err: any) {
        setError(err.message || "Error al cargar la reserva.");
      } finally {
        setLoading(false);
      }
    }

    if (bookingId) {
      fetchBooking();
    }
  }, [bookingId, searchParams]);

  // Manejar pago con Stripe Checkout
  const handleStripeCheckout = async () => {
    if (!booking) return;
    setPaying(true);
    setError(null);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId: booking.id,
          gateway: "stripe",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al iniciar Stripe Checkout.");
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (err: any) {
      setError(err.message || "Error procesando el checkout.");
      setPaying(false);
    }
  };

  // Botón para simular pago exitoso en entorno de desarrollo
  const handleSimulatePayment = async () => {
    if (!booking) return;
    setPaying(true);
    try {
      const res = await fetch("/api/checkout/simulate-success", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId: booking.id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setBooking(data.booking);
      setPaymentSuccessNotice(true);
    } catch (err: any) {
      setError(err.message || "Error en simulación de pago.");
    } finally {
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-3" />
        <p className="text-xs text-slate-500">Cargando comprobante de tu reserva...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
          <AlertCircle className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Reserva no encontrada</h2>
        <p className="text-xs text-slate-500">{error || "No pudimos encontrar la reservación indicada."}</p>
        <Link
          href="/client"
          className="inline-flex items-center gap-2 bg-slate-900 text-white font-bold text-xs py-2.5 px-4 rounded-xl"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Reservas</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Botón Volver */}
      <div className="flex items-center justify-between">
        <Link
          href="/client"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-brand-600 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver a Mis Reservas</span>
        </Link>
      </div>

      {/* Notificación de Éxito de Pago si regresa de Stripe */}
      {paymentSuccessNotice && (
        <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-4 flex items-center gap-3 text-emerald-800 text-xs shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <div>
            <strong className="block font-bold">¡Pago recibido con éxito!</strong>
            <span>
              Tu reservación ha sido confirmada vía Stripe Checkout. Hemos enviado tu comprobante y voucher al correo asociado.
            </span>
          </div>
        </div>
      )}

      {/* Banner de Acción si está Pendiente de Pago */}
      {booking.status === "PENDING" && (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">
              Estado de Pago: Pendiente
            </span>
            <h3 className="text-lg font-black text-slate-900">
              Completa tu pago seguro para asegurar la tarifa y habitaciones
            </h3>
            <p className="text-xs text-slate-600">
              Aceptamos tarjetas de débito y crédito a través de Stripe con confirmación inmediata.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleStripeCheckout}
              disabled={paying}
              className="bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs py-3 px-6 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 whitespace-nowrap disabled:opacity-50"
            >
              {paying ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <CreditCard className="w-4 h-4" />
              )}
              <span>Pagar con Tarjeta (Stripe)</span>
            </button>

            {/* Opción rápida para simular el pago en entorno de prueba */}
            <button
              onClick={handleSimulatePayment}
              disabled={paying}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 whitespace-nowrap disabled:opacity-50"
              title="Prueba inmediata del flujo completo de pago y webhook"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Simular Pago Exitoso (Test)</span>
            </button>
          </div>
        </div>
      )}

      {/* Comprobante / Voucher Imprimible */}
      <BookingVoucher booking={booking} />
    </div>
  );
}

export default function BookingDetailPage() {
  return (
    <Suspense
      fallback={
        <div className="py-24 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600 mx-auto mb-3" />
          <p className="text-xs text-slate-500">Cargando comprobante de reserva...</p>
        </div>
      }
    >
      <BookingDetailContent />
    </Suspense>
  );
}
