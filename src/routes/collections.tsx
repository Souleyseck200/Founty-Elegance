import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { MATERIALS, type Category, type Material } from "@/lib/products";
import { useStore } from "@/lib/store";
import { convertFromFCFA } from "@/lib/format";

type SpecialCollection = "saga" | "tabaski";
type Search = { category?: Category };

export const Route = createFileRoute("/collections")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    category: s.category as Category | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Collections — Founty Élégance" },
      {
        name: "description",
        content: "Explorez nos boubous, chemises, pantalons, ensembles et accessoires d'exception.",
      },
      { property: "og:title", content: "Collections — Founty Élégance" },
    ],
  }),
  component: Collections,
});

// Map category IDs to official Founty labels
const OFFICIAL_CATEGORIES: { ids: string[]; label: string }[] = [
  { ids: ["boubous", "ensembles"], label: "Vêtement traditionnel" },
  { ids: ["chemises", "pantalons"], label: "Vêtements Européens" },
  { ids: ["accessoires"], label: "Accessoires" },
];

const SPECIAL_COLLECTIONS: { id: SpecialCollection; label: string }[] = [
  { id: "saga", label: "Saga de l'élégance" },
  { id: "tabaski", label: "Tabaski · Laïd" },
];

// Product → special collection mapping (by product name keywords)
function getProductCollection(productName: string): SpecialCollection | null {
  const name = productName.toLowerCase();
  if (name.includes("royal") || name.includes("or") || name.includes("bordeaux")) return "saga";
  if (name.includes("bazin") || name.includes("cérémonie") || name.includes("tabaski")) return "tabaski";
  return null;
}

function Collections() {
  const { category } = Route.useSearch();
  const { currency, products, categories } = useStore();
  const [activeCat, setActiveCat] = useState<string | null>(category ?? null);
  const [activeMat, setActiveMat] = useState<Material | null>(null);
  const [activeSpecial, setActiveSpecial] = useState<SpecialCollection | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(300000);

  const filtered = useMemo(
    () =>
      products.filter((p) => {
        if (activeCat) {
          // Check official category mapping
          const official = OFFICIAL_CATEGORIES.find(o => o.label === activeCat);
          if (official) {
            if (!official.ids.includes(p.category)) return false;
          } else {
            // direct category id match (from URL param)
            if (p.category !== activeCat) return false;
          }
        }
        if (activeMat && p.material !== activeMat) return false;
        if (p.priceFCFA > maxPrice) return false;
        if (activeSpecial && getProductCollection(p.name) !== activeSpecial) return false;
        return true;
      }),
    [products, activeCat, activeMat, maxPrice, activeSpecial],
  );

  const maxConverted = Math.round(convertFromFCFA(maxPrice, currency));

  return (
    <div>
      <section className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-24">
          <p className="ui-label mb-4 text-muted-foreground">
            <Link to="/" className="hover:text-foreground">Accueil</Link>{" "}/ Collections
          </p>
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            {activeCat
              ? activeCat
              : activeSpecial
                ? SPECIAL_COLLECTIONS.find(s => s.id === activeSpecial)?.label
                : "Toute la collection"}
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            {filtered.length} pièces — chaque modèle peut être commandé en taille standard
            ou ajusté à vos mensurations.
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-6 py-16 lg:grid-cols-[240px_1fr] lg:px-12 lg:py-20">
        {/* Filters sidebar */}
        <aside className="space-y-10 lg:sticky lg:top-32 lg:self-start">
          {/* Official Categories */}
          <div>
            <p className="ui-label mb-5">Catégories</p>
            <ul className="space-y-4">
              <li>
                <button
                  onClick={() => { setActiveCat(null); setActiveSpecial(null); }}
                  className={`text-sm transition-colors ${
                    !activeCat && !activeSpecial ? "font-medium text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Toutes les pièces
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCat("Vêtement traditionnel"); setActiveSpecial(null); }}
                  className={`text-left transition-colors ${
                    activeCat === "Vêtement traditionnel" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block text-sm font-medium">Vêtement traditionnel</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed opacity-70">
                    Savoir-faire artisanal sénégalais, motifs et tissus locaux.
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCat("Vêtements Européens"); setActiveSpecial(null); }}
                  className={`text-left transition-colors ${
                    activeCat === "Vêtements Européens" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block text-sm font-medium">Vêtements Européens</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed opacity-70">
                    Styles européens avec une touche sénégalaise.
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCat("Accessoires"); setActiveSpecial(null); }}
                  className={`text-left transition-colors ${
                    activeCat === "Accessoires" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="block text-sm font-medium">Accessoires</span>
                  <span className="mt-0.5 block text-[11px] leading-relaxed opacity-70">
                    Pièces complémentaires, pratiques et esthétiques.
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveCat(null); setActiveSpecial(null); }}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Édition Limitée
                </button>
              </li>
            </ul>
          </div>

          {/* Special Collections */}
          <div>
            <p className="ui-label mb-5">Collections</p>
            <ul className="space-y-2">
              {SPECIAL_COLLECTIONS.map(s => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setActiveSpecial(prev => prev === s.id ? null : s.id);
                      setActiveCat(null);
                    }}
                    className={`flex items-center gap-2 text-sm transition-colors ${
                      activeSpecial === s.id ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span
                      className="inline-block h-1.5 w-1.5 rounded-full"
                      style={{ background: "var(--beige-dore)" }}
                    />
                    {s.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Materials */}
          <div>
            <p className="ui-label mb-5">Matières</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setActiveMat(null)}
                className={`ui-label border px-3 py-2 transition-colors ${
                  !activeMat ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"
                }`}
              >
                Toutes
              </button>
              {MATERIALS.map((m) => (
                <button
                  key={m}
                  onClick={() => setActiveMat(m)}
                  className={`ui-label border px-3 py-2 transition-colors ${
                    activeMat === m ? "border-foreground bg-foreground text-background" : "border-border text-muted-foreground hover:border-foreground"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div>
            <p className="ui-label mb-5">Prix maximum</p>
            <input
              type="range"
              min={40000}
              max={300000}
              step={10000}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-[var(--color-accent)]"
            />
            <p className="mt-2 text-sm tabular-nums text-muted-foreground">
              Jusqu'à{" "}
              <span className="text-foreground">
                {currency === "EUR" ? `${maxConverted} €` : `${maxConverted.toLocaleString("fr-FR")} FCFA`}
              </span>
            </p>
          </div>
        </aside>

        {/* Product grid */}
        <div>
          {filtered.length === 0 ? (
            <div className="flex h-96 items-center justify-center border border-dashed border-border">
              <p className="text-sm text-muted-foreground">Aucune pièce ne correspond à ces critères.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => {
                const col = getProductCollection(p.name);
                return (
                  <div key={p.id} className="relative">
                    {col && (
                      <div className="absolute left-3 top-3 z-10">
                        <span
                          className="inline-block px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider"
                          style={{
                            background: "var(--heritage)",
                            color: "var(--beige-dore)",
                          }}
                        >
                          {col === "saga" ? "Saga de l'élégance" : "Tabaski · Laïd"}
                        </span>
                      </div>
                    )}
                    <ProductCard product={p} />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
