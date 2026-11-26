"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookingData, SessionUser } from "@/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  Printer,
  CreditCard,
  AlertTriangle,
  Plane,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";

export default function ClientBookingsPage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [bookings, setBookings] = useState<BookingData[]>([]);
  const [loading, setLoading] = useState(true);
  const [resendingEmail, setResendingEmail] = useState(false);
  const [resendStatus, setResendStatus] = useState<string | null>(null);
  const [quickVerifying, setQuickVerifying] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const [userRes, bookingsRes] = await Promise.all([
          fetch("/api/auth/me"),
          fetch("/api/bookings"),
        ]);

        if (userRes.ok) {
          const userData = await userRes.json();
          setUser(userData.user);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.bookings || []);
        }
      } catch (err) {
        console.error("Error cargando panel del cliente", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleQuickVerify = async () => {
    setQuickVerifying(true);
    setResendStatus(null);
    try {
      const res = await fetch("/api/auth/quick-verify", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => (prev ? { ...prev, emailVerified: new Date().toISOString() } : null));
        setResendStatus("¡Cuenta verificada y activada exitosamente! Ya puedes realizar reservas.");
      } else {
        setResendStatus(data.error || "Error al verificar la cuenta.");
      }
    } catch {
      setResendStatus("Error de red al activar cuenta.");
    } finally {
      setQuickVerifying(false);
    }
  };

  const handleResendVerification = async () => {
    setResendingEmail(true);
    setResendStatus(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      setResendStatus(data.message || "Correo de verificación generado.");
    } catch {
      setResendStatus("Error al reenviar correo.");
    } finally {
      setResendingEmail(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Cargando tus reservas y datos de viaje...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* BANNER DE ADVERTENCIA SI EL CORREO NO ESTÁ VERIFICADO */}
      {user && !user.emailVerified && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-amber-900 text-sm">
                Tu correo ({user.email}) aún no está verificado
              </h4>
              <p className="text-amber-800 text-xs mt-0.5 leading-relaxed">
                Por política de seguridad debes activar tu cuenta. Si estás en modo pruebas, puedes activarla al instante aquí mismo o revisar la copia en <strong>nesred.02@gmail.com</strong>.
              </p>
              {resendStatus && (
                <p className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-lg mt-2 inline-block">
                  ✅ {resendStatus}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-stretch md:self-auto">
            <button
              onClick={handleQuickVerify}
              disabled={quickVerifying}
              className="flex-1 md:flex-none bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl transition shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5 disabled:opacity-50 whitespace-nowrap"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{quickVerifying ? "Activando..." : "⚡ Activar Cuenta en 1 Clic"}</span>
            </button>

            <button
              onClick={handleResendVerification}
              disabled={resendingEmail}
              className="flex-1 md:flex-none bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-bold px-3 py-2.5 rounded-xl transition disabled:opacity-50 whitespace-nowrap"
            >
              {resendingEmail ? "Enviando..." : "Reenviar correo"}
            </button>
          </div>
        </div>
      )}

      {/* Lista de Reservas */}
      {bookings.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-3">
            <Plane className="w-7 h-7 -rotate-45" />
          </div>
          <h3 className="font-extrabold text-slate-900 text-lg mb-1">
            No tienes reservas activas aún
          </h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            Comienza a planear tu próxima aventura navegando por nuestro catálogo y mapa de destinos turísticos.
          </p>
          <Link
            href="/cotizador"
            className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-3 px-6 rounded-xl transition shadow-md shadow-brand-500/20"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Crear mi primera cotización</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {bookings.map((booking) => {
            const isPaid = booking.status === "PAID";
            const isPending = booking.status === "PENDING";
            const isCancelled = booking.status === "CANCELLED";

            return (
              <div
                key={booking.id}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:shadow-md transition flex flex-col lg:flex-row lg:items-center justify-between gap-6"
              >
                {/* Detalles de Reserva */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xs font-bold bg-slate-100 text-slate-800 px-3 py-1 rounded-lg">
                      {booking.bookingCode}
                    </span>

                    {/* Insignia de Estado */}
                    {isPaid && (
                      <span className="inline-flex items-center gap-1 bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" /> PAGADO
                      </span>
                    )}
                    {isPending && (
                      <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-800 text-xs font-bold px-3 py-1 rounded-full">
                        <Clock className="w-3.5 h-3.5" /> PAGO PENDIENTE
                      </span>
                    )}
                    {isCancelled && (
                      <span className="inline-flex items-center gap-1 bg-rose-100 text-rose-800 text-xs font-bold px-3 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> CANCELADA
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      Creada el {formatDate(booking.createdAt)}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-black text-slate-900 mb-1 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-brand-500" />
                      {booking.destination?.name || "Destino Turístico"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Hotel / Hospedaje:{" "}
                      <strong className="text-slate-700">
                        {booking.hotel?.name || "Categoría Seleccionada"}
                      </strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-600 pt-2">
                    <span className="flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(booking.checkIn)} al {formatDate(booking.checkOut)}
                    </span>
                    <span className="bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                      {booking.adults} Adulto(s)
                      {booking.children > 0 ? `, ${booking.children} Niño(s)` : ""}
                    </span>
                  </div>
                </div>

                {/* Precio y Acciones */}
                <div className="flex flex-col sm:flex-row lg:flex-col items-start sm:items-center lg:items-end justify-between gap-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                  <div className="text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Total a Pagar / Liquidado
                    </span>
                    <span className="text-2xl font-black text-brand-600">
                      {formatCurrency(booking.totalPrice)}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botón de pago si está pendiente */}
                    {isPending && (
                      <Link
                        href={`/client/bookings/${booking.bookingCode}`}
                        className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition flex items-center gap-1.5"
                      >
                        <CreditCard className="w-3.5 h-3.5" />
                        Pagar Ahora
                      </Link>
                    )}

                    {/* Botón ver comprobante */}
                    <Link
                      href={`/client/bookings/${booking.bookingCode}`}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      Ver Voucher
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
