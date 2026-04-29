import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, PageHeader } from "@/components/admin/ui";
import { Plus, Trash2, Upload, AlertTriangle, Loader2 } from "lucide-react";

export const Route = createFileRoute("/admin/lookbook")({
  component: LookbookAdmin,
});

type Shape = "arch" | "circle" | "hex" | "diamond" | "wide";
type LookbookItem = { id: string; image_url: string; shape: Shape; created_at: string };

const SHAPES: { id: Shape; label: string }[] = [
  { id: "arch",    label: "Arche" },
  { id: "circle",  label: "Cercle" },
  { id: "hex",     label: "Hexagone" },
  { id: "diamond", label: "Losange" },
  { id: "wide",    label: "Large" },
];

function LookbookAdmin() {
  const [items, setItems] = useState<LookbookItem[]>([]);
  const [shape, setShape] = useState<Shape>("arch");
  const [uploading, setUploading] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    supabase.from("lookbook").select("*").order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setItems(data as LookbookItem[]); });
  }, []);

  const handleUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop();
      const path = `lookbook/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
      const { error: upErr } = await supabase.storage.from("founty-images").upload(path, file);
      if (upErr) { alert("Erreur upload: " + upErr.message); continue; }
      const { data: pub } = supabase.storage.from("founty-images").getPublicUrl(path);
      const { data: row, error: insErr } = await supabase.from("lookbook")
        .insert({ image_url: pub.publicUrl, shape })
        .select().single();
      if (insErr) { alert("Erreur enregistrement: " + insErr.message); continue; }
      setItems(prev => [row as LookbookItem, ...prev]);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleDelete = async (id: string) => {
    await supabase.from("lookbook").delete().eq("id", id);
    setItems(prev => prev.filter(i => i.id !== id));
    setConfirmDel(null);
  };

  return (
    <div>
      <PageHeader
        eyebrow="Boutique"
        title="Lookbook"
        description="Gérez les photos du lookbook artistique affiché sur la page d'accueil."
        action={null}
      />

      {/* Upload card */}
      <Card>
        <div className="p-6">
          <h3 className="font-serif text-lg text-[#111111] mb-4">Ajouter des photos (max 6)</h3>
          <p className="mb-4 text-xs text-gray-500">
            Les photos seront placées dans le collage album dans l'ordre d'upload. Pour de meilleurs résultats, uploadez des photos en format portrait (3:4).
          </p>
          <div
            onClick={() => fileRef.current?.click()}
            className="flex h-24 cursor-pointer items-center justify-center gap-3 rounded border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-400"
          >
            {uploading ? (
              <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
            ) : (
              <>
                <Upload className="h-5 w-5 text-gray-400" />
                <p className="text-sm text-gray-500">Cliquer pour uploader (multiple)</p>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={e => handleUpload(e.target.files)}
          />
        </div>
      </Card>

      {/* Gallery grid */}
      <Card>
        <div className="p-6">
          <h3 className="font-serif text-lg text-[#111111] mb-4">
            Photos publiées ({items.length})
          </h3>
          {items.length === 0 ? (
            <p className="text-sm text-gray-400 italic">Aucune photo dans le lookbook. Uploadez-en une ci-dessus.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {items.map(item => (
                <div key={item.id} className="group relative overflow-hidden rounded border border-gray-200">
                  <div className="aspect-square overflow-hidden bg-gray-100">
                    <img
                      src={item.image_url}
                      alt="Lookbook"
                      className="h-full w-full object-cover transition group-hover:scale-105"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <span
                      className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white"
                      style={{ background: "#3D2B1F" }}
                    >
                      {SHAPES.find(s => s.id === item.shape)?.label ?? item.shape}
                    </span>
                  </div>
                  {confirmDel === item.id ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 p-3">
                      <AlertTriangle className="h-5 w-5 text-rose-500" />
                      <p className="text-center text-xs font-medium">Supprimer cette photo ?</p>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmDel(null)} className="rounded border px-3 py-1 text-xs">Annuler</button>
                        <button onClick={() => handleDelete(item.id)} className="rounded bg-rose-600 px-3 py-1 text-xs text-white">Supprimer</button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmDel(item.id)}
                      className="absolute right-2 top-2 hidden rounded-full bg-white p-1.5 shadow-md transition hover:bg-rose-50 group-hover:flex"
                    >
                      <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
