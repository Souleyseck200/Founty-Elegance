import type { Product } from "@/lib/products";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { ProductImageSlider } from "./ProductImageSlider";

export function ProductCard({ product }: { product: Product }) {
  const { openOrder, currency } = useStore();
  const images = product.images?.length ? product.images : [product.image];
  return (
    <div className="product-card group flex flex-col">
      <div
        className="relative w-full overflow-hidden bg-surface"
        onClick={(e) => {
          // Prevent triggering when interacting with slider controls
          const target = e.target as HTMLElement;
          if (target.closest("button")) return;
          openOrder(product);
        }}
        style={{ cursor: "pointer" }}
      >
        <ProductImageSlider images={images} alt={product.name} variant="card" aspect="4 / 5" />
        <span className="pointer-events-none absolute inset-x-0 top-0 z-0 flex items-center justify-center pt-[40%] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="ui-label bg-foreground px-6 py-3 text-background">Voir la pièce</span>
        </span>
      </div>
      <div className="flex items-start justify-between gap-4 pt-5">
        <div className="min-w-0">
          <h3 className="font-serif text-lg leading-tight text-foreground">{product.name}</h3>
          <p className="ui-label mt-2 text-muted-foreground">{product.material}</p>
        </div>
        <p className="shrink-0 font-sans text-base tabular-nums text-foreground">
          {formatPrice(product.priceFCFA, currency)}
        </p>
      </div>
      <button
        onClick={() => openOrder(product)}
        className="btn-editorial btn-primary mt-5 w-full"
      >
        Commander
      </button>
    </div>
  );
}
