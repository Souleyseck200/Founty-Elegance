import { createFileRoute } from "@tanstack/react-router";
import heroImg from "@/assets/hero-boubou.jpg";
import { Mail, Phone, MapPin, Globe } from "lucide-react";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "À propos — Founty Élégance" },
      {
        name: "description",
        content:
          "Fondée en 2019, Founty est une maison de couture sénégalaise innovante, dédiée à la création de vêtements alliant traditions africaines et influences européennes.",
      },
      { property: "og:title", content: "À propos — Founty Élégance" },
      { property: "og:image", content: "/og-about.jpg" },
    ],
  }),
  component: About,
});

const HERITAGE = "#3D2B1F";
const BEIGE = "#D4B982";

function About() {
  return (
    <div>

      {/* ── HERO ── */}
      <section className="border-b border-border" style={{ background: HERITAGE }}>
        <div className="mx-auto max-w-[1440px] px-6 py-20 lg:px-12 lg:py-32">
          <p className="ui-label mb-6" style={{ color: BEIGE }}>— Maison Founty · Depuis 2019</p>
          <h1 className="max-w-4xl font-serif text-[clamp(2.5rem,5vw,4.5rem)] leading-[1.1] text-white">
            Founty – L'Alliance de l'
            <span className="italic" style={{ color: BEIGE }}>Élégance</span>
          </h1>
          <p className="mt-6 max-w-xl text-base font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.75)" }}>
            Maison de couture sénégalaise innovante alliant traditions culturelles africaines
            et influences européennes contemporaines.
          </p>
        </div>
      </section>

      {/* ── QUI SOMMES-NOUS ── */}
      <section className="mx-auto grid max-w-[1440px] gap-16 px-6 py-24 lg:grid-cols-12 lg:px-12">
        <div className="lg:col-span-7">
          <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: "4 / 5" }}>
            <img src={heroImg} alt="Atelier Founty" className="absolute inset-0 h-full w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="mb-6 h-px w-12" style={{ background: BEIGE }} />
          <p className="ui-label mb-4" style={{ color: BEIGE }}>Qui sommes-nous ?</p>
          <h2 className="font-serif text-3xl leading-tight md:text-4xl">
            Coupé, brodé, fini à la main — à Dakar.
          </h2>
          <div className="mt-8 space-y-5 text-base font-light leading-relaxed text-muted-foreground">
            <p>
              Fondée en 2019, Founty est une maison de couture sénégalaise innovante, dédiée à la création de vêtements qui allient les traditions culturelles africaines et les influences européennes contemporaines.
            </p>
            <p>
              Notre marque s'inspire à la fois de l'héritage artisanal du Sénégal et des tendances modernes du monde entier.
            </p>
          </div>
        </div>
      </section>

      {/* ── NOTRE VISION ── */}
      <section style={{ background: HERITAGE }}>
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <div className="mb-6 h-px w-12" style={{ background: BEIGE }} />
              <p className="ui-label mb-4" style={{ color: BEIGE }}>Notre Vision</p>
              <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
                Un leader mondial de la mode sénégalaise.
              </h2>
            </div>
            <div>
              <p className="text-lg font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
                Nous aspirons à devenir un leader mondial dans l'industrie de la mode, en permettant à chacun de découvrir la beauté des vêtements traditionnels et contemporains. Founty a pour mission de transformer la mode sénégalaise et européenne en une référence mondiale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENGAGEMENT ── */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <div className="mb-6 h-px w-12" style={{ background: BEIGE }} />
            <p className="ui-label mb-4" style={{ color: BEIGE }}>Engagement</p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">
              Artisans locaux &amp; pratiques durables.
            </h2>
            <p className="mt-6 text-base font-light leading-relaxed text-muted-foreground">
              Chez Founty, nous mettons un point d'honneur à travailler avec des artisans locaux et à promouvoir des pratiques durables. Chaque pièce est réalisée avec soin, dans le respect de la qualité et de l'authenticité.
            </p>
          </div>

          {/* Piliers */}
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-1 lg:gap-6">
            {[
              { n: "I",   t: "Vous transmettez", d: "Mensurations, inspiration, occasion. Nous écoutons." },
              { n: "II",  t: "Nous taillons",     d: "Patron unique, coupe au gabarit, broderie main." },
              { n: "III", t: "Vous portez",       d: "Livraison protégée, livret d'entretien inclus." },
            ].map((s) => (
              <div key={s.n} className="flex items-start gap-5 border-t pt-5" style={{ borderColor: BEIGE }}>
                <span className="font-serif text-3xl" style={{ color: BEIGE }}>{s.n}</span>
                <div>
                  <h3 className="font-serif text-lg">{s.t}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{s.d}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRODUITS / CATÉGORIES ── */}
      <section style={{ background: "var(--surface)" }}>
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12">
          <div className="mb-12">
            <div className="mb-6 h-px w-12" style={{ background: BEIGE }} />
            <p className="ui-label mb-4" style={{ color: BEIGE }}>Nos Collections</p>
            <h2 className="font-serif text-3xl leading-tight md:text-4xl">Trois univers, un savoir-faire.</h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Vêtements Traditionnels",
                text: "Des créations qui mettent en valeur le savoir-faire artisanal sénégalais, avec des designs inspirés des motifs et des tissus locaux.",
              },
              {
                title: "Vêtements Européens",
                text: "Une gamme de vêtements contemporains qui fusionne les styles européens avec une touche sénégalaise, parfaite pour ceux qui recherchent l'élégance.",
              },
              {
                title: "Accessoires",
                text: "Des pièces complémentaires qui rehaussent le style de nos collections, à la fois pratiques et esthétiques.",
              },
            ].map((c) => (
              <div key={c.title} className="border-t-2 pt-6" style={{ borderColor: BEIGE }}>
                <h3 className="font-serif text-xl" style={{ color: HERITAGE }}>{c.title}</h3>
                <p className="mt-3 text-sm font-light leading-relaxed text-muted-foreground">{c.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section style={{ background: HERITAGE }}>
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12">
          <div className="mb-12">
            <div className="mb-6 h-px w-12" style={{ background: BEIGE }} />
            <p className="ui-label mb-4" style={{ color: BEIGE }}>Contact</p>
            <h2 className="font-serif text-4xl leading-tight text-white">Votre atelier à Dakar.</h2>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            <ContactItem icon={<Phone className="h-5 w-5" />} label="Téléphone" value="+221 75 557 54 38" href="tel:+221755575438" />
            <ContactItem icon={<Mail className="h-5 w-5" />} label="Email" value="fountyelegance@gmail.com" href="mailto:fountyelegance@gmail.com" />
            <ContactItem icon={<MapPin className="h-5 w-5" />} label="Adresse" value="Dakar, Almadie 2" href="https://maps.google.com/?q=Almadies+Dakar+Senegal" />
            <ContactItem icon={<Globe className="h-5 w-5" />} label="Web" value="www.fountyelegance.com" href="https://www.fountyelegance.com" />
          </div>
        </div>
      </section>

    </div>
  );
}

function ContactItem({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="group flex items-start gap-4 transition-opacity hover:opacity-80">
      <div className="mt-0.5 shrink-0 rounded-full p-2.5" style={{ background: BEIGE, color: HERITAGE }}>
        {icon}
      </div>
      <div>
        <p className="text-[11px] uppercase tracking-wider" style={{ color: BEIGE }}>{label}</p>
        <p className="mt-1 font-light text-white">{value}</p>
      </div>
    </a>
  );
}
