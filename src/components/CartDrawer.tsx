import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { Link } from "@tanstack/react-router";
import { X, Minus, Plus } from "lucide-react";
import { useEffect } from "react";

export function CartDrawer() {
  const {
    items,
    cartOpen,
    setCartOpen,
    removeFromCart,
    updateQty,
    cartTotalFCFA,
    currency,
  } = useStore();

  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [cartOpen]);

  return (
    <>
      <div
        onClick={() => setCartOpen(false)}
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-500 ${
          cartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-[480px] flex-col bg-background shadow-[var(--shadow-editorial)] transition-transform duration-500 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.25,1,0.5,1)" }}
        aria-hidden={!cartOpen}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <p className="ui-label">Votre Sélection ({items.length})</p>
          <button onClick={() => setCartOpen(false)} aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="font-serif text-3xl text-foreground">Votre sélection est vide.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Découvrez nos pièces signées Founty Élégance.
              </p>
              <Link
                to="/collections"
                onClick={() => setCartOpen(false)}
                className="btn-editorial btn-primary mt-8"
              >
                Explorer la collection
              </Link>
            </div>
          ) : (
            <ul className="flex flex-col gap-6">
              {items.map((item) => (
                <li key={item.id} className="flex gap-4 border-b border-border pb-6">
                  <div className="h-28 w-24 shrink-0 overflow-hidden bg-surface">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <div className="flex justify-between gap-2">
                      <h3 className="font-serif text-lg leading-tight">{item.product.name}</h3>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        aria-label="Retirer"
                        className="text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="ui-label mt-1 text-muted-foreground">Taille {item.size}</p>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="px-2 py-1 hover:bg-surface"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="px-2 py-1 hover:bg-surface"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <p className="text-base tabular-nums">
                        {formatPrice(item.product.priceFCFA * item.quantity, currency)}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-border px-6 py-6">
            <div className="mb-5 flex items-baseline justify-between">
              <p className="ui-label">Sous-total</p>
              <p className="font-serif text-2xl tabular-nums">
                {formatPrice(cartTotalFCFA, currency)}
              </p>
            </div>
            <Link
              to="/checkout"
              onClick={() => setCartOpen(false)}
              className="btn-editorial btn-primary w-full"
            >
              Passer commande
            </Link>
            <p className="ui-label mt-4 text-center text-muted-foreground">
              Livraison calculée au paiement
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
