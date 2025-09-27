"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { offlineStorage, syncPendingActions } from '@/lib/offline-storage';
import { useToast } from '@/hooks/use-toast';

interface OfflineContextType {
  isOnline: boolean;
  pendingActions: number;
  isSyncing: boolean;
  storageInfo: {
    used: number;
    quota: number;
    percentage: number;
  };
  // Methods
  syncNow: () => Promise<void>;
  storeForOffline: (id: string, type: string, data: any) => Promise<void>;
  getOfflineData: (type: string) => Promise<any[]>;
  addPendingAction: (action: any) => Promise<string>;
  clearOfflineData: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

interface OfflineProviderProps {
  children: ReactNode;
}

export function OfflineProvider({ children }: OfflineProviderProps) {
  const [isOnline, setIsOnline] = useState(true);
  const [pendingActions, setPendingActions] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [storageInfo, setStorageInfo] = useState({
    used: 0,
    quota: 0,
    percentage: 0
  });
  const { toast } = useToast();

  // Initialize offline capabilities
  useEffect(() => {
    initializeOffline();
    setIsOnline(navigator.onLine);

    const handleOnline = async () => {
      setIsOnline(true);
      toast({
        title: "Connection Restored",
        description: "Back online! Syncing pending changes...",
        duration: 3000,
      });
      await syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Connection Lost",
        description: "You're now offline. Changes will be saved locally.",
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Periodic sync when online
    const syncInterval = setInterval(() => {
      if (navigator.onLine && pendingActions > 0) {
        syncNow();
      }
    }, 30000); // Sync every 30 seconds

    // Update storage info periodically
    const storageInterval = setInterval(updateStorageInfo, 60000); // Every minute

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(syncInterval);
      clearInterval(storageInterval);
    };
  }, [pendingActions]);

  const initializeOffline = async () => {
    try {
      await offlineStorage.init();
      await updatePendingCount();
      await updateStorageInfo();

      // Clear expired data on startup
      await offlineStorage.clearExpiredData();
    } catch (error) {
      console.error('Failed to initialize offline storage:', error);
    }
  };

  const updatePendingCount = async () => {
    try {
      const actions = await offlineStorage.getPendingActions();
      setPendingActions(actions.length);
    } catch (error) {
      console.error('Failed to update pending count:', error);
    }
  };

  const updateStorageInfo = async () => {
    try {
      const info = await offlineStorage.getStorageInfo();
      setStorageInfo(info);
    } catch (error) {
      console.error('Failed to update storage info:', error);
    }
  };

  const syncNow = async () => {
    if (!isOnline || isSyncing) return;

    setIsSyncing(true);
    try {
      const initialCount = pendingActions;
      await syncPendingActions();
      await updatePendingCount();

      if (initialCount > 0) {
        toast({
          title: "Sync Complete",
          description: `Successfully synced ${initialCount} pending changes.`,
          duration: 3000,
        });
      }
    } catch (error) {
      console.error('Sync failed:', error);
      toast({
        title: "Sync Failed",
        description: "Some changes couldn't be synced. Will retry automatically.",
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsSyncing(false);
    }
  };

  const storeForOffline = async (id: string, type: string, data: any) => {
    try {
      await offlineStorage.storeOfflineData(id, type as any, data);
      await updateStorageInfo();
    } catch (error) {
      console.error('Failed to store offline data:', error);
      throw error;
    }
  };

  const getOfflineData = async (type: string) => {
    try {
      return await offlineStorage.getOfflineData(type as any);
    } catch (error) {
      console.error('Failed to get offline data:', error);
      return [];
    }
  };

  const addPendingAction = async (action: any) => {
    try {
      const id = await offlineStorage.storePendingAction(action);
      await updatePendingCount();

      if (!isOnline) {
        toast({
          title: "Action Saved",
          description: "Your action will be synced when you're back online.",
          duration: 3000,
        });
      }

      return id;
    } catch (error) {
      console.error('Failed to add pending action:', error);
      throw error;
    }
  };

  const clearOfflineData = async () => {
    try {
      await offlineStorage.clearExpiredData();
      await updatePendingCount();
      await updateStorageInfo();

      toast({
        title: "Cache Cleared",
        description: "Offline data has been cleared successfully.",
        duration: 3000,
      });
    } catch (error) {
      console.error('Failed to clear offline data:', error);
      throw error;
    }
  };

  const value: OfflineContextType = {
    isOnline,
    pendingActions,
    isSyncing,
    storageInfo,
    syncNow,
    storeForOffline,
    getOfflineData,
    addPendingAction,
    clearOfflineData,
  };

  return (
    <OfflineContext.Provider value={value}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (context === undefined) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}

// Custom hooks for specific offline functionality
export function useOfflineStorage() {
  const { storeForOffline, getOfflineData } = useOffline();

  return {
    storeBooks: (books: any[]) => storeForOffline('books', 'book', books),
    getBooks: () => getOfflineData('book'),
    storeReservations: (reservations: any[]) => storeForOffline('reservations', 'reservation', reservations),
    getReservations: () => getOfflineData('reservation'),
    storeNotifications: (notifications: any[]) => storeForOffline('notifications', 'notification', notifications),
    getNotifications: () => getOfflineData('notification'),
  };
}

export function useOfflineActions() {
  const { addPendingAction, pendingActions, syncNow, isSyncing } = useOffline();

  const makeReservation = async (bookId: string, userId: string) => {
    return addPendingAction({
      type: 'reservation',
      action: 'create',
      data: { bookId, userId }
    });
  };

  const cancelReservation = async (reservationId: string) => {
    return addPendingAction({
      type: 'reservation',
      action: 'cancel',
      data: { reservationId }
    });
  };

  const returnBook = async (borrowingId: string) => {
    return addPendingAction({
      type: 'return',
      action: 'process',
      data: { borrowingId }
    });
  };

  return {
    makeReservation,
    cancelReservation,
    returnBook,
    pendingActions,
    syncNow,
    isSyncing,
  };
}