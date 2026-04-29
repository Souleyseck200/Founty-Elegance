// Mock data for the Founty Élégance admin back-office.
// No real backend — purely in-memory for UI prototyping.

import { PRODUCTS, type Product } from "./products";

export type ClassicOrderStatus =
  | "En préparation"
  | "Expédié"
  | "Livré"
  | "Annulé";

export type CustomRequestStatus =
  | "Nouveau"
  | "Devis Envoyé"
  | "En Confection"
  | "Livré";

export type PaymentMethod = "Wave" | "Orange Money" | "Carte" | "PayPal" | "Paiement à la livraison";

export type ClassicOrder = {
  id: string;
  date: string; // ISO
  customer: string;
  email: string;
  phone?: string;
  country: string;
  /** Full shipping address (street + city + postal). */
  address: string;
  city: string;
  items: { product: Product; size: string; qty: number }[];
  /** Sub-total before shipping. */
  subtotalFCFA: number;
  shippingFCFA: number;
  totalFCFA: number;
  payment: PaymentMethod;
  status: ClassicOrderStatus;
};

export type CustomMeasurements = {
  // Haut
  poitrine: number;
  taille_haut: number;
  epaules: number;
  bras: number;
  longueur: number;
  cou: number;
  // Bas
  taille_bas: number;
  hanches: number;
  jambe: number;
  cuisse: number;
  cheville: number;
};

export type CustomRequest = {
  id: string;
  date: string;
  customer: string;
  phone: string;
  country: string;
  city: string;
  inspiration: string; // model description
  cut: "Ajusté" | "Normal" | "Large";
  fabric: string;
  budgetFCFA: number;
  measurements: CustomMeasurements;
  notes: string;
  status: CustomRequestStatus;
  image_model?: string | null;
  image_client?: string | null;
  image_fabric?: string | null;
};

const today = new Date();
const daysAgo = (n: number) =>
  new Date(today.getTime() - n * 86400000).toISOString();

export const MOCK_CLASSIC_ORDERS: ClassicOrder[] = [
  {
    id: "FE-2410",
    date: daysAgo(0),
    customer: "Aïssatou Diop",
    email: "aissatou.d@mail.com",
    phone: "+221 77 612 45 89",
    country: "Sénégal",
    address: "Villa 24, Rue Saint-Michel, Sicap Liberté 6",
    city: "Dakar",
    items: [{ product: PRODUCTS[2], size: "L", qty: 1 }],
    subtotalFCFA: 65000,
    shippingFCFA: 2500,
    totalFCFA: 67500,
    payment: "Wave",
    status: "En préparation",
  },
  {
    id: "FE-2409",
    date: daysAgo(1),
    customer: "Moussa Ndiaye",
    email: "m.ndiaye@mail.com",
    phone: "+221 77 555 88 21",
    country: "Sénégal",
    address: "Cité Keur Gorgui, Lot 47B",
    city: "Dakar",
    items: [
      { product: PRODUCTS[0], size: "XL", qty: 1 },
      { product: PRODUCTS[7], size: "M", qty: 1 },
    ],
    subtotalFCFA: 230000,
    shippingFCFA: 0,
    totalFCFA: 230000,
    payment: "Orange Money",
    status: "Expédié",
  },
  {
    id: "FE-2408",
    date: daysAgo(2),
    customer: "Claire Bernard",
    email: "claire.b@mail.fr",
    phone: "+33 6 12 45 78 90",
    country: "France",
    address: "12 rue Saint-Antoine, 75004",
    city: "Paris",
    items: [{ product: PRODUCTS[4], size: "M", qty: 2 }],
    subtotalFCFA: 144000,
    shippingFCFA: 25000,
    totalFCFA: 169000,
    payment: "Carte",
    status: "Expédié",
  },
  {
    id: "FE-2407",
    date: daysAgo(4),
    customer: "Fatou Sarr",
    email: "fatou.s@mail.com",
    phone: "+221 78 902 11 33",
    country: "Sénégal",
    address: "Almadies, Cité Asecna, Villa 7",
    city: "Dakar",
    items: [{ product: PRODUCTS[5], size: "L", qty: 1 }],
    subtotalFCFA: 245000,
    shippingFCFA: 0,
    totalFCFA: 245000,
    payment: "Paiement à la livraison",
    status: "Livré",
  },
  {
    id: "FE-2406",
    date: daysAgo(5),
    customer: "Ibrahima Ba",
    email: "i.ba@mail.com",
    phone: "+223 76 444 02 18",
    country: "Mali",
    address: "Hamdallaye ACI 2000, Rue 254",
    city: "Bamako",
    items: [{ product: PRODUCTS[3], size: "XL", qty: 1 }],
    subtotalFCFA: 78000,
    shippingFCFA: 18000,
    totalFCFA: 96000,
    payment: "Orange Money",
    status: "Livré",
  },
  {
    id: "FE-2405",
    date: daysAgo(7),
    customer: "Sophie Martin",
    email: "sophie.m@mail.fr",
    phone: "+33 7 88 14 22 09",
    country: "France",
    address: "8 boulevard de la Liberté, 59000",
    city: "Lille",
    items: [{ product: PRODUCTS[1], size: "M", qty: 1 }],
    subtotalFCFA: 165000,
    shippingFCFA: 25000,
    totalFCFA: 190000,
    payment: "PayPal",
    status: "Livré",
  },
];

