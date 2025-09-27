"use client";

export const dynamic = 'force-dynamic';

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (user.role === "admin") {
        router.replace("/dashboard/admin");
      } else if (user.role === "student") {
        router.replace("/dashboard/user");
      } else {
        router.replace("/dashboard/user");
      }
    } else if (!loading && !user) {
      router.replace("/login");
    }
  }, [user, loading, router]);

  return (
    <div className="flex h-full w-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}
