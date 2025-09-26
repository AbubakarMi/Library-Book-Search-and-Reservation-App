"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import DashboardSidebar from "@/components/layout/DashboardSidebar";
import DashboardHeader from "@/components/layout/DashboardHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Loader2 } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-background">
        <DashboardSidebar userRole={user.role} />
        <div className="flex-1 flex flex-col overflow-hidden sm:ml-0">
          <DashboardHeader />
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto">
              <div className="p-4 md:p-6 lg:p-8 bg-muted/40 min-h-full pb-20 sm:pb-4">
                {children}
              </div>
            </div>
          </main>
        </div>
      </div>
    </ProtectedRoute>
  );
}
