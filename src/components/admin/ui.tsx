import type { ReactNode } from "react";
import type { ClassicOrderStatus, CustomRequestStatus } from "@/lib/adminMock";

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-2 text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
            — {eyebrow}
          </p>
        )}
        <h1 className="font-serif text-3xl text-[#111111] lg:text-4xl">{title}</h1>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm font-light text-gray-500">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-200/70 bg-white shadow-[0_1px_2px_rgba(16,16,16,0.04)] ${className}`}
    >
      {children}
    </div>
  );
}

const customStatusStyles: Record<CustomRequestStatus, string> = {
  Nouveau: "bg-[#D4AF37]/15 text-[#7A6320] border border-[#D4AF37]/30",
  "Devis Envoyé": "bg-blue-50 text-blue-700 border border-blue-100",
  "En Confection": "bg-purple-50 text-purple-700 border border-purple-100",
  Livré: "bg-emerald-50 text-emerald-700 border border-emerald-100",
};

const classicStatusStyles: Record<ClassicOrderStatus, string> = {
  "En préparation": "bg-amber-50 text-amber-700 border border-amber-100",
  Expédié: "bg-blue-50 text-blue-700 border border-blue-100",
  Livré: "bg-emerald-50 text-emerald-700 border border-emerald-100",
  Annulé: "bg-rose-50 text-rose-700 border border-rose-100",
};

export function StatusBadge({
  status,
  kind,
}: {
  status: string;
  kind: "custom" | "classic";
}) {
  const cls =
    kind === "custom"
      ? customStatusStyles[status as CustomRequestStatus]
      : classicStatusStyles[status as ClassicOrderStatus];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
        cls ?? "bg-gray-100 text-gray-700 border border-gray-200"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}

export function formatFCFA(v: number) {
  return `${new Intl.NumberFormat("fr-FR").format(v)} FCFA`;
}

export function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}
