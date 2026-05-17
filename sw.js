// ============================================================
// МИСИЈА НА АЛЕКСАНДАР — SAFE SERVICE WORKER v1.2
// GitHub Pages / PWA safe cache
// ============================================================

const CACHE_VERSION = 'alexander-quest-cache-v12';

const CORE_ASSETS = [
  './',
  './index.html',
  './game.js',
  './legacy.js',
  './monetization.js',
  './tracking.js',
  './sounds.js',
  './security.js',
  './pwa.js',
  './manifest.json',
  './favicon-16.png',
  './favicon-32.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_VERSION).then(cache => {
      return cache.addAll(CORE_ASSETS.map(asset => new Request(asset, { cache: 'reload' }))).catch(error => {
        console.warn('[SW] Some assets failed to cache:', error);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_VERSION).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (!request || request.method !== 'GET') return;

  let requestUrl;
  try { requestUrl = new URL(request.url); } catch (error) { return; }
  if (requestUrl.protocol !== 'http:' && requestUrl.protocol !== 'https:') return;

  event.respondWith(
    caches.match(request).then(cachedResponse => {
      if (cachedResponse) return cachedResponse;
      return fetch(request).then(networkResponse => {
        if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') return networkResponse;
        const responseClone = networkResponse.clone();
        caches.open(CACHE_VERSION).then(cache => cache.put(request, responseClone).catch(() => {}));
        return networkResponse;
      }).catch(() => {
        if (request.mode === 'navigate') return caches.match('./index.html');
        return new Response('', { status: 503, statusText: 'Offline' });
      });
    })
  );
});

self.addEventListener('message', event => {
  if (!event.data) return;
  if (event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => caches.delete(key)))));
  }
});
