export const dynamic = 'force-dynamic';
import AdminBorrowingConfirmation from "@/components/dashboard/AdminBorrowingConfirmation";

export default function AdminBorrowingPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Borrowing Confirmation</h1>
      <AdminBorrowingConfirmation />
    </div>
  );
}