import {
  ShieldCheck,
  CreditCard,
  Lock,
  Headphones,
  FileCheck2,
  Phone,
  Mail,
  CheckCircle2,
} from "lucide-react";

export default function TrustAndSecuritySection() {
  return (
    <section className="py-20 bg-white border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 text-xs font-black px-3.5 py-1.5 rounded-full mb-3 uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            Garantía y Protección al Viajero
          </div>
          <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
            Viaja con la máxima seguridad y respaldo
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            En Contigo Tours protegemos cada aspecto de tu experiencia: desde tus transacciones bancarias hasta tu integridad y equipaje en destino.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-14">
          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-emerald-500/20">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              Cobros Seguros vía Stripe
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Tus datos de tarjeta nunca tocan nuestros servidores. Son encriptados con el estándar bancario PCI-DSS Nivel 1 de Stripe.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-brand-500 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-brand-500/20">
              <FileCheck2 className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              Seguro de Asistencia Médica
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cada paquete cuenta con cobertura médica de emergencia, seguro de cancelación por causa mayor y seguro de extravío de equipaje.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-amber-500/20">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              Comprobante Oficial
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Al confirmar tu pago recibes de inmediato un código alfanumérico único de reserva y el voucher de confirmación por correo electrónico.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-6 border border-slate-200/80">
            <div className="w-12 h-12 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold mb-4 shadow-md shadow-sky-500/20">
              <Headphones className="w-6 h-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base mb-2">
              Asistencia Personal 24/7
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Línea directa para resolver dudas de vuelos, cambios de habitación o emergencias durante tu viaje en cualquier momento.
            </p>
          </div>
        </div>

        {/* Barra de Contacto y Respaldo Institucional */}
        <div className="bg-slate-900 rounded-3xl p-6 sm:p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-[11px] font-bold text-amber-400 uppercase tracking-widest">
              ¿Deseas atención inmediata o cotización especial?
            </span>
            <h4 className="text-xl font-bold">
              Habla directamente con un asesor turístico certificado de Contigo Tours
            </h4>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="https://wa.me/524431866129?text=Hola%20Contigo%20Tours,%20quisiera%20pedir%20informes%20de%20un%20viaje."
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-xs py-3 px-5 rounded-2xl transition flex items-center gap-2 shadow-md"
            >
              <Phone className="w-4 h-4" />
              <span>WhatsApp: +52 443 186 6129</span>
            </a>

            <a
              href="mailto:hugoalex.riverab@gmail.com?subject=Informes%20Contigo%20Tours"
              className="bg-slate-800 hover:bg-slate-700 text-slate-100 font-bold text-xs py-3 px-5 rounded-2xl transition flex items-center gap-2 border border-slate-700"
            >
              <Mail className="w-4 h-4 text-amber-400" />
              <span>hugoalex.riverab@gmail.com</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
