import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

// Load .env manually
const envPath = path.resolve('.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      process.env[match[1].trim()] = match[2].trim();
    }
  });
}

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("❌ Erreur: Clés Supabase manquantes dans le fichier .env");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function runTests() {
  console.log("🔍 Démarrage du diagnostic Supabase...\n");
  let allGood = true;

  // 1. Tester la table 'categories'
  console.log("▶ Test de la table 'categories'...");
  const { data: catData, error: catError } = await supabase.from('categories').select('*').limit(1);
  if (catError) {
    console.error("  ❌ Échec: " + catError.message);
    allGood = false;
  } else if (!catData || catData.length === 0) {
    console.log("  ⚠️  Table 'categories' accessible mais VIDE.");
    allGood = false;
  } else {
    console.log("  ✅ Succès: Table 'categories' contient des données.");
  }

  // 2. Tester la table 'products'
  console.log("\n▶ Test de la table 'products'...");
  const { data: prodData, error: prodError } = await supabase.from('products').select('*').limit(1);
  if (prodError) {
    console.error("  ❌ Échec: " + prodError.message);
    allGood = false;
  } else if (!prodData || prodData.length === 0) {
    console.log("  ⚠️  Table 'products' accessible mais VIDE.");
    allGood = false;
  } else {
    console.log("  ✅ Succès: Table 'products' contient des données.");
  }

  // 3. Tester la table 'classic_orders'
  console.log("\n▶ Test de la table 'classic_orders'...");
  const { data: orderData, error: orderError } = await supabase.from('classic_orders').select('*').limit(1);
  if (orderError) {
    console.error("  ❌ Échec: " + orderError.message);
    allGood = false;
  } else if (!orderData || orderData.length === 0) {
    console.log("  ⚠️  Table 'classic_orders' accessible mais VIDE.");
  } else {
    console.log("  ✅ Succès: Table 'classic_orders' contient des données.");
  }

  // 4. Tester la table 'custom_requests'
  console.log("\n▶ Test de la table 'custom_requests'...");
  const { data: reqData, error: reqError } = await supabase.from('custom_requests').select('*').limit(1);
  if (reqError) {
    console.error("  ❌ Échec: " + reqError.message);
    allGood = false;
  } else if (!reqData || reqData.length === 0) {
    console.log("  ⚠️  Table 'custom_requests' accessible mais VIDE.");
  } else {
    console.log("  ✅ Succès: Table 'custom_requests' contient des données.");
  }

  // 5. Tester le Storage (founty-images)
  console.log("\n▶ Test du bucket Storage 'founty-images'...");
  const testFile = new Blob(['test file'], { type: 'text/plain' });
  const testFileName = `test-${Date.now()}.txt`;
  const { error: storageError } = await supabase.storage.from('founty-images').upload(testFileName, testFile);
  
  if (storageError) {
    console.error("  ❌ Échec: " + storageError.message + " (Le bucket n'a pas été créé, n'est pas public, ou la policy d'upload manque)");
    allGood = false;
  } else {
    console.log("  ✅ Succès: Bucket 'founty-images' existe et l'upload est autorisé.");
    // Nettoyage
    await supabase.storage.from('founty-images').remove([testFileName]);
  }

  // Bilan
  console.log("\n====================================");
  if (allGood) {
    console.log("🚀 TOUT FONCTIONNE ! Votre backend Supabase est parfaitement configuré et lié au projet.");
  } else {
    console.log("⚠️ DES ERREURS ONT ÉTÉ DÉTECTÉES. Veuillez vérifier les messages ci-dessus.");
    console.log("   Vérifiez que vous avez bien :");
    console.log("   1. Exécuté le fichier supabase_schema.sql dans Supabase.");
    console.log("   2. Créé le bucket 'founty-images' en mode public.");
  }
  console.log("====================================\n");
}

runTests();
