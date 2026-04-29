import { useEffect, useState } from "react";
import { X, ArrowLeft, Sparkles, Check } from "lucide-react";
import { useStore } from "@/lib/store";
import { SIZES, type Size } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { ProductImageSlider } from "./ProductImageSlider";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";

type Mode = "choice" | "rtw" | "custom" | "success-rtw" | "success-custom";

const MEASUREMENT_FIELDS_TOP = [
  { key: "poitrine", label: "Poitrine" },
  { key: "taille_haut", label: "Taille (haut)" },
  { key: "epaules", label: "Épaules" },
  { key: "bras", label: "Longueur bras" },
  { key: "cou", label: "Tour de cou" },
  { key: "manche", label: "Tour de manche" },
] as const;

const MEASUREMENT_FIELDS_BOTTOM = [
  { key: "taille_bas", label: "Taille (bas)" },
  { key: "hanches", label: "Hanches" },
  { key: "jambes", label: "Longueur jambes" },
  { key: "cuisses", label: "Tour de cuisses" },
] as const;

export function OrderDrawer() {
  const { orderProduct, orderOpen, closeOrder, addToCart, openOrder, currency, setCartOpen } =
    useStore();
  const [mode, setMode] = useState<Mode>("choice");
  const [step, setStep] = useState(1);
  const [size, setSize] = useState<Size>("M");
  const [loading, setLoading] = useState(false);
  const { customer } = useAuth();
  
  // Custom form state
  const [contact, setContact] = useState({ nom: customer?.first_name ? `${customer.first_name} ${customer.last_name || ''}`.trim() : "", telephone: customer?.phone || "", pays: customer?.country || "Sénégal" });
  const [meas, setMeas] = useState<Record<string, string>>(customer?.measurements || {});
  const [opts, setOpts] = useState<{ coupe: string; notes: string; modele?: string; client?: string; tissu?: string }>({
    coupe: "Normal",
    notes: "",
  });

  useEffect(() => {
    if (orderOpen && customer) {
      setContact({
        nom: (`${customer.first_name || ''} ${customer.last_name || ''}`).trim(),
        telephone: customer.phone || "",
        pays: customer.country || "Sénégal",
      });
      setMeas(customer.measurements || {});
    }
  }, [orderOpen, customer]);

  useEffect(() => {
    document.body.style.overflow = orderOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [orderOpen]);

  useEffect(() => {
    if (orderOpen) {
      // If "Sur Mesure" CTA opened with no product, jump straight to custom flow
      if (!orderProduct) {
        setMode("custom");
        setStep(1);
      } else if (orderProduct.customEnabled === false) {
        // No custom option available — go directly to ready-to-wear
        setMode("rtw");
        setStep(1);
      } else {
        setMode("choice");
        setStep(1);
      }
      // Reset to first available size
      if (orderProduct?.sizesAvailable?.length) {
        setSize(orderProduct.sizesAvailable[0]);
      }
    }
  }, [orderOpen, orderProduct]);

  const close = () => {
    closeOrder();
    setTimeout(() => {
      setMode("choice");
      setStep(1);
      setSize("M");
      setContact({ nom: "", telephone: "", pays: "Sénégal" });
      setMeas({});
      setOpts({ coupe: "Normal", notes: "" });
    }, 500);
  };

  const handleAddToCart = () => {
    if (orderProduct) {
      addToCart(orderProduct, size);
      setMode("success-rtw");
    }
  };

  const submitCustom = async () => {
    setLoading(true);
    const requestId = `SM-${Math.floor(Math.random() * 10000)}`;
    const { error } = await supabase.from('custom_requests').insert({
      id: requestId,
      customer: contact.nom || "Inconnu",
      phone: contact.telephone || "Inconnu",
      country: contact.pays || "Sénégal",
      city: "Non précisée",
      inspiration: orderProduct ? `Produit Catalogue : ${orderProduct.name}` : "Modèle unique",
      cut: opts.coupe || "Normal",
      fabric: orderProduct?.material || "À définir",
      budget_fcfa: 0,
      measurements: meas,
      notes: opts.notes,
      email: customer?.email || null,
      image_model: orderProduct ? orderProduct.image : (opts.modele || null),
      image_client: opts.client || null,
      image_fabric: opts.tissu || null,
      status: "Nouveau"
    });
    setLoading(false);
    if (error) {
      console.error("Failed to insert custom request:", error);
    }
    setMode("success-custom");
  };

  const totalSteps = 4;
  const progress = mode === "custom" ? (step / totalSteps) * 100 : 0;

  return (
    <>
      <div
        onClick={close}
        className={`fixed inset-0 z-40 bg-foreground/40 transition-opacity duration-500 ${
          orderOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <aside
        className={`fixed bottom-0 right-0 z-50 flex h-[92dvh] w-full flex-col bg-background shadow-[var(--shadow-editorial)] transition-transform duration-500 sm:bottom-auto sm:top-0 sm:h-full sm:max-w-[560px] ${
          orderOpen
            ? "translate-y-0 sm:translate-x-0"
            : "translate-y-full sm:translate-x-full sm:translate-y-0"
        }`}
        style={{ transitionTimingFunction: "cubic-bezier(0.25,1,0.5,1)" }}
      >
        {/* Progress bar (custom only) */}
        {mode === "custom" && (
          <div className="absolute left-0 right-0 top-0 h-[2px] bg-border">
            <div
              className="h-full bg-accent transition-[width] duration-500"
              style={{ width: `${progress}%`, transitionTimingFunction: "cubic-bezier(0.25,1,0.5,1)" }}
            />
          </div>
        )}

        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          {mode === "custom" && step > 1 ? (
            <button
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              className="ui-label flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
          ) : mode !== "choice" && mode !== "success-custom" && mode !== "success-rtw" && orderProduct ? (
            <button
              onClick={() => setMode("choice")}
              className="ui-label flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" /> Retour
            </button>
          ) : (
            <p className="ui-label text-muted-foreground">
              {mode === "custom"
                ? `Étape ${step} / ${totalSteps}`
                : orderProduct
                  ? "Commander"
                  : "Sur Mesure"}
            </p>
          )}
          <button onClick={close} aria-label="Fermer">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8">
          {mode === "choice" && orderProduct && (
            <ChoiceView
              productName={orderProduct.name}
              onPick={(m) => {
                setMode(m);
                setStep(1);
              }}
            />
          )}

          {mode === "rtw" && orderProduct && (
            <div className="fade-in">
              <div className="mb-8 overflow-hidden border border-border bg-surface">
                <ProductImageSlider
                  images={orderProduct.images?.length ? orderProduct.images : [orderProduct.image]}
                  alt={orderProduct.name}
                  variant="detail"
                  aspect="4 / 3"
                />
              </div>
              <div className="mb-8">
                <h3 className="font-serif text-2xl leading-tight">{orderProduct.name}</h3>
                <p className="ui-label mt-2 text-muted-foreground">{orderProduct.material}</p>
                <p className="mt-2 text-base tabular-nums">
                  {formatPrice(orderProduct.priceFCFA, currency)}
                </p>
              </div>
              <p className="label-editorial">Votre taille</p>
              <div className="grid grid-cols-5 gap-3">
                {SIZES.map((s) => {
                  const available = (orderProduct.sizesAvailable ?? SIZES).includes(s);
                  return (
                    <button
                      key={s}
                      onClick={() => available && setSize(s)}
                      disabled={!available}
                      className={`flex h-16 items-center justify-center border text-base font-medium transition-all ${
                        !available
                          ? "cursor-not-allowed border-border bg-surface text-muted-foreground/40 line-through"
                          : size === s
                            ? "border-foreground bg-foreground text-background"
                            : "border-border hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  );
                })}
              </div>
              {orderProduct.customEnabled !== false && (
                <p className="ui-label mt-4 text-muted-foreground">
                  Hésitez? Optez pour le sur-mesure pour un ajustement parfait.
                </p>
              )}
              <button
                onClick={handleAddToCart}
                disabled={!(orderProduct.sizesAvailable ?? SIZES).includes(size)}
                className="btn-editorial btn-gold mt-10 w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                Ajouter au panier
              </button>
              {orderProduct.customEnabled !== false && (
                <button
                  onClick={() => setMode("custom")}
                  className="btn-editorial btn-ghost mt-3 w-full"
                >
                  <Sparkles className="h-4 w-4 text-accent" /> Préférer le sur-mesure
                </button>
              )}
            </div>
          )}

          {mode === "custom" && (
            <div className="fade-in">
              {orderProduct && step === 1 && (
                <p className="ui-label mb-3 text-accent">Sur-mesure pour {orderProduct.name}</p>
              )}
              {step === 1 && (
                <CustomStep1 contact={contact} setContact={setContact} />
              )}
              {step === 2 && <CustomStep2 meas={meas} setMeas={setMeas} />}
              {step === 3 && <CustomStep3 opts={opts} setOpts={setOpts} hideModelPhoto={!!orderProduct} />}
              {step === 4 && (
                <CustomStep4 contact={contact} meas={meas} opts={opts} product={orderProduct} />
              )}
            </div>
          )}

          {mode === "success-rtw" && orderProduct && (
            <SuccessView
              title="Pièce ajoutée"
              text={`${orderProduct.name} — Taille ${size} a rejoint votre sélection.`}
              primary={{
                label: "Voir le panier",
                onClick: () => {
                  close();
                  setTimeout(() => setCartOpen(true), 550);
                },
              }}
              secondary={{ label: "Continuer", onClick: close }}
            />
          )}

          {mode === "success-custom" && (
            <SuccessView
              title="Demande transmise"
              text="Notre atelier vous contacte sous 24h pour confirmer votre commande sur-mesure. Aucun paiement n'est requis à cette étape."
              primary={{ label: "Fermer", onClick: close }}
            />
          )}
        </div>

        {/* Footer actions for custom flow */}
        {mode === "custom" && (
          <div className="border-t border-border px-6 py-5 sm:px-8">
            {step < totalSteps ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={step === 1 && (!contact.nom || !contact.telephone)}
                className="btn-editorial btn-primary w-full disabled:cursor-not-allowed disabled:opacity-40"
              >
                Continuer
              </button>
            ) : (
              <button disabled={loading} onClick={submitCustom} className="btn-editorial btn-gold w-full disabled:cursor-not-allowed disabled:opacity-40">
                {loading ? "Envoi en cours..." : "Envoyer ma demande"}
              </button>
            )}
            <p className="ui-label mt-3 text-center text-muted-foreground">
              Aucun paiement requis maintenant
            </p>
          </div>
        )}
      </aside>
    </>
  );
}

