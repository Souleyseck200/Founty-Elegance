import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { type ClassicOrder, type CustomRequest } from "@/lib/adminMock";
import { Card, PageHeader, StatusBadge, formatDate, formatFCFA } from "@/components/admin/ui";
import { TrendingUp, Package, Scissors, ArrowUpRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { resolveCatalogImageUrl } from "@/lib/products";

export const Route = createFileRoute("/admin/")({
  component: DashboardPage,
});

function DashboardPage() {
  const [orders, setOrders] = useState<ClassicOrder[]>([]);
  const [requests, setRequests] = useState<CustomRequest[]>([]);

  useEffect(() => {
    async function fetchData() {
      const { data: oData } = await supabase.from('classic_orders').select(`
        *,
        order_items (
          *,
          products (*)
        )
      `);
      if (oData) {
        const mappedOrders: ClassicOrder[] = oData.map((d: any) => ({
          id: d.id,
          date: d.date,
          customer: d.customer,
          email: d.email,
          phone: d.phone,
          country: d.country,
          address: d.address,
          city: d.city,
          items: d.order_items?.map((item: any) => ({
             product: {
               id: item.products.id,
               name: item.products.name,
               priceFCFA: item.products.price_fcfa,
               image: resolveCatalogImageUrl(item.products.image)
             },
             size: item.size,
             qty: item.qty
          })) || [],
          subtotalFCFA: d.subtotal_fcfa,
          shippingFCFA: d.shipping_fcfa,
          totalFCFA: d.total_fcfa,
          payment: d.payment as any,
          status: d.status as any
        }));
        setOrders(mappedOrders);
      }

      const { data: rData } = await supabase.from('custom_requests').select('*');
      if (rData) {
        const mappedRequests: CustomRequest[] = rData.map(d => ({
          id: d.id,
          date: d.date,
          customer: d.customer,
          phone: d.phone,
          country: d.country,
          city: d.city,
          inspiration: d.inspiration,
          cut: d.cut as any,
          fabric: d.fabric,
          budgetFCFA: d.budget_fcfa,
          measurements: d.measurements,
          notes: d.notes,
          status: d.status as any
        }));
        setRequests(mappedRequests);
      }
    }
    fetchData();
  }, []);

  const monthRevenue = useMemo(
    () =>
      orders.filter((o) => {
        const d = new Date(o.date);
        const now = new Date();
        return (
          d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
        );
      }).reduce((s, o) => s + o.totalFCFA, 0) +
      requests.filter((r) => r.status === "Livré").reduce(
        (s, r) => s + r.budgetFCFA,
        0,
      ),
    [orders, requests],
  );

  const pendingClassic = orders.filter(
    (o) => o.status === "En préparation",
  ).length;
  const newCustom = requests.filter((r) => r.status === "Nouveau").length;

  // Recent activity: mix
  const activity = useMemo(() => {
    const c = orders.map((o) => ({
      kind: "classic" as const,
      id: o.id,
      date: o.date,
      label: o.customer,
      detail: `${o.items.length} article${o.items.length > 1 ? "s" : ""} · ${o.country}`,
      amount: o.totalFCFA,
      status: o.status,
    }));
    const s = requests.map((r) => ({
      kind: "custom" as const,
      id: r.id,
      date: r.date,
      label: r.customer,
      detail: `${r.cut} · ${r.fabric}`,
      amount: r.budgetFCFA,
      status: r.status,
    }));
    return [...c, ...s].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 6);
  }, [orders, requests]);

  return (
    <div>
      <PageHeader
        eyebrow="Vue d'ensemble"
        title="Bonjour, Maître Founty"
        description="Voici l'activité récente de l'atelier et de la boutique en ligne."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Kpi
          icon={TrendingUp}
          label="Chiffre d'affaires du mois"
          value={formatFCFA(monthRevenue)}
          hint="+12% vs mois dernier"
        />
        <Kpi
          icon={Package}
          label="Commandes en attente"
          value={String(pendingClassic).padStart(2, "0")}
          hint="Prêt-à-porter à préparer"
        />
        <Kpi
          icon={Scissors}
          label="Nouvelles demandes Sur-Mesure"
          value={String(newCustom).padStart(2, "0")}
          hint="À traiter aujourd'hui"
          highlight
        />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
            <div>
              <h2 className="font-serif text-lg">Activité récente</h2>
              <p className="text-xs text-gray-500">Mélange commandes & demandes sur-mesure</p>
            </div>
            <Link
              to="/admin/sur-mesure"
              className="inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wider text-gray-700 hover:text-[#111111]"
            >
              Tout voir <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                  <th className="px-5 py-3 font-medium">Type</th>
                  <th className="px-5 py-3 font-medium">Référence</th>
                  <th className="px-5 py-3 font-medium">Client</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                  <th className="px-5 py-3 font-medium">Statut</th>
                  <th className="px-5 py-3 text-right font-medium">Montant</th>
                </tr>
              </thead>
              <tbody>
                {activity.map((row) => (
                  <tr key={row.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          row.kind === "custom"
                            ? "bg-[#D4AF37]/15 text-[#7A6320]"
                            : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {row.kind === "custom" ? "Sur-mesure" : "Boutique"}
                      </span>
                    </td>
                    <td className="px-5 py-3 font-mono text-xs text-gray-600">{row.id}</td>
                    <td className="px-5 py-3 font-medium text-[#111111]">{row.label}</td>
                    <td className="px-5 py-3 text-gray-500">{formatDate(row.date)}</td>
                    <td className="px-5 py-3">
                      <StatusBadge status={row.status} kind={row.kind} />
                    </td>
                    <td className="px-5 py-3 text-right font-serif tabular-nums">
                      {formatFCFA(row.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="overflow-hidden">
          <div className="bg-[#0E0E0E] px-5 py-5 text-white">
            <Sparkles className="h-5 w-5 text-[#D4AF37]" />
            <h3 className="mt-3 font-serif text-xl leading-snug">
              L'atelier brille <span className="italic text-[#D4AF37]">ce mois-ci</span>
            </h3>
            <p className="mt-2 text-sm text-white/70">
              {newCustom} nouvelles demandes sur-mesure attendent votre regard d'expert.
            </p>
            <Link
              to="/admin/sur-mesure"
              className="mt-5 inline-flex items-center gap-2 border border-[#D4AF37] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#111111]"
            >
              Ouvrir l'atelier <ArrowUpRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="px-5 py-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-400">
              — Répartition
            </p>
            <div className="mt-3 space-y-3">
              <Bar label="Sénégal" value={68} />
              <Bar label="France" value={22} />
              <Bar label="Mali / autres" value={10} />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  hint,
  highlight = false,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`relative rounded-lg bg-white p-5 shadow-[0_1px_2px_rgba(16,16,16,0.04)] ${
        highlight ? "border-2 border-[#D4AF37]" : "border border-gray-200/70"
      }`}
    >
      {highlight && (
        <span className="absolute -top-2 right-4 rounded-full bg-[#D4AF37] px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-[#111111]">
          Priorité
        </span>
      )}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-wider text-gray-500">{label}</p>
          <p className="mt-2 font-serif text-3xl tabular-nums text-[#111111]">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-500">{hint}</p>}
        </div>
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-md ${
            highlight ? "bg-[#D4AF37]/15 text-[#7A6320]" : "bg-gray-100 text-gray-600"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}

function Bar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-gray-600">{label}</span>
        <span className="tabular-nums text-gray-500">{value}%</span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full bg-[#111111]"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
}
