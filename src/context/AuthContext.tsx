import React, { createContext, useContext, useState, useEffect } from "react";

export interface User {
  email: string;
  name: string;
  phone: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => Promise<{ success: boolean; error?: string; code?: string }>;
  signup: (
    name: string,
    email: string,
    phone: string,
    countryCode?: string,
  ) => Promise<{ success: boolean; error?: string; code?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("zyvora_user");
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (e) {
        console.error("Failed to parse saved user", e);
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Login failed", code: data.code };
      }
      setUser(data.user);
      localStorage.setItem("zyvora_user", JSON.stringify(data.user));
      return { success: true };
    } catch (e: unknown) {
      const err = e as Error;
      return { success: false, error: err.message || "Network error" };
    }
  };

  const signup = async (name: string, email: string, phone: string, countryCode?: string) => {
    try {
      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, countryCode }),
      });
      const data = await response.json();
      if (!response.ok) {
        return { success: false, error: data.error || "Signup failed", code: data.code };
      }
      setUser(data.user);
      localStorage.setItem("zyvora_user", JSON.stringify(data.user));
      return { success: true };
    } catch (e: unknown) {
      const err = e as Error;
      return { success: false, error: err.message || "Network error" };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("zyvora_user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
