import { createFileRoute } from "@tanstack/react-router";
import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import {
  MATERIALS,
  SIZES,
  type Category,
  type Material,
  type Product,
  type Size,
} from "@/lib/products";
import { useStore } from "@/lib/store";
import { Card, PageHeader, formatFCFA } from "@/components/admin/ui";
import {
  Plus,
  Pencil,
  X,
  Trash2,
  Upload,
  AlertTriangle,
  Sparkles,
  ImageIcon,
  Loader2,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

export const Route = createFileRoute("/admin/catalogue")({
  component: CataloguePage,
});

type Draft = {
  id?: string;
  name: string;
  category: Category;
  material: Material;
  priceFCFA: number;
  description: string;
  images: string[];
  sizesAvailable: Size[];
  customEnabled: boolean;
};

const emptyDraft: Draft = {
  name: "",
  category: "boubous",
  material: "Bazin",
  priceFCFA: 0,
  description: "",
  images: [],
  sizesAvailable: ["S", "M", "L", "XL"],
  customEnabled: true,
};

function toDraft(p: Product): Draft {
  return {
    id: p.id,
    name: p.name,
    category: p.category,
    material: p.material,
    priceFCFA: p.priceFCFA,
    description: p.description,
    images: p.images?.length ? p.images : p.image ? [p.image] : [],
    sizesAvailable: p.sizesAvailable ?? ["S", "M", "L", "XL"],
    customEnabled: p.customEnabled ?? true,
  };
}

function CataloguePage() {
  const { products, categories, upsertProduct, deleteProduct, upsertCategory, deleteCategory } = useStore();
  const [view, setView] = useState<"products" | "categories">("products");
  const [filter, setFilter] = useState<Category | "all">("all");
  const [editing, setEditing] = useState<Draft | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Product | null>(null);

  const list = filter === "all" ? products : products.filter((p) => p.category === filter);

  const openCreate = () => setEditing({ ...emptyDraft });
  const openEdit = (p: Product) => setEditing(toDraft(p));
  const close = () => setEditing(null);

  const save = () => {
    if (!editing) return;
    if (!editing.name.trim()) return;
    const id = editing.id ?? `p${Date.now()}`;
    const images = editing.images.length ? editing.images : products[0]?.images ?? [];
    const product: Product = {
      id,
      name: editing.name.trim(),
      category: editing.category,
      material: editing.material,
      priceFCFA: editing.priceFCFA,
      description: editing.description,
      image: images[0] ?? products[0]?.image ?? "",
      images,
      sizesAvailable: editing.sizesAvailable,
      customEnabled: editing.customEnabled,
    };
    upsertProduct(product);
    close();
  };

  const askDelete = (p: Product) => setConfirmDelete(p);
  const confirmRemove = () => {
    if (confirmDelete) {
      deleteProduct(confirmDelete.id);
      setConfirmDelete(null);
      // Also close edit modal if it was the same product
      if (editing?.id === confirmDelete.id) close();
    }
  };

  return (
    <div>
      <PageHeader
        eyebrow="Boutique"
        title="Catalogue produits"
        description="Pièces de prêt-à-porter publiées sur la boutique en ligne."
        action={
          <div className="flex items-center gap-3">
            <div className="flex rounded-md border border-gray-200 overflow-hidden text-xs">
              <button
                onClick={() => setView("products")}
                className={`px-3 py-2 font-medium tracking-wide transition-colors ${view === "products" ? "bg-[#111111] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >Produits</button>
              <button
                onClick={() => setView("categories")}
                className={`px-3 py-2 font-medium tracking-wide transition-colors ${view === "categories" ? "bg-[#111111] text-white" : "bg-white text-gray-600 hover:bg-gray-50"}`}
              >Catégories</button>
            </div>
            {view === "products" && (
              <button
                onClick={openCreate}
                className="inline-flex items-center gap-2 bg-[#111111] px-4 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-black"
              >
                <Plus className="h-3.5 w-3.5" /> Ajouter un produit
              </button>
            )}
          </div>
        }
      />

      {view === "products" && (
        <>
          <div className="mb-5 flex flex-wrap gap-2">
            <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
              Tout ({products.length})
            </FilterChip>
            {categories.map((c) => {
              const count = products.filter((p) => p.category === c.id).length;
              return (
                <FilterChip
                  key={c.id}
                  active={filter === c.id}
                  onClick={() => setFilter(c.id)}
                >
                  {c.label} ({count})
                </FilterChip>
              );
            })}
          </div>

          <Card>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-gray-400">
                    <th className="px-5 py-3 font-medium">Produit</th>
                    <th className="px-5 py-3 font-medium">Catégorie</th>
                    <th className="px-5 py-3 font-medium">Matière</th>
                    <th className="px-5 py-3 font-medium">Tailles</th>
                    <th className="px-5 py-3 font-medium">Sur-mesure</th>
                    <th className="px-5 py-3 font-medium">Prix</th>
                    <th className="px-5 py-3 font-medium">Statut</th>
                    <th className="px-5 py-3 text-right font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((p) => (
                    <tr key={p.id} className="border-t border-gray-100 hover:bg-gray-50/60">
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-12 shrink-0 overflow-hidden ring-1 ring-gray-200">
                            <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
                            {p.images && p.images.length > 1 && (
                              <span className="absolute bottom-0 right-0 bg-[#111111] px-1 text-[9px] font-medium text-white">×{p.images.length}</span>
                            )}
                          </div>
                          <div className="min-w-0">
                            <div className="font-medium text-[#111111]">{p.name}</div>
                            <div className="truncate text-xs text-gray-500 max-w-xs">{p.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 capitalize text-gray-700">{p.category}</td>
                      <td className="px-5 py-3 text-gray-700">{p.material}</td>
                      <td className="px-5 py-3 text-xs text-gray-600">{(p.sizesAvailable ?? []).join(" · ") || "—"}</td>
                      <td className="px-5 py-3">
                        {p.customEnabled ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-[#D4AF37]/30 bg-[#D4AF37]/15 px-2 py-0.5 text-[10px] font-medium text-[#7A6320]">
                            <Sparkles className="h-2.5 w-2.5" /> Activé
                          </span>
                        ) : (
                          <span className="text-[11px] text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 font-serif tabular-nums">{formatFCFA(p.priceFCFA)}</td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> Publié
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => openEdit(p)}
                            className="inline-flex items-center gap-1 rounded-md border border-gray-200 px-2.5 py-1 text-xs text-gray-700 transition-colors hover:border-[#111111] hover:text-[#111111]"
                          >
                            <Pencil className="h-3 w-3" /> Éditer
                          </button>
                          <button
                            onClick={() => askDelete(p)}
                            aria-label={`Supprimer ${p.name}`}
                            className="inline-flex items-center justify-center rounded-md border border-gray-200 p-1.5 text-gray-500 transition-colors hover:border-rose-300 hover:bg-rose-50 hover:text-rose-700"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {list.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-5 py-12 text-center text-sm text-gray-500">
                        Aucun produit dans cette catégorie.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {editing && (
            <ProductModal
              draft={editing}
              categories={categories}
              onChange={setEditing}
              onClose={close}
              onSave={save}
              onDelete={editing.id ? () => askDelete(products.find((p) => p.id === editing.id)!) : undefined}
            />
          )}

          {confirmDelete && (
            <ConfirmDeleteModal
              product={confirmDelete}
              onCancel={() => setConfirmDelete(null)}
              onConfirm={confirmRemove}
            />
          )}
        </>
      )}

      {view === "categories" && (
        <CategoriesManager
          categories={categories}
          onUpsert={upsertCategory}
          onDelete={deleteCategory}
        />
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Categories Manager                                               */
/* ---------------------------------------------------------------- */

function CategoriesManager({
  categories,
  onUpsert,
  onDelete,
}: {
  categories: { id: string; label: string; image: string; tagline: string }[];
  onUpsert: (c: { id: string; label: string; image: string; tagline: string }) => void;
  onDelete: (id: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({ label: "", tagline: "", image: "" });
  const [uploading, setUploading] = useState(false);
  const [confirmDel, setConfirmDel] = useState<string | null>(null);

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    const file = files[0];
    const ext = file.name.split('.').pop();
    const path = `categories/${Math.random().toString(36).substring(2)}.${ext}`;
    const { error } = await supabase.storage.from('founty-images').upload(path, file);
    if (error) { alert('Erreur upload'); setUploading(false); return; }
    const { data } = supabase.storage.from('founty-images').getPublicUrl(path);
    setForm(f => ({ ...f, image: data.publicUrl }));
    setUploading(false);
  };

  const handleAdd = () => {
    if (!form.label.trim()) return;
    const id = form.label.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    onUpsert({ id, label: form.label.trim(), image: form.image, tagline: form.tagline.trim() });
    setForm({ label: '', tagline: '', image: '' });
  };

  return (
    <div className="mt-6 space-y-6">
      {/* Add category form */}
      <Card>
        <div className="p-6">
          <h3 className="font-serif text-lg text-[#111111] mb-4">Nouvelle catégorie</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-500">Nom du catalogue *</label>
              <input
                type="text"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                placeholder="Ex: Djellabas, Costumes..."
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] uppercase tracking-wider text-gray-500">Slogan (optionnel)</label>
              <input
                type="text"
                value={form.tagline}
                onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))}
                placeholder="Ex: Le style royal"
                className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-black focus:outline-none"
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="text-[11px] uppercase tracking-wider text-gray-500">Photo du catalogue *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="mt-2 flex h-32 cursor-pointer items-center justify-center gap-3 rounded border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-gray-400"
            >
              {form.image ? (
                <img src={form.image} alt="preview" className="h-full w-full object-cover rounded" />
              ) : uploading ? (
                <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
              ) : (
                <div className="text-center text-gray-400">
                  <Upload className="mx-auto h-6 w-6 mb-1" />
                  <p className="text-xs">Cliquer pour choisir une photo</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(e.target.files)} />
          </div>
          <button
            onClick={handleAdd}
            disabled={!form.label.trim() || !form.image}
            className="mt-4 inline-flex items-center gap-2 bg-[#111111] px-5 py-2.5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition hover:bg-black disabled:opacity-40"
          >
            <Plus className="h-3.5 w-3.5" /> Ajouter le catalogue
          </button>
        </div>
      </Card>

      {/* Existing categories grid */}
      <Card>
        <div className="p-6">
          <h3 className="font-serif text-lg text-[#111111] mb-4">Catalogues existants ({categories.length})</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map(c => (
              <div key={c.id} className="group relative overflow-hidden rounded border border-gray-200">
                <div className="aspect-[4/3] overflow-hidden bg-gray-100">
                  {c.image ? (
                    <img src={c.image} alt={c.label} className="h-full w-full object-cover transition group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <ImageIcon className="h-8 w-8 text-gray-300" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm text-[#111111]">{c.label}</p>
                  {c.tagline && <p className="text-xs text-gray-500 mt-0.5">{c.tagline}</p>}
                </div>
                {confirmDel === c.id ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-white/95 p-3">
                    <AlertTriangle className="h-5 w-5 text-rose-500" />
                    <p className="text-center text-xs font-medium">Supprimer ce catalogue ?</p>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmDel(null)} className="rounded border px-3 py-1 text-xs">Annuler</button>
                      <button onClick={() => { onDelete(c.id); setConfirmDel(null); }} className="rounded bg-rose-600 px-3 py-1 text-xs text-white">Supprimer</button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setConfirmDel(c.id)}
                    className="absolute right-2 top-2 hidden rounded-full bg-white p-1.5 shadow-md transition hover:bg-rose-50 group-hover:flex"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-rose-500" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Product create / edit modal                                     */
/* ---------------------------------------------------------------- */

const MAX_IMAGES = 4;

function ProductModal({
  draft,
  categories,
  onChange,
  onClose,
  onSave,
  onDelete,
}: {
  draft: Draft;
  categories: { id: string; label: string }[];
  onChange: (d: Draft) => void;
  onClose: () => void;
  onSave: () => void;
  onDelete?: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const toggleSize = (s: Size) => {
    const has = draft.sizesAvailable.includes(s);
    onChange({
      ...draft,
      sizesAvailable: has
        ? draft.sizesAvailable.filter((x) => x !== s)
        : [...draft.sizesAvailable, s],
    });
  };

  const readFiles = async (files: FileList | null) => {
    if (!files) return;
    const remaining = MAX_IMAGES - draft.images.length;
    const list = Array.from(files).slice(0, Math.max(0, remaining));
    if (list.length === 0) return;

    setUploading(true);
    const uploadedUrls: string[] = [];

    for (const file of list) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `products/${fileName}`;
      
      const { error } = await supabase.storage
        .from('founty-images')
        .upload(filePath, file);
        
      if (error) {
        console.error('Erreur lors de l\'upload:', error);
        alert('Erreur lors de l\'upload de l\'image.');
        continue;
      }
      
      const { data: publicUrlData } = supabase.storage
        .from('founty-images')
        .getPublicUrl(filePath);
        
      uploadedUrls.push(publicUrlData.publicUrl);
    }

    onChange({ ...draft, images: [...draft.images, ...uploadedUrls].slice(0, MAX_IMAGES) });
    setUploading(false);
  };

  const onFileInput = (e: ChangeEvent<HTMLInputElement>) => {
    readFiles(e.target.files);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const onDrop = (e: DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setDragOver(false);
    readFiles(e.dataTransfer.files);
  };

  const removeImage = (i: number) => {
    onChange({ ...draft, images: draft.images.filter((_, idx) => idx !== i) });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-stretch justify-center sm:items-center sm:p-6">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 flex w-full max-w-4xl flex-col overflow-hidden bg-white shadow-2xl sm:rounded-lg">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-gray-200 bg-[#0E0E0E] px-6 py-5 text-white">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#D4AF37]">
              Catalogue
            </p>
            <h2 className="mt-1 font-serif text-2xl">
              {draft.id ? "Éditer le produit" : "Nouveau produit"}
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="rounded-md p-2 text-white/70 hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[80vh] flex-1 overflow-y-auto bg-[#F7F7F8] px-6 py-6 sm:px-8">
          {/* Section: Images */}
          <Section title="Images du produit" subtitle={`Jusqu'à ${MAX_IMAGES} images. Glissez-déposez ou cliquez.`}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1fr_280px]">
              <label
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={onDrop}
                className={`flex h-44 cursor-pointer flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed bg-white px-4 text-center transition-colors ${
                  dragOver
                    ? "border-[#D4AF37] bg-[#FFFCF2]"
                    : draft.images.length >= MAX_IMAGES
                      ? "border-gray-200 opacity-60"
                      : "border-gray-300 hover:border-[#D4AF37] hover:bg-[#FFFCF2]"
                }`}
              >
                <Upload className="h-6 w-6 text-[#D4AF37]" />
                <p className="text-sm font-medium text-[#111111]">
                  {uploading
                    ? "Upload en cours..."
                    : draft.images.length >= MAX_IMAGES
                      ? "Limite atteinte"
                      : "Glissez vos images ici"}
                </p>
                <p className="text-[11px] text-gray-500">
                  PNG, JPG · {draft.images.length} / {MAX_IMAGES}
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={onFileInput}
                  disabled={uploading || draft.images.length >= MAX_IMAGES}
                />
              </label>

              {/* Thumbnails */}
              <div className="grid grid-cols-4 gap-2 lg:grid-cols-2">
                {Array.from({ length: MAX_IMAGES }).map((_, i) => {
                  const src = draft.images[i];
                  return (
                    <div
                      key={i}
                      className="relative aspect-square overflow-hidden rounded-md border border-gray-200 bg-white"
                    >
                      {src ? (
                        <>
                          <img src={src} alt={`Aperçu ${i + 1}`} className="h-full w-full object-cover" />
                          {i === 0 && (
                            <span className="absolute left-1 top-1 bg-[#111111] px-1.5 py-0.5 text-[9px] font-medium uppercase tracking-wider text-white">
                              Cover
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => removeImage(i)}
                            aria-label="Retirer l'image"
                            className="absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <div className="flex h-full w-full items-center justify-center text-gray-300">
                          <ImageIcon className="h-6 w-6" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </Section>

          {/* Section: General info */}
          <Section title="Informations générales">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Field label="Titre du produit" className="md:col-span-2">
                <input
                  value={draft.name}
                  onChange={(e) => onChange({ ...draft, name: e.target.value })}
                  placeholder="Ex. Grand Boubou Royal — Or"
                  className="admin-input"
                />
              </Field>
              <Field label="Catégorie">
                <select
                  value={draft.category}
                  onChange={(e) => onChange({ ...draft, category: e.target.value as Category })}
                  className="admin-input"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Matière">
                <select
                  value={draft.material}
                  onChange={(e) => onChange({ ...draft, material: e.target.value as Material })}
                  className="admin-input"
                >
                  {MATERIALS.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Prix de base (FCFA)">
                <input
                  type="number"
                  value={draft.priceFCFA || ""}
                  onChange={(e) =>
                    onChange({ ...draft, priceFCFA: Number(e.target.value) || 0 })
                  }
                  placeholder="185000"
                  className="admin-input tabular-nums"
                />
              </Field>
              <Field label="Référence interne">
                <input
                  value={draft.id ?? "Auto-généré"}
                  readOnly
                  className="admin-input bg-gray-50 text-gray-500"
                />
              </Field>
              <Field label="Description détaillée" className="md:col-span-2">
                <textarea
                  value={draft.description}
                  onChange={(e) => onChange({ ...draft, description: e.target.value })}
                  rows={4}
                  placeholder="Pièce d'apparat en bazin riche, brodée à la main…"
                  className="admin-input min-h-[110px] py-2.5"
                />
              </Field>
            </div>
          </Section>

          {/* Section: Sales logic */}
          <Section title="Logique de vente" subtitle="Tailles disponibles et option sur-mesure.">
            <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_320px]">
              <div>
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
                  Tailles standards
                </p>
                <div className="flex flex-wrap gap-2">
                  {SIZES.map((s) => {
                    const active = draft.sizesAvailable.includes(s);
                    return (
                      <button
                        key={s}
                        type="button"
                        onClick={() => toggleSize(s)}
                        className={`flex h-11 min-w-[3.25rem] items-center justify-center rounded-md border px-3 text-sm font-medium transition-colors ${
                          active
                            ? "border-[#111111] bg-[#111111] text-white"
                            : "border-gray-300 bg-white text-gray-700 hover:border-[#111111]"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
                <p className="mt-2 text-[11px] text-gray-500">
                  {draft.sizesAvailable.length} taille
                  {draft.sizesAvailable.length > 1 ? "s" : ""} sélectionnée
                  {draft.sizesAvailable.length > 1 ? "s" : ""}.
                </p>
              </div>

              <div className="rounded-md border border-gray-200 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-sm font-medium text-[#111111]">
                      <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                      Activer le Sur-Mesure
                    </p>
                    <p className="mt-1 text-[12px] leading-relaxed text-gray-500">
                      Permet aux clients de commander cette pièce confectionnée à leurs mensurations.
                    </p>
                  </div>
                  <Toggle
                    checked={draft.customEnabled}
                    onChange={(v) => onChange({ ...draft, customEnabled: v })}
                  />
                </div>
              </div>
            </div>
          </Section>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-200 bg-white px-6 py-4 sm:px-8">
          {onDelete ? (
            <button
              onClick={onDelete}
              className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider text-rose-600 hover:text-rose-700"
            >
              <Trash2 className="h-3.5 w-3.5" /> Supprimer ce produit
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="h-11 px-5 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-700 hover:text-[#111111]"
            >
              Annuler
            </button>
            <button
              onClick={onSave}
              disabled={uploading || !draft.name.trim() || draft.sizesAvailable.length === 0}
              className="h-11 bg-[#111111] px-6 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : draft.id ? "Enregistrer" : "Créer le produit"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Confirm delete modal                                            */
/* ---------------------------------------------------------------- */

function ConfirmDeleteModal({
  product,
  onCancel,
  onConfirm,
}: {
  product: Product;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-lg bg-white shadow-2xl">
        <div className="flex items-start gap-4 px-6 pt-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#111111]">Supprimer ce modèle ?</h3>
            <p className="mt-1.5 text-sm text-gray-600">
              Êtes-vous sûr de vouloir supprimer{" "}
              <span className="font-medium text-[#111111]">« {product.name} »</span>{" "}
              du catalogue&nbsp;? Cette action est irréversible.
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-gray-100 bg-gray-50/60 px-6 py-4">
          <button
            onClick={onCancel}
            className="h-10 rounded-md px-4 text-[11px] font-medium uppercase tracking-[0.18em] text-gray-700 hover:bg-white hover:text-[#111111]"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="h-10 rounded-md bg-rose-600 px-5 text-[11px] font-medium uppercase tracking-[0.18em] text-white transition-colors hover:bg-rose-700"
          >
            <span className="inline-flex items-center gap-1.5">
              <Trash2 className="h-3.5 w-3.5" /> Supprimer
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Small helpers                                                   */
/* ---------------------------------------------------------------- */

function Section({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-6 rounded-lg border border-gray-200 bg-white p-5 sm:p-6">
      <header className="mb-5 border-b border-gray-100 pb-4">
        <h3 className="font-serif text-lg text-[#111111]">{title}</h3>
        {subtitle && <p className="mt-1 text-[12px] text-gray-500">{subtitle}</p>}
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  children,
  className = "",
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.18em] text-gray-500">
        {label}
      </span>
      {children}
    </label>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
        checked ? "bg-[#D4AF37]" : "bg-gray-300"
      }`}
    >
      <span
        className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : "translate-x-0.5"
        }`}
      />
    </button>
  );
}

function FilterChip({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-3.5 py-1.5 text-[11px] font-medium uppercase tracking-wider transition-colors ${
        active
          ? "border-[#111111] bg-[#111111] text-white"
          : "border-gray-200 bg-white text-gray-700 hover:border-[#111111]"
      }`}
    >
      {children}
    </button>
  );
}
