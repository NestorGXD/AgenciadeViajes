"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Plane, ArrowRight, Sparkles, ShieldCheck } from "lucide-react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    // Timeout de seguridad de 3 segundos para que jamás se quede congelado
    const timeoutTimer = setTimeout(() => {
      if (isMounted && loading) {
        setLoading(false);
        // Si no respondió a tiempo, verificar si la sesión ya está activa
        checkUserSession();
      }
    }, 3500);

    async function checkUserSession() {
      try {
        const meRes = await fetch("/api/auth/me");
        if (meRes.ok) {
          const meData = await meRes.json();
          if (meData?.user?.emailVerified) {
            if (isMounted) {
              setSuccess(true);
              setUserName(meData.user.name);
              setMessage("¡Tu cuenta ya está verificada y lista para viajar!");
              setLoading(false);
              return true;
            }
          }
        }
      } catch {
        // Ignorar
      }
      return false;
    }

    async function verifyToken() {
      // 1. Primero verificar si la sesión ya está activa y verificada
      const alreadyOk = await checkUserSession();
      if (alreadyOk) return;

      if (!token) {
        if (isMounted) {
          setLoading(false);
          setSuccess(false);
          setMessage("No se encontró ningún código o token de verificación en el enlace.");
        }
        return;
      }

      try {
        // Llamada a la API de verificación
        const res = await fetch("/api/auth/verify-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
        });

        const data = await res.json().catch(() => null);

        if (!isMounted) return;

        if (res.ok && data?.success) {
          setSuccess(true);
          setUserName(data.user?.name || null);
          setMessage(data.message || "Correo verificado exitosamente.");
        } else if (data?.alreadyVerified) {
          setSuccess(true);
          setUserName(data.user?.name || null);
          setMessage(data.message || "Tu cuenta ya está verificada.");
        } else {
          // Si falló por token, checar si la sesión de usuario ya estaba activa
          const sessionOk = await checkUserSession();
          if (!sessionOk && isMounted) {
            setSuccess(false);
            setMessage(data?.error || "El enlace de verificación no es válido o ya fue utilizado.");
          }
        }
      } catch (err) {
        if (isMounted) {
          // Si hubo error de red, intentar verificar la sesión
          const sessionOk = await checkUserSession();
          if (!sessionOk) {
            setSuccess(false);
            setMessage("Error de conexión al verificar el correo.");
          }
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    verifyToken();

    return () => {
      isMounted = false;
      clearTimeout(timeoutTimer);
    };
  }, [token]);

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-200 text-center animate-in fade-in">
        <div className="w-14 h-14 rounded-2xl bg-brand-500 text-white mx-auto flex items-center justify-center font-bold mb-5 shadow-lg shadow-brand-500/25">
          <Plane className="w-7 h-7 -rotate-45" />
        </div>

        {loading ? (
          <div className="py-6 space-y-4">
            <Loader2 className="w-10 h-10 text-brand-600 animate-spin mx-auto" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              Verificando tu correo electrónico...
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              Estamos validando tus credenciales con el servidor de Contigo Tours.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setLoading(false)}
                className="text-xs text-brand-600 font-bold hover:underline"
              >
                ¿Tarda más de lo esperado? Haz clic aquí para continuar
              </button>
            </div>
          </div>
        ) : success ? (
          <div className="py-2 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" /> Cuenta Verificada
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              {userName ? `¡Bienvenido, ${userName}!` : "¡Cuenta Verificada con Éxito!"}
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {message} Ahora tienes acceso completo a todas las funciones, cotizaciones inteligentes y reservaciones seguras con Stripe.
            </p>

            <div className="pt-4 flex flex-col gap-2.5">
              <Link
                href="/cotizador"
                className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 px-4 rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-md shadow-amber-400/20"
              >
                <Sparkles className="w-4 h-4 text-amber-900" />
                <span>Ir al Cotizador y Reservar Viaje</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/client"
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <span>Ver Mi Panel de Cliente</span>
              </Link>
            </div>
          </div>
        ) : (
          <div className="py-2 space-y-4">
            <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
              <AlertCircle className="w-10 h-10" />
            </div>

            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Aviso de Verificación
            </h2>

            <p className="text-xs text-slate-600 leading-relaxed max-w-sm mx-auto">
              {message}
            </p>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 text-left space-y-1">
              <span className="font-bold text-slate-800 block">¿Qué puedes hacer?</span>
              <p>• Si ya habías hecho clic en el enlace, es probable que tu cuenta <strong>ya esté verificada</strong>.</p>
              <p>• Inicia sesión o revisa tu perfil para confirmar tu estado.</p>
            </div>

            <div className="pt-3 flex flex-col gap-2">
              <Link
                href="/auth/login"
                className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-3 px-4 rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <span>Iniciar Sesión en Mi Cuenta</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/client/profile"
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-2.5 px-4 rounded-xl text-xs transition"
              >
                Ir a Mi Perfil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center bg-slate-50">
          <Loader2 className="w-8 h-8 animate-spin text-brand-600" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
