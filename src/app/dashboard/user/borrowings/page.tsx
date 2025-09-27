export const dynamic = 'force-dynamic';
import UserBorrowings from "@/components/dashboard/UserBorrowings";

export default function UserBorrowingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">My Borrowed Books</h1>
      <UserBorrowings />
    </div>
  );
}