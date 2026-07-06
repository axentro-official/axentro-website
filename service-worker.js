const CACHE_VERSION = 'axentro-v3-ai-prod';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/about.html',
  '/links.html',
  '/404.html',
  '/assets/css/style.css',
  '/assets/css/animations.css',
  '/assets/css/responsive.css',
  '/assets/css/ai-assistant.css',
  '/assets/js/main.js',
  '/assets/js/theme.js',
  '/assets/js/language.js',
  '/assets/js/particles.js',
  '/assets/js/ga.js',
  '/assets/js/ai-assistant.js',
  '/manifest.json',
  '/favicon.png'
];

// 1. Install: Pre-cache App Shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) => {
      return cache.addAll(PRECACHE_URLS).catch(error => console.error('Pre-cache failed:', error));
    })
  );
  self.skipWaiting();
});

// 2. Activate: Clean up old caches aggressively
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_VERSION) {
            return caches.delete(cacheName); // Delete old versions
          }
        })
      );
    })
  );
  self.clients.claim();
});

// 3. Fetch: Advanced Routing & Caching Strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Ignore non-GET requests
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Strategy 1: Network First for HTML (Ensures fresh content)
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request).then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
        return networkResponse;
      }).catch(() => caches.match(request).then(cached => cached || caches.match('/404.html')))
    );
    return;
  }

  // Strategy 2: Network Only for AI Worker API (Prevent caching AI responses)
  if (url.origin === 'https://axentro-ai-assistant.axentroofficial.workers.dev') {
    event.respondWith(fetch(request));
    return;
  }

  // Strategy 3: Stale While Revalidate for Cross-Origin (Fonts, Images, Analytics, CloudFront Video)
  if (url.origin !== self.location.origin) {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        const fetchPromise = fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
          }
          return networkResponse;
        }).catch(() => cachedResponse);
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy 4: Cache First for Same-Origin Static Assets (CSS, JS, Images)
  event.respondWith(
    caches.match(request).then((cachedResponse) => {
      return cachedResponse || fetch(request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const clone = networkResponse.clone();
          caches.open(CACHE_VERSION).then(cache => cache.put(request, clone));
        }
        return networkResponse;
      });
    })
  );
});
