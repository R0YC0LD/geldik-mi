/*
  Geldik Mi?
  Copyright (c) 2026 Onur Teryakioğlu. Tüm hakları saklıdır.
  Bu dosya Onur Teryakioğlu'nun yazılı izni olmadan kopyalanamaz,
  değiştirilemez, dağıtılamaz veya ticari amaçla kullanılamaz.
*/

const CACHE_NAME = "geldikmi-cache-v1";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/app.js",
  "./js/stops-data.js",
  "./manifest.webmanifest",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Yalnızca kendi kaynağımızdaki GET isteklerini önbellekten karşıla;
// harita karoları / arama servisi gibi dış istekleri ağa bırak.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
