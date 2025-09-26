"use client";

import { useAuth } from "./useAuth";

export function useRoleAccess() {
  const { user } = useAuth();

  const isAdmin = user?.role === "admin";
  const isUser = user?.role === "user";
  const isAuthenticated = !!user;

  const hasPermission = (requiredRole?: "user" | "admin") => {
    if (!requiredRole) return isAuthenticated;
    return user?.role === requiredRole;
  };

  const canAccessRoute = (route: string) => {
    if (!isAuthenticated) return false;

    // Admin-only routes
    if (route.startsWith("/dashboard/admin")) {
      return isAdmin;
    }

    // User-only routes
    if (route.startsWith("/dashboard/user")) {
      return isUser;
    }

    // Public routes accessible to authenticated users
    if (route === "/dashboard" || route === "/" || route.startsWith("/books")) {
      return isAuthenticated;
    }

    return false;
  };

  const getRedirectUrl = () => {
    if (!user) return "/login";
    return user.role === "admin" ? "/dashboard/admin" : "/dashboard/user";
  };

  return {
    user,
    isAdmin,
    isUser,
    isAuthenticated,
    hasPermission,
    canAccessRoute,
    getRedirectUrl,
  };
}