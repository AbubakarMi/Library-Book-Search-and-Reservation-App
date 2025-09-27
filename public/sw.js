const CACHE_NAME = 'libroreserva-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('Caching static assets...');
      return cache.addAll(STATIC_ASSETS);
    }).catch(err => {
      console.error('Error caching static assets:', err);
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event
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

  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // For navigation requests, try network first, fallback to offline page
      if (request.mode === 'navigate') {
        return fetch(request).catch(() => {
          return caches.match('/offline');
        });
      }

      // For API requests, try network first
      if (url.pathname.startsWith('/api/')) {
        return fetch(request).catch(() => {
          return new Response(
            JSON.stringify({
              error: 'Network unavailable',
              offline: true
            }),
            {
              status: 503,
              statusText: 'Service Unavailable',
              headers: { 'Content-Type': 'application/json' }
            }
          );
        });
      }

      // For other requests, network first, cache on success
      return fetch(request).then((response) => {
        // Don't cache error responses
        if (!response.ok) {
          return response;
        }

        // Clone the response before caching
        const responseClone = response.clone();

        caches.open(DYNAMIC_CACHE).then((cache) => {
          cache.put(request, responseClone);
        });

        return response;
      }).catch(() => {
        // Return a custom offline response for images
        if (request.destination === 'image') {
          return new Response(
            '<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dominant-baseline="middle" fill="#6b7280">Offline</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
          );
        }

        throw error;
      });
    })
  );
});

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