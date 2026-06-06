"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "CUSTOMER" | "ADMIN" | "MANAGER";
  image?: string | null;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (data: { firstName: string; lastName: string; email: string; password: string; referralCode?: string }) => Promise<{ success: boolean; error?: string; role?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(email: string, password: string) {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        return { success: true as const, role: data.user.role as string };
      }
      return { success: false as const, error: data.error as string };
    } catch {
      return { success: false as const, error: "Network error" };
    }
  }

  async function register(userData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    referralCode?: string;
  }) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });
      const data = await res.json();
      if (res.ok) {
        return await login(userData.email, userData.password);
      }
      return { success: false as const, error: data.error as string };
    } catch {
      return { success: false as const, error: "Network error" };
    }
  }

  async function logout() {
    setUser(null);
    await fetch("/api/auth/logout", { method: "POST" });
  }

  const value: AuthContextType = { user, loading, login, register, logout };

  return React.createElement(
    AuthContext.Provider,
    { value: value },
    children
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}