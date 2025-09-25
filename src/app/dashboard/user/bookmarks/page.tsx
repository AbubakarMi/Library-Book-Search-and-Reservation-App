"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { books } from '@/lib/mock-data';
import { BookCard } from '@/components/books/BookCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bookmark, BookOpen, Trash2 } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

export default function BookmarksPage() {
  const [bookmarkedBooks, setBookmarkedBooks] = useState<typeof books>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (user) {
      setIsLoading(true);

      // Get bookmarked book IDs from localStorage
      const bookmarkIds = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');

      // Filter books based on bookmarked IDs
      const bookmarked = books.filter(book => bookmarkIds.includes(book.id));

      setBookmarkedBooks(bookmarked);
      setIsLoading(false);
    }
  }, [user]);

  const clearAllBookmarks = () => {
    if (user) {
      localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify([]));
      setBookmarkedBooks([]);

      addNotification({
        type: 'info',
        title: 'Bookmarks Cleared',
        message: 'All bookmarks have been removed.'
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold font-headline">My Bookmarks</h1>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="bg-gray-300 h-64 rounded-lg mb-4"></div>
              <div className="bg-gray-300 h-4 rounded mb-2"></div>
              <div className="bg-gray-300 h-3 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bookmark className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline">My Bookmarks</h1>
        </div>
        {bookmarkedBooks.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAllBookmarks}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All
          </Button>
        )}
      </div>

      {bookmarkedBooks.length === 0 ? (
        <Card className="text-center py-12">
          <CardHeader>
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <BookOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-xl">No Bookmarks Yet</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-6">
              Start exploring our library and bookmark your favorite books to see them here.
            </p>
            <Button asChild>
              <a href="/">Browse Books</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="text-sm text-muted-foreground">
            {bookmarkedBooks.length} book{bookmarkedBooks.length !== 1 ? 's' : ''} bookmarked
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {bookmarkedBooks.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}