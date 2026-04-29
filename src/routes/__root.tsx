import { Outlet, Link, createRootRoute, HeadContent, Scripts, useRouterState } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { StoreProvider } from "@/lib/store";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { OrderDrawer } from "@/components/OrderDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";

function NotFoundComponent() {
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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Founty Élégance — Mode traditionnelle d'exception" },
      {
        name: "description",
        content:
          "Boubous, ensembles et chemises haut de gamme. Sur-mesure ou prêt-à-porter, signés à Dakar.",
      },
      { name: "author", content: "Founty Élégance" },
      { property: "og:title", content: "Founty Élégance" },
      {
        property: "og:description",
        content: "L'élégance sénégalaise, sur-mesure ou prêt-à-porter.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/png", href: "/logo-founty.png" },
      { rel: "apple-touch-icon", href: "/logo-founty.png" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Playfair+Display:ital,wght@0,400;0,500;0,600;1,400&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { location } = useRouterState();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return (
      <AuthProvider>
        <StoreProvider>
          <Outlet />
        </StoreProvider>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <StoreProvider>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
        <CartDrawer />
        <OrderDrawer />
        <WhatsAppFab />
      </StoreProvider>
    </AuthProvider>
  );
}
