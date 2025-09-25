"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Book,
  Users,
  BarChart2,
  TrendingUp,
  AlertCircle,
  Calendar,
  Activity,
  BookOpen,
  UserCheck,
  Clock,
  Star,
  Settings,
  Download,
  Plus,
  Eye,
  ArrowUp,
  ArrowDown
} from "lucide-react";
import { books, users, bookCategories } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { format } from "date-fns";

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const totalBooks = books.length;
  const totalUsers = users.length;
  const reservedBooks = books.filter(b => b.availabilityStatus === 'reserved').length;
  const checkedOutBooks = books.filter(b => b.availabilityStatus === 'checked_out').length;
  const availableBooks = books.filter(b => b.availabilityStatus === 'available').length;

  // Enhanced statistics
  const todayStats = {
    newReservations: 12,
    newUsers: 5,
    booksReturned: 8,
    overdueBooks: 3
  };

  // Recent activity for admin
  const recentActivity = [
    {
      id: 1,
      type: 'reservation',
      user: 'John Doe',
      book: 'The Great Gatsby',
      action: 'Reserved',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      status: 'success'
    },
    {
      id: 2,
      type: 'return',
      user: 'Jane Smith',
      book: 'To Kill a Mockingbird',
      action: 'Returned',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      status: 'success'
    },
    {
      id: 3,
      type: 'overdue',
      user: 'Mike Johnson',
      book: '1984',
      action: 'Overdue',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      status: 'warning'
    },
    {
      id: 4,
      type: 'signup',
      user: 'Sarah Wilson',
      book: null,
      action: 'Signed up',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
      status: 'info'
    }
  ];

  // Top users (mock data)
  const topUsers = [
    { name: 'Emily Davis', booksRead: 15, avatar: undefined },
    { name: 'Robert Brown', booksRead: 12, avatar: undefined },
    { name: 'Alice Cooper', booksRead: 10, avatar: undefined },
    { name: 'David Wilson', booksRead: 9, avatar: undefined },
    { name: 'Lisa Johnson', booksRead: 8, avatar: undefined }
  ];

  // Category distribution data
  const categoryData = bookCategories.map(category => ({
    name: category,
    value: books.filter(b => b.category === category).length,
    percentage: Math.round((books.filter(b => b.category === category).length / totalBooks) * 100)
  })).filter(item => item.value > 0);

  // Monthly activity data (mock)
  const monthlyData = [
    { month: 'Jan', reservations: 45, returns: 38, newUsers: 12 },
    { month: 'Feb', reservations: 52, returns: 41, newUsers: 15 },
    { month: 'Mar', reservations: 61, returns: 55, newUsers: 18 },
    { month: 'Apr', reservations: 58, returns: 49, newUsers: 14 },
    { month: 'May', reservations: 67, returns: 62, newUsers: 22 },
    { month: 'Jun', reservations: 73, returns: 68, newUsers: 19 }
  ];

  // Weekly activity data (mock)
  const weeklyActivity = [
    { day: 'Mon', books: 12 },
    { day: 'Tue', books: 19 },
    { day: 'Wed', books: 15 },
    { day: 'Thu', books: 23 },
    { day: 'Fri', books: 28 },
    { day: 'Sat', books: 34 },
    { day: 'Sun', books: 18 }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const popularBooks = books
    .map(book => ({ ...book, popularity: Math.floor(Math.random() * 100) + 1 }))
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                <AvatarFallback className="text-xl font-semibold bg-primary text-primary-foreground">
                  {user?.name?.charAt(0) || 'A'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                  Welcome, {user?.name?.split(' ')[0] || 'Admin'}! 👨‍💼
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Here's your library overview for today
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="px-3 py-1">
                <Activity className="w-4 h-4 mr-1" />
                Live Data
              </Badge>
              <Button className="gap-2">
                <Download className="h-4 w-4" />
                Export Report
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50 hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.newReservations}</div>
                <div className="text-xs text-muted-foreground">New Reservations</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +15% from yesterday
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500/10 rounded-lg">
                <UserCheck className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.newUsers}</div>
                <div className="text-xs text-muted-foreground">New Users</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  +8% this week
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <BookOpen className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.booksReturned}</div>
                <div className="text-xs text-muted-foreground">Books Returned</div>
                <div className="flex items-center text-xs text-green-600 mt-1">
                  <ArrowUp className="h-3 w-3 mr-1" />
                  On schedule
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 hover:shadow-sm transition-shadow">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-500/10 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <div className="text-2xl font-bold">{todayStats.overdueBooks}</div>
                <div className="text-xs text-muted-foreground">Overdue Books</div>
                <div className="flex items-center text-xs text-red-600 mt-1">
                  <ArrowDown className="h-3 w-3 mr-1" />
                  -3 from yesterday
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <Book className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooks}</div>
            <p className="text-xs text-muted-foreground">in the library collection</p>
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+12% from last month</span>
            </div>
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
            <div className="mt-2 flex items-center text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
              <span className="text-green-600">+8% from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reserved Books</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{reservedBooks}</div>
            <p className="text-xs text-muted-foreground">currently reserved</p>
            <Progress value={(reservedBooks / totalBooks) * 100} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Checked Out</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{checkedOutBooks}</div>
            <p className="text-xs text-muted-foreground">books checked out</p>
            <Progress value={(checkedOutBooks / totalBooks) * 100} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Book Category Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percentage }) => `${name} ${percentage}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Monthly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Activity Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="reservations" stroke="#8884d8" strokeWidth={2} />
                <Line type="monotone" dataKey="returns" stroke="#82ca9d" strokeWidth={2} />
                <Line type="monotone" dataKey="newUsers" stroke="#ffc658" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Weekly Book Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="books" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Popular Books */}
        <Card>
          <CardHeader>
            <CardTitle>Most Popular Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {popularBooks.map((book, index) => (
                <div key={book.id} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm line-clamp-1">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{book.popularity}</p>
                    <p className="text-xs text-muted-foreground">views</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Analytics */}
        <div className="lg:col-span-2 space-y-6">
          {/* Availability Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-primary" />
                Book Availability Overview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={[
                  { status: 'Available', count: availableBooks, fill: '#22c55e' },
                  { status: 'Reserved', count: reservedBooks, fill: '#f59e0b' },
                  { status: 'Checked Out', count: checkedOutBooks, fill: '#ef4444' }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Charts Grid - Existing charts */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Category Distribution */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percentage }) => `${name} ${percentage}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Weekly Activity */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={weeklyActivity}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="books" stroke="#8884d8" fill="#8884d8" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Monthly Activity Chart */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Monthly Activity Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="reservations" stroke="#8884d8" strokeWidth={2} />
                  <Line type="monotone" dataKey="returns" stroke="#82ca9d" strokeWidth={2} />
                  <Line type="monotone" dataKey="newUsers" stroke="#ffc658" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-3 last:pb-0 last:border-0 border-b border-border/50">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-orange-500' :
                    activity.status === 'info' ? 'bg-blue-500' : 'bg-gray-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      <span className="font-medium">{activity.user}</span>{' '}
                      <span className="text-muted-foreground lowercase">{activity.action}</span>
                      {activity.book && (
                        <span className="text-muted-foreground"> "{activity.book}"</span>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(activity.timestamp, 'MMM d, h:mm a')}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Top Users */}
          <Card className="border-border/50">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Star className="h-5 w-5 text-primary" />
                  Top Readers
                </CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/dashboard/admin/users" className="text-xs">
                    View All
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {topUsers.map((user, index) => (
                <div key={user.name} className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {index + 1}
                  </div>
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-xs">
                      {user.name.split(' ').map(n => n.charAt(0)).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.booksRead} books read</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* System Health */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Settings className="h-5 w-5 text-primary" />
                System Health
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Healthy
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">API Response</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  Fast
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage</span>
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                  75%
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Uptime</span>
                <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                  99.9%
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/admin/books">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Book
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/admin/users">
                  <Eye className="h-4 w-4 mr-2" />
                  Manage Users
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/admin/reports">
                  <Download className="h-4 w-4 mr-2" />
                  Generate Report
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
