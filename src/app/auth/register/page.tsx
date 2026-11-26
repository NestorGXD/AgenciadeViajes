"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plane, User, Mail, Lock, Phone, AlertCircle, CheckCircle2, ArrowRight, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [registeredSuccess, setRegisteredSuccess] = useState(false);
  const [verifyUrl, setVerifyUrl] = useState<string | null>(null);
  const [deliveredTo, setDeliveredTo] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al registrar el usuario.");
      }

      if (data.verifyUrl) {
        setVerifyUrl(data.verifyUrl);
      }
      if (data.deliveredTo) {
        setDeliveredTo(data.deliveredTo);
      }
      setRegisteredSuccess(true);
    } catch (err: any) {
      setError(err.message || "Error al procesar el registro.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200">
        {registeredSuccess ? (
          <div className="text-center py-4 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h2 className="text-2xl font-black text-slate-900">
              ¡Cuenta Creada con Éxito!
            </h2>
            <div className="p-5 bg-gradient-to-b from-brand-50 to-white rounded-2xl border border-brand-200 text-xs text-brand-900 leading-relaxed text-left space-y-3 shadow-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-extrabold text-slate-900 text-sm">
                  Usuario: {name} ({email})
                </span>
              </div>

              {deliveredTo && deliveredTo.toLowerCase() !== email.toLowerCase() && (
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-amber-900 text-[11px] leading-relaxed">
                  <strong>🔔 Aviso de Sandbox de Resend:</strong><br />
                  Dado que la cuenta de pruebas gratuita de Resend (<em>onboarding@resend.dev</em>) solo permite entregar emails a tu correo registrado (<strong>{deliveredTo}</strong>), hemos despachado el correo de activación directamente a <strong>{deliveredTo}</strong> para que puedas abrirlo en tu Gmail.
                </div>
              )}

              <p className="text-slate-600 text-xs">
                Para tu comodidad en este entorno de desarrollo, puedes activar tu cuenta de inmediato con 1 clic en el botón verde:
              </p>

              {/* Botón de Activación Inmediata */}
              <div className="pt-1">
                <Link
                  href={verifyUrl || "/auth/verify"}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-3.5 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20"
                >
                  <Sparkles className="w-4 h-4 text-emerald-200" />
                  <span>⚡ Activar y Verificar Mi Cuenta Ahora Mismo</span>
                  <ArrowRight className="w-4 h-4 ml-auto" />
                </Link>
              </div>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/cotizador"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3 px-4 rounded-xl text-center text-xs transition shadow-xs"
              >
                Ir al Cotizador y Planear Viaje
              </Link>
              <Link
                href="/client"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-center text-xs transition"
              >
                Ir a mi panel de cliente
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white mx-auto flex items-center justify-center font-bold mb-3 shadow-md shadow-brand-500/20">
                <Plane className="w-6 h-6 -rotate-45" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                Crea tu Cuenta
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Únete a Contigo Tours para cotizar, guardar y confirmar tus viajes.
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl p-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Nombre Completo
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Ana Sofía Martínez"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@correo.com"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Teléfono / WhatsApp (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+52 998 123 4567"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repite tu contraseña"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-2 text-sm disabled:opacity-50 mt-4"
              >
                {loading ? "Creando cuenta..." : "Crear mi cuenta"}
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
              ¿Ya tienes una cuenta registrada?{" "}
              <Link
                href="/auth/login"
                className="font-bold text-brand-600 hover:underline"
              >
                Inicia sesión aquí
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
