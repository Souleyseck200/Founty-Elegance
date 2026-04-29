import { createContext, useCallback, useContext, useMemo, useState, useEffect, type ReactNode } from "react";
import { PRODUCTS as INITIAL_PRODUCTS, CATEGORIES as INITIAL_CATEGORIES, type Product, type Size, type Category as CatType } from "./products";
import { supabase } from "./supabase";
import type { Currency } from "./format";

export type CartItem = {
  id: string; // product id + size
  product: Product;
  size: Size;
  quantity: number;
};

type StoreContextValue = {
  // Products catalog (shared between client store and admin)
  products: Product[];
  categories: { id: string; label: string; image: string; tagline: string }[];
  upsertProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  upsertCategory: (c: { id: string; label: string; image: string; tagline: string }) => void;
  deleteCategory: (id: string) => void;
  // Cart
  items: CartItem[];
  addToCart: (product: Product, size: Size) => void;
  removeFromCart: (id: string) => void;
  updateQty: (id: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotalFCFA: number;
  // Cart drawer
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  // Order drawer (hybrid)
  orderProduct: Product | null;
  openOrder: (p: Product | null) => void;
  closeOrder: () => void;
  // Currency
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const StoreContext = createContext<StoreContextValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories, setCategories] = useState<{ id: string; label: string; image: string; tagline: string }[]>(INITIAL_CATEGORIES);
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);
  const [orderOpen, setOrderOpen] = useState(false);
  const [currency, setCurrency] = useState<Currency>("FCFA");

  useEffect(() => {
    async function fetchProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Error fetching products from Supabase:", error);
        return;
      }
      if (data && data.length > 0) {
        const mapped: Product[] = data.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category as any,
          material: d.material as any,
          priceFCFA: d.price_fcfa,
          image: d.image,
          images: d.images,
          description: d.description,
          sizesAvailable: d.sizes_available as any,
          customEnabled: d.custom_enabled,
        }));
        setProducts(mapped);
      }
    }
    async function fetchCategories() {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error("Error fetching categories from Supabase:", error);
        return;
      }
      if (data && data.length > 0) {
        setCategories(data);
      }
    }
    fetchProducts();
    fetchCategories();
  }, []);

  const upsertProduct = useCallback(async (p: Product) => {
    // Optimistic UI update
    setProducts((prev) => {
      const idx = prev.findIndex((x) => x.id === p.id);
      if (idx === -1) return [p, ...prev];
      const next = [...prev];
      next[idx] = p;
      return next;
    });
    // Persist to Supabase
    await supabase.from('products').upsert({
      id: p.id,
      name: p.name,
      category: p.category,
      material: p.material,
      price_fcfa: p.priceFCFA,
      image: p.image,
      images: p.images,
      description: p.description,
      sizes_available: p.sizesAvailable,
      custom_enabled: p.customEnabled,
    });
  }, []);

  const deleteProduct = useCallback(async (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    const { error } = await supabase.from('products').delete().eq('id', id);
    if (error) {
      console.error('[deleteProduct] Supabase error:', error);
      alert(`Erreur suppression produit: ${error.message}`);
    } else {
      console.log('[deleteProduct] OK, id=', id);
    }
  }, []);

  const upsertCategory = useCallback(async (c: { id: string; label: string; image: string; tagline: string }) => {
    setCategories((prev) => {
      const idx = prev.findIndex((x) => x.id === c.id);
      if (idx === -1) return [...prev, c];
      const next = [...prev];
      next[idx] = c;
      return next;
    });
    const { error } = await supabase.from('categories').upsert({ id: c.id, label: c.label, image: c.image, tagline: c.tagline });
    if (error) console.error('[upsertCategory] Supabase error:', error);
  }, []);

  const deleteCategory = useCallback(async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (error) {
      console.error('[deleteCategory] Supabase error:', error);
      alert(`Erreur suppression catalogue: ${error.message}`);
    } else {
      console.log('[deleteCategory] OK, id=', id);
    }
  }, []);

  const addToCart = (product: Product, size: Size) => {
    const id = `${product.id}-${size}`;
    setItems((prev) => {
      const found = prev.find((i) => i.id === id);
      if (found) {
        return prev.map((i) => (i.id === id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { id, product, size, quantity: 1 }];
    });
  };
  const removeFromCart = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));
  const updateQty = (id: string, qty: number) =>
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, quantity: Math.max(1, qty) } : i)),
    );
  const clearCart = () => setItems([]);

  const cartCount = items.reduce((s, i) => s + i.quantity, 0);
  const cartTotalFCFA = items.reduce((s, i) => s + i.quantity * i.product.priceFCFA, 0);

  const openOrder = (p: Product | null) => {
    setOrderProduct(p);
    setOrderOpen(true);
  };
  const closeOrder = () => {
    setOrderOpen(false);
    setTimeout(() => setOrderProduct(null), 300);
  };

  const value = useMemo<StoreContextValue & { orderOpen: boolean }>(
    () => ({
      products,
      categories,
      upsertProduct,
      deleteProduct,
      upsertCategory,
      deleteCategory,
      items,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      cartCount,
      cartTotalFCFA,
      cartOpen,
      setCartOpen,
      orderProduct,
      openOrder,
      closeOrder,
      orderOpen,
      currency,
      setCurrency,
    }),
    [products, categories, upsertProduct, deleteProduct, upsertCategory, deleteCategory, items, cartOpen, orderProduct, orderOpen, currency, cartCount, cartTotalFCFA],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext) as
    | (StoreContextValue & { orderOpen: boolean })
    | null;
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
