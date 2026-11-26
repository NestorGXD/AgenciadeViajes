"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "¿Por qué debo verificar mi correo electrónico antes de completar una reserva?",
      a: "Por tu seguridad y para garantizar que recibas de inmediato tu comprobante, tickets y claves de acceso al hotel. Una vez registrado, recibirás un enlace de activación seguro enviado a tu bandeja de entrada.",
    },
    {
      q: "¿Cómo se calculan las tarifas para adultos y niños?",
      a: "Nuestro cotizador divide automáticamente la tarifa base: los adultos pagan la tarifa normal (100%) y los niños de 0 a 11 años disfrutan de un 35% de descuento en la tarifa base del destino.",
    },
    {
      q: "¿Qué incluye la preferencia 'Todo Incluido' (All-Inclusive)?",
      a: "Incluye todas las comidas (desayuno, almuerzo, cena buffet o a la carta), snacks continuos, bebidas nacionales e internacionales ilimitadas y acceso a las amenidades del resort (piscinas, shows nocturnos y deportes acuáticos no motorizados).",
    },
    {
      q: "¿Cómo funciona el mapa interactivo de destinos?",
      a: "Puedes explorar visualmente los puntos en el mapa con tecnología OpenStreetMap, hacer clic sobre cualquier marcador para ver precios base y fotos, o seleccionar el destino de la lista sincronizada para centrar el mapa al instante.",
    },
    {
      q: "¿Qué métodos de pago aceptan?",
      a: "Aceptamos todas las tarjetas de crédito y débito (Visa, Mastercard, American Express) procesadas mediante Stripe con cifrado de grado bancario. También contamos con soporte para Mercado Pago en varios países.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-slate-50 border-t border-slate-200/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 bg-brand-100 text-brand-700 text-xs font-bold px-3 py-1 rounded-full mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            Resolviendo tus dudas
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Todo lo que necesitas saber antes de empacar tus maletas con Contigo Tours.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full text-left p-5 flex items-center justify-between gap-4 font-bold text-slate-800 text-sm hover:text-brand-600 transition"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 flex-shrink-0 ${
                      isOpen ? "transform rotate-180 text-brand-600" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
