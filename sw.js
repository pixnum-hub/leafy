// Leafy PWA Service Worker v2.8.0
// 43 plants | Monetization (7-day trial, ₹199/mo, ₹1999/yr)
// Organic Fertilizer Engine | Disease Finder | Soil & Fertiliser Calculators
// Watering Tracker | Propagation Guide | Cost Tracker | My Plant Files
// AdSense Ready | © Manik Roy 2026. All Rights Reserved.

const CACHE_NAME = 'leafy-v2.8.0';
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

// Install: pre-cache shell assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_ASSETS).catch(() => cache.add('./index.html')))
      .then(() => self.skipWaiting())
  );
});

// Activate: purge all old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

// Fetch strategy
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Never cache — always pass through to network
  if (
    url.hostname.includes('googlesyndication.com') ||
    url.hostname.includes('googleadservices.com') ||
    url.hostname.includes('doubleclick.net') ||
    url.hostname.includes('google-analytics.com') ||
    url.hostname === 'api.anthropic.com'
  ) return;

  // Navigation: network-first, fallback to cache
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match(OFFLINE_URL))
    );
    return;
  }

  // Static assets: cache-first
  if (
    ['style', 'script', 'font', 'image'].includes(request.destination) ||
    url.pathname.match(/\.(json|html|png|ico|js|css|webp|svg)$/)
  ) {
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

  // Everything else: network-first
  event.respondWith(
    fetch(request).catch(() => caches.match(request))
  );
});

// Push notifications
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
