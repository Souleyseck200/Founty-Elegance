import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import {
  CUSTOM_STATUSES,
  type CustomRequest,
  type CustomRequestStatus,
} from "@/lib/adminMock";
import { Card, PageHeader, StatusBadge, formatDate, formatFCFA } from "@/components/admin/ui";
import { CustomRequestDrawer } from "@/components/admin/CustomRequestDrawer";
import { Filter, ChevronRight } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/sur-mesure")({
  component: SurMesurePage,
});

function SurMesurePage() {
  const [requests, setRequests] = useState<CustomRequest[]>([]);
  const [filter, setFilter] = useState<CustomRequestStatus | "Tous">("Tous");
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchRequests() {
      const { data } = await supabase.from('custom_requests').select('*');
      if (data) {
        const mapped: CustomRequest[] = data.map(d => ({
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
          status: d.status as any,
          image_model: d.image_model,
          image_client: d.image_client,
          image_fabric: d.image_fabric
        }));
        mapped.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        setRequests(mapped);
      }
    }
    fetchRequests();
  }, []);

  const filtered = useMemo(
    () =>
      filter === "Tous"
        ? requests
        : requests.filter((r) => r.status === filter),
    [requests, filter],
  );

  const open = openId ? requests.find((r) => r.id === openId) ?? null : null;

  const updateStatus = async (id: string, status: CustomRequestStatus) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    await supabase.from('custom_requests').update({ status }).eq('id', id);
  };

  const updatePrice = async (id: string, price: number) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, budgetFCFA: price } : r)));
    await supabase.from('custom_requests').update({ budget_fcfa: price }).eq('id', id);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Atelier"
        title="Demandes Sur-Mesure"
        description="Pièces uniques en gestation. Cliquez sur une ligne pour ouvrir la fiche complète."
        action={
          <div className="flex items-center gap-2 text-xs">
            <Filter className="h-3.5 w-3.5 text-gray-500" />
            {(["Tous", ...CUSTOM_STATUSES] as const).map((s) => (
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
                <th className="px-5 py-3 font-medium">Référence</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 font-medium">Client</th>
                <th className="px-5 py-3 font-medium">Pays</th>
                <th className="px-5 py-3 font-medium">Coupe</th>
                <th className="px-5 py-3 font-medium">Budget</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setOpenId(r.id)}
                  className="cursor-pointer border-t border-gray-100 transition-colors hover:bg-gray-50/70"
                >
                  <td className="px-5 py-4 font-mono text-xs text-gray-600">{r.id}</td>
                  <td className="px-5 py-4 text-gray-600">{formatDate(r.date)}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-[#111111]">{r.customer}</div>
                    <div className="text-xs text-gray-500">{r.phone}</div>
                  </td>
                  <td className="px-5 py-4 text-gray-700">{r.country}</td>
                  <td className="px-5 py-4 text-gray-700">{r.cut}</td>
                  <td className="px-5 py-4 font-serif tabular-nums">{formatFCFA(r.budgetFCFA)}</td>
                  <td className="px-5 py-4">
                    <StatusBadge status={r.status} kind="custom" />
                  </td>
                  <td className="px-5 py-4 text-right text-gray-400">
                    <ChevronRight className="ml-auto h-4 w-4" />
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-500">
                    Aucune demande pour ce filtre.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <CustomRequestDrawer
        request={open}
        onClose={() => setOpenId(null)}
        onStatusChange={updateStatus}
        onPriceChange={updatePrice}
      />
    </div>
  );
}
