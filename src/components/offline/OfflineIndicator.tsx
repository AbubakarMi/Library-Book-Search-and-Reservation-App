"use client";

import { useState, useEffect } from 'react';
import { Wifi, WifiOff, CloudOff, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { offlineStorage, syncPendingActions } from '@/lib/offline-storage';

interface OfflineIndicatorProps {
  showFullStatus?: boolean;
  className?: string;
}

export function OfflineIndicator({ showFullStatus = false, className = "" }: OfflineIndicatorProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Initialize online status
    setIsOnline(navigator.onLine);

    // Set up event listeners
    const handleOnline = async () => {
      setIsOnline(true);
      toast({
        title: "Back Online",
        description: "Connection restored. Syncing data...",
        duration: 3000,
      });

      // Sync pending actions when back online
      await handleSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Gone Offline",
        description: "You're now offline. Some features may be limited.",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Load pending actions count
    loadPendingCount();

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  const loadPendingCount = async () => {
    try {
      const actions = await offlineStorage.getPendingActions();
      setPendingActions(actions.length);
    } catch (error) {
      console.error('Failed to load pending actions:', error);
    }
  };

  const handleSync = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      await syncPendingActions();
      await loadPendingCount();

      if (pendingActions > 0) {
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${pendingActions} pending actions.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Failed to sync some data. Will retry automatically.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  if (showFullStatus) {
    return (
      <div className={`flex items-center space-x-2 ${className}`}>
        <Badge
          variant={isOnline ? "default" : "destructive"}
          className="flex items-center space-x-1"
        >
          {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
          <span>{isOnline ? 'Online' : 'Offline'}</span>
        </Badge>

        {pendingActions > 0 && (
          <Badge variant="secondary" className="flex items-center space-x-1">
            <CloudOff className="h-3 w-3" />
            <span>{pendingActions} pending</span>
          </Badge>
        )}

        {isOnline && pendingActions > 0 && (
          <Button
            size="sm"
            variant="outline"
            onClick={handleSync}
            disabled={isSyncing}
            className="h-6 px-2 text-xs"
          >
            {isSyncing ? 'Syncing...' : 'Sync Now'}
          </Button>
        )}
      </div>
    );
  }

  // Compact indicator
  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`w-2 h-2 rounded-full ${
          isOnline ? 'bg-green-500' : 'bg-red-500'
        }`}
        title={isOnline ? 'Online' : 'Offline'}
      />
      {pendingActions > 0 && (
        <Badge
          variant="secondary"
          className="ml-2 h-4 px-1 text-xs"
          title={`${pendingActions} actions pending sync`}
        >
          {pendingActions}
        </Badge>
      )}
    </div>
  );
}

// Floating offline banner
export function OfflineBanner() {
  const [isOnline, setIsOnline] = useState(true);
  const [show, setShow] = useState(false);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      setShow(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShow(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!show || isOnline) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
      <div className="flex items-center justify-center space-x-2">
        <AlertCircle className="h-4 w-4" />
        <span>You're currently offline. Some features may be limited.</span>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => setShow(false)}
          className="h-6 px-2 ml-4"
        >
          Dismiss
        </Button>
      </div>
    </div>
  );
}

// Offline-ready component wrapper
interface OfflineReadyProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requiresOnline?: boolean;
}

export function OfflineReady({ children, fallback, requiresOnline = false }: OfflineReadyProps) {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (requiresOnline && !isOnline) {
    return (
      <div className="text-center p-4 bg-muted rounded-lg">
        <WifiOff className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm text-muted-foreground">
          This feature requires an internet connection
        </p>
        {fallback}
      </div>
    );
  }

  return <>{children}</>;
}