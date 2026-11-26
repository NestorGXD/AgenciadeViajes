"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Phone, Mail, GraduationCap, CheckCircle2, Loader2, Sparkles, User, School, MapPin } from "lucide-react";

export default function SchoolTripChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [destination, setDestination] = useState("");
  const [studentsCount, setStudentsCount] = useState("");
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
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Ocurrió un error al enviar tus datos.");
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || "Error al enviar la solicitud.");
    } finally {
      setLoading(false);
    }
  };

  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hola Contigo Tours, soy ${name || "un cliente"}, me gustaría recibir informes y cotización para un viaje escolar${schoolName ? ` de la escuela ${schoolName}` : ""}${destination ? ` con destino a ${destination}` : ""}.`
    );
    return `https://wa.me/52${WHATSAPP_NUMBER}?text=${text}`;
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {/* Botón flotante para abrir el Chat */}
      {!isOpen && (
        <div className="relative group">
          <div className="hidden sm:block absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-semibold py-2 px-3.5 rounded-2xl shadow-xl whitespace-nowrap pointer-events-none animate-bounce">
            🎒 ¿Viaje escolar? Pide informes aquí
            <div className="absolute right-[-6px] top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-l-6 border-l-slate-900" />
          </div>

          <button
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-600 to-sky-500 hover:from-brand-500 hover:to-sky-400 text-white shadow-2xl shadow-brand-500/40 flex items-center justify-center transition-all duration-300 hover:scale-110 relative"
            aria-label="Abrir chat de informes de viajes escolares"
          >
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full animate-ping" />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" />
            <MessageCircle className="w-7 h-7" />
          </button>
        </div>
      )}

      {/* Ventana de Chat */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[400px] max-h-[85vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300">
          {/* Cabecera del Chat */}
          <div className="bg-gradient-to-r from-brand-700 via-brand-600 to-sky-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-bold text-lg">
                  🎓
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-400 border-2 border-brand-700 rounded-full" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  Asesor de Viajes Escolares
                </h4>
                <p className="text-[11px] text-brand-100 flex items-center gap-1">
                  <span>En línea</span> • <span>Responde en minutos</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href={`https://wa.me/52${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Escribir por WhatsApp"
                className="p-1.5 text-brand-100 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-brand-100 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Contacto Directo Rápido */}
          <div className="bg-brand-50 px-4 py-2 border-b border-brand-100 flex items-center justify-between text-[11px]">
            <a
              href={`https://wa.me/52${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 font-bold hover:underline flex items-center gap-1"
            >
              📱 WhatsApp: {WHATSAPP_DISPLAY}
            </a>
            <a
              href={`mailto:${ADMIN_EMAIL}`}
              className="text-brand-700 font-bold hover:underline flex items-center gap-1 truncate max-w-[170px]"
              title={ADMIN_EMAIL}
            >
              ✉️ {ADMIN_EMAIL}
            </a>
          </div>

          {/* Cuerpo del Chat con Scroll */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs text-slate-700 custom-scrollbar">
            {/* Mensaje de Bienvenida 1 */}
            <div className="flex gap-2 max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                CT
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-xs">
                <p className="font-semibold text-slate-800 leading-relaxed">
                  ¡Hola! 👋 Bienvenido a Contigo Tours. ¿Estás planeando un viaje escolar, graduación o excursión para tu grupo?
                </p>
              </div>
            </div>

            {/* Mensaje de Bienvenida 2 */}
            <div className="flex gap-2 max-w-[90%]">
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                CT
              </div>
              <div className="bg-white p-3 rounded-2xl rounded-tl-sm border border-slate-200/80 shadow-xs">
                <p className="text-slate-600 leading-relaxed">
                  Déjanos tus datos aquí para enviarte la cotización y paquete completo a <strong className="text-brand-700">{ADMIN_EMAIL}</strong>, o chatea directamente con nosotros al WhatsApp <strong className="text-emerald-700">{WHATSAPP_DISPLAY}</strong>.
                </p>
              </div>
            </div>

            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-center space-y-3 my-2 animate-in fade-in">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h5 className="font-extrabold text-emerald-950 text-sm">
                    ¡Solicitud de Informes Enviada!
                  </h5>
                  <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                    Hemos recibido tus datos y los enviamos al coordinador escolar a <strong>{ADMIN_EMAIL}</strong>. Nos comunicaremos contigo al teléfono <strong>{phone}</strong> en breve.
                  </p>
                </div>
                <div className="pt-2 flex flex-col gap-2">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 px-3 rounded-xl transition text-center shadow-xs flex items-center justify-center gap-1.5"
                  >
                    💬 Continuar por WhatsApp ahora
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage("");
                    }}
                    className="text-[11px] text-slate-500 hover:text-slate-800 underline"
                  >
                    Enviar otra consulta
                  </button>
                </div>
              </div>
            ) : (
              /* Formulario dentro del chat */
              <form onSubmit={handleSubmit} className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between pb-1 border-b border-slate-100">
                  <span className="font-bold text-slate-800 text-[11px] flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Solicitar Informes y Cotización
                  </span>
                  <span className="text-[10px] text-slate-400">Respuesta rápida</span>
                </div>

                {error && (
                  <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-[10px] rounded-lg">
                    {error}
                  </div>
                )}

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    Tu Nombre *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Profesor Carlos Morales"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      Teléfono / WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Ej. 443 123 4567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      Tu Correo *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@correo.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      Escuela o Institución
                    </label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="Ej. Colegio Hidalgo"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                      Destino de Interés
                    </label>
                    <input
                      type="text"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      placeholder="Ej. Cancún, Guanajuato..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    No. estimado de alumnos / pasajeros
                  </label>
                  <input
                    type="number"
                    value={studentsCount}
                    onChange={(e) => setStudentsCount(e.target.value)}
                    placeholder="Ej. 35 alumnos + 4 profesores"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 block mb-0.5">
                    Mensaje o preguntas específicas
                  </label>
                  <textarea
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="¿Alguna fecha tentativa o requerimiento de hospedaje/transporte?"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:bg-white focus:ring-1 focus:ring-brand-500 outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 px-3 rounded-xl shadow-md shadow-brand-500/20 transition flex items-center justify-center gap-1.5 text-xs disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Enviando al coordinador...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Recibir Informes por Correo</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Footer del Chat con acceso directo a WhatsApp */}
          <div className="p-3 bg-white border-t border-slate-200 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">
              ¿Prefieres atención inmediata?
            </span>
            <a
              href={getWhatsAppUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-[11px] px-3 py-1.5 rounded-xl transition flex items-center gap-1 shadow-xs"
            >
              <span>WhatsApp: {WHATSAPP_DISPLAY}</span>
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
