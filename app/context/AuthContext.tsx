"use client";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { User } from "@supabase/supabase-js";
import { supabase } from "../utils/supabase";
import { useRouter } from "next/navigation";

interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isDemo, setIsDemo] = useState(
    () => localStorage.getItem("demoMode") === "true"
  );
  const router = useRouter();

  useEffect(() => {
    const fetchSession = async () => {
      if (localStorage.getItem("demoMode") === "true") {
        setIsDemo(true);
        setUser({ email: "demo@example.com" } as User);
        return;
      }

      setIsDemo(false);
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (localStorage.getItem("demoMode") === "true") {
          setIsDemo(true);
          return;
        }

        setIsDemo(false);
        setUser(session?.user ?? null);

        if (event === "SIGNED_IN") {
          router.push("/");
        }
        if (event === "SIGNED_OUT") {
          localStorage.removeItem("demoMode");
          router.push("/login");
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, setUser, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
