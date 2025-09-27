"use client";
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { WifiOff, RefreshCw, Home, Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    setIsOnline(navigator.onLine);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    if (isOnline && typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <WifiOff className="h-8 w-8 text-muted-foreground" />
          </div>
          <CardTitle className="text-2xl">You're Offline</CardTitle>
          <CardDescription>
            {isOnline
              ? "Connection restored! You can try refreshing the page."
              : "Please check your internet connection and try again."
            }
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="text-sm text-muted-foreground space-y-2">
            <p>While offline, you can still:</p>
            <ul className="list-disc list-inside space-y-1 text-left">
              <li>Browse cached book information</li>
              <li>View your reservation history</li>
              <li>Read offline notifications</li>
              <li>Use basic app features</li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <Button
              onClick={handleRetry}
              disabled={!isOnline}
              className="w-full"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              {isOnline ? 'Retry' : 'Waiting for connection...'}
            </Button>

            <Link href="/">
              <Button variant="outline" className="w-full">
                <Home className="mr-2 h-4 w-4" />
                Go to Home
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                <Book className="mr-2 h-4 w-4" />
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <div className="pt-4 border-t">
            <div className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
              isOnline
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`} />
              {isOnline ? 'Online' : 'Offline'}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}