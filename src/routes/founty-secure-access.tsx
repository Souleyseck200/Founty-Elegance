import { createFileRoute, useNavigate, Navigate } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/founty-secure-access")({
  head: () => ({
    meta: [
      { title: "Accès Sécurisé" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { isAdmin } = useAuth();

  if (isAdmin) {
    return <Navigate to="/admin" />;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Identifiants incorrects.");
      setLoading(false);
    } else {
      window.location.href = "/admin";
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9F9F9] px-6">
      <div className="w-full max-w-[400px] bg-white p-10 shadow-sm border border-border">
        <div className="mb-10 text-center">
          <h1 className="font-serif text-3xl">Administration</h1>
          <p className="mt-2 text-sm text-muted-foreground">Accès restreint au personnel autorisé.</p>
        </div>

        {error && (
          <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-600">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="label-editorial">Adresse Email</label>
            <input
              type="email"
              required
              className="input-editorial"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="label-editorial">Mot de Passe</label>
            <input
              type="password"
              required
              className="input-editorial"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-editorial btn-primary w-full justify-center"
          >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Se Connecter"}
          </button>
        </form>
      </div>
    </div>
  );
}
