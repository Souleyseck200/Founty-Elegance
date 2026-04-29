import { createFileRoute, Outlet, Link } from "@tanstack/react-router";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin · Founty Élégance" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminRootLayout,
});

function AdminRootLayout() {
  const { isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9]">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[#111111] border-t-transparent" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-6 text-center">
        <div className="max-w-md">
          <p className="ui-label mb-6 text-accent">— Erreur 404</p>
          <h1 className="font-serif text-6xl leading-none">Page introuvable</h1>
          <p className="mt-5 text-sm text-muted-foreground">
            La page que vous cherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/" className="btn-editorial btn-primary mt-10">
            Retour à l'accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  );
}
