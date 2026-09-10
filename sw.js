// sw.js — ARVEXA School Service Worker (mis à jour)
const CACHE_NAME = 'arvexa-v1.0.0';
const RUNTIME_CACHE = 'arvexa-runtime-v1';

// Fichiers essentiels à mettre en cache dès l'installation
const PRECACHE_URLS = [
  './',
  './index.html',
  './login.html',
  './admin-users.html',
  './admin-content.html',
  './manifest.json',
  './pwa-register.js',
  './icon.png',
  './icon-192x192.png',
  './icon-512x512.png'
];

// Installation : pré-cache
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Pré-cache des fichiers');
        return Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => console.warn('[SW] Échec cache:', url, err))
          )
        );
      })
      .then(() => self.skipWaiting())
  );
});

// Activation : nettoyage anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME && key !== RUNTIME_CACHE)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// Fetch : stratégie Network-First pour HTML, Cache-First pour assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Ignorer les requêtes non-GET et Firebase/Firestore
  if (request.method !== 'GET') return;
  if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) return;

  // HTML → Network First (frais), fallback cache
  if (request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match(request).then(r => r || caches.match('./login.html'))
    );
    return;
  }

  // Assets (CSS, JS, images, fonts) → Cache First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((response) => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
        return response;
      }).catch(() => cached);
    })
  );
});

// Message pour forcer mise à jour
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});
