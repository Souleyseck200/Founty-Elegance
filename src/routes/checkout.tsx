import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { formatPrice } from "@/lib/format";
import { Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Paiement — Founty Élégance" },
      { name: "description", content: "Finalisez votre commande Founty Élégance." },
    ],
  }),
  component: Checkout,
});

const COUNTRIES = [
  "Sénégal",
  "France",
  "Côte d'Ivoire",
  "Mali",
  "États-Unis",
  "Royaume-Uni",
  "Belgique",
  "Canada",
];

function Checkout() {
  const { items, cartTotalFCFA, currency, clearCart } = useStore();
  const { customer } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: customer?.first_name || "",
    lastName: customer?.last_name || "",
    email: customer?.email || "",
    phone: customer?.phone || "",
    country: customer?.country || "Sénégal",
    address: customer?.address || "",
    city: customer?.city || "",
    zip: "",
  });

  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        firstName: customer.first_name || prev.firstName,
        lastName: customer.last_name || prev.lastName,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
        country: customer.country || prev.country,
        address: customer.address || prev.address,
        city: customer.city || prev.city,
      }));
    }
  }, [customer]);

  const [payment, setPayment] = useState<string>("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const isSenegal = form.country === "Sénégal";
  const senegalMethods = ["Paiement à la livraison", "Wave", "Orange Money"];
  const intlMethods = ["Carte bancaire", "PayPal"];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!payment || items.length === 0) return;
    setLoading(true);

    const orderId = `FE-${Math.floor(1000 + Math.random() * 9000)}`;

    const { error: orderError } = await supabase.from('classic_orders').insert({
      id: orderId,
      customer: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.phone,
      country: form.country,
      address: form.address,
      city: form.city,
      subtotal_fcfa: cartTotalFCFA,
      shipping_fcfa: 0,
      total_fcfa: cartTotalFCFA,
      payment,
      status: "Nouveau"
    });

    if (!orderError) {
      const orderItems = items.map(it => ({
        order_id: orderId,
        product_id: it.product.id,
        size: it.size,
        qty: it.quantity
      }));
      await supabase.from('order_items').insert(orderItems);
    }

    setDone(true);
    setLoading(false);
    clearCart();
    setTimeout(() => navigate({ to: "/" }), 4000);
  };

  if (done) {
    return (
      <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-8 flex h-16 w-16 items-center justify-center border border-accent">
          <Check className="h-7 w-7 text-accent" />
        </div>
        <h1 className="font-serif text-4xl leading-tight">Commande confirmée</h1>
        <p className="mt-4 max-w-md text-sm text-muted-foreground">
          Merci pour votre confiance. Vous recevrez sous peu un message WhatsApp avec
          le numéro de suivi de votre colis.
        </p>
        <Link to="/" className="btn-editorial btn-primary mt-10">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-4xl">Votre sélection est vide</h1>
        <p className="mt-4 text-sm text-muted-foreground">
          Choisissez vos pièces avant de procéder au paiement.
        </p>
        <Link to="/collections" className="btn-editorial btn-primary mt-8">
          Explorer la collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1440px] px-6 py-16 lg:px-12 lg:py-24">
      <p className="ui-label mb-4 text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Accueil</Link> / Paiement
      </p>
      <h1 className="font-serif text-5xl leading-tight md:text-6xl">Paiement</h1>

      <div className="mt-16 grid grid-cols-1 gap-16 lg:grid-cols-[1.4fr_1fr]">
        {/* LEFT: Form */}
        <form className="space-y-14" onSubmit={handleSubmit}>
          <section>
            <p className="ui-label mb-6 text-accent">— I. Adresse de livraison</p>
            <div className="grid grid-cols-1 gap-x-6 gap-y-7 sm:grid-cols-2">
              <div>
                <label className="label-editorial">Prénom</label>
                <input value={form.firstName} onChange={e => setForm({...form, firstName: e.target.value})} className="input-editorial" placeholder="Aïssatou" required />
              </div>
              <div>
                <label className="label-editorial">Nom</label>
                <input value={form.lastName} onChange={e => setForm({...form, lastName: e.target.value})} className="input-editorial" placeholder="Diop" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label-editorial">Email</label>
                <input value={form.email} onChange={e => setForm({...form, email: e.target.value})} type="email" className="input-editorial" placeholder="aissatou@example.com" required />
              </div>
              <div className="sm:col-span-2">
                <label className="label-editorial">Adresse</label>
                <input value={form.address} onChange={e => setForm({...form, address: e.target.value})} className="input-editorial" placeholder="12 Rue Carnot" required />
              </div>
              <div>
                <label className="label-editorial">Ville</label>
                <input value={form.city} onChange={e => setForm({...form, city: e.target.value})} className="input-editorial" placeholder="Dakar" required />
              </div>
              <div>
                <label className="label-editorial">Code postal</label>
                <input value={form.zip} onChange={e => setForm({...form, zip: e.target.value})} className="input-editorial" placeholder="11000" />
              </div>
              <div className="sm:col-span-2">
                <label className="label-editorial">Pays</label>
                <select
                  className="input-editorial bg-transparent"
                  value={form.country}
                  onChange={(e) => {
                    setForm({...form, country: e.target.value});
                    setPayment("");
                  }}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="label-editorial">Téléphone</label>
                <input value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="input-editorial" placeholder="+221 77 000 00 00" required />
              </div>
            </div>
          </section>

          <section className="fade-in" key={form.country}>
            <p className="ui-label mb-6 text-accent">— II. Mode de paiement</p>
            <p className="mb-6 text-sm text-muted-foreground">
              {isSenegal
                ? "Méthodes locales disponibles pour le Sénégal"
                : `Paiement sécurisé international (${form.country})`}
            </p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {(isSenegal ? senegalMethods : intlMethods).map((m) => (
                <button
                  type="button"
                  key={m}
                  onClick={() => setPayment(m)}
                  className={`flex h-16 items-center justify-between border px-5 text-left transition-colors ${
                    payment === m
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  <span className="text-sm font-medium">{m}</span>
                  <span
                    className={`flex h-4 w-4 items-center justify-center border ${
                      payment === m ? "border-accent bg-accent" : "border-border"
                    }`}
                  >
                    {payment === m && <Check className="h-3 w-3 text-foreground" />}
                  </span>
                </button>
              ))}
            </div>
            {isSenegal && payment === "Wave" && (
              <p className="ui-label mt-4 text-muted-foreground">
                Vous serez invité à composer #999# après confirmation.
              </p>
            )}
            {!isSenegal && payment === "Carte bancaire" && (
              <div className="mt-6 border border-border p-5">
                <p className="ui-label mb-3 text-muted-foreground">Aperçu Stripe</p>
                <div className="space-y-4">
                  <input className="input-editorial" placeholder="Numéro de carte" />
                  <div className="grid grid-cols-2 gap-4">
                    <input className="input-editorial" placeholder="MM / AA" />
                    <input className="input-editorial" placeholder="CVC" />
                  </div>
                </div>
              </div>
            )}
          </section>

          <button
            type="submit"
            disabled={!payment || loading}
            className="btn-editorial btn-gold w-full disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : `Confirmer la commande — ${formatPrice(cartTotalFCFA, currency)}`}
          </button>
        </form>

        {/* RIGHT: Summary */}
        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="border border-border bg-surface p-8">
            <p className="ui-label mb-6 text-accent">— Votre sélection</p>
            <ul className="space-y-5 border-b border-border pb-6">
              {items.map((it) => (
                <li key={it.id} className="flex gap-4">
                  <div className="h-20 w-16 shrink-0 overflow-hidden bg-background">
                    <img src={it.product.image} alt={it.product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex flex-1 flex-col text-sm">
                    <p className="font-serif text-base leading-tight">{it.product.name}</p>
                    <p className="ui-label mt-1 text-muted-foreground">
                      Taille {it.size} · Qté {it.quantity}
                    </p>
                    <p className="mt-auto tabular-nums">
                      {formatPrice(it.product.priceFCFA * it.quantity, currency)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Sous-total</dt>
                <dd className="tabular-nums">{formatPrice(cartTotalFCFA, currency)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Livraison</dt>
                <dd className="ui-label text-accent">Offerte</dd>
              </div>
              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <dt className="ui-label">Total</dt>
                <dd className="font-serif text-2xl tabular-nums">
                  {formatPrice(cartTotalFCFA, currency)}
                </dd>
              </div>
            </dl>
          </div>
        </aside>
      </div>
    </div>
  );
}
