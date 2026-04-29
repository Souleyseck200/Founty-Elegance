import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CLASSIC_STATUSES,
  type ClassicOrder,
  type ClassicOrderStatus,
} from "@/lib/adminMock";
import { Card, PageHeader, StatusBadge, formatDate, formatFCFA } from "@/components/admin/ui";
import { ClassicOrderDrawer } from "@/components/admin/ClassicOrderDrawer";
import { ChevronRight, Filter } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { resolveCatalogImageUrl } from "@/lib/products";

export const Route = createFileRoute("/admin/commandes")({
  component: CommandesPage,
});

function CommandesPage() {
  const [orders, setOrders] = useState<ClassicOrder[]>([]);
  const [filter, setFilter] = useState<ClassicOrderStatus | "Tous">("Tous");
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchOrders() {
      const { data, error } = await supabase.from('classic_orders').select(`
        *,
        order_items (
          *,
          products (*)
        )
      `);
      if (data) {
        const mapped: ClassicOrder[] = data.map((d: any) => ({
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
        mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setOrders(mapped);
      }
    }
    fetchOrders();
  }, []);

  const filtered = useMemo(
    () => (filter === "Tous" ? orders : orders.filter((o) => o.status === filter)),
    [orders, filter],
  );

  const setStatus = async (id: string, status: ClassicOrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await supabase.from('classic_orders').update({ status }).eq('id', id);
  };

  const active = activeId ? orders.find((o) => o.id === activeId) ?? null : null;

  return (
    <div>
      <PageHeader
        eyebrow="Boutique"
        title="Commandes Classiques"
        description="Prêt-à-porter — cliquez sur une commande pour voir le détail."
        action={
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-gray-500" />
            {(["Tous", ...CLASSIC_STATUSES] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className={`rounded-md border px-2.5 py-1.5 text-[11px] transition-colors ${
                  filter === s
                    ? "border-[#111111] bg-[#111111] text-white"
                    : "border-gray-200 bg-white text-gray-700 hover:border-[#111111]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      />

      <Card>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                <th className="px-5 py-3 font-medium">Commande</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Pays</th>
                <th className="px-5 py-3 font-medium">Articles</th>
                <th className="px-5 py-3 font-medium">Paiement</th>
                <th className="px-5 py-3 font-medium">Montant</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="w-10 px-3 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  onClick={() => setActiveId(o.id)}
                  className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50/80"
                >
                  <td className="px-5 py-4 font-mono text-xs text-gray-700">{o.id}</td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(o.date)}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#111111]">{o.customer}</div>
                    <div className="text-xs text-gray-500">{o.email}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{o.country}</td>
                  <td className="px-5 py-4 text-gray-700">
                    {o.items.reduce((s, i) => s + i.qty, 0)}
                    <span className="ml-1 text-xs text-gray-400">
                      · {o.items[0].product.name}
                      {o.items.length > 1 ? ` +${o.items.length - 1}` : ""}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="rounded-md bg-gray-100 px-2 py-0.5 text-[11px] font-medium text-gray-700">
                      {o.payment}
                    </span>
                  </td>
                  <td className="px-5 py-4 font-serif tabular-nums">{formatFCFA(o.totalFCFA)}</td>
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={o.status}
                      onChange={(e) => setStatus(o.id, e.target.value as ClassicOrderStatus)}
                      className="rounded-md border border-gray-200 bg-white px-2 py-1 text-xs focus:border-[#111111] focus:outline-none"
                    >
                      {CLASSIC_STATUSES.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <div className="mt-1.5">
                      <StatusBadge status={o.status} kind="classic" />
                    </div>
                  </td>
                  <td className="px-3 py-4 text-right text-gray-300">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-sm text-gray-500">
                    Aucune commande pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ClassicOrderDrawer
        order={active}
        onClose={() => setActiveId(null)}
        onStatusChange={setStatus}
      />
    </div>
  );
}
