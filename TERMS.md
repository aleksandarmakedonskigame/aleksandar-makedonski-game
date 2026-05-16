// 👑 Мисија на Александар — Service Worker v1.0
// Offline support, instant load, app-like experience

const CACHE_NAME = 'aleksandar-v6-1';
const RUNTIME_CACHE = 'aleksandar-runtime-v6-1';

// Critical app shell — cached on install
const APP_SHELL = [
  './',
  './index.html',
  './game.js',
  './legacy.js',
  './monetization.js',
  './tracking.js',
  './pwa.js',
  './integrations.js',
  './analytics_center.js',
  './manifest.json',
  './icons/icon-72.png',
  './icons/icon-96.png',
  './icons/icon-128.png',
  './icons/icon-144.png',
  './icons/icon-152.png',
  './icons/icon-192.png',
  './icons/icon-384.png',
  './icons/icon-512.png',
  './icons/apple-touch-icon.png',
  './icons/icon-maskable-512.png',
  './icons/favicon-16.png',
  './icons/favicon-32.png',
];

// External CDN resources — cached on first request
const RUNTIME_URLS = [
  'https://cdn.tailwindcss.com',
  'https://cdn.jsdelivr.net/npm/phaser@3.60.0/dist/phaser.min.js',
  'https://unpkg.com/lucide@latest',
  'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.2/dist/confetti.browser.min.js',
  'https://fonts.googleapis.com',
];

// === INSTALL: precache the app shell ===
self.addEventListener('install', event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Pre-caching app shell');
        // Cache files individually to avoid one failure breaking everything
        return Promise.allSettled(
          APP_SHELL.map(url =>
            cache.add(url).catch(err => console.warn('[SW] Failed to cache:', url, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// === ACTIVATE: clean up old caches ===
self.addEventListener('activate', event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// === FETCH: serve from cache, fall back to network ===
self.addEventListener('fetch', event => {
  const req = event.request;

  // Skip non-GET requests
  if (req.method !== 'GET') return;

  // Skip Stripe/PayPal/Analytics URLs — they should always be fresh
  const skipDomains = ['stripe.com', 'paypal.com', 'google-analytics.com',
                       'googletagmanager.com', 'facebook.net', 'tiktok.com'];
  if (skipDomains.some(d => req.url.includes(d))) {
    return;
  }

  // Strategy: Cache-first for app shell, network-first for everything else
  const reqPath = new URL(req.url).pathname;
  const isAppShell = APP_SHELL.some(url => {
    const clean = url.replace(/^\.\//, '/');
    return reqPath.endsWith(clean) || (url === './' && req.mode === 'navigate');
  });

  if (isAppShell) {
    // Cache-first
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone));
        }
        return response;
      }))
    );
  } else {
    // Network-first with cache fallback (for CDNs)
    event.respondWith(
      fetch(req)
        .then(response => {
          if (response.ok && (response.type === 'basic' || response.type === 'cors')) {
            const clone = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(req, clone));
          }
          return response;
        })
        .catch(() => caches.match(req).then(cached => cached || new Response('', { status: 504 })))
    );
  }
});

// === MESSAGE: allow manual cache clearing from app ===
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => event.ports[0]?.postMessage({ cleared: true }));
  }
});
