"use client";

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from 'recharts';
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  BookOpen,
  Calendar,
  AlertTriangle,
  DollarSign
} from 'lucide-react';
import { books, users, reservations, borrowingRecords, bookCategories } from '@/lib/mock-data';
import ReportGenerator from './ReportGenerator';

export default function AdminReportDashboard() {
  const [dateRange, setDateRange] = useState('30d');
  const [reportType, setReportType] = useState('overview');

  // Calculate statistics
  const totalBooks = books.length;
  const totalUsers = users.length;
  const totalReservations = reservations.length;
  const totalBorrowings = borrowingRecords.length;
  const overdueBorrowings = borrowingRecords.filter(b => b.status === 'overdue').length;
  const totalFines = borrowingRecords
    .filter(b => b.fineAmount)
    .reduce((sum, b) => sum + (b.fineAmount || 0), 0);

  // Most popular books based on reservations
  const bookPopularity = books.map(book => ({
    ...book,
    reservationCount: reservations.filter(r => r.bookID === book.id).length,
    borrowingCount: borrowingRecords.filter(b => b.bookID === book.id).length
  }));

  const popularBooks = bookPopularity
    .sort((a, b) => (b.reservationCount + b.borrowingCount) - (a.reservationCount + a.borrowingCount))
    .slice(0, 10);

  // Category usage statistics
  const categoryStats = bookCategories.map(category => {
    const categoryBooks = books.filter(b => b.category === category);
    const reservationCount = reservations.filter(r =>
      categoryBooks.some(book => book.id === r.bookID)
    ).length;
    const borrowingCount = borrowingRecords.filter(b =>
      categoryBooks.some(book => book.id === b.bookID)
    ).length;

    return {
      name: category,
      books: categoryBooks.length,
      reservations: reservationCount,
      borrowings: borrowingCount,
      total: reservationCount + borrowingCount
    };
  }).filter(cat => cat.books > 0);

  // User activity statistics
  const userStats = users.map(user => {
    const userReservations = reservations.filter(r => r.userID === user.id).length;
    const userBorrowings = borrowingRecords.filter(b => b.userID === user.id).length;
    return {
      ...user,
      reservations: userReservations,
      borrowings: userBorrowings,
      totalActivity: userReservations + userBorrowings
    };
  }).sort((a, b) => b.totalActivity - a.totalActivity);

  // Monthly trend data (mock)
  const monthlyTrends = [
    { month: 'Jan', reservations: 45, borrowings: 38, returns: 35 },
    { month: 'Feb', reservations: 52, borrowings: 41, returns: 39 },
    { month: 'Mar', reservations: 61, borrowings: 55, returns: 52 },
    { month: 'Apr', reservations: 58, borrowings: 49, returns: 47 },
    { month: 'May', reservations: 67, borrowings: 62, returns: 60 },
    { month: 'Jun', reservations: 73, borrowings: 68, returns: 65 }
  ];

  // Status distribution
  const statusDistribution = [
    { name: 'Available', value: books.filter(b => b.availabilityStatus === 'available').length, color: '#22c55e' },
    { name: 'Reserved', value: books.filter(b => b.availabilityStatus === 'reserved').length, color: '#f59e0b' },
    { name: 'Checked Out', value: books.filter(b => b.availabilityStatus === 'checked_out').length, color: '#ef4444' }
  ];

  const exportReport = (type: string) => {
    // Mock export functionality
    const data = {
      type,
      generatedAt: new Date().toISOString(),
      statistics: {
        totalBooks,
        totalUsers,
        totalReservations,
        totalBorrowings,
        overdueBorrowings,
        totalFines
      },
      popularBooks: popularBooks.slice(0, 5),
      categoryStats,
      userStats: userStats.slice(0, 10)
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `library-report-${type}-${new Date().getTime()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header with Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Library Reports & Analytics</h2>
          <p className="text-muted-foreground">Comprehensive insights into library operations</p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Date Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="3m">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>

          <Button onClick={() => exportReport('comprehensive')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">in collection</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">registered users</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue Books</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{overdueBorrowings}</div>
            <p className="text-xs text-muted-foreground">need attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Fines</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalFines.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">collected</p>
          </CardContent>
        </Card>
      </div>

      {/* Report Tabs */}
      <Tabs defaultValue="overview" value={reportType} onValueChange={setReportType}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="books">Books</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="ai-reports">AI Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Book Status Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={statusDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {statusDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Monthly Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="reservations" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="borrowings" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="returns" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Most Popular Books</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {popularBooks.slice(0, 8).map((book, index) => (
                    <div key={book.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-bold">{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-sm">{book.title}</p>
                          <p className="text-xs text-muted-foreground">{book.author}</p>
                        </div>
                      </div>
                      <Badge variant="secondary">
                        {book.reservationCount + book.borrowingCount} uses
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={categoryStats.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="total" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Most Active Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.slice(0, 10).map((user, index) => (
                  <div key={user.id} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold">{index + 1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-sm">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary">{user.totalActivity} activities</Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        {user.reservations}R, {user.borrowings}B
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="reservations" stackId="1" stroke="#8884d8" fill="#8884d8" />
                  <Area type="monotone" dataKey="borrowings" stackId="1" stroke="#82ca9d" fill="#82ca9d" />
                  <Area type="monotone" dataKey="returns" stackId="1" stroke="#ffc658" fill="#ffc658" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="ai-reports">
          <ReportGenerator />
        </TabsContent>
      </Tabs>
    </div>
  );
}