import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";

const TOP = [
  { key: "poitrine", label: "Poitrine" },
  { key: "taille_haut", label: "Taille (haut)" },
  { key: "epaules", label: "Épaules" },
  { key: "bras", label: "Longueur bras" },
  { key: "cou", label: "Tour de cou" },
  { key: "manche", label: "Tour de manche" },
];
const BOTTOM = [
  { key: "taille_bas", label: "Taille (bas)" },
  { key: "hanches", label: "Hanches" },
  { key: "jambes", label: "Longueur jambes" },
  { key: "cuisses", label: "Tour de cuisses" },
];

export const Route = createFileRoute("/profil")({
  head: () => ({
    meta: [
      { title: "Mon compte — Founty Élégance" },
      { name: "description", content: "Votre dashboard Founty : commandes, mensurations et préférences." },
    ],
  }),
  component: Profil,
});

function Profil() {
  const { clientEmail, customer, loading: authLoading, refreshCustomer, loginClient, logoutClient } = useAuth();
  const [tab, setTab] = useState<"orders" | "measurements" | "info">("orders");
  const [meas, setMeas] = useState<Record<string, string>>({});
  const [info, setInfo] = useState({ first_name: "", last_name: "", email: "", phone: "", address: "", city: "", country: "Sénégal" });
  const [saved, setSaved] = useState(false);
  const [orders, setOrders] = useState<any[]>([]);
  
  // Login Form State
  const [loginForm, setLoginForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    if (customer) {
      setMeas(customer.measurements || {});
      setInfo({
        first_name: customer.first_name || "",
        last_name: customer.last_name || "",
        email: customer.email || clientEmail || "",
        phone: customer.phone || "",
        address: customer.address || "",
        city: customer.city || "",
        country: customer.country || "Sénégal"
      });
    }
  }, [customer, clientEmail]);

  useEffect(() => {
    if (clientEmail && tab === "orders") {
      Promise.all([
        supabase.from("classic_orders").select("*").eq("email", clientEmail),
        supabase.from("custom_requests").select("*").eq("email", clientEmail),
      ]).then(([classicRes, customRes]) => {
        const classics = (classicRes.data || []).map(o => ({
          id: o.id,
          date: o.created_at || o.date,
          status: o.status,
          total_fcfa: o.total_fcfa,
          type: "Prêt-à-porter"
        }));
        const customs = (customRes.data || []).map(o => ({
          id: o.id,
          date: o.created_at,
          status: o.status,
          total_fcfa: o.budget_fcfa,
          type: "Sur-Mesure"
        }));
        
        const merged = [...classics, ...customs].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(merged);
      });
    }
  }, [clientEmail, tab]);

  const setMeasurement = (k: string, v: string) => {
    setMeas({ ...meas, [k]: v });
    setSaved(false);
  };

  const handleSaveMeasurements = async () => {
    if (!clientEmail) return;
    await supabase.from("customers").update({ measurements: meas }).eq("email", clientEmail);
    await refreshCustomer();
    setSaved(true);
  };

  const handleSaveInfo = async () => {
    if (!clientEmail) return;
    await supabase.from("customers").update({
      first_name: info.first_name,
      last_name: info.last_name,
      phone: info.phone,
    }).eq("email", clientEmail);
    await refreshCustomer();
    alert("Informations mises à jour.");
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    const email = loginForm.email.toLowerCase().trim();

    // Upsert into customers table
    const { error } = await supabase.from("customers").upsert({
      email,
      first_name: loginForm.first_name,
      last_name: loginForm.last_name,
      phone: loginForm.phone,
      address: loginForm.address,
    }, { onConflict: 'email' });

    if (error) {
      alert("Erreur lors de l'enregistrement de votre profil.");
      console.error(error);
    } else {
      loginClient(email);
    }
    setLoginLoading(false);
  };

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-accent" />
      </div>
    );
  }

  if (!clientEmail) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col justify-center px-6 py-12">
        <p className="ui-label mb-6 text-center text-accent">— Espace Client</p>
        <h1 className="mb-6 text-center font-serif text-4xl">Vos Coordonnées</h1>
        <p className="mb-8 text-center text-sm text-muted-foreground">
          Renseignez vos informations pour accéder à votre espace, retrouver vos commandes, et sauvegarder vos mensurations.
        </p>
        
        <form onSubmit={handleLoginSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-editorial">Prénom</label>
              <input
                type="text"
                required
                className="input-editorial"
                value={loginForm.first_name}
                onChange={(e) => setLoginForm({ ...loginForm, first_name: e.target.value })}
              />
            </div>
            <div>
              <label className="label-editorial">Nom</label>
              <input
                type="text"
                required
                className="input-editorial"
                value={loginForm.last_name}
                onChange={(e) => setLoginForm({ ...loginForm, last_name: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="label-editorial">Adresse Email</label>
            <input
              type="email"
              required
              className="input-editorial"
              value={loginForm.email}
              onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
            />
          </div>
          <div>
            <label className="label-editorial">Téléphone (WhatsApp)</label>
            <input
              type="tel"
              required
              className="input-editorial"
              value={loginForm.phone}
              onChange={(e) => setLoginForm({ ...loginForm, phone: e.target.value })}
            />
          </div>
          <div>
            <label className="label-editorial">Adresse Complète</label>
            <input
              type="text"
              required
              className="input-editorial"
              value={loginForm.address}
              onChange={(e) => setLoginForm({ ...loginForm, address: e.target.value })}
            />
          </div>
          
          <button disabled={loginLoading} className="btn-editorial btn-primary w-full justify-center">
            {loginLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Accéder à mon espace"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-24">
      <div className="flex flex-col gap-6 border-b border-border pb-10 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="ui-label mb-3 text-accent">— Votre compte</p>
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            Bienvenue, {customer?.first_name || clientEmail}
          </h1>
        </div>
        <button onClick={logoutClient} className="btn-editorial btn-ghost self-start md:self-auto">
          Se déconnecter
        </button>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-12 lg:grid-cols-[220px_1fr]">
        {/* Tabs */}
        <nav className="flex flex-row gap-2 overflow-x-auto lg:flex-col lg:gap-0">
          {[
            { id: "orders", label: "Commandes" },
            { id: "measurements", label: "Mes mensurations" },
            { id: "info", label: "Informations" },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id as typeof tab)}
              className={`ui-label whitespace-nowrap border px-4 py-3 text-left transition-colors lg:border-0 lg:border-l-2 lg:px-5 ${
                tab === t.id
                  ? "border-foreground text-foreground lg:bg-surface"
                  : "border-border text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div>
          {tab === "orders" && (
            <div className="fade-in">
              <h2 className="mb-8 font-serif text-3xl">Historique de commandes</h2>
              {orders.length === 0 ? (
                <p className="text-muted-foreground">Aucune commande pour le moment.</p>
              ) : (
                <div className="overflow-x-auto border border-border">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-surface text-left">
                        <th className="ui-label px-5 py-4">N°</th>
                        <th className="ui-label px-5 py-4">Type</th>
                        <th className="ui-label px-5 py-4">Date</th>
                        <th className="ui-label px-5 py-4">Statut</th>
                        <th className="ui-label px-5 py-4 text-right">Total/Budget</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((o) => (
                        <tr key={o.id} className="border-b border-border last:border-0">
                          <td className="px-5 py-5 font-medium tabular-nums">{o.id}</td>
                          <td className="px-5 py-5">
                            <span className="text-xs uppercase tracking-wider text-muted-foreground">{o.type}</span>
                          </td>
                          <td className="px-5 py-5 text-muted-foreground">
                            {new Date(o.date).toLocaleDateString("fr-FR")}
                          </td>
                          <td className="px-5 py-5">
                            <span
                              className={`ui-label px-2 py-1 ${
                                o.status === "Livré"
                                  ? "bg-foreground text-background"
                                  : "bg-accent text-foreground"
                              }`}
                            >
                              {o.status}
                            </span>
                          </td>
                          <td className="px-5 py-5 text-right tabular-nums">
                            {o.type === "Sur-Mesure" && o.total_fcfa === 0 ? (
                              <span className="text-sm italic text-muted-foreground">Sur devis</span>
                            ) : (
                              `${o.total_fcfa} FCFA`
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {tab === "measurements" && (
            <div className="fade-in">
              <h2 className="mb-2 font-serif text-3xl">Mes mensurations</h2>
              <p className="mb-10 text-sm text-muted-foreground">
                Sauvegardez vos mesures pour des commandes sur-mesure plus rapides.
              </p>
              <div className="space-y-12">
                <section>
                  <p className="ui-label mb-5 text-accent">Le haut</p>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                    {TOP.map((f) => (
                      <div key={f.key}>
                        <label className="label-editorial">{f.label}</label>
                        <input
                          type="number"
                          className="input-editorial tabular-nums"
                          value={meas[f.key] ?? ""}
                          onChange={(e) => setMeasurement(f.key, e.target.value)}
                          placeholder="cm"
                        />
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <p className="ui-label mb-5 text-accent">Le bas</p>
                  <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2 lg:grid-cols-3">
                    {BOTTOM.map((f) => (
                      <div key={f.key}>
                        <label className="label-editorial">{f.label}</label>
                        <input
                          type="number"
                          className="input-editorial tabular-nums"
                          value={meas[f.key] ?? ""}
                          onChange={(e) => setMeasurement(f.key, e.target.value)}
                          placeholder="cm"
                        />
                      </div>
                    ))}
                  </div>
                </section>
                <div className="flex items-center gap-4">
                  <button onClick={handleSaveMeasurements} className="btn-editorial btn-primary">
                    Enregistrer
                  </button>
                  {saved && <span className="ui-label text-accent">✓ Mesures sauvegardées</span>}
                </div>
              </div>
            </div>
          )}

          {tab === "info" && (
            <div className="fade-in">
              <h2 className="mb-8 font-serif text-3xl">Informations personnelles</h2>
              <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
                <div>
                  <label className="label-editorial">Prénom</label>
                  <input 
                    className="input-editorial" 
                    value={info.first_name} 
                    onChange={e => setInfo({ ...info, first_name: e.target.value })} 
                  />
                </div>
                <div>
                  <label className="label-editorial">Nom</label>
                  <input 
                    className="input-editorial" 
                    value={info.last_name} 
                    onChange={e => setInfo({ ...info, last_name: e.target.value })} 
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-editorial">Email</label>
                  <input className="input-editorial opacity-50" value={info.email} disabled />
                </div>
                <div className="sm:col-span-2">
                  <label className="label-editorial">Téléphone</label>
                  <input 
                    className="input-editorial" 
                    value={info.phone} 
                    onChange={e => setInfo({ ...info, phone: e.target.value })} 
                  />
                </div>
              </div>
              <button onClick={handleSaveInfo} className="btn-editorial btn-primary mt-10">Mettre à jour</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
