// ============================================================
// МИСИЈА НА АЛЕКСАНДАР — SERVICE WORKER v1.7.1
// Network-first for HTML/JS so old game code does not stay cached.
// ============================================================

const CACHE_NAME = 'alexander-quest-v1-8-1-1';
const CORE_ASSETS = [
  './',
  './index.html?v=1.8.1',
  './game.js?v=1.8.1',
  './legacy.js?v=1.8.1',
  './pwa.js?v=1.8.1',
  './v13_world_protocol.js?v=1.8.1',
  './v14_world_unique.js?v=1.8.1',
  './v15_dynamic_gameplay.js?v=1.8.1',
  './v16_player_identity_flags.js?v=1.8.1',
  './v17_rhythm_identity.js?v=1.8.1',
  './v18_proactive_agents.js?v=1.8.1.1',
  './v181_clean_buttons.js?v=1.8.1.1',
  './manifest.json?v=1.8.1'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE_ASSETS).catch(() => null))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (!request || request.method !== 'GET') return;

  let url;
  try { url = new URL(request.url); } catch (e) { return; }
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;

  const isHTML = request.mode === 'navigate' || url.pathname.endsWith('/index.html');
  const isJS = url.pathname.endsWith('.js');

  // Network-first for HTML and JS to avoid stale game code.
  if (isHTML || isJS) {
    event.respondWith(
      fetch(request, { cache: 'no-store' })
        .then(response => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy).catch(() => null));
          return response;
        })
        .catch(() => caches.match(request).then(cached => cached || caches.match('./index.html?v=1.8.1')))
    );
    return;
  }

  // Cache-first for static assets.
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.status === 200 && response.type !== 'opaque') {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy).catch(() => null));
        }
        return response;
      });
    })
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') self.skipWaiting();
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  }
});
