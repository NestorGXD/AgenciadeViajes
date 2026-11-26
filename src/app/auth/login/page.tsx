"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Plane, Lock, Mail, AlertCircle, ArrowRight, Loader2 } from "lucide-react";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Credenciales inválidas.");
      }

      // Redirigir según el rol o callbackUrl
      if (callbackUrl) {
        router.push(callbackUrl);
      } else if (data.user.role === "ADMIN") {
        router.push("/admin");
      } else {
        router.push("/client");
      }
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Error al iniciar sesión.");
    } finally {
      setLoading(false);
    }
  };

  // Botón rápido para pruebas
  const fillDemoAccount = (demoRole: "ADMIN" | "CLIENT") => {
    if (demoRole === "ADMIN") {
      setEmail("admin@contigotours.com");
      setPassword("Admin12345!");
    } else {
      setEmail("cliente@contigotours.com");
      setPassword("Cliente12345!");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white mx-auto flex items-center justify-center font-bold mb-3 shadow-md shadow-brand-500/20">
            <Plane className="w-6 h-6 -rotate-45" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Iniciar Sesión
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Ingresa a tu cuenta de Contigo Tours para gestionar tus viajes.
          </p>
        </div>

        {/* Cuentas Demo Rápidas para evaluación */}
        <div className="mb-6 p-3 bg-brand-50 rounded-2xl border border-brand-100 text-xs">
          <span className="font-bold text-brand-900 block mb-1">
            ⚡ Acceso Rápido de Prueba (Seed Data):
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => fillDemoAccount("ADMIN")}
              className="flex-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-1.5 px-2 rounded-xl border border-brand-200 text-center transition"
            >
              Cargar Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount("CLIENT")}
              className="flex-1 bg-white hover:bg-slate-100 text-slate-800 font-semibold py-1.5 px-2 rounded-xl border border-brand-200 text-center transition"
            >
              Cargar Cliente
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-50 border border-rose-200 rounded-2xl flex items-center gap-2.5 text-rose-700 text-xs">
            <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ejemplo@correo.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-bold text-slate-700">Contraseña</label>
              <Link
                href="/auth/forgot-password"
                className="text-[11px] text-brand-600 hover:underline font-semibold"
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-2"
          >
            {loading ? "Iniciando sesión..." : "Acceder a mi cuenta"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
          ¿Aún no tienes una cuenta?{" "}
          <Link
            href="/auth/register"
            className="font-bold text-brand-600 hover:underline"
          >
            Regístrate aquí
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <LoginFormContent />
    </Suspense>
  );
}
