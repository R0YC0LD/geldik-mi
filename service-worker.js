/*
  Geldik Mi?
  Copyright (c) 2026 Onur Teryakioğlu. Tüm hakları saklıdır.
  Bu dosya Onur Teryakioğlu'nun yazılı izni olmadan kopyalanamaz,
  değiştirilemez, dağıtılamaz veya ticari amaçla kullanılamaz.
*/

// Sürümü her önemli güncellemede artır — eski önbellekler activate
// aşamasında otomatik silinir, bu da HTML/JS arasında sürüm uyuşmazlığı
// (stale index.html + yeni app.js gibi) yaşanmasını önler.
const CACHE_NAME = "geldikmi-cache-v2";
const APP_SHELL = [
  "./",
  "./index.html",
  "./css/style.css",
  "./js/i18n.js",
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

// Uygulama kabuğu (HTML/CSS/JS) için AĞ ÖNCELİKLİ: kullanıcı çevrimiçiyken
// her zaman en güncel sürümü alır; sadece ağ başarısız olursa (çevrimdışı)
// önbelleğe düşer. Bu, eski HTML'in yeni JS ile çakışıp hata vermesini
// (sürüm uyumsuzluğunu) engeller. Harita karoları/arama gibi dış
// isteklere hiç dokunulmaz.
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.ok) caches.open(CACHE_NAME).then((c) => c.put(req, res.clone()));
        return res;
      })
      .catch(() => caches.match(req))
  );
});
