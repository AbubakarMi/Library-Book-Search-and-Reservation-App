/**
 * Offline Storage Utility
 * Provides IndexedDB-based storage for offline functionality
 */

interface OfflineData {
  id: string;
  type: 'book' | 'reservation' | 'user' | 'notification' | 'search';
  data: any;
  timestamp: number;
  synced: boolean;
}

interface PendingAction {
  id: string;
  type: 'reservation' | 'cancellation' | 'return' | 'notification';
  action: string;
  data: any;
  timestamp: number;
  retryCount: number;
}

class OfflineStorage {
  private dbName = 'LibroReservaOfflineDB';
  private version = 1;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // Create object stores
        if (!db.objectStoreNames.contains('offlineData')) {
          const dataStore = db.createObjectStore('offlineData', { keyPath: 'id' });
          dataStore.createIndex('type', 'type', { unique: false });
          dataStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('pendingActions')) {
          const actionsStore = db.createObjectStore('pendingActions', { keyPath: 'id' });
          actionsStore.createIndex('type', 'type', { unique: false });
          actionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        }

        if (!db.objectStoreNames.contains('cachedSearches')) {
          const searchStore = db.createObjectStore('cachedSearches', { keyPath: 'query' });
          searchStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };
    });
  }

  // Store data for offline access
  async storeOfflineData(id: string, type: OfflineData['type'], data: any): Promise<void> {
    if (!this.db) await this.init();

    const offlineData: OfflineData = {
      id,
      type,
      data,
      timestamp: Date.now(),
      synced: true
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readwrite');
      const store = transaction.objectStore('offlineData');
      const request = store.put(offlineData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Retrieve offline data by type
  async getOfflineData(type: OfflineData['type']): Promise<OfflineData[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData'], 'readonly');
      const store = transaction.objectStore('offlineData');
      const index = store.index('type');
      const request = index.getAll(type);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Store pending actions for sync when online
  async storePendingAction(action: Omit<PendingAction, 'id' | 'timestamp' | 'retryCount'>): Promise<string> {
    if (!this.db) await this.init();

    const pendingAction: PendingAction = {
      id: `${action.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      retryCount: 0,
      ...action
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.add(pendingAction);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(pendingAction.id);
    });
  }

  // Get all pending actions
  async getPendingActions(): Promise<PendingAction[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readonly');
      const store = transaction.objectStore('pendingActions');
      const request = store.getAll();

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve(request.result);
    });
  }

  // Remove completed pending action
  async removePendingAction(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['pendingActions'], 'readwrite');
      const store = transaction.objectStore('pendingActions');
      const request = store.delete(id);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Cache search results
  async cacheSearch(query: string, results: any[]): Promise<void> {
    if (!this.db) await this.init();

    const cacheData = {
      query,
      results,
      timestamp: Date.now()
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedSearches'], 'readwrite');
      const store = transaction.objectStore('cachedSearches');
      const request = store.put(cacheData);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => resolve();
    });
  }

  // Get cached search results
  async getCachedSearch(query: string): Promise<any[] | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['cachedSearches'], 'readonly');
      const store = transaction.objectStore('cachedSearches');
      const request = store.get(query);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        const result = request.result;
        if (result && Date.now() - result.timestamp < 24 * 60 * 60 * 1000) { // 24 hours cache
          resolve(result.results);
        } else {
          resolve(null);
        }
      };
    });
  }

  // Store user books/reservations for offline access
  async storeUserBooks(userId: string, books: any[]): Promise<void> {
    await this.storeOfflineData(`user_books_${userId}`, 'book', books);
  }

  async getUserBooks(userId: string): Promise<any[]> {
    const data = await this.getOfflineData('book');
    const userBooks = data.find(item => item.id === `user_books_${userId}`);
    return userBooks ? userBooks.data : [];
  }

  // Store user reservations for offline access
  async storeUserReservations(userId: string, reservations: any[]): Promise<void> {
    await this.storeOfflineData(`user_reservations_${userId}`, 'reservation', reservations);
  }

  async getUserReservations(userId: string): Promise<any[]> {
    const data = await this.getOfflineData('reservation');
    const userReservations = data.find(item => item.id === `user_reservations_${userId}`);
    return userReservations ? userReservations.data : [];
  }

  // Store notifications for offline access
  async storeNotifications(userId: string, notifications: any[]): Promise<void> {
    await this.storeOfflineData(`user_notifications_${userId}`, 'notification', notifications);
  }

  async getNotifications(userId: string): Promise<any[]> {
    const data = await this.getOfflineData('notification');
    const userNotifications = data.find(item => item.id === `user_notifications_${userId}`);
    return userNotifications ? userNotifications.data : [];
  }

  // Clear expired cache data
  async clearExpiredData(): Promise<void> {
    if (!this.db) await this.init();

    const expiredTime = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(['offlineData', 'cachedSearches'], 'readwrite');

      // Clear expired offline data
      const dataStore = transaction.objectStore('offlineData');
      const dataIndex = dataStore.index('timestamp');
      const dataRequest = dataIndex.openCursor(IDBKeyRange.upperBound(expiredTime));

      dataRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      // Clear expired searches
      const searchStore = transaction.objectStore('cachedSearches');
      const searchIndex = searchStore.index('timestamp');
      const searchRequest = searchIndex.openCursor(IDBKeyRange.upperBound(expiredTime));

      searchRequest.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        }
      };

      transaction.onerror = () => reject(transaction.error);
      transaction.oncomplete = () => resolve();
    });
  }

  // Get storage usage info
  async getStorageInfo(): Promise<{ used: number; quota: number; percentage: number }> {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      const used = estimate.usage || 0;
      const quota = estimate.quota || 0;
      const percentage = quota > 0 ? Math.round((used / quota) * 100) : 0;

      return { used, quota, percentage };
    }

    return { used: 0, quota: 0, percentage: 0 };
  }
}

// Create and export singleton instance
export const offlineStorage = new OfflineStorage();

// Helper functions for common offline operations
export async function isOnline(): Promise<boolean> {
  return navigator.onLine;
}

export async function waitForOnline(): Promise<void> {
  return new Promise((resolve) => {
    if (navigator.onLine) {
      resolve();
    } else {
      const handler = () => {
        window.removeEventListener('online', handler);
        resolve();
      };
      window.addEventListener('online', handler);
    }
  });
}

export async function syncPendingActions(): Promise<void> {
  const actions = await offlineStorage.getPendingActions();

  for (const action of actions) {
    try {
      // Attempt to sync the action
      const response = await fetch(`/api/${action.type}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(action.data),
      });

      if (response.ok) {
        // Successfully synced, remove from pending
        await offlineStorage.removePendingAction(action.id);
      } else {
        // Failed to sync, increment retry count
        action.retryCount++;
        if (action.retryCount >= 3) {
          // Too many retries, remove action
          await offlineStorage.removePendingAction(action.id);
        }
      }
    } catch (error) {
      console.error('Failed to sync action:', action.id, error);
      action.retryCount++;
    }
  }
}

// Auto-sync when online
window.addEventListener('online', () => {
  syncPendingActions().catch(console.error);
});