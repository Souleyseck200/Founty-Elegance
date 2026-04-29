-- ============================================================
-- Founty Élégance — Politiques RLS + Contraintes FK
-- À exécuter dans le SQL Editor de Supabase
-- ============================================================

-- 1. Activer RLS sur toutes les tables
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classic_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.custom_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

-- 2. Supprimer les anciennes politiques pour éviter les conflits
DROP POLICY IF EXISTS "Public access for all" ON public.customers;
DROP POLICY IF EXISTS "Public access for all" ON public.classic_orders;
DROP POLICY IF EXISTS "Public access for all" ON public.custom_requests;
DROP POLICY IF EXISTS "Public access for all" ON public.products;
DROP POLICY IF EXISTS "Public access for all" ON public.categories;

-- 3. Créer des politiques d'accès PUBLIC complet (SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Public access for all" ON public.customers      FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for all" ON public.classic_orders FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for all" ON public.custom_requests FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for all" ON public.products       FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Public access for all" ON public.categories     FOR ALL USING (true) WITH CHECK (true);

-- 4. CORRECTION FK : Permettre la suppression de produits même s'ils ont des commandes liées
--    On passe la contrainte en ON DELETE SET NULL pour garder l'historique des commandes
--    mais permettre la suppression du produit.
ALTER TABLE public.order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
ALTER TABLE public.order_items ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;

-- 5. TABLE LOOKBOOK — Pour la section artistique de la homepage
CREATE TABLE IF NOT EXISTS public.lookbook (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url   TEXT NOT NULL,
  shape       TEXT DEFAULT 'arch' CHECK (shape IN ('arch','circle','hex','diamond','wide')),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.lookbook ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public access for all" ON public.lookbook;
CREATE POLICY "Public access for all" ON public.lookbook FOR ALL USING (true) WITH CHECK (true);
