const CACHE_NAME = 'nhap-hang-v1';
const FILES_TO_CACHE = [
  './index.html',
  './manifest.json'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Không cache các request gọi Google Apps Script (luôn cần dữ liệu mới nhất)
  if (e.request.url.includes('script.google.com')) return;
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
