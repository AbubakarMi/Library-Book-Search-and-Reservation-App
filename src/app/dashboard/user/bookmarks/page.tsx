"use client";
export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { books } from '@/lib/mock-data';
import { BookCard } from '@/components/books/BookCard';
import { BookFilters } from '@/components/books/BookFilters';
import { SearchProvider, useSearch } from '@/context/SearchContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Book, Search, Filter } from 'lucide-react';
import { useNotifications } from '@/context/NotificationContext';

function BrowseBooksContent() {
  const {
    searchTerm,
    setSearchTerm,
    filteredBooks,
    isLoading,
    totalResults,
    currentPage,
    setCurrentPage,
    booksPerPage
  } = useSearch();

  const startIndex = (currentPage - 1) * booksPerPage;
  const endIndex = startIndex + booksPerPage;
  const currentBooks = filteredBooks.slice(startIndex, endIndex);
  const totalPages = Math.ceil(totalResults / booksPerPage);

  // Only show available books
  const availableBooks = currentBooks.filter(book => book.availabilityStatus === 'available');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Book className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline">Browse Books</h1>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search books by title, author, or category..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Books Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-1/4">
          <BookFilters />
        </aside>

        {/* Books Content */}
        <div className="flex-1">
          <div className="mb-6 flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Showing {availableBooks.length} available books
            </div>
          </div>

          {availableBooks.length === 0 ? (
            <Card className="text-center py-12">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <CardTitle className="text-xl">No Available Books Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Try adjusting your search terms or filters to find more books.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {availableBooks.map((book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookmarksPage() {
  return (
    <SearchProvider>
      <BrowseBooksContent />
    </SearchProvider>
  );
}