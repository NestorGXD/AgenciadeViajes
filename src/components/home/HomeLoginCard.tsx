"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Mail,
  User,
  Shield,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  LogOut,
  PlaneTakeoff,
} from "lucide-react";

export default function HomeLoginCard() {
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Verificar si ya hay una sesión activa
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data?.user) {
            setCurrentUser(data.user);
          }
        }
      } catch {
        // Sin sesión
      } finally {
        setCheckingAuth(false);
      }
    }
    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales no válidas.");
      }

      setSuccessMessage(`¡Bienvenido de nuevo, ${data.user.name}!`);
      setCurrentUser(data.user);

      // Redirigir según el rol
      setTimeout(() => {
        if (data.user.role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/client");
        }
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message || "Error al conectar con la autenticación.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemo = async (role: "CLIENT" | "ADMIN") => {
    setErrorMessage(null);
    setIsLoading(true);

    const demoCreds =
      role === "ADMIN"
        ? { email: "admin@contigotours.com", password: "Admin12345!" }
        : { email: "cliente@contigotours.com", password: "Cliente12345!" };

    setEmail(demoCreds.email);
    setPassword(demoCreds.password);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(demoCreds),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "No se pudo acceder con la cuenta demo.");
      }

      setSuccessMessage(`Acceso concedido como ${role === "ADMIN" ? "Administrador" : "Cliente"}`);
      setCurrentUser(data.user);

      setTimeout(() => {
        if (role === "ADMIN") {
          router.push("/admin");
        } else {
          router.push("/client");
        }
        router.refresh();
      }, 700);
    } catch (err: any) {
      setErrorMessage(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setCurrentUser(null);
      setSuccessMessage(null);
      setEmail("");
      setPassword("");
      router.refresh();
    } catch (err) {
      console.error(err);
    }
  };

  if (checkingAuth) {
    return (
      <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-slate-200/80 text-center flex flex-col items-center justify-center min-h-[360px]">
        <Loader2 className="w-8 h-8 animate-spin text-brand-600 mb-3" />
        <p className="text-xs text-slate-500 font-medium">Cargando módulo de acceso...</p>
      </div>
    );
  }

  // Vista cuando ya está autenticado
  if (currentUser) {
    return (
      <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/80 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-100 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md shadow-emerald-500/20">
            <User className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md inline-block mb-1">
              Sesión Activa
            </span>
            <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
              {currentUser.name}
            </h3>
            <p className="text-xs text-slate-500">{currentUser.email}</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Rol asignado:</span>
            <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
              {currentUser.role === "ADMIN" ? "Administrador de la Agencia" : "Cliente Viajero"}
            </span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Estado de cuenta:</span>
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verificada
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {currentUser.role === "ADMIN" ? (
            <Link
              href="/admin"
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 text-sm"
            >
              <Shield className="w-4 h-4 text-amber-400" />
              <span>Entrar al Panel de Administrador</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          ) : (
            <Link
              href="/client"
              className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3.5 px-4 rounded-2xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 text-sm"
            >
              <PlaneTakeoff className="w-4 h-4" />
              <span>Ver Mis Reservaciones y Viajes</span>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </Link>
          )}

          <Link
            href="/cotizador"
            className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold py-3.5 px-4 rounded-2xl shadow-md transition flex items-center justify-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4 text-amber-900" />
            <span>Ir al Cotizador Oficial de Viajes</span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl transition flex items-center justify-center gap-2 text-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </div>
    );
  }

  // Formulario de Inicio de Sesión
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200/90 relative overflow-hidden">
      <div className="text-left mb-6">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-2">
          <Lock className="w-3.5 h-3.5" />
          Acceso Oficial a Clientes y Administradores
        </div>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Iniciar Sesión
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          Ingresa a tu cuenta para gestionar tus itinerarios o acceder a tus cotizaciones guardadas.
        </p>
      </div>

      {/* Cuentas Demo Rápidas en 1 Clic */}
      <div className="mb-5 p-3.5 bg-gradient-to-r from-slate-50 to-brand-50/50 rounded-2xl border border-slate-200 text-xs">
        <span className="font-extrabold text-slate-800 block mb-2 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          Acceso Rápido Demo (1 Clic):
        </span>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleQuickDemo("CLIENT")}
            disabled={isLoading}
            className="bg-white hover:bg-emerald-50 text-slate-800 hover:text-emerald-800 font-bold py-2 px-2.5 rounded-xl border border-slate-200 hover:border-emerald-300 text-center transition flex items-center justify-center gap-1 text-[11px] shadow-xs"
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span>👤 Cliente Demo</span>
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemo("ADMIN")}
            disabled={isLoading}
            className="bg-white hover:bg-brand-50 text-slate-800 hover:text-brand-800 font-bold py-2 px-2.5 rounded-xl border border-slate-200 hover:border-brand-300 text-center transition flex items-center justify-center gap-1 text-[11px] shadow-xs"
          >
            <Shield className="w-3.5 h-3.5 text-brand-600" />
            <span>🛡️ Admin Demo</span>
          </button>
        </div>
      </div>

      {/* Mensajes de éxito o error */}
      {successMessage && (
        <div className="mb-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl p-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl p-3 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Correo Electrónico
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
            <input
              type="email"
              required
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Contraseña
          </label>
          <div className="relative">
            <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3.5 pointer-events-none" />
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs sm:text-sm font-medium bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 focus:bg-white outline-none transition"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-brand-600 hover:bg-brand-500 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 text-xs sm:text-sm disabled:opacity-50"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Verificando credenciales...</span>
            </>
          ) : (
            <>
              <span>Ingresar a Mi Cuenta</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
        <Link
          href="/auth/register"
          className="text-brand-600 hover:text-brand-700 font-bold hover:underline"
        >
          Crear cuenta nueva
        </Link>
        <Link
          href="/cotizador"
          className="text-slate-500 hover:text-slate-800 font-semibold"
        >
          Cotizar como invitado →
        </Link>
      </div>
    </div>
  );
}
