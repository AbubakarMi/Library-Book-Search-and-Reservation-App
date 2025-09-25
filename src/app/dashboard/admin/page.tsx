import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, BarChart2 } from "lucide-react";
import { books, users } from "@/lib/mock-data";

export default function AdminDashboardPage() {
  const totalBooks = books.length;
  const totalUsers = users.length;
  const reservedBooks = books.filter(b => b.availabilityStatus === 'reserved').length;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 font-headline">Admin Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">in the library collection</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">registered in the system</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Reservations</CardTitle>
            <BarChart2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservedBooks}</div>
            <p className="text-xs text-muted-foreground">books currently reserved</p>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 font-headline">Quick Actions</h2>
        {/* Quick action links can be added here */}
      </div>
    </div>
  );
}
