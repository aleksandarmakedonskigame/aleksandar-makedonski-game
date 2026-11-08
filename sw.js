// WPA educational games - controlled public playtest cache.
const CACHE_NAME = 'wpa-alex-playtest-2.3.4';
const ASSETS = [
  "./audio/pesna-patot-na-svetlinata.m4a",
  "./certificate.html",
  "./crossover.html",
  "./edition.js",
  "./game.js",
  "./i18n.js",
  "./icons/apple-touch-icon.png",
  "./icons/favicon-16.png",
  "./icons/favicon-32.png",
  "./icons/icon-128.png",
  "./icons/icon-144.png",
  "./icons/icon-152.png",
  "./icons/icon-192.png",
  "./icons/icon-384.png",
  "./icons/icon-512.png",
  "./icons/icon-72.png",
  "./icons/icon-96.png",
  "./icons/icon-maskable-512.png",
  "./icons/screenshot-desktop.png",
  "./icons/screenshot-mobile.png",
  "./index.html",
  "./legacy.js",
  "./manifest.json",
  "./privacy.html",
  "./pwa.js",
  "./song.js",
  "./sounds.js",
  "./teacher.html",
  "./v13_world_protocol.js",
  "./v14_world_unique.js",
  "./v15_dynamic_gameplay.js",
  "./v16_player_identity_flags.js",
  "./v17_rhythm_identity.js",
  "./v181_clean_buttons.js",
  "./v18_proactive_agents.js",
  "./vendor/confetti.browser.js",
  "./vendor/fonts.css",
  "./vendor/fonts/caveat-cyrillic-400-normal.woff2",
  "./vendor/fonts/caveat-cyrillic-700-normal.woff2",
  "./vendor/fonts/caveat-latin-400-normal.woff2",
  "./vendor/fonts/caveat-latin-700-normal.woff2",
  "./vendor/fonts/forum-cyrillic-400-normal.woff2",
  "./vendor/fonts/forum-latin-400-normal.woff2",
  "./vendor/fonts/inter-cyrillic-400-normal.woff2",
  "./vendor/fonts/inter-cyrillic-500-normal.woff2",
  "./vendor/fonts/inter-cyrillic-600-normal.woff2",
  "./vendor/fonts/inter-cyrillic-700-normal.woff2",
  "./vendor/fonts/inter-latin-400-normal.woff2",
  "./vendor/fonts/inter-latin-500-normal.woff2",
  "./vendor/fonts/inter-latin-600-normal.woff2",
  "./vendor/fonts/inter-latin-700-normal.woff2",
  "./vendor/lucide.min.js",
  "./vendor/phaser.min.js",
  "./vendor/tailwind.css"
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(async cache => {
    for(const path of ASSETS){try{await cache.add(path);}catch(err){console.warn('[WPA SW] optional asset unavailable:',path);}}
  }).then(()=>self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key.startsWith('wpa-alex-playtest-') && key!==CACHE_NAME).map(key=>caches.delete(key)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  if(req.mode==='navigate') {
    event.respondWith(fetch(req).then(res=>{if(res.ok){const clone=res.clone();caches.open(CACHE_NAME).then(c=>c.put(req,clone));}return res;}).catch(()=>caches.match(req).then(r=>r||caches.match('./index.html'))));
    return;
  }
  event.respondWith(caches.match(req).then(hit=>hit||fetch(req)));
});
