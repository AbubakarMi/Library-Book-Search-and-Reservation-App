"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Book, Users, BarChart2, TrendingUp, AlertCircle, Calendar, Activity } from "lucide-react";
import { books, users, bookCategories } from "@/lib/mock-data";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from "recharts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function AdminDashboardPage() {
  const totalBooks = books.length;
  const totalUsers = users.length;
  const reservedBooks = books.filter(b => b.availabilityStatus === 'reserved').length;
  const checkedOutBooks = books.filter(b => b.availabilityStatus === 'checked_out').length;
  const availableBooks = books.filter(b => b.availabilityStatus === 'available').length;

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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold font-headline">Admin Dashboard</h1>
        <Badge variant="secondary" className="px-3 py-1">
          <Activity className="w-4 h-4 mr-1" />
          Live Data
        </Badge>
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

      {/* Recent Activity & Quick Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Availability Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
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

        <Card>
          <CardHeader>
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm">Database</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Healthy</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">API Response</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">Fast</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Storage</span>
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">75%</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Uptime</span>
              <Badge variant="secondary" className="bg-green-100 text-green-800">99.9%</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
