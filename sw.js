// Leafy PWA Service Worker v2.1.0
// 43 plants | AI Photo Diagnosis | Disease Finder (25 diseases, 22 symptoms)
// Soil & Fertiliser Calculators | Watering Tracker | Propagation Guide | Cost Tracker
// © Manik Roy 2026. All Rights Reserved.

const CACHE_NAME = 'leafy-v2.1.0';
const OFFLINE_URL = './index.html';

const PRECACHE_ASSETS = [
  './index.html',
  './manifest.json',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-152.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png',
  './favicon.ico',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS).catch(() => cache.add('./index.html')))
      .then(() => self.skipWaiting())
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
  const { request } = event;
  const url = new URL(request.url);
  if (url.hostname === 'api.anthropic.com') return;
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request).catch(() => caches.match(OFFLINE_URL)));
    return;
  }
  if (['style','script','font','image'].includes(request.destination) ||
      url.pathname.match(/\.(json|html|png|ico|js|css)$/)) {
    event.respondWith(
      caches.match(request).then(cached => {
        if (cached) return cached;
        return fetch(request).then(res => {
          if (!res || res.status !== 200 || res.type === 'error') return res;
          caches.open(CACHE_NAME).then(c => c.put(request, res.clone()));
          return res;
        }).catch(() => caches.match(OFFLINE_URL));
      })
    );
    return;
  }
  event.respondWith(fetch(request).catch(() => caches.match(request)));
});

self.addEventListener('push', event => {
  const data = event.data ? event.data.json() : {};
  self.registration.showNotification(data.title || 'Leafy 🌿', {
    body: data.body || 'Time to check on your plants!',
    icon: './icon-192.png',
    badge: './icon-96.png',
    tag: 'leafy-reminder',
    renotify: true,
    data: { url: data.url || './index.html' }
  });
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow(event.notification.data.url));
});
