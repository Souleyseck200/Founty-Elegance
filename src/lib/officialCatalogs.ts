import type { Category } from "./products";

/** Catalogues officiels regroupés (navigation « Collections »). */
export const OFFICIAL_CATALOGS: readonly { readonly label: string; readonly ids: readonly Category[] }[] = [
  { label: "Vêtement traditionnel", ids: ["boubous", "ensembles"] },
  { label: "Vêtements Européens", ids: ["chemises", "pantalons"] },
  { label: "Accessoires", ids: ["accessoires"] },
];
