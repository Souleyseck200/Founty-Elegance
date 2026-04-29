import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  images: string[];
  alt: string;
  /** "card" = compact (in product card), "detail" = larger (drawer) */
  variant?: "card" | "detail";
  /** Aspect ratio. Defaults to 4/5. */
  aspect?: string;
};

/**
 * Touch-friendly image slider with arrows + dots.
 * Uses native scroll-snap so swipe gestures work on mobile.
 */
export function ProductImageSlider({ images, alt, variant = "card", aspect = "4 / 5" }: Props) {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const safeImages = images && images.length > 0 ? images : [];
  const count = safeImages.length;

  // Sync index with scroll position
  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = el.clientWidth;
        if (w === 0) return;
        const i = Math.round(el.scrollLeft / w);
        setIndex((prev) => (prev === i ? prev : i));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const goTo = (i: number) => {
    const el = trackRef.current;
    if (!el) return;
    const clamped = Math.max(0, Math.min(count - 1, i));
    el.scrollTo({ left: clamped * el.clientWidth, behavior: "smooth" });
    setIndex(clamped);
  };

  const arrowSize = variant === "detail" ? "h-10 w-10" : "h-9 w-9";

  if (count === 0) {
    return (
      <div
        className="flex w-full items-center justify-center bg-surface text-xs text-muted-foreground"
        style={{ aspectRatio: aspect }}
      >
        Aucune image
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: aspect }}>
      <div
        ref={trackRef}
        className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {safeImages.map((src, i) => (
          <div key={i} className="relative h-full w-full shrink-0 snap-center">
            <img
              src={src}
              alt={`${alt} — vue ${i + 1}`}
              loading="lazy"
              className="h-full w-full object-cover"
              draggable={false}
            />
          </div>
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Image précédente"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(index - 1);
            }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 ${arrowSize} flex items-center justify-center bg-background/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-background group-hover:opacity-100 disabled:opacity-0`}
            disabled={index === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            aria-label="Image suivante"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              goTo(index + 1);
            }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 ${arrowSize} flex items-center justify-center bg-background/85 text-foreground opacity-0 backdrop-blur-sm transition-opacity duration-200 hover:bg-background group-hover:opacity-100 disabled:opacity-0`}
            disabled={index === count - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </button>

          <div className="pointer-events-none absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5">
            {safeImages.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Aller à l'image ${i + 1}`}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goTo(i);
                }}
                className={`pointer-events-auto h-1.5 transition-all duration-300 ${
                  i === index ? "w-6 bg-background" : "w-1.5 bg-background/60 hover:bg-background"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
