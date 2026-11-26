"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, User, Calendar, PlusCircle } from "lucide-react";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/client", label: "Mis Reservas e Itinerarios", icon: Calendar },
    { href: "/client/profile", label: "Mi Perfil y Seguridad", icon: User },
  ];

  return (
    <div className="bg-slate-50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Cabecera del Portal */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 block mb-1">
              Portal del Viajero
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Mi Panel de Reservas
            </h1>
          </div>
          <Link
            href="/cotizador"
            className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Cotizar un Nuevo Viaje
          </Link>
        </div>

        {/* Pestañas de Navegación */}
        <div className="flex items-center gap-2 border-b border-slate-200 mb-8 pb-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = pathname === tab.href;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-xl transition ${
                  isActive
                    ? "bg-white text-brand-700 shadow-xs border border-slate-200"
                    : "text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </Link>
            );
          })}
        </div>

        {/* Contenido de la página */}
        {children}
      </div>
    </div>
  );
}
