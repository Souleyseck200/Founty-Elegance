import { useEffect } from "react";
import { X, MapPin, Phone, Calendar, CreditCard, Check, Truck } from "lucide-react";
import {
  CLASSIC_STATUSES,
  type ClassicOrder,
  type ClassicOrderStatus,
} from "@/lib/adminMock";
import { StatusBadge, formatDate, formatFCFA } from "./ui";

const PAYMENT_LABELS: Record<string, string> = {
  Wave: "Payé via Wave",
  "Orange Money": "Payé via Orange Money",
  Carte: "Payé par Carte Bancaire",
  PayPal: "Payé via PayPal",
  "Paiement à la livraison": "Paiement à la livraison",
};

export function ClassicOrderDrawer({
  order,
  onClose,
  onStatusChange,
}: {
  order: ClassicOrder | null;
  onClose: () => void;
  onStatusChange: (id: string, status: ClassicOrderStatus) => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (order) {
      document.addEventListener("keydown", handler);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "";
    };
  }, [order, onClose]);

  if (!order) return null;

  const itemsCount = order.items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="flex h-full w-full max-w-2xl flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300 sm:max-w-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 bg-[#0E0E0E] px-6 py-5 text-white">
          <div className="min-w-0">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Commande · {order.id}
            </p>
            <h2 className="mt-1 truncate font-serif text-2xl">{order.customer}</h2>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[12px] text-white/70">
              {order.phone && (
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="h-3 w-3" />
                  {order.phone}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3 w-3" />
                {formatDate(order.date)}
              </span>
              <span>{order.email}</span>
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto bg-[#F7F7F8] px-6 py-6">
          {/* Status row */}
          <div className="mb-6 flex flex-wrap items-center gap-3">
            <StatusBadge status={order.status} kind="classic" />
            <div className="flex flex-wrap gap-1.5">
              {CLASSIC_STATUSES.map((s) => (
                <button
                  key={s}
                  onClick={() => onStatusChange(order.id, s)}
                  className={`rounded-md border px-2.5 py-1 text-[11px] transition-colors ${
                    order.status === s
                      ? "border-[#111111] bg-[#111111] text-white"
                      : "border-gray-200 bg-white text-gray-700 hover:border-[#111111]"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Shipping address */}
          <section className="rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg text-[#111111]">
              <MapPin className="h-4 w-4 text-[#D4AF37]" /> Adresse de livraison
            </h3>
            <div className="mt-3 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Destinataire</p>
                <p className="mt-1 font-medium text-[#111111]">{order.customer}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Pays</p>
                <p className="mt-1 text-[#111111]">{order.country}</p>
              </div>
              <div className="sm:col-span-2">
                <p className="text-[10px] uppercase tracking-wider text-gray-400">Adresse</p>
                <p className="mt-1 text-[#111111]">
                  {order.address}
                  <br />
                  {order.city}, {order.country}
                </p>
              </div>
            </div>
          </section>

          {/* Items */}
          <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="font-serif text-lg text-[#111111]">
              Articles
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({itemsCount} pièce{itemsCount > 1 ? "s" : ""})
              </span>
            </h3>
            <ul className="mt-4 divide-y divide-gray-100">
              {order.items.map((it, i) => (
                <li key={i} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <img
                    src={it.product.image}
                    alt={it.product.name}
                    className="h-16 w-16 shrink-0 object-cover ring-1 ring-gray-200"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-[#111111]">{it.product.name}</p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {it.product.material} · Taille{" "}
                      <span className="font-medium text-[#111111]">{it.size}</span> · Qté{" "}
                      <span className="font-medium text-[#111111]">{it.qty}</span>
                    </p>
                  </div>
                  <p className="font-serif text-sm tabular-nums text-[#111111]">
                    {formatFCFA(it.product.priceFCFA * it.qty)}
                  </p>
                </li>
              ))}
            </ul>
          </section>

          {/* Payment */}
          <section className="mt-5 rounded-lg border border-gray-200 bg-white p-5">
            <h3 className="flex items-center gap-2 font-serif text-lg text-[#111111]">
              <CreditCard className="h-4 w-4 text-[#D4AF37]" /> Paiement
            </h3>
            <div className="mt-3 rounded-md border border-gray-100 bg-gray-50 px-4 py-3">
              <p className="text-[11px] uppercase tracking-wider text-gray-500">
                Méthode utilisée
              </p>
              <p className="mt-1 text-sm font-medium text-[#111111]">
                {PAYMENT_LABELS[order.payment] ?? order.payment}
              </p>
            </div>
            <dl className="mt-4 space-y-2 text-sm">
              <PaymentRow label="Sous-total" value={formatFCFA(order.subtotalFCFA)} />
              <PaymentRow
                label={
                  <span className="inline-flex items-center gap-1.5">
                    <Truck className="h-3 w-3 text-gray-400" /> Frais de livraison
                  </span>
                }
                value={
                  order.shippingFCFA === 0 ? (
                    <span className="text-emerald-600">Offerts</span>
                  ) : (
                    formatFCFA(order.shippingFCFA)
                  )
                }
              />
              <div className="border-t border-gray-100 pt-2">
                <PaymentRow
                  label={<span className="font-medium text-[#111111]">Total</span>}
                  value={
                    <span className="font-serif text-lg text-[#111111] tabular-nums">
                      {formatFCFA(order.totalFCFA)}
                    </span>
                  }
                />
              </div>
            </dl>
          </section>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 flex flex-col gap-2 border-t border-gray-200 bg-white px-6 py-4 sm:flex-row sm:gap-3">
          {order.status !== "Livré" && (
            <button
              onClick={() => {
                const next: ClassicOrderStatus =
                  order.status === "En préparation"
                    ? "Expédié"
                    : order.status === "Expédié"
                      ? "Livré"
                      : "Expédié";
                onStatusChange(order.id, next);
              }}
              className="inline-flex h-12 flex-1 items-center justify-center gap-2 bg-[#111111] text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-black"
            >
              <Check className="h-4 w-4" />
              {order.status === "En préparation" ? "Marquer comme expédié" : "Marquer comme livré"}
            </button>
          )}
          <button
            onClick={onClose}
            className="inline-flex h-12 items-center justify-center gap-2 border border-gray-300 bg-white px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-700 transition-colors hover:border-[#111111] hover:text-[#111111]"
          >
            Fermer
          </button>
        </div>
      </aside>
    </div>
  );
}

function PaymentRow({
  label,
  value,
}: {
  label: React.ReactNode;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-gray-600">{label}</dt>
      <dd className="tabular-nums text-[#111111]">{value}</dd>
    </div>
  );
}
