export const dynamic = 'force-dynamic';
import AdminReservationManagement from "@/components/dashboard/AdminReservationManagement";

export default function AdminReservationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Reservation Management</h1>
      <AdminReservationManagement />
    </div>
  );
}