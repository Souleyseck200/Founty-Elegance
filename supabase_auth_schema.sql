-- 1. Nettoyage de l'ancienne approche stricte
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. Création de la table 'customers' (Basée sur l'email, sans authentification forte)
CREATE TABLE IF NOT EXISTS public.customers (
    email TEXT PRIMARY KEY,
    first_name TEXT,
    last_name TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    country TEXT,
    measurements JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Mise à jour des tables de commandes pour pointer vers l'email du client
-- (On s'assure que user_id est supprimé, et on utilise 'customer_email' si on veut une relation stricte, 
-- mais 'email' est déjà présent dans classic_orders).
ALTER TABLE public.classic_orders DROP COLUMN IF EXISTS user_id;
ALTER TABLE public.custom_requests DROP COLUMN IF EXISTS user_id;

-- NOUVEAUTÉ : Ajout de l'email pour le sur-mesure
ALTER TABLE public.custom_requests ADD COLUMN IF NOT EXISTS email TEXT;

-- NOUVEAUTÉ : Ajout des colonnes pour les images de sur-mesure
ALTER TABLE public.custom_requests ADD COLUMN IF NOT EXISTS image_model TEXT;
ALTER TABLE public.custom_requests ADD COLUMN IF NOT EXISTS image_client TEXT;
ALTER TABLE public.custom_requests ADD COLUMN IF NOT EXISTS image_fabric TEXT;

-- 4. Sécurité (RLS) pour la table customers
-- Puisqu'on veut que n'importe qui avec un email puisse se connecter (MVP), on permet tout au public pour cette table.
ALTER TABLE public.customers DISABLE ROW LEVEL SECURITY;
