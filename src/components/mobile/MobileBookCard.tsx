"use client";

import { useState } from 'react';
import { Heart, Share2, Eye, Calendar, Star, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { TouchGestures } from './TouchGestures';
import { Book } from '@/lib/types';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';

interface MobileBookCardProps {
  book: Book;
  onReserve?: (book: Book) => void;
  onBookmark?: (book: Book) => void;
  isBookmarked?: boolean;
  compact?: boolean;
}

export function MobileBookCard({
  book,
  onReserve,
  onBookmark,
  isBookmarked = false,
  compact = false
}: MobileBookCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const { toast } = useToast();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: book.title,
          text: `Check out "${book.title}" by ${book.author}`,
          url: window.location.origin + `/books/${book.id}`
        });
      } catch (error) {
        console.log('Share cancelled or failed');
      }
    } else {
      // Fallback: copy to clipboard
      await navigator.clipboard.writeText(
        `${book.title} by ${book.author} - ${window.location.origin}/books/${book.id}`
      );
      toast({
        title: "Link Copied",
        description: "Book link copied to clipboard",
        duration: 3000,
      });
    }
  };

  const handleDoubleTap = () => {
    if (onBookmark) {
      onBookmark(book);
    }
  };

  const handleSwipeRight = () => {
    if (onReserve && book.availabilityStatus === 'Available') {
      onReserve(book);
    }
  };

  const handleSwipeLeft = () => {
    setIsFlipped(!isFlipped);
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'Checked Out': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'Reserved': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  if (compact) {
    return (
      <TouchGestures
        onSwipeRight={handleSwipeRight}
        onDoubleTap={handleDoubleTap}
        className="w-full"
      >
        <Card className={`transition-all duration-200 ${isPressed ? 'scale-95' : ''}`}>
          <CardContent className="p-3">
            <div className="flex space-x-3">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-12 h-16 object-cover rounded"
                loading="lazy"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate">{book.title}</h3>
                <p className="text-xs text-muted-foreground truncate">{book.author}</p>
                <div className="flex items-center justify-between mt-2">
                  <Badge className={`text-xs ${getAvailabilityColor(book.availabilityStatus)}`}>
                    {book.availabilityStatus}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs">{book.rating}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onBookmark?.(book)}
                className="h-8 w-8 p-0"
              >
                <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </TouchGestures>
    );
  }

  return (
    <TouchGestures
      onSwipeRight={handleSwipeRight}
      onSwipeLeft={handleSwipeLeft}
      onDoubleTap={handleDoubleTap}
      className="w-full"
    >
      <div
        className="relative w-full h-full"
        onTouchStart={() => setIsPressed(true)}
        onTouchEnd={() => setIsPressed(false)}
      >
        <Card className={`relative overflow-hidden transition-all duration-300 ${
          isPressed ? 'scale-98' : ''
        } ${isFlipped ? 'rotate-y-180' : ''}`}>

          {/* Front of card */}
          <div className={`${isFlipped ? 'hidden' : 'block'}`}>
            <div className="relative">
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-full h-48 object-cover"
                loading="lazy"
              />

              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              {/* Status badge */}
              <Badge className={`absolute top-2 left-2 ${getAvailabilityColor(book.availabilityStatus)}`}>
                {book.availabilityStatus}
              </Badge>

              {/* Quick actions */}
              <div className="absolute top-2 right-2 flex space-x-1">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => onBookmark?.(book)}
                  className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                >
                  <Heart className={`h-4 w-4 ${isBookmarked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleShare}
                  className="h-8 w-8 p-0 bg-black/20 hover:bg-black/40 backdrop-blur-sm"
                >
                  <Share2 className="h-4 w-4 text-white" />
                </Button>
              </div>

              {/* Title overlay */}
              <div className="absolute bottom-2 left-2 right-2">
                <h3 className="font-semibold text-white text-sm line-clamp-2 mb-1">
                  {book.title}
                </h3>
                <p className="text-white/80 text-xs">{book.author}</p>
              </div>
            </div>

            <CardContent className="p-3 space-y-3">
              {/* Rating and year */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-medium">{book.rating}</span>
                  <span className="text-xs text-muted-foreground">({book.reviews} reviews)</span>
                </div>
                <span className="text-xs text-muted-foreground">{book.publicationYear}</span>
              </div>

              {/* Category */}
              <Badge variant="outline" className="text-xs">
                {book.category}
              </Badge>

              {/* Description */}
              <p className="text-xs text-muted-foreground line-clamp-2">
                {book.description}
              </p>

              {/* Action buttons */}
              <div className="flex space-x-2">
                <Link href={`/books/${book.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full">
                    <Eye className="h-3 w-3 mr-1" />
                    View
                  </Button>
                </Link>
                {book.availabilityStatus === 'Available' && (
                  <Button
                    size="sm"
                    onClick={() => onReserve?.(book)}
                    className="flex-1"
                  >
                    <Calendar className="h-3 w-3 mr-1" />
                    Reserve
                  </Button>
                )}
              </div>
            </CardContent>
          </div>

          {/* Back of card */}
          <div className={`${isFlipped ? 'block' : 'hidden'}`}>
            <CardContent className="p-4 h-full">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">{book.title}</h3>

                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Author:</span>
                    <span>{book.author}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ISBN:</span>
                    <span className="font-mono">{book.isbn}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Publisher:</span>
                    <span>{book.publisher}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Language:</span>
                    <span>{book.language}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Pages:</span>
                    <span>{book.pages}</span>
                  </div>
                </div>

                {book.genres && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Genres:</p>
                    <div className="flex flex-wrap gap-1">
                      {book.genres.slice(0, 3).map((genre, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {genre}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFlipped(false)}
                  className="w-full mt-4"
                >
                  <BookOpen className="h-3 w-3 mr-1" />
                  Flip Back
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Swipe hints */}
        <div className="absolute -bottom-1 left-0 right-0 flex justify-center space-x-4 text-xs text-muted-foreground">
          {book.availabilityStatus === 'Available' && (
            <span>Swipe → to reserve</span>
          )}
          <span>Swipe ← for details</span>
          <span>Double tap to ♡</span>
        </div>
      </div>
    </TouchGestures>
  );
}