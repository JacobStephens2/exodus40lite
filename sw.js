var CACHE_NAME = 'exodus40lite-v5';
var ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './manifest.json',
  './favicon_io/favicon.ico',
  './favicon_io/favicon-32x32.png',
  './favicon_io/favicon-16x16.png',
  './favicon_io/apple-touch-icon.png',
  './favicon_io/android-chrome-192x192.png',
  './favicon_io/android-chrome-512x512.png'
];

self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_NAME; })
            .map(function (k) { return caches.delete(k); })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (event) {
  event.respondWith(
    fetch(event.request).then(function (response) {
      var clone = response.clone();
      caches.open(CACHE_NAME).then(function (cache) {
        cache.put(event.request, clone);
      });
      return response;
    }).catch(function () {
      return caches.match(event.request);
    })
  );
});
