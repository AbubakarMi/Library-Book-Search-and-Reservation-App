"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from "@/hooks/useAuth";
import { useNotifications } from "@/context/NotificationContext";
import UserReservations from "@/components/dashboard/UserReservations";
import UserBorrowings from "@/components/dashboard/UserBorrowings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  BookOpen,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  Bookmark,
  Award,
  Target,
  Activity,
  Book,
  Heart,
  CheckCircle,
  AlertCircle,
  Bell,
  ArrowRight,
  RotateCcw
} from "lucide-react";
import { books } from "@/lib/mock-data";
import { placeholderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";

export default function UserDashboardPage() {
  const { user } = useAuth();
  const { notifications, unreadCount } = useNotifications();
  const [bookmarkedBooks, setBookmarkedBooks] = useState<typeof books>([]);
  const [readingStats, setReadingStats] = useState({
    booksRead: 0,
    booksReserved: 0,
    totalReadingTime: 0, // minutes
    readingStreak: 0, // days
    readingGoal: 12, // books per year
    favoriteGenre: "Fiction"
  });

  // Get user's bookmarked books
  useEffect(() => {
    if (user) {
      const bookmarkIds = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
      const bookmarked = books.filter(book => bookmarkIds.includes(book.id)).slice(0, 3);
      setBookmarkedBooks(bookmarked);
    }
  }, [user]);

  // Recent activity based on actual user actions
  const recentActivity: any[] = []; // Will be populated when user performs actual actions

  // Recommended books based on reading history
  const recommendedBooks = books.filter(book =>
    book.category === readingStats.favoriteGenre
  ).slice(0, 4);

  const readingProgress = Math.round((readingStats.booksRead / readingStats.readingGoal) * 100);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Please sign in</h2>
          <p className="text-muted-foreground">You need to be signed in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmMWY1ZjkiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxLjUiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-40"></div>

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback className="text-xl font-semibold">
                  {user.name?.charAt(0) || 'U'}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold tracking-tight font-headline">
                  Welcome back, {user.name?.split(' ')[0] || 'Reader'}! 👋
                </h1>
                <p className="text-muted-foreground text-lg mt-1">
                  Ready to continue your reading journey?
                </p>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{readingStats.booksRead}</div>
                <div className="text-xs text-muted-foreground">Books Read</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{readingStats.readingStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </div>
              {unreadCount > 0 && (
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-500">{unreadCount}</div>
                  <div className="text-xs text-muted-foreground">Notifications</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Reading Progress Card */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  2024 Reading Goal
                </CardTitle>
                <Badge variant="secondary" className="text-xs">
                  {readingStats.booksRead} of {readingStats.readingGoal} books
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{readingProgress}% complete</span>
              </div>
              <Progress value={readingProgress} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Started: Jan 2024</span>
                <span>{readingStats.readingGoal - readingStats.booksRead} books remaining</span>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{readingStats.booksReserved}</div>
                <div className="text-xs text-muted-foreground">Active Reservations</div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Clock className="h-5 w-5 text-green-500" />
                </div>
                <div className="text-2xl font-bold">{Math.floor(readingStats.totalReadingTime / 60)}</div>
                <div className="text-xs text-muted-foreground">Hours Read</div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Bookmark className="h-5 w-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{bookmarkedBooks.length}</div>
                <div className="text-xs text-muted-foreground">Bookmarked</div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <div className="w-10 h-10 bg-orange-500/10 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Award className="h-5 w-5 text-orange-500" />
                </div>
                <div className="text-2xl font-bold">{readingStats.readingStreak}</div>
                <div className="text-xs text-muted-foreground">Day Streak</div>
              </CardContent>
            </Card>
          </div>

          {/* Library Management Tabs */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    My Reservations
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/user/reservations" className="text-xs">
                      View All <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your recent reservations will appear here</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-primary" />
                    Borrowed Books
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/user/borrowings" className="text-xs">
                      View All <ArrowRight className="h-3 w-3 ml-1" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8 text-muted-foreground">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Your borrowed books will appear here</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recommended Books */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Recommended For You
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Based on your reading history in {readingStats.favoriteGenre}
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {recommendedBooks.map((book) => {
                  const coverImage = placeholderImages.find(p => p.id === book.coverImageId) || placeholderImages[0];
                  return (
                    <div key={book.id} className="group">
                      <Link href={`/books/${book.id}`} className="block">
                        <div className="relative aspect-[3/4] rounded-lg overflow-hidden mb-2 shadow-sm group-hover:shadow-md transition-all duration-300">
                          <Image
                            src={coverImage.imageUrl}
                            alt={book.title}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {book.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                      </Link>
                    </div>
                  );
                })}
              </div>
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
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Your activity will appear here as you use the library</p>
                <p className="text-xs mt-1">Reserve books, return books, and more</p>
              </div>
            </CardContent>
          </Card>

          {/* Quick Bookmarks */}
          {bookmarkedBooks.length > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <Heart className="h-5 w-5 text-primary" />
                    My Bookmarks
                  </CardTitle>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/dashboard/user/bookmarks" className="text-xs">
                      View All
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {bookmarkedBooks.map((book) => {
                  const coverImage = placeholderImages.find(p => p.id === book.coverImageId) || placeholderImages[0];
                  return (
                    <Link key={book.id} href={`/books/${book.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="relative w-12 h-16 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={coverImage.imageUrl}
                          alt={book.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                        <p className="text-xs text-muted-foreground">{book.author}</p>
                        <Badge variant="outline" className="mt-1 text-xs">
                          {book.availabilityStatus}
                        </Badge>
                      </div>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          )}

          {/* Notifications Preview */}
          {unreadCount > 0 && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Recent Notifications
                  <Badge variant="destructive" className="ml-auto">
                    {unreadCount}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {notifications.filter(n => !n.read).slice(0, 3).map((notification) => (
                  <div key={notification.id} className="p-3 rounded-lg bg-muted/50 border border-border/50">
                    <div className="flex items-start gap-2">
                      {notification.type === 'success' && <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'warning' && <AlertCircle className="h-4 w-4 text-orange-500 mt-0.5 flex-shrink-0" />}
                      {notification.type === 'info' && <Bell className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />}
                      <div className="flex-1">
                        <h5 className="font-medium text-sm">{notification.title}</h5>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Browse Books
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline" asChild>
                <Link href="/dashboard/user/bookmarks">
                  <Bookmark className="h-4 w-4 mr-2" />
                  My Bookmarks
                </Link>
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Calendar className="h-4 w-4 mr-2" />
                Reading Schedule
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}