-- Supabase Schema for Founty Elegance

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    image TEXT NOT NULL,
    tagline TEXT NOT NULL
);

-- 2. Create Products Table
CREATE TABLE IF NOT EXISTS public.products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL REFERENCES public.categories(id),
    material TEXT NOT NULL,
    price_fcfa INTEGER NOT NULL,
    image TEXT NOT NULL,
    images TEXT[] NOT NULL,
    description TEXT NOT NULL,
    sizes_available TEXT[] NOT NULL,
    custom_enabled BOOLEAN NOT NULL DEFAULT false
);

-- 3. Create Classic Orders Table
CREATE TABLE IF NOT EXISTS public.classic_orders (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    subtotal_fcfa INTEGER NOT NULL,
    shipping_fcfa INTEGER NOT NULL,
    total_fcfa INTEGER NOT NULL,
    payment TEXT NOT NULL,
    status TEXT NOT NULL
);

-- 4. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT NOT NULL REFERENCES public.classic_orders(id) ON DELETE CASCADE,
    product_id TEXT NOT NULL REFERENCES public.products(id),
    size TEXT NOT NULL,
    qty INTEGER NOT NULL
);

-- 5. Create Custom Requests Table
CREATE TABLE IF NOT EXISTS public.custom_requests (
    id TEXT PRIMARY KEY,
    date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    customer TEXT NOT NULL,
    phone TEXT NOT NULL,
    country TEXT NOT NULL,
    city TEXT NOT NULL,
    inspiration TEXT NOT NULL,
    cut TEXT NOT NULL,
    fabric TEXT NOT NULL,
    budget_fcfa INTEGER NOT NULL,
    measurements JSONB NOT NULL,
    notes TEXT,
    status TEXT NOT NULL
);

-- Turn off RLS for public access (since this is just a mockup transitioning to MVP)
ALTER TABLE public.categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.products DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.classic_orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests DISABLE ROW LEVEL SECURITY;

-- SEED DATA

-- Categories
INSERT INTO public.categories (id, label, image, tagline) VALUES
('boubous', 'Boubous', '/src/assets/cat-boubous.jpg', 'L''apparat majestueux'),
('chemises', 'Chemises', '/src/assets/cat-chemises.jpg', 'L''élégance quotidienne'),
('pantalons', 'Pantalons', '/src/assets/cat-pantalons.jpg', 'La coupe parfaite'),
('ensembles', 'Ensembles', '/src/assets/cat-ensembles.jpg', 'L''harmonie complète'),
('accessoires', 'Accessoires', '/src/assets/cat-accessoires.jpg', 'Les détails qui signent')
ON CONFLICT (id) DO NOTHING;

