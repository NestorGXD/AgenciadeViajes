"use client";

import { useState } from "react";
import { Send, CheckCircle2, Phone, Mail, Loader2, Sparkles } from "lucide-react";

export default function SchoolTripForm() {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [destination, setDestination] = useState("");
  const [studentsCount, setStudentsCount] = useState("");
  const [travelDate, setTravelDate] = useState("");
  const [message, setMessage] = useState("");

  const WHATSAPP_NUMBER = "4431866129";
  const WHATSAPP_DISPLAY = "443 186 6129";
  const ADMIN_EMAIL = "hugoalex.riverab@gmail.com";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact/school-trip", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          schoolName,
          destination,
          studentsCount,
          travelDate,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Error al enviar la solicitud.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Error al procesar tu solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppDirectUrl = () => {
    const text = encodeURIComponent(
      `Hola Contigo Tours, soy ${name || "un cliente interesado"}, me gustaría recibir informes y cotización para un viaje escolar${schoolName ? ` de la escuela ${schoolName}` : ""}${destination ? ` con destino a ${destination}` : ""}.`
    );
    return `https://wa.me/52${WHATSAPP_NUMBER}?text=${text}`;
  };

  if (submitted) {
    return (
      <div className="text-center py-6 space-y-4 animate-in fade-in">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h3 className="text-2xl font-black text-slate-900">
          ¡Solicitud Recibida con Éxito!
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
          Tus datos han sido enviados directamente al correo del coordinador <strong>{ADMIN_EMAIL}</strong>. Nos comunicaremos contigo al teléfono <strong>{phone}</strong> o por correo a la brevedad.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href={getWhatsAppDirectUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 px-6 rounded-xl transition shadow-md shadow-emerald-500/20 flex items-center gap-2"
          >
            <Phone className="w-4 h-4" />
            <span>Hablar ahora por WhatsApp ({WHATSAPP_DISPLAY})</span>
          </a>
          <button
            onClick={() => {
              setSubmitted(false);
              setMessage("");
            }}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs py-3 px-5 rounded-xl transition"
          >
            Enviar otra consulta
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Nombre Completo del Contacto *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej. Profa. Laura Sánchez o Padre de Familia"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Teléfono o WhatsApp de Contacto *
          </label>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Ej. 443 186 6129"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Correo Electrónico para Enviar Cotización *
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Nombre de la Escuela o Institución
          </label>
          <input
            type="text"
            value={schoolName}
            onChange={(e) => setSchoolName(e.target.value)}
            placeholder="Ej. Escuela Secundaria No. 5 / Colegio Morelos"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Destino(s) de Interés
          </label>
          <input
            type="text"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Ej. Cancún, CDMX, Guanajuato..."
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            No. Estimado de Pasajeros
          </label>
          <input
            type="number"
            value={studentsCount}
            onChange={(e) => setStudentsCount(e.target.value)}
            placeholder="Ej. 40 alumnos"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">
            Fecha o Mes Tentativo
          </label>
          <input
            type="text"
            value={travelDate}
            onChange={(e) => setTravelDate(e.target.value)}
            placeholder="Ej. Junio 2025"
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none"
          />
        </div>
      </div>

      <div>
        <label className="text-xs font-bold text-slate-700 block mb-1">
          Requerimientos especiales, dudas o itinerario deseado
        </label>
        <textarea
          rows={3}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="¿Desean hotel todo incluido, transporte en autobús, visitas a museos o facilidades de pago en plazos?"
          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-brand-500 outline-none resize-none"
        />
      </div>

      <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-[11px] text-slate-500">
          📨 Tu información se enviará a <strong>{ADMIN_EMAIL}</strong> y la atenderá nuestro equipo de asesores.
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-xs py-3.5 px-8 rounded-xl shadow-lg shadow-brand-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Enviando información...</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>Solicitar Informes de Viaje Escolar</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
