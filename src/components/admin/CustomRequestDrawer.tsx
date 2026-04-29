import { X, MessageCircle, Check, Phone, MapPin, Calendar, Image as ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
  CUSTOM_STATUSES,
  type CustomRequest,
  type CustomRequestStatus,
} from "@/lib/adminMock";
import { StatusBadge, formatDate, formatFCFA } from "./ui";

export function CustomRequestDrawer({
  request,
  onClose,
  onStatusChange,
  onPriceChange,
}: {
  request: CustomRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: CustomRequestStatus) => void;
  onPriceChange?: (id: string, price: number) => void;
}) {
  const [priceInput, setPriceInput] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (request) setPriceInput(request.budgetFCFA.toString());
  }, [request]);
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (request) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [request, onClose]);

  if (!request) return null;

  const top = [
    { label: "Poitrine", v: request.measurements.poitrine },
    { label: "Taille (haut)", v: request.measurements.taille_haut },
    { label: "Épaules", v: request.measurements.epaules },
    { label: "Bras", v: request.measurements.bras },
    { label: "Longueur", v: request.measurements.longueur },
    { label: "Cou", v: request.measurements.cou },
  ];
  const bottom = [
    { label: "Taille (bas)", v: request.measurements.taille_bas },
    { label: "Hanches", v: request.measurements.hanches },
    { label: "Jambe", v: request.measurements.jambe },
    { label: "Cuisse", v: request.measurements.cuisse },
    { label: "Cheville", v: request.measurements.cheville },
  ];

  const meas = request.measurements || {};
  const measText = [
    meas.poitrine     && `Poitrine: ${meas.poitrine}cm`,
    meas.taille_haut  && `Taille (haut): ${meas.taille_haut}cm`,
    meas.epaules      && `Épaules: ${meas.epaules}cm`,
    meas.bras         && `Bras: ${meas.bras}cm`,
    meas.longueur     && `Longueur: ${meas.longueur}cm`,
    meas.cou          && `Cou: ${meas.cou}cm`,
    meas.taille_bas   && `Taille (bas): ${meas.taille_bas}cm`,
    meas.hanches      && `Hanches: ${meas.hanches}cm`,
    meas.jambe        && `Jambe: ${meas.jambe}cm`,
    meas.cuisse       && `Cuisse: ${meas.cuisse}cm`,
    meas.cheville     && `Cheville: ${meas.cheville}cm`,
  ].filter(Boolean).join("\n");

  const waMessage = [
    `Bonjour ${request.customer.split(" ")[0]} 👋`,
    `Founty Élégance vous contacte concernant votre demande sur-mesure *${request.id}*.`,
    ``,
    `*Modèle :* ${request.inspiration}`,
    `*Coupe :* ${request.cut}  |  *Tissu :* ${request.fabric}`,
    request.budgetFCFA > 0 ? `*Devis :* ${request.budgetFCFA.toLocaleString("fr-FR")} FCFA` : `*Devis :* En cours d'évaluation`,
    ``,
    measText ? `*Vos mesures :*\n${measText}` : "",
    ``,
    `N'hésitez pas à revenir vers nous pour toute question. Merci de votre confiance ! 🙏`,
  ].filter(s => s !== undefined).join("\n");

  const waLink = `https://wa.me/${request.phone.replace(/[^\d]/g, "")}?text=${encodeURIComponent(waMessage)}`;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="flex h-full w-full max-w-3xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 bg-[#0E0E0E] px-6 py-5 text-white">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Demande Sur-Mesure · {request.id}
            </p>
            <h2 className="mt-1 truncate font-serif text-2xl">{request.customer}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/70">
              <span className="inline-flex items-center gap-1.5"><Phone className="h-3 w-3" />{request.phone}</span>
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-3 w-3" />{request.city}, {request.country}</span>
              <span className="inline-flex items-center gap-1.5"><Calendar className="h-3 w-3" />{formatDate(request.date)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label="Fermer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body — scrollable */}
        <div className="flex-1 overflow-y-auto bg-[#F7F7F8] px-6 py-6">
          {/* Status row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={request.status} kind="custom" />
            <div className="flex flex-wrap gap-1.5">
              {CUSTOM_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(request.id, s)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                    request.status === s
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#111111]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Mensurations */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="font-serif text-lg text-[#111111]">Mensurations</h3>
            <p className="mb-4 text-[11px] uppercase tracking-wider text-gray-400">
              Toutes les mesures en centimètres
            </p>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  — Haut du corps
                </p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
                  {top.map((m) => (
                    <MeasureCell key={m.label} label={m.label} value={m.v} />
                  ))}
                </dl>
              </div>
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
                  — Bas du corps
                </p>
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-3 md:grid-cols-2">
                  {bottom.map((m) => (
                    <MeasureCell key={m.label} label={m.label} value={m.v} />
                  ))}
                </dl>
              </div>
            </div>
          </section>

          {/* Médias & options */}
          <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="font-serif text-lg text-[#111111]">Médias & options</h3>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500">Coupe</p>
                <p className="mt-1 font-serif text-xl text-[#111111]">{request.cut}</p>
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gray-500">Tissu choisi</p>
                <p className="mt-1 font-serif text-xl text-[#111111]">{request.fabric}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              <MediaPlaceholder label="Photo du client" url={request.image_client} />
              <MediaPlaceholder label="Modèle d'inspiration" url={request.image_model} />
              <MediaPlaceholder label="Échantillon tissu" url={request.image_fabric} />
            </div>

            <div className="mt-5">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">Inspiration</p>
              <p className="mt-1 text-sm text-[#111111]">{request.inspiration}</p>
            </div>
            {request.notes && (
              <div className="mt-4">
                <p className="text-[11px] uppercase tracking-wider text-gray-500">Notes client</p>
                <p className="mt-1 text-sm italic text-gray-700">« {request.notes} »</p>
              </div>
            )}
          </section>

          {/* Devis section */}
          <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="font-serif text-lg text-[#111111]">Devis & Tarification</h3>
            <div className="mt-4 flex items-end gap-3">
              <div className="flex-1">
                <label className="text-[11px] uppercase tracking-wider text-gray-500">Montant proposé (FCFA)</label>
                <input 
                  type="number" 
                  value={priceInput}
                  onChange={(e) => setPriceInput(e.target.value)}
                  className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none focus:ring-1 focus:ring-black"
                  placeholder="0"
                />
              </div>
              <button 
                disabled={isSaving}
                onClick={async () => {
                  if (onPriceChange) {
                    setIsSaving(true);
                    await onPriceChange(request.id, parseInt(priceInput, 10) || 0);
                    setIsSaving(false);
                    setSaved(true);
                    setTimeout(() => setSaved(false), 2000);
                  }
                }}
                className={`rounded px-4 py-2 text-[11px] font-medium uppercase tracking-[0.1em] text-white transition-all ${
                  saved ? "bg-green-600" : "bg-[#111111] hover:bg-black"
                } disabled:opacity-50`}
              >
                {isSaving ? "..." : saved ? "Enregistré !" : "Enregistrer"}
              </button>
            </div>
            {request.budgetFCFA === 0 ? (
              <p className="mt-2 text-xs text-amber-600">Devis non fixé. Le client voit "Sur devis".</p>
            ) : (
              <p className="mt-2 text-xs text-green-600">Devis actuel : {formatFCFA(request.budgetFCFA)}. Le client voit ce prix.</p>
            )}
          </section>
        </div>

        {/* Sticky footer */}
        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:gap-3">
          <button
            onClick={() => onStatusChange(request.id, "Livré")}
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-[#111111] text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-black"
          >
            <Check className="h-4 w-4" /> Marquer comme traité
          </button>
          <a
            href={waLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-[#25D366] text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-[#1eb957]"
          >
            <MessageCircle className="h-4 w-4" /> Contacter le client
          </a>
        </div>
      </aside>
    </div>
  );
}

function MeasureCell({ label, value }: { label: string; value: number }) {
  return (
    <div className="border-b border-gray-100 pb-2">
      <dt className="text-[10px] uppercase tracking-wider text-gray-400">{label}</dt>
      <dd className="mt-0.5 font-serif text-lg tabular-nums text-[#111111]">
        {value}
        <span className="ml-0.5 text-xs text-gray-400">cm</span>
      </dd>
    </div>
  );
}

function MediaPlaceholder({ label, url }: { label: string; url?: string | null }) {
  if (url) {
    return (
      <a href={url} target="_blank" rel="noreferrer" className="group relative block aspect-square overflow-hidden rounded border border-gray-200">
        <img src={url} alt={label} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
        <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-2">
          <span className="text-[10px] uppercase tracking-wider text-white">{label}</span>
        </div>
      </a>
    );
  }

  return (
    <div className="flex aspect-square flex-col items-center justify-center gap-2 border border-dashed border-gray-300 bg-[#FAFAFA] text-gray-400">
      <ImageIcon className="h-6 w-6" />
      <span className="px-2 text-center text-[10px] uppercase tracking-wider">{label}</span>
    </div>
  );
}
