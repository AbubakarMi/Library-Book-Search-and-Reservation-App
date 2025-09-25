"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bookmark, BookmarkCheck } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/context/NotificationContext';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
  bookId: string;
  bookTitle: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'sm' | 'default' | 'lg';
  showText?: boolean;
  className?: string;
}

export function BookmarkButton({
  bookId,
  bookTitle,
  variant = 'ghost',
  size = 'default',
  showText = false,
  className
}: BookmarkButtonProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { addNotification } = useNotifications();

  useEffect(() => {
    if (user) {
      // Check if book is bookmarked (from localStorage for demo)
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');
      setIsBookmarked(bookmarks.includes(bookId));
    }
  }, [bookId, user]);

  const toggleBookmark = async () => {
    if (!user) {
      addNotification({
        type: 'warning',
        title: 'Sign In Required',
        message: 'Please sign in to bookmark books.',
        actionUrl: '/login',
        actionText: 'Sign In'
      });
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      const bookmarks = JSON.parse(localStorage.getItem(`bookmarks_${user.id}`) || '[]');

      if (isBookmarked) {
        // Remove bookmark
        const updatedBookmarks = bookmarks.filter((id: string) => id !== bookId);
        localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
        setIsBookmarked(false);

        addNotification({
          type: 'info',
          title: 'Bookmark Removed',
          message: `\"${bookTitle}\" has been removed from your bookmarks.`
        });
      } else {
        // Add bookmark
        const updatedBookmarks = [...bookmarks, bookId];
        localStorage.setItem(`bookmarks_${user.id}`, JSON.stringify(updatedBookmarks));
        setIsBookmarked(true);

        addNotification({
          type: 'success',
          title: 'Book Bookmarked',
          message: `\"${bookTitle}\" has been added to your bookmarks.`,
          actionUrl: '/dashboard/user',
          actionText: 'View Bookmarks'
        });
      }

      setIsLoading(false);
    }, 500);
  };

  return (
    <Button
      variant={variant}
      size={size}
      onClick={toggleBookmark}
      disabled={isLoading}
      className={cn(
        'transition-all duration-200',
        isBookmarked && variant === 'ghost' && 'text-yellow-600 hover:text-yellow-700',
        className
      )}
    >
      {isLoading ? (
        <Bookmark className={cn(
          'animate-pulse',
          size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
          showText && 'mr-2'
        )} />
      ) : (
        <>
          {isBookmarked ? (
            <BookmarkCheck className={cn(
              'fill-current',
              size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
              showText && 'mr-2'
            )} />
          ) : (
            <Bookmark className={cn(
              size === 'sm' ? 'h-3 w-3' : size === 'lg' ? 'h-5 w-5' : 'h-4 w-4',
              showText && 'mr-2'
            )} />
          )}
        </>
      )}
      {showText && (
        <span>{isBookmarked ? 'Bookmarked' : 'Bookmark'}</span>
      )}
    </Button>
  );
}