"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import {
  DollarSign,
  CalendarCheck,
  Users,
  MapPin,
  TrendingUp,
  CheckCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const res = await fetch("/api/admin/stats");
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (err) {
        console.error("Error al cargar estadísticas", err);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-400">
        Cargando métricas del panel administrativo...
      </div>
    );
  }

  const metrics = data?.metrics || {
    totalRevenue: 0,
    totalBookings: 0,
    paidBookings: 0,
    pendingBookings: 0,
    totalUsers: 0,
    totalDestinations: 0,
    totalHotels: 0,
  };

  const statCards = [
    {
      title: "Ingresos Totales (Cobrados)",
      value: formatCurrency(metrics.totalRevenue),
      desc: "Pagos procesados exitosamente vía Stripe",
      icon: DollarSign,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Total de Reservas",
      value: metrics.totalBookings,
      desc: `${metrics.paidBookings} pagadas • ${metrics.pendingBookings} pendientes`,
      icon: CalendarCheck,
      color: "text-brand-400",
      bg: "bg-brand-500/10 border-brand-500/20",
    },
    {
      title: "Usuarios Registrados",
      value: metrics.totalUsers,
      desc: "Clientes y administradores",
      icon: Users,
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Destinos y Hoteles",
      value: `${metrics.totalDestinations} / ${metrics.totalHotels}`,
      desc: "Coordenadas geográficas sincronizadas",
      icon: MapPin,
      color: "text-purple-400",
      bg: "bg-purple-500/10 border-purple-500/20",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Cabecera */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          Panel de Control y Métricas
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervisión general de ingresos, reservas y catálogo de Contigo Tours.
        </p>
      </div>

      {/* Tarjetas de Métricas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              className={`p-5 rounded-2xl border ${card.bg} flex flex-col justify-between`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-300">
                  {card.title}
                </span>
                <Icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-black text-white mb-1">
                  {card.value}
                </div>
                <p className="text-[11px] text-slate-400">{card.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabla de Reservas Recientes */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-bold text-white">Últimas Reservas Generadas</h3>
            <p className="text-xs text-slate-400">Actividad de reservas en tiempo real</p>
          </div>
          <Link
            href="/admin/bookings"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            Ver todas <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-900/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Código</th>
                <th className="py-3 px-4">Cliente</th>
                <th className="py-3 px-4">Destino</th>
                <th className="py-3 px-4">Monto</th>
                <th className="py-3 px-4">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {data?.recentBookings?.map((b: any) => (
                <tr key={b.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-4 font-mono font-bold text-white">
                    {b.bookingCode}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold text-white block">{b.user.name}</span>
                    <span className="text-[11px] text-slate-500">{b.user.email}</span>
                  </td>
                  <td className="py-3 px-4">{b.destination.name}</td>
                  <td className="py-3 px-4 font-bold text-amber-400">
                    {formatCurrency(b.totalPrice)}
                  </td>
                  <td className="py-3 px-4">
                    {b.status === "PAID" ? (
                      <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        PAGADO
                      </span>
                    ) : (
                      <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2.5 py-0.5 rounded-full font-bold text-[10px]">
                        PENDIENTE
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
