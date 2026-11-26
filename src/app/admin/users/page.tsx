"use client";

import { useEffect, useState } from "react";
import { formatDate } from "@/lib/utils";
import { Users, Shield, CheckCircle, AlertTriangle, UserCheck } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/admin/users");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleToggle = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "CLIENT" : "ADMIN";
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      });
      if (res.ok) fetchUsers();
    } catch {
      alert("Error al actualizar rol.");
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerificationToggle = async (userId: string, currentVerified: boolean) => {
    setUpdatingId(userId);
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, emailVerified: !currentVerified }),
      });
      if (res.ok) fetchUsers();
    } catch {
      alert("Error al actualizar verificación.");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white">
          Gestión de Usuarios y Roles
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Administra roles de acceso (CLIENT vs ADMIN) y estado de verificación de correo electrónico.
        </p>
      </div>

      <div className="bg-slate-950 rounded-3xl p-6 border border-slate-800 overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-900/60 uppercase text-[10px] text-slate-400 border-b border-slate-800">
            <tr>
              <th className="py-3 px-4">Usuario</th>
              <th className="py-3 px-4">Teléfono</th>
              <th className="py-3 px-4">Rol Asignado</th>
              <th className="py-3 px-4">Email Verificado</th>
              <th className="py-3 px-4">Reservas</th>
              <th className="py-3 px-4">Fecha Registro</th>
              <th className="py-3 px-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {users.map((u) => {
              const isVerified = Boolean(u.emailVerified);
              const isAdmin = u.role === "ADMIN";

              return (
                <tr key={u.id} className="hover:bg-slate-900/40 transition">
                  <td className="py-3 px-4">
                    <span className="font-bold text-white block">{u.name}</span>
                    <span className="text-[11px] text-slate-400">{u.email}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-400">{u.phone || "—"}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 ${
                        isAdmin
                          ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                          : "bg-slate-800 text-slate-300"
                      }`}
                    >
                      {isAdmin && <Shield className="w-3 h-3" />}
                      {u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleVerificationToggle(u.id, isVerified)}
                      disabled={updatingId === u.id}
                      title="Haz clic para alternar verificación"
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 transition ${
                        isVerified
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30"
                          : "bg-rose-500/20 text-rose-400 border border-rose-500/30 hover:bg-rose-500/30"
                      }`}
                    >
                      {isVerified ? (
                        <>
                          <CheckCircle className="w-3 h-3" /> Verificado
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3" /> No Verificado
                        </>
                      )}
                    </button>
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-200">
                    {u._count?.bookings || 0}
                  </td>
                  <td className="py-3 px-4 text-slate-500 text-[11px]">
                    {formatDate(u.createdAt)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      onClick={() => handleRoleToggle(u.id, u.role)}
                      disabled={updatingId === u.id}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 text-[11px] font-semibold px-2.5 py-1 rounded-lg transition"
                    >
                      Cambiar a {isAdmin ? "CLIENT" : "ADMIN"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
