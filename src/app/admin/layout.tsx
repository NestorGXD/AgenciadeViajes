"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  MapPin,
  Building,
  CalendarCheck,
  Users,
  Shield,
  ExternalLink,
} from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: "/admin", label: "Métricas y Dashboard", icon: LayoutDashboard },
    { href: "/admin/destinations", label: "Gestión de Destinos (Mapa)", icon: MapPin },
    { href: "/admin/hotels", label: "Gestión de Hoteles", icon: Building },
    { href: "/admin/bookings", label: "Gestión de Reservas", icon: CalendarCheck },
    { href: "/admin/users", label: "Usuarios y Roles", icon: Users },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Admin */}
      <aside className="w-full md:w-64 bg-slate-950 border-r border-slate-800 p-6 flex flex-col justify-between">
        <div>
          {/* Logo Admin */}
          <div className="flex items-center gap-2 mb-8 pb-6 border-b border-slate-800">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight text-white block">
                ADMIN CONSOLE
              </span>
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                Contigo Tours
              </span>
            </div>
          </div>

          {/* Menú de Navegación */}
          <nav className="space-y-1.5">
            {links.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold transition ${
                    isActive
                      ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20"
                      : "text-slate-400 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-slate-800 mt-6">
          <Link
            href="/"
            className="flex items-center justify-between text-xs font-semibold text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-800/40 transition"
          >
            <span>Ver Sitio Público</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Área de Contenido Principal */}
      <main className="flex-1 p-6 sm:p-10 bg-slate-900 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
