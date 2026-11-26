"use client";

import { useEffect, useState } from "react";
import { formatCurrency, formatDate } from "@/lib/utils";
import { CalendarCheck, Search, Filter, CheckCircle, Clock, XCircle, ArrowUpRight } from "lucide-react";
import Link from "next/link";

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      const url = statusFilter === "ALL" ? "/api/bookings" : `/api/bookings?status=${statusFilter}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setBookings(data.bookings || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [statusFilter]);

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    setUpdatingId(bookingId);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        fetchBookings();
      } else {
        alert("Error al actualizar estado.");
      }
    } catch {
      alert("Error al actualizar estado.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = bookings.filter((b) => {
    const term = searchTerm.toLowerCase();
    return (
      b.bookingCode.toLowerCase().includes(term) ||
      b.user.name.toLowerCase().includes(term) ||
      b.user.email.toLowerCase().includes(term) ||
      b.destination.name.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Gestión de Reservas
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Supervisa el estado de todas las reservas de los clientes y actualiza su estatus.
        </p>
      </div>

      {/* Filtros y Buscador */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar por código, cliente o destino..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
          >
            <option value="ALL">Todos los Estados</option>
            <option value="PAID">Pagado (PAID)</option>
            <option value="PENDING">Pendiente (PENDING)</option>
            <option value="CONFIRMED">Confirmado (CONFIRMED)</option>
            <option value="CANCELLED">Cancelado (CANCELLED)</option>
          </select>
        </div>
      </div>

      {/* Tabla de Reservas */}
      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Código</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Destino y Fechas</th>
              <th className="py-3 px-4">Pasajeros</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Estado Actual</th>
              <th className="py-3 px-4 text-right">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((b) => (
              <tr key={b.id} className="hover:bg-slate-900/40 transition">
                <td className="py-3 px-4 font-mono font-bold text-white">
                  {b.bookingCode}
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-white block">{b.user.name}</span>
                  <span className="text-[11px] text-slate-500">{b.user.email}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="font-semibold text-slate-200 block">{b.destination.name}</span>
                  <span className="text-[10px] text-slate-500">
                    {formatDate(b.checkIn)} al {formatDate(b.checkOut)}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {b.adults} Ad. {b.children > 0 ? `+ ${b.children} Niñ.` : ""}
                </td>
                <td className="py-3 px-4 font-bold text-amber-400">
                  {formatCurrency(b.totalPrice)}
                </td>
                <td className="py-3 px-4">
                  <select
                    disabled={updatingId === b.id}
                    value={b.status}
                    onChange={(e) => handleStatusChange(b.id, e.target.value)}
                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-2 py-1 text-[11px] font-bold focus:outline-none"
                  >
                    <option value="PAID">PAID (Pagado)</option>
                    <option value="PENDING">PENDING (Pendiente)</option>
                    <option value="CONFIRMED">CONFIRMED (Confirmado)</option>
                    <option value="CANCELLED">CANCELLED (Cancelado)</option>
                  </select>
                </td>
                <td className="py-3 px-4 text-right">
                  <Link
                    href={`/client/bookings/${b.bookingCode}`}
                    target="_blank"
                    className="p-1.5 text-slate-400 hover:text-amber-400 inline-flex items-center gap-1 text-[11px] font-semibold"
                  >
                    Voucher <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