function ChoiceView({
  productName,
  onPick,
}: {
  productName: string;
  onPick: (m: "rtw" | "custom") => void;
}) {
  return (
    <div className="fade-in">
      <p className="ui-label mb-2 text-muted-foreground">{productName}</p>
      <h2 className="mb-10 font-serif text-3xl leading-tight">
        Comment souhaitez-vous être habillé&nbsp;?
      </h2>
      <div className="grid gap-4">
        <button
          onClick={() => onPick("rtw")}
          className="group flex h-44 flex-col items-start justify-between border border-border bg-surface p-6 text-left transition-colors hover:border-foreground hover:bg-background"
        >
          <p className="ui-label text-muted-foreground group-hover:text-accent">Option I</p>
          <div>
            <h3 className="font-serif text-2xl">Prêt-à-porter</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Choisissez votre taille standard. Expédition immédiate.
            </p>
          </div>
        </button>
        <button
          onClick={() => onPick("custom")}
          className="group flex h-44 flex-col items-start justify-between border border-foreground bg-foreground p-6 text-left text-background transition-colors hover:bg-accent hover:text-foreground"
        >
          <p className="ui-label flex items-center gap-2 text-accent group-hover:text-foreground">
            <Sparkles className="h-3.5 w-3.5" /> Option II
          </p>
          <div>
            <h3 className="font-serif text-2xl">Sur-Mesure</h3>
            <p className="mt-2 text-sm opacity-80">
              Vos mensurations exactes. Coupé et cousu pour vous à Dakar.
            </p>
          </div>
        </button>
      </div>
    </div>
  );
}

