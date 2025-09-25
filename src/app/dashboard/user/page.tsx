import UserReservations from "@/components/dashboard/UserReservations";

export default function UserDashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">My Dashboard</h1>
      <UserReservations />
    </div>
  );
}
