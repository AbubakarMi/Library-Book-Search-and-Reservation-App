export const dynamic = 'force-dynamic';
import UserReservations from "@/components/dashboard/UserReservations";

export default function UserReservationsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">My Reservations</h1>
      <UserReservations />
    </div>
  );
}