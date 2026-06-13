// Leafy PWA Service Worker
// © Manik Roy. All Rights Reserved.

const CACHE_NAME = 'leafy-v1.0.0';
const OFFLINE_URL = './index.html';

// Assets to pre-cache on install
const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;700&family=DM+Sans:wght@300;400;500&display=swap',
];

// ── Install: pre-cache shell assets ─────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(PRECACHE_ASSETS).catch(() => {
        // If font fetch fails (offline), cache what we can
        return cache.add('./index.html');
      });
    }).then(() => self.skipWaiting())
  );
});

// ── Activate: clean up old caches ───────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for app shell, network-first for API ─────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Never intercept Anthropic API calls — always go to network
  if (url.hostname === 'api.anthropic.com') {
    return; // pass through
  }

  // For navigation requests, serve index.html from cache (offline support)
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Cache-first strategy for static assets
  if (
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'font' ||
    request.destination === 'image' ||
    url.pathname.endsWith('.json') ||
    url.pathname.endsWith('.html')
  ) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(response => {
          // Only cache valid responses
          if (!response || response.status !== 200 || response.type === 'error') {
            return response;
          }
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        }).catch(() => caches.match(OFFLINE_URL));
      })
    );
    return;
  }

  // Network-first for everything else
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// ── Background sync placeholder (for future use) ─────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'leafy-sync') {
    // Reserved for future background data sync
  }
});

// ── Push notifications placeholder (for future use) ──────────────
self.addEventListener('push', event => {
  if (event.data) {
    const data = event.data.json();
    self.registration.showNotification(data.title || 'Leafy', {
      body: data.body || 'Time to check on your plants! 🌿',
      icon: './icon-192.png',
      badge: './icon-96.png',
      tag: 'leafy-reminder',
      renotify: true,
    });
  }
});