-- Products
INSERT INTO public.products (id, name, category, material, price_fcfa, image, images, description, sizes_available, custom_enabled) VALUES
('p1', 'Boubou Royal — Or', 'boubous', 'Bazin', 185000, '/src/assets/product-boubou-1.jpg', ARRAY['/src/assets/product-boubou-1.jpg', '/src/assets/product-boubou-2.jpg', '/src/assets/product-ensemble-1.jpg', '/src/assets/product-ensemble-2.jpg'], 'Pièce d''apparat en bazin riche, brodée à la main de motifs dorés. Coupe ample, finitions soignées.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], true),
('p2', 'Boubou Saphir — Marine', 'boubous', 'Bazin', 165000, '/src/assets/product-boubou-2.jpg', ARRAY['/src/assets/product-boubou-2.jpg', '/src/assets/product-boubou-1.jpg', '/src/assets/product-ensemble-2.jpg'], 'Boubou contemporain en bazin marine, col mandarin brodé d''argent. Pour l''élégance discrète.', ARRAY['S', 'M', 'L', 'XL'], true),
('p3', 'Chemise Atelier — Lin Sable', 'chemises', 'Lin', 65000, '/src/assets/product-chemise-1.jpg', ARRAY['/src/assets/product-chemise-1.jpg', '/src/assets/product-chemise-2.jpg'], 'Chemise en lin pur, col mandarin, boutons en corozo doré. Confort et raffinement quotidien.', ARRAY['S', 'M', 'L', 'XL'], true),
('p4', 'Chemise Brodée — Ivoire', 'chemises', 'Coton', 78000, '/src/assets/product-chemise-2.jpg', ARRAY['/src/assets/product-chemise-2.jpg', '/src/assets/product-chemise-1.jpg', '/src/assets/product-pantalon-1.jpg'], 'Chemise longue en coton ivoire, plastron brodé à la main de motifs géométriques.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], true),
('p5', 'Pantalon Carré — Anthracite', 'pantalons', 'Lin', 72000, '/src/assets/product-pantalon-1.jpg', ARRAY['/src/assets/product-pantalon-1.jpg', '/src/assets/product-chemise-1.jpg'], 'Pantalon de coupe ample, ceinture haute, tombé impeccable. Tissu noble et léger.', ARRAY['S', 'M', 'L', 'XL'], true),
('p6', 'Ensemble Grand Soir — Or', 'ensembles', 'Bazin', 245000, '/src/assets/product-ensemble-1.jpg', ARRAY['/src/assets/product-ensemble-1.jpg', '/src/assets/product-ensemble-2.jpg', '/src/assets/product-boubou-1.jpg', '/src/assets/product-boubou-2.jpg'], 'Ensemble tunique et pantalon, broderies fil d''or. La pièce maîtresse des grandes occasions.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], true),
('p7', 'Ensemble Bordeaux — Cérémonie', 'ensembles', 'Bazin', 225000, '/src/assets/product-ensemble-2.jpg', ARRAY['/src/assets/product-ensemble-2.jpg', '/src/assets/product-ensemble-1.jpg', '/src/assets/product-boubou-1.jpg'], 'Grand boubou bordeaux, broderies fines or pâle. Allure souveraine.', ARRAY['S', 'M', 'L', 'XL', 'XXL'], true),
('p8', 'Babouches Atelier — Cuir Noir', 'accessoires', 'Cuir', 45000, '/src/assets/product-accessoire-1.jpg', ARRAY['/src/assets/product-accessoire-1.jpg'], 'Babouches en cuir pleine fleur, finitions or. Cousues main, semelle souple.', ARRAY['S', 'M', 'L'], false)
ON CONFLICT (id) DO NOTHING;

-- Classic Orders
INSERT INTO public.classic_orders (id, date, customer, email, phone, country, address, city, subtotal_fcfa, shipping_fcfa, total_fcfa, payment, status) VALUES
('FE-2410', NOW(), 'Aïssatou Diop', 'aissatou.d@mail.com', '+221 77 612 45 89', 'Sénégal', 'Villa 24, Rue Saint-Michel, Sicap Liberté 6', 'Dakar', 65000, 2500, 67500, 'Wave', 'En préparation'),
('FE-2409', NOW() - INTERVAL '1 day', 'Moussa Ndiaye', 'm.ndiaye@mail.com', '+221 77 555 88 21', 'Sénégal', 'Cité Keur Gorgui, Lot 47B', 'Dakar', 230000, 0, 230000, 'Orange Money', 'Expédié'),
('FE-2408', NOW() - INTERVAL '2 days', 'Claire Bernard', 'claire.b@mail.fr', '+33 6 12 45 78 90', 'France', '12 rue Saint-Antoine, 75004', 'Paris', 144000, 25000, 169000, 'Carte', 'Expédié'),
('FE-2407', NOW() - INTERVAL '4 days', 'Fatou Sarr', 'fatou.s@mail.com', '+221 78 902 11 33', 'Sénégal', 'Almadies, Cité Asecna, Villa 7', 'Dakar', 245000, 0, 245000, 'Paiement à la livraison', 'Livré'),
('FE-2406', NOW() - INTERVAL '5 days', 'Ibrahima Ba', 'i.ba@mail.com', '+223 76 444 02 18', 'Mali', 'Hamdallaye ACI 2000, Rue 254', 'Bamako', 78000, 18000, 96000, 'Orange Money', 'Livré'),
('FE-2405', NOW() - INTERVAL '7 days', 'Sophie Martin', 'sophie.m@mail.fr', '+33 7 88 14 22 09', 'France', '8 boulevard de la Liberté, 59000', 'Lille', 165000, 25000, 190000, 'PayPal', 'Livré')
ON CONFLICT (id) DO NOTHING;

-- Order Items
INSERT INTO public.order_items (order_id, product_id, size, qty) VALUES
('FE-2410', 'p3', 'L', 1),
('FE-2409', 'p1', 'XL', 1),
('FE-2409', 'p8', 'M', 1),
('FE-2408', 'p5', 'M', 2),
('FE-2407', 'p6', 'L', 1),
('FE-2406', 'p4', 'XL', 1),
('FE-2405', 'p2', 'M', 1);

-- Custom Requests
INSERT INTO public.custom_requests (id, date, customer, phone, country, city, inspiration, cut, fabric, budget_fcfa, measurements, notes, status) VALUES
('SM-0142', NOW(), 'Awa Camara', '+221 77 612 45 89', 'Sénégal', 'Dakar', 'Boubou de cérémonie inspiré du modèle « Royal Or », broderies dorées au plastron.', 'Normal', 'Bazin Riche — Bordeaux', 220000, '{"poitrine": 96, "taille_haut": 78, "epaules": 42, "bras": 62, "longueur": 140, "cou": 38, "taille_bas": 80, "hanches": 102, "jambe": 102, "cuisse": 58, "cheville": 24}', 'Mariage prévu le 15 du mois suivant. Préfère un tombé ample.', 'Nouveau'),
('SM-0141', NOW() - INTERVAL '1 day', 'Mariama Sow', '+221 78 902 11 33', 'Sénégal', 'Thiès', 'Ensemble pantalon + tunique pour baptême, broderies fil d''or discret.', 'Ajusté', 'Bazin — Ivoire', 180000, '{"poitrine": 88, "taille_haut": 72, "epaules": 39, "bras": 58, "longueur": 110, "cou": 36, "taille_bas": 74, "hanches": 96, "jambe": 98, "cuisse": 54, "cheville": 22}', 'Souhaite voir une photo du tissu avant lancement.', 'Nouveau'),
('SM-0140', NOW() - INTERVAL '3 days', 'Cheikh Fall', '+221 76 555 12 04', 'Sénégal', 'Dakar', 'Grand boubou marine, col mandarin brodé argent.', 'Large', 'Bazin — Marine', 200000, '{"poitrine": 108, "taille_haut": 96, "epaules": 48, "bras": 66, "longueur": 148, "cou": 42, "taille_bas": 98, "hanches": 110, "jambe": 108, "cuisse": 64, "cheville": 26}', 'Déjà client — préférences enregistrées.', 'Devis Envoyé'),
('SM-0139', NOW() - INTERVAL '6 days', 'Léa Dubois', '+33 6 12 45 78 90', 'France', 'Paris', 'Chemise longue brodée, inspiration ethnique chic.', 'Ajusté', 'Lin — Sable', 95000, '{"poitrine": 86, "taille_haut": 68, "epaules": 38, "bras": 60, "longueur": 92, "cou": 34, "taille_bas": 70, "hanches": 94, "jambe": 96, "cuisse": 52, "cheville": 21}', 'Livraison internationale via DHL.', 'En Confection'),
('SM-0138', NOW() - INTERVAL '10 days', 'Ousmane Diallo', '+221 77 444 02 18', 'Sénégal', 'Dakar', 'Ensemble traditionnel sobre pour Tabaski.', 'Normal', 'Bazin — Blanc cassé', 175000, '{"poitrine": 100, "taille_haut": 88, "epaules": 46, "bras": 64, "longueur": 145, "cou": 40, "taille_bas": 90, "hanches": 106, "jambe": 104, "cuisse": 60, "cheville": 25}', '', 'Livré')
ON CONFLICT (id) DO NOTHING;
