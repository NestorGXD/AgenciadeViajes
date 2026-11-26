"use client";

import { useEffect, useState } from "react";
import { SessionUser } from "@/types";
import { User, Mail, Phone, ShieldCheck, AlertTriangle, CheckCircle2, RefreshCw } from "lucide-react";

export default function ClientProfilePage() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);
  const [resending, setResending] = useState(false);
  const [quickVerifying, setQuickVerifying] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string; verifyUrl?: string } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
          setName(data.user?.name || "");
          setPhone(data.user?.phone || "");
        }
      } catch (err) {
        console.error("Error al cargar perfil", err);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleQuickVerify = async () => {
    setQuickVerifying(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/auth/quick-verify", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.success) {
        setUser((prev) => (prev ? { ...prev, emailVerified: new Date().toISOString() } : null));
        setFeedback({
          type: "success",
          msg: "¡Tu cuenta ha sido activada y verificada exitosamente!",
        });
      } else {
        setFeedback({ type: "error", msg: data.error || "Error al verificar cuenta." });
      }
    } catch {
      setFeedback({ type: "error", msg: "Error al conectar con el servidor." });
    } finally {
      setQuickVerifying(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setFeedback(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = await res.json();
      setFeedback({
        type: "success",
        msg: data.message || "Enlace de verificación generado.",
        verifyUrl: data.verifyUrl,
      });
    } catch {
      setFeedback({ type: "error", msg: "Error al reenviar verificación." });
    } finally {
      setResending(false);
    }
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs text-slate-500">
        Cargando información del perfil...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs space-y-2 border ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300"
              : "bg-rose-50 text-rose-800 border-rose-300"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            )}
            <span>{feedback.msg}</span>
          </div>

          {feedback.verifyUrl && (
            <div className="pt-1">
              <a
                href={feedback.verifyUrl}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl text-xs transition shadow-xs"
              >
                <span>⚡ Hacer clic aquí para activar y verificar tu cuenta ahora</span>
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tarjeta de Estado de Verificación */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
        <h3 className="font-extrabold text-slate-900 text-base mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-brand-500" />
          Estado de Verificación de Cuenta
        </h3>

        {user?.emailVerified ? (
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900">
            <CheckCircle2 className="w-6 h-6 text-emerald-600 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Correo Electrónico Verificado</h4>
              <p className="text-xs text-emerald-700">
                Tu cuenta cumple con todos los requisitos para reservar, emitir vouchers y realizar pagos seguros.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-sm">Verificación Pendiente</h4>
                <p className="text-xs text-amber-800 mt-0.5">
                  No podrás completar pagos o emitir vouchers hasta confirmar tu correo electrónico ({user?.email}). Si estás en pruebas con Resend, revisa la copia en <strong>nesred.02@gmail.com</strong> o activa tu cuenta con el botón de abajo.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleQuickVerify}
                disabled={quickVerifying}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black py-2.5 px-4 rounded-xl transition flex items-center gap-2 shadow-md shadow-emerald-600/20 disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{quickVerifying ? "Activando..." : "⚡ Activar Cuenta en 1 Clic"}</span>
              </button>

              <button
                onClick={handleResend}
                disabled={resending}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold py-2.5 px-4 rounded-xl transition flex items-center gap-2 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${resending ? "animate-spin" : ""}`} />
                {resending ? "Enviando..." : "Solicitar nuevo correo de activación"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Información Personal */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base mb-2 flex items-center gap-2">
          <User className="w-5 h-5 text-brand-500" />
          Datos Personales
        </h3>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Nombre</label>
          <input
            type="text"
            disabled
            value={name}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Correo Electrónico</label>
          <input
            type="email"
            disabled
            value={user?.email || ""}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-600 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Rol en la Plataforma</label>
          <span className="inline-block bg-slate-900 text-white font-mono text-xs font-bold px-3 py-1 rounded-lg">
            {user?.role}
          </span>
        </div>
      </div>
    </div>
  );
}
