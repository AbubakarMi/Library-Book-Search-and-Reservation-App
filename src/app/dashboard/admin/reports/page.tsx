"use client";

import { useSearchParams } from 'next/navigation';
import AdminReportDashboard from "@/components/dashboard/AdminReportDashboard";

export default function AdminReportsPage() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get('tab') || 'overview';

  return <AdminReportDashboard defaultTab={defaultTab} />;
}
