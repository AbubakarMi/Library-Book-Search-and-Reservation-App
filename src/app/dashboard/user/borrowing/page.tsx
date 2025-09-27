export const dynamic = 'force-dynamic';
import UserBorrowingRequest from "@/components/dashboard/UserBorrowingRequest";

export default function UserBorrowingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Request to Borrow Books</h1>
      <UserBorrowingRequest />
    </div>
  );
}