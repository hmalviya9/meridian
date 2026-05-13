// Meridian Service Worker — offline-first with network update
const CACHE = 'meridian-v1';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './icon-192.png',
  './icon-512.png'
];

// Install: precache shell
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS).catch(() => {}))
  );
  self.skipWaiting();
});

// Activate: clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first, network fallback (with stale-while-revalidate for fonts)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);

  // Google Fonts and other CDN: stale-while-revalidate
  if (
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com' ||
    url.hostname === 'cdnjs.cloudflare.com'
  ) {
    event.respondWith(
      caches.open(CACHE).then(async (cache) => {
        const cached = await cache.match(event.request);
        const fetched = fetch(event.request)
          .then((resp) => {
            if (resp && resp.ok) cache.put(event.request, resp.clone());
            return resp;
          })
          .catch(() => cached);
        return cached || fetched;
      })
    );
    return;
  }

  // App shell: cache-first
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((resp) => {
          if (resp && resp.ok && resp.type === 'basic') {
            const clone = resp.clone();
            caches.open(CACHE).then((c) => c.put(event.request, clone));
          }
          return resp;
        })
        .catch(() => {
          // Optional: offline fallback for navigations
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
