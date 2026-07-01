const CACHE_NAME = 'axentro-cache-v1';
const URLs_TO_CACHE = [
  '/',
  '/index.html',
  '/about.html',
  '/links.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/css/animations.css',
  '/assets/css/responsive.css',
  '/assets/js/main.js',
  '/assets/js/theme.js',
  '/assets/js/language.js',
  '/assets/js/particles.js',
  '/assets/js/ga.js',
  '/manifest.json'
];

// Install: Cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLs_TO_CACHE).catch(error => {
        console.error('Failed to cache:', error);
      });
    })
  );
  self.skipWaiting();
});

// Activate: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch: Cache First Strategy, then Network
self.addEventListener('fetch', (event) => {
  // Skip cross-origin requests like Google Analytics, Fonts, CloudFront
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((networkResponse) => {
        // Optional: Cache new requests dynamically
        if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback to 404 page if offline and resource not cached
        if (event.request.mode === 'navigate') {
          return caches.match('/404.html');
        }
      });
    })
  );
});
