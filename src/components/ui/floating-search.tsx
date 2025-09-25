"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { books } from '@/lib/mock-data';
import { placeholderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';

export function FloatingSearchButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredBooks = searchQuery.length > 0
    ? books.filter(book =>
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const getStatusBadgeVariant = (status: "available" | "reserved" | "checked_out") => {
    switch (status) {
      case "available":
        return "bg-green-500 hover:bg-green-600";
      case "reserved":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "checked_out":
        return "bg-red-500 hover:bg-red-600";
    }
  };

  const handleBookClick = () => {
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button
            size="lg"
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
          >
            <Search className="h-6 w-6" />
            <span className="sr-only">Quick Search</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Quick Book Search
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author, or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10"
                autoFocus
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {searchQuery.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Start typing to search for books...</p>
              </div>
            ) : filteredBooks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No books found matching "{searchQuery}"</p>
              </div>
            ) : (
              <ScrollArea className="max-h-96">
                <div className="space-y-3">
                  {filteredBooks.map((book) => {
                    const coverImage = placeholderImages.find(p => p.id === book.coverImageId) || placeholderImages[0];

                    return (
                      <Link
                        key={book.id}
                        href={`/books/${book.id}`}
                        onClick={handleBookClick}
                        className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted transition-colors"
                      >
                        <div className="relative w-12 h-16 flex-shrink-0">
                          <Image
                            src={coverImage.imageUrl}
                            alt={`Cover of ${book.title}`}
                            fill
                            className="object-cover rounded"
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-sm line-clamp-2">{book.title}</h3>
                          <p className="text-xs text-muted-foreground mt-1">{book.author}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <Badge variant="secondary" className="text-xs">
                              {book.category}
                            </Badge>
                            <Badge
                              className={cn(
                                "text-xs text-white",
                                getStatusBadgeVariant(book.availabilityStatus)
                              )}
                            >
                              {book.availabilityStatus.replace("_", " ")}
                            </Badge>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </ScrollArea>
            )}

            {filteredBooks.length > 0 && (
              <div className="pt-4 border-t">
                <Link
                  href={`/?search=${encodeURIComponent(searchQuery)}`}
                  onClick={handleBookClick}
                  className="block w-full"
                >
                  <Button variant="outline" className="w-full">
                    View All Results for "{searchQuery}"
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}