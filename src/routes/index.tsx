import { createFileRoute, Link } from "@tanstack/react-router";
import { ProductCard } from "@/components/ProductCard";
import { Sparkles, ArrowUpRight } from "lucide-react";
import { useStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase";
import heroImg from "@/assets/DSC04232_(2).jpg";
import ctaImg from "@/assets/DSC04243@1x_1-1.jpg";
import { LookbookAlbum } from "@/components/LookbookAlbum";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Founty Élégance — Mode traditionnelle d'exception" },
      {
        name: "description",
        content:
          "Boubous, ensembles et chemises haut de gamme. Sur-mesure ou prêt-à-porter, signés à Dakar.",
      },
      { property: "og:title", content: "Founty Élégance" },
      {
        property: "og:description",
        content: "L'élégance sénégalaise, sur-mesure ou prêt-à-porter.",
      },
    ],
  }),
  component: Home,
});

type LookbookItem = { id: string; image_url: string };

function Home() {
  const { openOrder, products, categories } = useStore();
  const featured = products.slice(0, 4);
  const [lookbook, setLookbook] = useState<LookbookItem[]>([]);

  useEffect(() => {
    supabase.from("lookbook").select("id,image_url").order("created_at", { ascending: false }).limit(6)
      .then(({ data }) => { if (data) setLookbook(data as LookbookItem[]); });
  }, []);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-0 lg:grid-cols-12">
          <div className="reveal flex flex-col justify-center px-6 py-20 lg:col-span-5 lg:px-12 lg:py-32">
            <p className="ui-label mb-6" style={{ color: "var(--beige-dore)" }}>Maison de couture sénégalaise · Depuis 2019</p>
            <h1 className="font-serif text-[clamp(2.75rem,6vw,5rem)] leading-[1.05] tracking-tight">
              Founty – L'Alliance de l'​<span style={{ color: "var(--heritage)" }}>Elégance</span>
            </h1>
            <p className="mt-8 max-w-md text-base font-light leading-relaxed text-muted-foreground">
              Maison de couture sénégalaise innovante alliant traditions culturelles africaines
              et influences européennes contemporaines.
            </p>
            <div className="mt-10 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
              <Link
                to="/collections"
                className="btn-editorial"
                style={{ background: "var(--heritage)", color: "var(--beige-dore)" }}
              >
                Découvrir la Collection
              </Link>
              <button onClick={() => openOrder(null)} className="btn-editorial btn-outline">
                <Sparkles className="h-4 w-4" /> Créer sur-mesure
              </button>
            </div>

            <div className="mt-16 grid grid-cols-3 gap-6 border-t border-border pt-10 lg:max-w-md">
              <Stat label="Pièces uniques" value="120+" />
              <Stat label="Pays livrés" value="18" />
              <Stat label="Fondée en" value="2019" />
            </div>
          </div>

          <div className="relative lg:col-span-7">
            <div
              className="clip-up relative w-full overflow-hidden bg-surface"
              style={{ animationDelay: "100ms" }}
            >
              <img
                src={heroImg}
                alt="Modèle vêtu d'un boubou cérémonie en bazin or"
                className="w-full h-auto block"
                style={{ maxHeight: "100vh", objectFit: "contain", objectPosition: "center top" }}
              />
              
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="mb-14 flex items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="ui-label mb-3 text-muted-foreground">— Univers</p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">Tradition &amp; Modernité</h2>
            <p className="mt-3 max-w-lg text-sm font-light text-muted-foreground">
              Du savoir-faire artisanal sénégalais aux influences européennes contemporaines.
            </p>
          </div>
          <Link to="/collections" className="ui-label hidden items-center gap-2 text-foreground hover:text-accent md:flex">
            Voir tout <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5 lg:gap-6">
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/collections"
              search={{ category: c.id } as never}
              className="product-card group flex flex-col"
            >
              <div className="relative overflow-hidden bg-surface" style={{ aspectRatio: "3 / 4" }}>
                <img
                  src={c.image}
                  alt={c.label}
                  loading="lazy"
                  className="product-image absolute inset-0 h-full w-full object-cover"
                />
              </div>
              <p className="mt-4 font-serif text-lg leading-tight">{c.label}</p>
              <p className="mt-1 text-xs text-muted-foreground">{c.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="bg-surface">
        <div className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
          <div className="mb-14 flex items-end justify-between gap-6 border-b border-border pb-8">
            <div>
              <p className="ui-label mb-3 text-muted-foreground">— Les essentiels</p>
              <h2 className="font-serif text-4xl leading-tight md:text-5xl">Pièces les plus convoitées</h2>
            </div>
            <Link to="/collections" className="ui-label hidden items-center gap-2 text-foreground hover:text-accent md:flex">
              Toute la collection <ArrowUpRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* LOOKBOOK */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
        <div className="mb-14 flex items-end justify-between gap-6 border-b border-border pb-8">
          <div>
            <p className="ui-label mb-3" style={{ color: "var(--beige-dore)" }}>— Lookbook</p>
            <h2 className="font-serif text-4xl leading-tight md:text-5xl">L'atelier en images</h2>
          </div>
        </div>

        {lookbook.length === 0 ? (
          <div
            className="flex h-64 items-center justify-center border"
            style={{ borderColor: "var(--beige-dore)", background: "var(--surface)" }}
          >
            <div className="text-center">
              <p className="font-serif text-2xl" style={{ color: "var(--heritage)" }}>Founty Élégance</p>
              <p className="mt-2 text-sm text-muted-foreground">Le lookbook sera bientôt disponible.</p>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: [0.25, 1, 0.5, 1] }}
          >
            <LookbookAlbum photos={lookbook} />
          </motion.div>
        )}
      </section>

      {/* CUSTOM CTA */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 lg:px-12 lg:py-32">
        <div
          className="relative grid items-center gap-12 overflow-hidden p-10 text-background lg:grid-cols-2 lg:p-20"
        >
          {/* Photo de fond */}
          <img
            src={ctaImg}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Overlay couleur heritage */}
          <div
            className="absolute inset-0"
            style={{ background: "var(--heritage)", opacity: 0.55 }}
          />
          {/* Contenu — z-index pour passer au-dessus de l'overlay */}
          <div className="relative z-10">
            <p className="ui-label mb-5" style={{ color: "var(--beige-dore)" }}>— Atelier sur-mesure</p>
            <h2 className="font-serif text-4xl leading-tight text-white md:text-5xl">
              Vos mensurations.
              <br />
              Notre savoir-faire.
            </h2>
            <p className="mt-6 max-w-md font-light leading-relaxed" style={{ color: "rgba(255,255,255,0.78)" }}>
              En quatre étapes, transmettez vos mesures à notre atelier. Nos couturiers
              vous confectionnent une pièce unique, livrée sous 21 jours.
            </p>
          </div>
          <div className="relative z-10 lg:text-right">
            <button
              onClick={() => openOrder(null)}
              className="btn-editorial"
              style={{ background: "var(--beige-dore)", color: "var(--heritage)" }}
            >
              <Sparkles className="h-4 w-4" /> Démarrer ma commande
            </button>
            <p className="ui-label mt-4" style={{ color: "rgba(255,255,255,0.5)" }}>Aucun paiement requis</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-serif text-2xl tabular-nums">{value}</p>
      <p className="ui-label mt-1 text-muted-foreground">{label}</p>
    </div>
  );
}