function CustomStep1({
  contact,
  setContact,
}: {
  contact: { nom: string; telephone: string; pays: string };
  setContact: (c: { nom: string; telephone: string; pays: string }) => void;
}) {
  return (
    <div>
      <h2 className="mb-2 font-serif text-3xl">Vos coordonnées</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Pour confirmer votre commande sur-mesure.
      </p>
      <div className="space-y-7">
        <div>
          <label className="label-editorial">Nom complet</label>
          <input
            className="input-editorial"
            value={contact.nom}
            onChange={(e) => setContact({ ...contact, nom: e.target.value })}
            placeholder="Aïssatou Diop"
          />
        </div>
        <div>
          <label className="label-editorial">Téléphone (WhatsApp)</label>
          <input
            className="input-editorial"
            value={contact.telephone}
            onChange={(e) => setContact({ ...contact, telephone: e.target.value })}
            placeholder="+221 77 000 00 00"
          />
        </div>
        <div>
          <label className="label-editorial">Pays</label>
          <select
            className="input-editorial bg-transparent"
            value={contact.pays}
            onChange={(e) => setContact({ ...contact, pays: e.target.value })}
          >
            <option>Sénégal</option>
            <option>France</option>
            <option>Côte d'Ivoire</option>
            <option>Mali</option>
            <option>États-Unis</option>
            <option>Royaume-Uni</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function CustomStep2({
  meas,
  setMeas,
}: {
  meas: Record<string, string>;
  setMeas: (m: Record<string, string>) => void;
}) {
  const set = (k: string, v: string) => setMeas({ ...meas, [k]: v });
  return (
    <div>
      <h2 className="mb-2 font-serif text-3xl">Vos mensurations</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Toutes les valeurs en centimètres.
      </p>
      <div className="space-y-10">
        <div>
          <p className="ui-label mb-5 text-accent">Le haut</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-7">
            {MEASUREMENT_FIELDS_TOP.map((f) => (
              <div key={f.key}>
                <label className="label-editorial">{f.label}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input-editorial tabular-nums"
                  value={meas[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder="cm"
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <p className="ui-label mb-5 text-accent">Le bas</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-7">
            {MEASUREMENT_FIELDS_BOTTOM.map((f) => (
              <div key={f.key}>
                <label className="label-editorial">{f.label}</label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="input-editorial tabular-nums"
                  value={meas[f.key] ?? ""}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder="cm"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function CustomStep3({
  opts,
  setOpts,
  hideModelPhoto,
}: {
  opts: { coupe: string; notes: string; modele?: string; client?: string; tissu?: string };
  setOpts: (o: { coupe: string; notes: string; modele?: string; client?: string; tissu?: string }) => void;
  hideModelPhoto?: boolean;
}) {
  return (
    <div>
      <h2 className="mb-2 font-serif text-3xl">Vos préférences</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Précisez la coupe, joignez vos inspirations.
      </p>
      <div className="space-y-8">
        <div>
          <p className="label-editorial">Type de coupe</p>
          <div className="grid grid-cols-3 gap-3">
            {["Ajusté", "Normal", "Large"].map((c) => (
              <button
                key={c}
                onClick={() => setOpts({ ...opts, coupe: c })}
                className={`flex h-14 items-center justify-center border text-sm transition ${
                  opts.coupe === c
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:border-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {!hideModelPhoto && (
            <FileField
              label="Photo modèle souhaité"
              value={opts.modele}
              onChange={(v) => setOpts({ ...opts, modele: v })}
            />
          )}
          <FileField
            label="Votre photo"
            value={opts.client}
            onChange={(v) => setOpts({ ...opts, client: v })}
          />
          <div className={hideModelPhoto ? "col-span-1" : "col-span-2"}>
            <FileField
              label="Échantillon de tissu (optionnel)"
              value={opts.tissu}
              onChange={(v) => setOpts({ ...opts, tissu: v })}
            />
          </div>
        </div>
        <div>
          <label className="label-editorial">Notes complémentaires</label>
          <textarea
            rows={4}
            className="input-editorial !h-auto resize-none border-b py-2"
            value={opts.notes}
            onChange={(e) => setOpts({ ...opts, notes: e.target.value })}
            placeholder="Précisions sur la couleur, les broderies, l'usage..."
          />
        </div>
      </div>
    </div>
  );
}

function FileField({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
}) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `custom-requests/${fileName}`;

    const { error } = await supabase.storage.from('founty-images').upload(filePath, file);

    if (error) {
      console.error('Error uploading:', error);
      alert('Erreur lors du téléchargement de l\'image.');
    } else {
      const { data } = supabase.storage.from('founty-images').getPublicUrl(filePath);
      onChange(data.publicUrl);
    }
    setUploading(false);
  };

  return (
    <label className="block cursor-pointer">
      <span className="label-editorial">{label}</span>
      <span
        className={`mt-1 flex h-24 items-center justify-center border border-dashed px-3 text-center text-xs ${
          value ? "border-accent text-accent" : "border-border text-muted-foreground"
        }`}
      >
        {uploading ? "Envoi..." : value ? "Image ajoutée" : "Cliquez pour téléverser"}
      </span>
      <input
        type="file"
        accept="image/*"
        className="hidden"
        disabled={uploading}
        onChange={handleFileChange}
      />
    </label>
  );
}

function CustomStep4({
  contact,
  meas,
  opts,
  product,
}: {
  contact: { nom: string; telephone: string; pays: string };
  meas: Record<string, string>;
  opts: { coupe: string; notes: string; modele?: string; client?: string; tissu?: string };
  product: ReturnType<typeof useStore>["orderProduct"];
}) {
  const measCount = Object.values(meas).filter(Boolean).length;
  return (
    <div>
      <h2 className="mb-2 font-serif text-3xl">Validation</h2>
      <p className="mb-8 text-sm text-muted-foreground">
        Récapitulatif avant envoi à notre atelier.
      </p>
      <dl className="space-y-5 border-y border-border py-6 text-sm">
        {product && (
          <Row label="Pièce inspirée" value={product.name} />
        )}
        <Row label="Nom" value={contact.nom || "—"} />
        <Row label="Téléphone" value={contact.telephone || "—"} />
        <Row label="Pays" value={contact.pays} />
        <Row label="Coupe" value={opts.coupe} />
        <Row label="Mensurations renseignées" value={`${measCount} / 10`} />
        {opts.notes && <Row label="Notes" value={opts.notes} />}
      </dl>
      <p className="mt-6 text-sm leading-relaxed text-muted-foreground">
        Aucun paiement n'est requis à cette étape. Notre atelier vous contactera sous 24h
        pour confirmer le devis et valider votre commande.
      </p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="ui-label text-muted-foreground">{label}</dt>
      <dd className="text-right font-serif text-base text-foreground">{value}</dd>
    </div>
  );
}

function SuccessView({
  title,
  text,
  primary,
  secondary,
}: {
  title: string;
  text: string;
  primary: { label: string; onClick: () => void };
  secondary?: { label: string; onClick: () => void };
}) {
  return (
    <div className="fade-in flex h-full flex-col items-center justify-center text-center">
      <div className="mb-8 flex h-16 w-16 items-center justify-center border border-accent">
        <Check className="h-7 w-7 text-accent" />
      </div>
      <h2 className="mb-3 font-serif text-3xl">{title}</h2>
      <p className="max-w-sm text-sm text-muted-foreground">{text}</p>
      <div className="mt-10 flex w-full max-w-xs flex-col gap-3">
        <button onClick={primary.onClick} className="btn-editorial btn-primary w-full">
          {primary.label}
        </button>
        {secondary && (
          <button onClick={secondary.onClick} className="btn-editorial btn-ghost w-full">
            {secondary.label}
          </button>
        )}
      </div>
    </div>
  );
}
