const CACHE_NAME = 'libroreserva-v2';
const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v2';
const API_CACHE = 'api-v2';
const IMAGE_CACHE = 'images-v2';

// Assets to cache on install (critical resources)
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/login',
  '/signup',
  '/dashboard',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/icons/icon-144x144.png',
  '/icons/icon-72x72.png'
];

// Additional assets to cache in background
const RUNTIME_CACHE_ASSETS = [
  '/dashboard/user',
  '/dashboard/admin',
  '/support',
  '/privacy',
  '/terms'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    Promise.all([
      // Cache critical static assets
      caches.open(STATIC_CACHE).then((cache) => {
        console.log('Caching static assets...');
        return cache.addAll(STATIC_ASSETS);
      }),
      // Pre-cache runtime assets in background
      caches.open(DYNAMIC_CACHE).then((cache) => {
        console.log('Pre-caching runtime assets...');
        return cache.addAll(RUNTIME_CACHE_ASSETS).catch(err => {
          console.warn('Some runtime assets could not be cached:', err);
        });
      })
    ]).catch(err => {
      console.error('Error during install:', err);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    Promise.all([
      // Clean up old caches
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (![STATIC_CACHE, DYNAMIC_CACHE, API_CACHE, IMAGE_CACHE].includes(cacheName)) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      }),
      // Initialize IndexedDB for offline storage
      initializeOfflineDB()
    ])
  );
  self.clients.claim();
});

// Fetch event with enhanced caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Skip external URLs
  if (!url.href.startsWith(self.location.origin)) {
    return;
  }

  // Route different request types to appropriate strategies
  if (request.mode === 'navigate') {
    event.respondWith(handleNavigationRequest(request));
  } else if (url.pathname.startsWith('/api/')) {
    event.respondWith(handleAPIRequest(request));
  } else if (request.destination === 'image') {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(url.pathname)) {
    event.respondWith(handleStaticAsset(request));
  } else {
    event.respondWith(handleDynamicRequest(request));
  }
});

// Navigation requests - Network first, cache fallback
async function handleNavigationRequest(request) {
  try {
    const response = await fetch(request);

    // Cache successful navigation responses
    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Try cache first, then offline page
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    return caches.match('/offline');
  }
}

// API requests - Network first with offline response
async function handleAPIRequest(request) {
  const url = new URL(request.url);

  try {
    const response = await fetch(request);

    // Cache successful GET API responses for read operations
    if (response.ok && isReadOnlyAPI(url.pathname)) {
      const cache = await caches.open(API_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // For read operations, try cache
    if (isReadOnlyAPI(url.pathname)) {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }
    }

    return new Response(
      JSON.stringify({
        error: 'Network unavailable',
        offline: true,
        message: 'This request will be retried when you\'re back online'
      }),
      {
        status: 503,
        statusText: 'Service Unavailable',
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

// Image requests - Cache first
async function handleImageRequest(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(IMAGE_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    // Return offline placeholder image
    return new Response(
      `<svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
        <rect width="200" height="150" fill="#f3f4f6" stroke="#e5e7eb"/>
        <circle cx="80" cy="60" r="8" fill="#d1d5db"/>
        <path d="M60 80 L80 60 L100 80 L140 40 L140 120 L60 120 Z" fill="#d1d5db"/>
        <text x="100" y="140" text-anchor="middle" font-family="Arial" font-size="12" fill="#6b7280">Image offline</text>
      </svg>`,
      {
        headers: {
          'Content-Type': 'image/svg+xml',
          'Cache-Control': 'no-cache'
        }
      }
    );
  }
}

// Static assets - Cache first
async function handleStaticAsset(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }

  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    throw error;
  }
}

// Dynamic requests - Network first, cache fallback
async function handleDynamicRequest(request) {
  try {
    const response = await fetch(request);

    if (response.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }

    throw error;
  }
}

// Helper functions
function isStaticAsset(pathname) {
  return pathname.startsWith('/_next/') ||
         pathname.includes('.js') ||
         pathname.includes('.css') ||
         pathname.includes('.woff') ||
         pathname.includes('.woff2') ||
         pathname === '/manifest.json';
}

function isReadOnlyAPI(pathname) {
  const readOnlyPaths = ['/api/books', '/api/search', '/api/notifications'];
  return readOnlyPaths.some(path => pathname.startsWith(path)) &&
         !pathname.includes('/create') &&
         !pathname.includes('/update') &&
         !pathname.includes('/delete');
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);

  if (event.tag === 'background-reservation') {
    event.waitUntil(syncReservations());
  }

  if (event.tag === 'background-notifications') {
    event.waitUntil(syncNotifications());
  }
});

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);

  const options = {
    body: event.data ? event.data.text() : 'New notification from LibroReserva',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'libroreserva-notification',
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/icons/view.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss',
        icon: '/icons/dismiss.png'
      }
    ]
  };

  event.waitUntil(
    self.registration.showNotification('LibroReserva', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();

  if (event.action === 'view') {
    event.waitUntil(
      clients.openWindow('/dashboard')
    );
  } else if (event.action === 'dismiss') {
    // Just close the notification
    return;
  } else {
    // Default action - open app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Helper functions
async function syncReservations() {
  try {
    // Get pending reservations from IndexedDB
    const pendingReservations = await getPendingReservations();

    for (const reservation of pendingReservations) {
      try {
        const response = await fetch('/api/reservations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(reservation)
        });

        if (response.ok) {
          // Remove from pending list
          await removePendingReservation(reservation.id);
        }
      } catch (error) {
        console.error('Failed to sync reservation:', error);
      }
    }
  } catch (error) {
    console.error('Error in syncReservations:', error);
  }
}

async function syncNotifications() {
  try {
    // Sync any offline notifications
    console.log('Syncing notifications...');
  } catch (error) {
    console.error('Error in syncNotifications:', error);
  }
}

async function getPendingReservations() {
  // This would interact with IndexedDB to get pending reservations
  return [];
}

async function removePendingReservation(id) {
  // This would remove the reservation from IndexedDB
  console.log('Removing pending reservation:', id);
}

// Initialize IndexedDB for offline storage
async function initializeOfflineDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('LibroReservaOfflineDB', 1);

    request.onerror = () => {
      console.error('Failed to initialize offline database');
      resolve(); // Don't fail the service worker activation
    };

    request.onsuccess = () => {
      console.log('Offline database initialized');
      resolve();
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create stores for offline data
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