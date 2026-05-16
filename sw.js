// ============================================================
// МИСИЈА НА АЛЕКСАНДАР — SAFE SERVICE WORKER
// GitHub Pages / PWA safe cache
// Fixes chrome-extension cache errors
// ============================================================

const CACHE_VERSION = 'alexander-quest-cache-v3';
const APP_SCOPE = '/aleksandar-makedonski-game/';

const CORE_ASSETS = [
  './',
  './index.html',
  './game.js',
  './legacy.js',
  './pwa.js',
  './manifest.json',
  './favicon-16.png',
  './favicon-32.png',
  './icon-96.png',
  './icon-128.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

// ------------------------------------------------------------
// INSTALL
// ------------------------------------------------------------
self.addEventListener('install', event => {
  self.skipWaiting();

  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(
        CORE_ASSETS.map(asset => new Request(asset, { cache: 'reload' }))
      ).catch(error => {
        console.warn('[SW] Some core assets failed to cache:', error);
      });
    })
  );
});

// ------------------------------------------------------------
// ACTIVATE
// ------------------------------------------------------------
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_VERSION)
          .map(key => caches.delete(key))
      );
    }).then(() => {
      return self.clients.claim();
    })
  );
});

// ------------------------------------------------------------
// FETCH — SAFE VERSION
// ------------------------------------------------------------
self.addEventListener('fetch', event => {
  const request = event.request;

  // Only handle GET requests
  if (!request || request.method !== 'GET') {
    return;
  }

  let requestUrl;
  try {
    requestUrl = new URL(request.url);
  } catch (error) {
    return;
  }

  // Never cache unsupported schemes:
  // chrome-extension://, data:, blob:, file:, devtools:, etc.
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') {
    return;
  }

  // Avoid caching browser extensions and devtools requests
  if (
    requestUrl.protocol === 'chrome-extension:' ||
    requestUrl.hostname.includes('extension')
  ) {
    return;
  }

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(request).then(networkResponse => {
        // Return immediately if response is not valid for cache
        if (
          !networkResponse ||
          networkResponse.status !== 200 ||
          request.method !== 'GET'
        ) {
          return networkResponse;
        }

        // Do not cache opaque CDN responses or extension-like requests
        if (networkResponse.type === 'opaque') {
          return networkResponse;
        }

        const responseClone = networkResponse.clone();

        caches.open(CACHE_VERSION).then(cache => {
          cache.put(request, responseClone).catch(error => {
            console.warn('[SW] Cache put skipped:', error);
          });
        }).catch(error => {
          console.warn('[SW] Cache open failed:', error);
        });

        return networkResponse;
      }).catch(() => {
        // Offline fallback only for navigation/page requests
        if (request.mode === 'navigate') {
          return caches.match('./index.html');
        }

        return new Response('', {
          status: 503,
          statusText: 'Offline'
        });
      });
    })
  );
});

// ------------------------------------------------------------
// MESSAGE HANDLER — allow manual cache clear from pwa.js/devtools
// ------------------------------------------------------------
self.addEventListener('message', event => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(keys => {
        return Promise.all(keys.map(key => caches.delete(key)));
      })
    );
  }
});
