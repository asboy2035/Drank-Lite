const cacheName = 'water-tracker-v1';
const assetsToCache = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/stats/index.html',
];

// Install event - cache the assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll(assetsToCache);
    })
  );
});

// Fetch event - respond with cached assets or fetch from network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Check if the browser is online
      if (navigator.onLine) {
        // If online, try to fetch from the network and update the cache
        return fetch(event.request).then(networkResponse => {
          // Update the cache with the new network response
          return caches.open(cacheName).then(cache => {
            cache.put(event.request, networkResponse.clone());
            document.getElementById('app-updated').classList.remove('hidden');
            return networkResponse;
          });
        }).catch(() => {
          // If the network request fails, return the cached response
          return cachedResponse || fetch(event.request);
        });
      } else {
        // If offline, return the cached response or fallback to fetch if it's not cached
        return cachedResponse || fetch(event.request);
      }
    })
  );
});

// Activate event - clean up old caches if any
self.addEventListener('activate', event => {
  const cacheWhitelist = [cacheName];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (!cacheWhitelist.includes(cache)) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});
