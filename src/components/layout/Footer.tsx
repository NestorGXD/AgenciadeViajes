import Link from "next/link";
import { Plane, Mail, Phone, MapPin, Shield, CreditCard, Heart } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 pt-16 pb-12 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Marca e info general */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold">
                <Plane className="w-5 h-5 -rotate-45" />
              </div>
              <span className="text-xl font-black text-white">
                Contigo <span className="text-brand-400">Tours</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Tu agencia de viajes líder en experiencias memorables, paquetes todo incluido y atención personalizada 24/7 en los mejores destinos de México, Colombia y el Caribe.
            </p>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                <Shield className="w-3.5 h-3.5 text-emerald-400" /> Reservas 100% Protegidas
              </span>
              <span className="inline-flex items-center gap-1 bg-slate-900 px-2.5 py-1 rounded-md border border-slate-800">
                <CreditCard className="w-3.5 h-3.5 text-brand-400" /> Stripe Seguro
              </span>
            </div>
          </div>

          {/* Enlaces Rápidos */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Explorar
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition">Inicio</Link>
              </li>
              <li>
                <Link href="/destinations" className="hover:text-white transition">Mapa de Destinos</Link>
              </li>
              <li>
                <Link href="/cotizador" className="hover:text-white transition">Cotizador de Viajes</Link>
              </li>
              <li>
                <Link href="/viajes-escolares" className="hover:text-amber-400 font-bold transition">🎒 Viajes Escolares</Link>
              </li>
              <li>
                <Link href="/client" className="hover:text-white transition">Portal de Clientes</Link>
              </li>
            </ul>
          </div>

          {/* Destinos Populares */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Destinos Clave
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link href="/destinations/cancun-riviera-maya" className="hover:text-white transition">Cancún y Riviera Maya</Link></li>
              <li><Link href="/destinations/ciudad-de-mexico-cdmx" className="hover:text-white transition">Ciudad de México</Link></li>
              <li><Link href="/destinations/cartagena-de-indias" className="hover:text-white transition">Cartagena de Indias</Link></li>
              <li><Link href="/destinations/medellin-eterna-primavera" className="hover:text-white transition">Medellín</Link></li>
              <li><Link href="/destinations/cusco-machu-picchu" className="hover:text-white transition">Cusco y Machu Picchu</Link></li>
            </ul>
          </div>

          {/* Contacto */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-wider mb-4">
              Atención y Contacto
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="https://wa.me/524431866129"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-400 font-bold block"
                  >
                    WhatsApp: +52 443 186 6129
                  </a>
                  <span className="text-[11px] text-slate-500">Atención personalizada y viajes escolares</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <div>
                  <a
                    href="mailto:hugoalex.riverab@gmail.com"
                    className="hover:text-white font-bold block text-slate-300"
                  >
                    hugoalex.riverab@gmail.com
                  </a>
                  <span className="text-[11px] text-slate-500">Informes y cotizaciones</span>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-brand-400 flex-shrink-0 mt-0.5" />
                <span>Av. Bonampak 77, Zona Hotelera, Cancún, Q.R., México</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Barra de Copyright */}
        <div className="pt-8 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Contigo Tours Inc. Todos los derechos reservados.</p>
          <p className="flex items-center gap-1">
            Hecho con <Heart className="w-3 h-3 text-rose-500 fill-rose-500" /> para viajeros apasionados
          </p>
        </div>
      </div>
    </footer>
  );
}
