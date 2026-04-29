import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useStore } from "@/lib/store";
import { OFFICIAL_CATALOGS } from "@/lib/officialCatalogs";
import { Sparkles, ShoppingBag, User, Menu, X, ChevronDown } from "lucide-react";
import logoFounty from "@/assets/logo-founty.png";

export function Header() {
  const { cartCount, setCartOpen, openOrder, currency, setCurrency } = useStore();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collectionsOpen, setCollectionsOpen] = useState(false);
  const { location } = useRouterState();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setCollectionsOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`sticky top-0 z-40 w-full border-b border-border/70 backdrop-blur-md transition-[height,background-color] duration-500 ${
        scrolled ? "h-[64px] bg-background/85" : "h-[96px] bg-background/95"
      }`}
    >
      <div className="mx-auto flex h-full max-w-[1440px] items-center justify-between gap-6 px-6 lg:px-12">
        {/* Left: currency + nav */}
        <div className="flex items-center gap-8">
          <div className="hidden items-center gap-1 md:flex">
            <button
              onClick={() => setCurrency("FCFA")}
              className={`ui-label px-2 py-1 transition-colors ${
                currency === "FCFA" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              FCFA
            </button>
            <span className="text-muted-foreground">/</span>
            <button
              onClick={() => setCurrency("EUR")}
              className={`ui-label px-2 py-1 transition-colors ${
                currency === "EUR" ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              EUR
            </button>
          </div>
          <nav className="hidden items-center gap-7 lg:flex">
            <Link
              to="/"
              className="ui-label text-foreground transition-opacity hover:opacity-60"
              activeProps={{ className: "ui-label text-foreground border-b border-foreground" }}
              activeOptions={{ exact: true }}
            >
              Accueil
            </Link>
            <div
              className="relative"
              onMouseEnter={() => setCollectionsOpen(true)}
              onMouseLeave={() => setCollectionsOpen(false)}
            >
              <Link
                to="/collections"
                className="ui-label flex items-center gap-1 text-foreground transition-opacity hover:opacity-60"
              >
                Collections <ChevronDown className="h-3 w-3" />
              </Link>
              {collectionsOpen && (
                <div className="fade-in absolute left-1/2 top-full -translate-x-1/2 pt-3">
                  <div className="min-w-[260px] border border-border bg-background py-3 shadow-[var(--shadow-editorial)]">
                    <Link
                      to="/collections"
                      className="block px-5 py-2 font-serif text-base text-foreground transition-colors hover:bg-surface"
                    >
                      Toute la collection
                    </Link>
                    <div className="mx-3 my-2 border-t border-border" />
                    <p className="px-5 pb-1 pt-1 ui-label text-muted-foreground">Catalogues officiels</p>
                    {OFFICIAL_CATALOGS.map((c) => (
                      <Link
                        key={c.label}
                        to="/collections"
                        search={{ category: c.label }}
                        className="block px-5 py-2 font-serif text-base text-foreground transition-colors hover:bg-surface"
                      >
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <Link
              to="/about"
              className="ui-label text-foreground transition-opacity hover:opacity-60"
              activeProps={{ className: "ui-label text-foreground border-b border-foreground" }}
            >
              À propos
            </Link>
          </nav>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="lg:hidden"
            aria-label="Menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Center logo */}
        <Link
          to="/"
          aria-label="Founty Élégance — Accueil"
          className={`absolute left-1/2 flex -translate-x-1/2 items-center gap-2 transition-all duration-500 ${
            scrolled ? "text-xl" : "text-2xl"
          }`}
        >
          <img
            src={logoFounty}
            alt="Founty Élégance"
            className={`w-auto object-contain transition-all duration-500 ${
              scrolled ? "h-9" : "h-12"
            }`}
          />
          <span className="font-serif">
            <span className="tracking-tight text-foreground">Founty</span>{" "}
            <span className="italic text-accent">Élégance</span>
          </span>
        </Link>

        {/* Right */}
        <div className="flex items-center gap-3 sm:gap-5">
          <button
            onClick={() => openOrder(null)}
            className="ui-label group hidden items-center gap-2 border border-foreground px-4 py-2 text-foreground transition-colors hover:bg-foreground hover:text-background sm:inline-flex"
          >
            <Sparkles className="h-3.5 w-3.5 text-accent group-hover:text-accent" />
            Sur Mesure
          </button>
          <Link to="/profil" aria-label="Compte" className="p-1 text-foreground hover:opacity-60">
            <User className="h-5 w-5" />
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            aria-label="Panier"
            className="relative p-1 text-foreground hover:opacity-60"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center bg-accent px-1 text-[10px] font-medium tabular-nums text-foreground">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fade-in absolute left-0 right-0 top-full border-t border-border bg-background lg:hidden">
          <nav className="flex flex-col px-6 py-6">
            <Link to="/" className="py-3 font-serif text-2xl text-foreground">
              Accueil
            </Link>
            <div className="border-t border-border py-3">
              <p className="ui-label mb-3 text-muted-foreground">Collections</p>
              <Link to="/collections" className="block py-2 font-serif text-lg text-foreground">
                Toute la collection
              </Link>
              <p className="ui-label mb-2 mt-4 text-muted-foreground">Catalogues officiels</p>
              {OFFICIAL_CATALOGS.map((c) => (
                <Link
                  key={c.label}
                  to="/collections"
                  search={{ category: c.label }}
                  className="block py-2 font-serif text-lg text-foreground"
                >
                  {c.label}
                </Link>
              ))}
            </div>
            <Link to="/about" className="border-t border-border py-3 font-serif text-2xl">
              À propos
            </Link>
            <button
              onClick={() => {
                openOrder(null);
                setMobileOpen(false);
              }}
              className="btn-editorial btn-gold mt-4 w-full"
            >
              <Sparkles className="h-3.5 w-3.5" /> Sur Mesure
            </button>
            <div className="mt-4 flex items-center gap-2 border-t border-border pt-4">
              <button
                onClick={() => setCurrency("FCFA")}
                className={`ui-label px-3 py-1 ${currency === "FCFA" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                FCFA
              </button>
              <button
                onClick={() => setCurrency("EUR")}
                className={`ui-label px-3 py-1 ${currency === "EUR" ? "bg-foreground text-background" : "text-muted-foreground"}`}
              >
                EUR
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
