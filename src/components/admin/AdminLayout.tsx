import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  Scissors,
  ShoppingBag,
  Camera,
  Search,
  Bell,
  LogOut,
  Menu,
  X,
  Key,
  Loader2,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import logoFounty from "@/assets/logo-founty.png";
import { supabase } from "@/lib/supabase";

const NAV = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/admin/commandes", label: "Commandes Classiques", icon: Package, exact: false },
  { to: "/admin/sur-mesure", label: "Demandes Sur-Mesure", icon: Scissors, exact: false },
  { to: "/admin/catalogue", label: "Catalogue", icon: ShoppingBag, exact: false },
  { to: "/admin/lookbook", label: "Lookbook", icon: Camera, exact: false },
] as const;

export function AdminLayout({ children }: { children?: ReactNode }) {
  const [mobileNav, setMobileNav] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { location } = useRouterState();

  return (
    <div className="flex min-h-screen w-full bg-[#F7F7F8] font-sans text-[#111111] antialiased">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-[260px] flex-col bg-[#0E0E0E] text-white lg:flex">
        <SidebarInner pathname={location.pathname} onNavigate={() => setMobileNav(false)} />
      </aside>

      {/* Sidebar — mobile drawer */}
      {mobileNav && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setMobileNav(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-[#0E0E0E] text-white lg:hidden">
            <SidebarInner pathname={location.pathname} onNavigate={() => setMobileNav(false)} />
          </aside>
        </>
      )}

      {/* Main column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top header */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-gray-200 bg-white px-4 lg:px-8">
          <button
            onClick={() => setMobileNav(true)}
            aria-label="Ouvrir le menu"
            className="rounded-md p-2 text-gray-700 hover:bg-gray-100 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative flex-1 max-w-xl">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="search"
              placeholder="Rechercher une commande, un client, un produit…"
              className="h-10 w-full rounded-md border border-gray-200 bg-[#FAFAFA] pl-10 pr-3 text-sm font-light placeholder:text-gray-400 focus:border-[#111111] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowPasswordModal(true)}
              title="Modifier le mot de passe"
              aria-label="Modifier le mot de passe"
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
            >
              <Key className="h-5 w-5" />
            </button>

            <button
              aria-label="Notifications"
              className="relative rounded-md p-2 text-gray-700 hover:bg-gray-100"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[#D4AF37]" />
            </button>

            <div className="hidden items-center gap-3 border-l border-gray-200 pl-3 sm:flex">
              <img
                src={logoFounty}
                alt="Founty Élégance"
                className="h-9 w-9 object-contain"
              />
              <div className="hidden flex-col leading-tight md:flex">
                <span className="text-sm font-medium">Founty Admin</span>
                <span className="text-[11px] text-gray-500">Atelier Dakar</span>
              </div>
              <Link
                to="/"
                title="Retour à la boutique"
                className="ml-1 inline-flex items-center gap-1.5 rounded-md border border-gray-200 px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-gray-700 transition-colors hover:border-[#111111] hover:text-[#111111]"
              >
                <LogOut className="h-3.5 w-3.5" />
                Boutique
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children ?? <Outlet />}</main>
      </div>
      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}
    </div>
  );
}

function SidebarInner({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate: () => void;
}) {
  return (
    <div className="flex h-full flex-col">
      <div className="flex h-20 items-center justify-between border-b border-white/10 px-5">
        <Link to="/admin" onClick={onNavigate} className="flex items-center gap-2">
          <img
            src={logoFounty}
            alt="Founty Élégance"
            className="h-11 w-auto object-contain"
          />
          <span className="font-serif text-lg leading-none">
            <span className="text-white">Founty</span>{" "}
            <span className="italic text-[#D4AF37]">Élégance</span>
          </span>
        </Link>
        <button
          onClick={onNavigate}
          className="rounded p-1 text-white/60 hover:bg-white/10 lg:hidden"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
      <div className="px-6 pt-5 pb-3 text-[10px] font-medium uppercase tracking-[0.2em] text-white/40">
        Atelier
      </div>
      <nav className="flex flex-1 flex-col gap-1 px-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.to
            : pathname === item.to || pathname.startsWith(item.to + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={`group relative flex items-center gap-3 rounded-md px-3 py-2.5 text-sm transition-colors ${
                active
                  ? "bg-white/5 text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && (
                <span className="absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-[#D4AF37]" />
              )}
              <Icon className={`h-4 w-4 ${active ? "text-[#D4AF37]" : ""}`} />
              <span className={active ? "font-medium" : ""}>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <div className="rounded-md border border-white/10 bg-white/5 p-3">
          <p className="font-serif text-sm text-white">
            <span className="italic text-[#D4AF37]">Atelier</span> · Dakar
          </p>
          <p className="mt-1 text-[11px] text-white/50">
            Maître tailleur — Founty Élégance
          </p>
        </div>
      </div>
    </div>
  );
}

function PasswordModal({ onClose }: { onClose: () => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    setLoading(true);
    setError("");
    const { error: updateError } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (updateError) {
      setError("Erreur lors de la mise à jour : " + updateError.message);
    } else {
      setSuccess(true);
      setTimeout(onClose, 2000);
    }
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-sm rounded-lg bg-white p-6 shadow-xl">
        <h2 className="mb-4 font-serif text-2xl">Modifier le mot de passe</h2>
        
        {success ? (
          <div className="rounded border border-green-200 bg-green-50 p-4 text-green-700">
            Mot de passe mis à jour avec succès !
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="text-sm text-red-600">{error}</div>}
            <div>
              <label className="mb-1 block text-sm font-medium">Nouveau mot de passe</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="w-full rounded border border-gray-300 p-2 focus:border-[#111111] focus:outline-none text-black"
              />
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded px-4 py-2 text-sm text-black hover:bg-gray-100"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center rounded bg-[#111111] px-4 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Enregistrer"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
