"use client";

import { createContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import type { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  signup: (email: string, pass: string, name: string) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users
const mockUser: User = { id: "user-1", name: "Alice Johnson", email: "user@libroreserva.com", role: "user", avatarUrl: 'https://i.pravatar.cc/150?u=user-1' };
const mockAdmin: User = { id: "user-admin", name: "Admin User", email: "admin@libroreserva.com", role: "admin", avatarUrl: 'https://i.pravatar.cc/150?u=user-admin' };


export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Mock checking for a logged-in user
    const storedUser = sessionStorage.getItem("libroreserva_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    let loggedInUser: User | null = null;
    if (email === "admin@libroreserva.com" && pass === "admin123") {
        loggedInUser = mockAdmin;
    } else if (email === "user@libroreserva.com" && pass === "user123") {
        loggedInUser = mockUser;
    } else {
        setLoading(false);
        throw new Error("Invalid credentials");
    }

    setUser(loggedInUser);
    sessionStorage.setItem("libroreserva_user", JSON.stringify(loggedInUser));
    setLoading(false);
  };
  
  const signup = async (email: string, pass: string, name: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));
    const newUser: User = {
        id: `user-${Date.now()}`,
        name,
        email,
        role: 'user',
        avatarUrl: `https://i.pravatar.cc/150?u=${email}`
    };
    setUser(newUser);
    sessionStorage.setItem("libroreserva_user", JSON.stringify(newUser));
    setLoading(false);
  }

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("libroreserva_user");
    router.push("/login");
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