export const MOCK_CUSTOM_REQUESTS: CustomRequest[] = [
  {
    id: "SM-0142",
    date: daysAgo(0),
    customer: "Awa Camara",
    phone: "+221 77 612 45 89",
    country: "Sénégal",
    city: "Dakar",
    inspiration:
      "Boubou de cérémonie inspiré du modèle « Royal Or », broderies dorées au plastron.",
    cut: "Normal",
    fabric: "Bazin Riche — Bordeaux",
    budgetFCFA: 220000,
    measurements: {
      poitrine: 96, taille_haut: 78, epaules: 42, bras: 62, longueur: 140, cou: 38,
      taille_bas: 80, hanches: 102, jambe: 102, cuisse: 58, cheville: 24,
    },
    notes: "Mariage prévu le 15 du mois suivant. Préfère un tombé ample.",
    status: "Nouveau",
  },
  {
    id: "SM-0141",
    date: daysAgo(1),
    customer: "Mariama Sow",
    phone: "+221 78 902 11 33",
    country: "Sénégal",
    city: "Thiès",
    inspiration: "Ensemble pantalon + tunique pour baptême, broderies fil d'or discret.",
    cut: "Ajusté",
    fabric: "Bazin — Ivoire",
    budgetFCFA: 180000,
    measurements: {
      poitrine: 88, taille_haut: 72, epaules: 39, bras: 58, longueur: 110, cou: 36,
      taille_bas: 74, hanches: 96, jambe: 98, cuisse: 54, cheville: 22,
    },
    notes: "Souhaite voir une photo du tissu avant lancement.",
    status: "Nouveau",
  },
  {
    id: "SM-0140",
    date: daysAgo(3),
    customer: "Cheikh Fall",
    phone: "+221 76 555 12 04",
    country: "Sénégal",
    city: "Dakar",
    inspiration: "Grand boubou marine, col mandarin brodé argent.",
    cut: "Large",
    fabric: "Bazin — Marine",
    budgetFCFA: 200000,
    measurements: {
      poitrine: 108, taille_haut: 96, epaules: 48, bras: 66, longueur: 148, cou: 42,
      taille_bas: 98, hanches: 110, jambe: 108, cuisse: 64, cheville: 26,
    },
    notes: "Déjà client — préférences enregistrées.",
    status: "Devis Envoyé",
  },
  {
    id: "SM-0139",
    date: daysAgo(6),
    customer: "Léa Dubois",
    phone: "+33 6 12 45 78 90",
    country: "France",
    city: "Paris",
    inspiration: "Chemise longue brodée, inspiration ethnique chic.",
    cut: "Ajusté",
    fabric: "Lin — Sable",
    budgetFCFA: 95000,
    measurements: {
      poitrine: 86, taille_haut: 68, epaules: 38, bras: 60, longueur: 92, cou: 34,
      taille_bas: 70, hanches: 94, jambe: 96, cuisse: 52, cheville: 21,
    },
    notes: "Livraison internationale via DHL.",
    status: "En Confection",
  },
  {
    id: "SM-0138",
    date: daysAgo(10),
    customer: "Ousmane Diallo",
    phone: "+221 77 444 02 18",
    country: "Sénégal",
    city: "Dakar",
    inspiration: "Ensemble traditionnel sobre pour Tabaski.",
    cut: "Normal",
    fabric: "Bazin — Blanc cassé",
    budgetFCFA: 175000,
    measurements: {
      poitrine: 100, taille_haut: 88, epaules: 46, bras: 64, longueur: 145, cou: 40,
      taille_bas: 90, hanches: 106, jambe: 104, cuisse: 60, cheville: 25,
    },
    notes: "",
    status: "Livré",
  },
];

export const CUSTOM_STATUSES: CustomRequestStatus[] = [
  "Nouveau", "Devis Envoyé", "En Confection", "Livré",
];

export const CLASSIC_STATUSES: ClassicOrderStatus[] = [
  "En préparation", "Expédié", "Livré", "Annulé",
];
