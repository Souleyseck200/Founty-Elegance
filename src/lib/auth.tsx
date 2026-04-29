import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type Customer = {
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  country: string | null;
  measurements: Record<string, string>;
};

type AuthContextType = {
  // Admin stuff
  session: Session | null;
  user: User | null;
  isAdmin: boolean;
  signOutAdmin: () => Promise<void>;
  
  // Client stuff
  clientEmail: string | null;
  customer: Customer | null;
  loginClient: (email: string) => void;
  logoutClient: () => void;
  refreshCustomer: () => Promise<void>;
  
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// L'email administrateur officiel
const ADMIN_EMAIL = "admin@fountyelegance.com"; 

export function AuthProvider({ children }: { children: ReactNode }) {
  // Admin State
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  
  // Client State
  const [clientEmail, setClientEmail] = useState<string | null>(null);
  const [customer, setCustomer] = useState<Customer | null>(null);
  
  const [loading, setLoading] = useState(true);

  // Fetch Customer profile from custom table
  const fetchCustomer = async (email: string) => {
    const { data, error } = await supabase
      .from("customers")
      .select("*")
      .eq("email", email)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching customer:", error);
    }
    
    if (data) {
      setCustomer(data as Customer);
    } else {
      setCustomer(null);
    }
  };

  useEffect(() => {
    // 1. Restore Admin Session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    // 2. Restore Client Session from LocalStorage
    const storedEmail = localStorage.getItem("founty_client_email");
    if (storedEmail) {
      setClientEmail(storedEmail);
      fetchCustomer(storedEmail).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    return () => subscription.unsubscribe();
  }, []);

  const refreshCustomer = async () => {
    if (clientEmail) await fetchCustomer(clientEmail);
  };

  const loginClient = async (email: string) => {
    localStorage.setItem("founty_client_email", email);
    setClientEmail(email);
    await fetchCustomer(email);
  };

  const logoutClient = () => {
    localStorage.removeItem("founty_client_email");
    setClientEmail(null);
    setCustomer(null);
  };

  const signOutAdmin = async () => {
    await supabase.auth.signOut();
  };

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <AuthContext.Provider value={{ 
      session, user, isAdmin, signOutAdmin, 
      clientEmail, customer, loginClient, logoutClient, refreshCustomer,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
