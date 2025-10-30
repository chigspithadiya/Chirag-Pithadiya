const CACHE_NAME = "chirag-pithadiya-v2";
const BASE_PATH = "/Chirag-Pithadiya"; // GitHub Pages subdirectory

// ✅ List only verified, real files
const ASSETS_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/assets/css/style.css`,
  `${BASE_PATH}/assets/css/plugins.css`,
  `${BASE_PATH}/assets/js/nill.js`,
  `${BASE_PATH}/assets/js/plugins.js`,
  `${BASE_PATH}/assets/img/favicon.ico`,
  `${BASE_PATH}/assets/img/profile.png`,
];

// Install Service Worker and cache files
self.addEventListener("install", event => {
  console.log("🟡 Service Worker: Installing...");
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const url of ASSETS_TO_CACHE) {
        try {
          const response = await fetch(url, { cache: "no-store" });
          if (response.ok) await cache.put(url, response);
          else console.warn("⚠️ Skipped (not OK):", url);
        } catch (err) {
          console.warn("⚠️ Skipped (fetch error):", url);
        }
      }
    })()
  );
});

// Activate new service worker and clear old caches
self.addEventListener("activate", event => {
  console.log("🟢 Service Worker: Activated");
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log("🧹 Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      )
    )
  );
});

// Fetch handler — serve cached assets first
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      return (
        cachedResponse ||
        fetch(event.request).then(networkResponse => {
          // Cache new files for future visits
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
      );
    })
  );
});
