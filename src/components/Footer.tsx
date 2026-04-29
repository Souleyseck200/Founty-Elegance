import { Link } from "@tanstack/react-router";
import logoFounty from "@/assets/logo-founty.png";
import { Phone, Mail, MapPin, Globe, Instagram } from "lucide-react";

const BEIGE = "#D4B982";
const HERITAGE = "#3D2B1F";

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border text-background" style={{ background: HERITAGE }}>
      <div className="mx-auto max-w-[1440px] px-6 pb-6 pt-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-4">

          {/* Maison */}
          <div>
            <p className="ui-label mb-5" style={{ color: BEIGE }}>Maison</p>
            <ul className="space-y-3 font-light text-white/80">
              <li><Link to="/about" className="transition-colors hover:text-white" style={{ color: "inherit" }}>À propos</Link></li>
              <li><a href="#" className="transition-colors hover:text-white">L'atelier</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Sur-mesure</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Journal</a></li>
            </ul>
          </div>

          {/* Boutique */}
          <div>
            <p className="ui-label mb-5" style={{ color: BEIGE }}>Boutique</p>
            <ul className="space-y-3 font-light text-white/80">
              <li><Link to="/collections" className="transition-colors hover:text-white">Collections</Link></li>
              <li><a href="#" className="transition-colors hover:text-white">Nouveautés</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Édition Limitée</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Cartes cadeau</a></li>
            </ul>
          </div>

          {/* Service */}
          <div>
            <p className="ui-label mb-5" style={{ color: BEIGE }}>Service</p>
            <ul className="space-y-3 font-light text-white/80">
              <li><a href="#" className="transition-colors hover:text-white">Livraison</a></li>
              <li><a href="#" className="transition-colors hover:text-white">Retours</a></li>
              <li><Link to="/about" className="transition-colors hover:text-white">Contact</Link></li>
              <li><a href="#" className="transition-colors hover:text-white">FAQ</a></li>
            </ul>
          </div>

          {/* Contact réel */}
          <div>
            <p className="ui-label mb-5" style={{ color: BEIGE }}>Contact</p>
            <ul className="space-y-3 font-light text-white/80">
              <li>
                <a href="tel:+221755575438" className="flex items-center gap-2 transition-colors hover:text-white">
                  <Phone className="h-3.5 w-3.5 shrink-0" style={{ color: BEIGE }} />
                  +221 75 557 54 38
                </a>
              </li>
              <li>
                <a href="mailto:fountyelegance@gmail.com" className="flex items-center gap-2 transition-colors hover:text-white">
                  <Mail className="h-3.5 w-3.5 shrink-0" style={{ color: BEIGE }} />
                  fountyelegance@gmail.com
                </a>
              </li>
              <li>
                <a href="https://maps.google.com/?q=Almadies+Dakar" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
                  <MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: BEIGE }} />
                  Dakar, Almadie 2
                </a>
              </li>
              <li>
                <a href="https://www.fountyelegance.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 transition-colors hover:text-white">
                  <Globe className="h-3.5 w-3.5 shrink-0" style={{ color: BEIGE }} />
                  www.fountyelegance.com
                </a>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="mt-6 flex items-center gap-4">
              <a
                href="https://instagram.com/fountyelegance"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-white/10"
                style={{ borderColor: BEIGE, color: BEIGE }}
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://wa.me/221755575438"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-white/10"
                style={{ borderColor: BEIGE, color: BEIGE }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.121 1.531 5.849L0 24l6.318-1.508A11.955 11.955 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.882a9.875 9.875 0 01-5.03-1.374l-.361-.214-3.741.981.999-3.648-.235-.374A9.877 9.877 0 012.118 12C2.118 6.533 6.533 2.118 12 2.118S21.882 6.533 21.882 12 17.467 21.882 12 21.882z"/>
                </svg>
              </a>
              <a
                href="https://tiktok.com/@fountyelegance"
                target="_blank"
                rel="noreferrer"
                aria-label="TikTok"
                className="flex h-9 w-9 items-center justify-center rounded-full border transition-colors hover:bg-white/10"
                style={{ borderColor: BEIGE, color: BEIGE }}
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.94a8.16 8.16 0 004.77 1.52V7.01a4.85 4.85 0 01-1-.32z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Big wordmark */}
        <div className="mt-20 flex flex-col items-center gap-6 border-t pt-12" style={{ borderColor: "rgba(212,185,130,0.2)" }}>
          <img src={logoFounty} alt="Founty Élégance" className="h-40 w-auto object-contain md:h-52" style={{ filter: "brightness(0) invert(1)" }} />
          <h2 className="text-center font-serif text-[14vw] leading-none tracking-tight md:text-[10vw]">
            <span className="text-white">Founty</span>{" "}
            <span className="italic" style={{ color: BEIGE }}>Élégance</span>
          </h2>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 text-xs md:flex-row" style={{ color: "rgba(255,255,255,0.45)" }}>
          <p>© {new Date().getFullYear()} Founty Élégance. Tous droits réservés. — Dakar, Almadie 2</p>
          <div className="flex items-center gap-4">
            <Link to="/admin" className="ui-label tracking-widest transition-colors hover:text-white" style={{ color: BEIGE }}>
              Vue Admin
            </Link>
            <p className="ui-label tracking-widest">Mode traditionnelle d'exception</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
