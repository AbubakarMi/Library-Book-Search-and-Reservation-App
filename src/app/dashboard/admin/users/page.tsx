import UserManagement from "@/components/dashboard/UserManagement";

export default function AdminUsersPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">User Management</h1>
      <UserManagement />
    </div>
  );
}
