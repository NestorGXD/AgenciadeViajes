"use client";

import Link from "next/link";
import {
  Sparkles,
  ShieldCheck,
  Award,
  HeartHandshake,
  ArrowRight,
  GraduationCap,
  Phone,
  Mail,
  Compass,
} from "lucide-react";
import HomeLoginCard from "./HomeLoginCard";

export default function HeroSection() {
  const scrollToAbout = () => {
    const el = document.getElementById("nosotros");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="relative pt-8 pb-16 md:pt-16 md:pb-24 overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-slate-50 border-b border-slate-200/60">
      {/* Círculos decorativos de fondo */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-brand-200/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-0 -ml-20 w-80 h-80 rounded-full bg-amber-200/30 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Columna Izquierda: Información Institucional y Bienvenida */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="inline-flex items-center gap-2 bg-brand-100/90 text-brand-800 text-xs font-black px-3.5 py-1.5 rounded-full shadow-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Agencia de Viajes y Operador Turístico Oficial
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              Bienvenido a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-sky-500">
                Contigo Tours
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              Somos tu agencia de confianza para descubrir los mejores destinos de playa, ciudades coloniales y maravillas naturales. Diseñamos itinerarios familiares, corporativos y especializados en <strong>viajes escolares y de graduación</strong> con total seguridad y transparencia.
            </p>

            {/* Accesos Rápidos Principales */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                type="button"
                onClick={scrollToAbout}
                className="bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs sm:text-sm py-3.5 px-6 rounded-2xl shadow-md transition flex items-center gap-2"
              >
                <Compass className="w-4 h-4 text-amber-400" />
                <span>Conocer la Agencia</span>
              </button>

              <Link
                href="/viajes-escolares"
                className="bg-brand-50 hover:bg-brand-100 text-brand-800 font-bold text-xs sm:text-sm py-3.5 px-5 rounded-2xl border border-brand-200 transition flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4 text-brand-600" />
                <span>Viajes Escolares</span>
              </Link>

              <Link
                href="/cotizador"
                className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm py-3.5 px-5 rounded-2xl shadow-md transition flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Cotizador Oficial</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Datos Directos de Contacto para Informes */}
            <div className="p-4 bg-white/90 backdrop-blur-xs rounded-2xl border border-slate-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2 text-slate-700">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-slate-900">Atención a Clientes & Escuelas:</span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="https://wa.me/524431866129"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-extrabold text-emerald-700 hover:text-emerald-800 flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>+52 443 186 6129</span>
                </a>
                <span className="text-slate-300">•</span>
                <a
                  href="mailto:hugoalex.riverab@gmail.com"
                  className="font-extrabold text-brand-700 hover:text-brand-800 flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>hugoalex.riverab@gmail.com</span>
                </a>
              </div>
            </div>

            {/* Badges de Confianza */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-200/70">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-xs sm:text-sm">Stripe Checkout</span>
                  <span className="text-[10px] text-slate-500">Cobros 100% Seguros</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold flex-shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-xs sm:text-sm">+18,000</span>
                  <span className="text-[10px] text-slate-500">Viajeros Asistidos</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold flex-shrink-0">
                  <HeartHandshake className="w-4 h-4" />
                </div>
                <div>
                  <span className="block font-black text-slate-900 text-xs sm:text-sm">4.9 / 5.0</span>
                  <span className="text-[10px] text-slate-500">Satisfacción Comprobada</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Tarjeta de Inicio de Sesión Integrada */}
          <div className="lg:col-span-5">
            <HomeLoginCard />
          </div>
        </div>
      </div>
    </section>
  );
}
