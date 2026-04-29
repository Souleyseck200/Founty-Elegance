import boubou1 from "@/assets/product-boubou-1.jpg";
import boubou2 from "@/assets/product-boubou-2.jpg";
import chemise1 from "@/assets/product-chemise-1.jpg";
import chemise2 from "@/assets/product-chemise-2.jpg";
import pantalon1 from "@/assets/product-pantalon-1.jpg";
import ensemble1 from "@/assets/product-ensemble-1.jpg";
import ensemble2 from "@/assets/product-ensemble-2.jpg";
import accessoire1 from "@/assets/product-accessoire-1.jpg";

import catBoubous from "@/assets/cat-boubous.jpg";
import catChemises from "@/assets/cat-chemises.jpg";
import catPantalons from "@/assets/cat-pantalons.jpg";
import catEnsembles from "@/assets/cat-ensembles.jpg";
import catAccessoires from "@/assets/cat-accessoires.jpg";

export type Category =
  | "boubous"
  | "chemises"
  | "pantalons"
  | "ensembles"
  | "accessoires";

export type Material = "Bazin" | "Lin" | "Wax" | "Cuir" | "Coton";

export const SIZES = ["S", "M", "L", "XL", "XXL"] as const;
export type Size = (typeof SIZES)[number];

export type Product = {
  id: string;
  name: string;
  category: Category;
  material: Material;
  priceFCFA: number;
  /** Cover image (first of the gallery). Kept for backwards compatibility. */
  image: string;
  /** Up to 4 product images for the gallery slider. */
  images: string[];
  description: string;
  /** Standard sizes available for ready-to-wear. */
  sizesAvailable: Size[];
  /** Whether the "Sur-Mesure" flow is enabled for this model. */
  customEnabled: boolean;
};

export const CATEGORIES: { id: Category; label: string; image: string; tagline: string }[] = [
  { id: "boubous", label: "Boubous", image: catBoubous, tagline: "L'apparat majestueux" },
  { id: "chemises", label: "Chemises", image: catChemises, tagline: "L'élégance quotidienne" },
  { id: "pantalons", label: "Pantalons", image: catPantalons, tagline: "La coupe parfaite" },
  { id: "ensembles", label: "Ensembles", image: catEnsembles, tagline: "L'harmonie complète" },
  { id: "accessoires", label: "Accessoires", image: catAccessoires, tagline: "Les détails qui signent" },
];

const ALL_SIZES: Size[] = ["S", "M", "L", "XL", "XXL"];
const STD_SIZES: Size[] = ["S", "M", "L", "XL"];

export const PRODUCTS: Product[] = [
  {
    id: "p1",
    name: "Boubou Royal — Or",
    category: "boubous",
    material: "Bazin",
    priceFCFA: 185000,
    image: boubou1,
    images: [boubou1, boubou2, ensemble1, ensemble2],
    sizesAvailable: ALL_SIZES,
    customEnabled: true,
    description:
      "Pièce d'apparat en bazin riche, brodée à la main de motifs dorés. Coupe ample, finitions soignées.",
  },
  {
    id: "p2",
    name: "Boubou Saphir — Marine",
    category: "boubous",
    material: "Bazin",
    priceFCFA: 165000,
    image: boubou2,
    images: [boubou2, boubou1, ensemble2],
    sizesAvailable: STD_SIZES,
    customEnabled: true,
    description:
      "Boubou contemporain en bazin marine, col mandarin brodé d'argent. Pour l'élégance discrète.",
  },
  {
    id: "p3",
    name: "Chemise Atelier — Lin Sable",
    category: "chemises",
    material: "Lin",
    priceFCFA: 65000,
    image: chemise1,
    images: [chemise1, chemise2],
    sizesAvailable: STD_SIZES,
    customEnabled: true,
    description:
      "Chemise en lin pur, col mandarin, boutons en corozo doré. Confort et raffinement quotidien.",
  },
  {
    id: "p4",
    name: "Chemise Brodée — Ivoire",
    category: "chemises",
    material: "Coton",
    priceFCFA: 78000,
    image: chemise2,
    images: [chemise2, chemise1, pantalon1],
    sizesAvailable: ALL_SIZES,
    customEnabled: true,
    description:
      "Chemise longue en coton ivoire, plastron brodé à la main de motifs géométriques.",
  },
  {
    id: "p5",
    name: "Pantalon Carré — Anthracite",
    category: "pantalons",
    material: "Lin",
    priceFCFA: 72000,
    image: pantalon1,
    images: [pantalon1, chemise1],
    sizesAvailable: STD_SIZES,
    customEnabled: true,
    description:
      "Pantalon de coupe ample, ceinture haute, tombé impeccable. Tissu noble et léger.",
  },
  {
    id: "p6",
    name: "Ensemble Grand Soir — Or",
    category: "ensembles",
    material: "Bazin",
    priceFCFA: 245000,
    image: ensemble1,
    images: [ensemble1, ensemble2, boubou1, boubou2],
    sizesAvailable: ALL_SIZES,
    customEnabled: true,
    description:
      "Ensemble tunique et pantalon, broderies fil d'or. La pièce maîtresse des grandes occasions.",
  },
  {
    id: "p7",
    name: "Ensemble Bordeaux — Cérémonie",
    category: "ensembles",
    material: "Bazin",
    priceFCFA: 225000,
    image: ensemble2,
    images: [ensemble2, ensemble1, boubou1],
    sizesAvailable: ALL_SIZES,
    customEnabled: true,
    description:
      "Grand boubou bordeaux, broderies fines or pâle. Allure souveraine.",
  },
  {
    id: "p8",
    name: "Babouches Atelier — Cuir Noir",
    category: "accessoires",
    material: "Cuir",
    priceFCFA: 45000,
    image: accessoire1,
    images: [accessoire1],
    sizesAvailable: ["S", "M", "L"],
    customEnabled: false,
    description:
      "Babouches en cuir pleine fleur, finitions or. Cousues main, semelle souple.",
  },
];

export const MATERIALS: Material[] = ["Bazin", "Lin", "Wax", "Coton", "Cuir"];
