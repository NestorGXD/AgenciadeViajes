"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SessionUser } from "@/types";
import {
  Menu,
  X,
  Compass,
  Calendar,
  User,
  Shield,
  LogOut,
  AlertTriangle,
  Plane,
} from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SessionUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Consultar sesión del usuario
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      router.push("/auth/login");
      router.refresh();
    } catch (err) {
      console.error("Error cerrando sesión", err);
    }
  };

  const navLinks = [
    { href: "/", label: "Inicio" },
    { href: "/destinations", label: "Destinos y Mapa" },
    { href: "/cotizador", label: "Cotizador" },
    { href: "/viajes-escolares", label: "🎒 Viajes Escolares" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition">
              <Plane className="w-5 h-5 -rotate-45" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-brand-600 transition">
                Contigo <span className="text-brand-500">Tours</span>
              </span>
              <span className="hidden sm:block text-[10px] text-slate-400 font-medium tracking-widest uppercase">
                Viaja sin límites
              </span>
            </div>
          </Link>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition ${
                    isActive
                      ? "text-brand-600 bg-brand-50/80"
                      : "text-slate-600 hover:text-brand-600 hover:bg-slate-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Acciones de Usuario Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-9 bg-slate-100 rounded-xl animate-pulse" />
            ) : user ? (
              <div className="flex items-center gap-2.5">
                {/* Alerta de no verificado */}
                {!user.emailVerified && (
                  <Link
                    href="/client/profile"
                    className="flex items-center gap-1.5 text-xs bg-amber-50 text-amber-800 border border-amber-300 px-2.5 py-1.5 rounded-xl font-medium hover:bg-amber-100 transition"
                    title="Tu cuenta no está verificada aún"
                  >
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Verificar email</span>
                  </Link>
                )}

                {/* Si es ADMIN */}
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 transition"
                  >
                    <Shield className="w-3.5 h-3.5 text-amber-400" />
                    Panel Admin
                  </Link>
                )}

                {/* Panel Cliente */}
                <Link
                  href="/client"
                  className="bg-brand-50 text-brand-700 hover:bg-brand-100 text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition border border-brand-200"
                >
                  <User className="w-3.5 h-3.5 text-brand-600" />
                  {user.name.split(" ")[0]} (Mis Reservas)
                </Link>

                {/* Botón Salir */}
                <button
                  onClick={handleLogout}
                  title="Cerrar sesión"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="text-xs font-bold text-slate-700 hover:text-brand-600 px-3 py-2 rounded-xl hover:bg-slate-50 transition"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  className="bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-brand-500/20 transition"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>

          {/* Botón Mobile Menu */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil */}
      {isOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white p-4 space-y-3">
          <div className="space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <div className="px-3 py-1">
                  <span className="text-xs text-slate-400 block">Conectado como</span>
                  <span className="text-sm font-bold text-slate-800">{user.name}</span>
                </div>
                {user.role === "ADMIN" && (
                  <Link
                    href="/admin"
                    onClick={() => setIsOpen(false)}
                    className="block w-full bg-slate-900 text-white text-xs font-bold py-2.5 px-4 rounded-xl text-center"
                  >
                    Panel de Administración
                  </Link>
                )}
                <Link
                  href="/client"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-brand-50 text-brand-700 text-xs font-bold py-2.5 px-4 rounded-xl text-center"
                >
                  Mis Reservas y Perfil
                </Link>
                <button
                  onClick={() => {
                    setIsOpen(false);
                    handleLogout();
                  }}
                  className="block w-full text-rose-600 hover:bg-rose-50 text-xs font-bold py-2 px-4 rounded-xl text-center"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="border border-slate-300 text-slate-700 text-xs font-bold py-2 px-3 rounded-xl text-center"
                >
                  Iniciar Sesión
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="bg-brand-600 text-white text-xs font-bold py-2 px-3 rounded-xl text-center"
                >
                  Registrarse
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
