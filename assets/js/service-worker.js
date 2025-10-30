const CACHE_NAME = 'chirag-portfolio-v3';
const urlsToCache = [
  '/', // Home page
  '/Chirag-Pithadiya/index.html',
  '/Chirag-Pithadiya/assets/css/style.css',
  '/Chirag-Pithadiya/assets/js/jquery-3.4.1.min.js',
  '/Chirag-Pithadiya/assets/js/nill.js',
  '/Chirag-Pithadiya/assets/js/nill-rtl.js',
  '/Chirag-Pithadiya/assets/js/plugins.js',
  '/Chirag-Pithadiya/assets/img/logo.png',
  '/Chirag-Pithadiya/assets/fonts/', // optional if you have fonts folder
];

// Install Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Caching portfolio assets...');
      return cache.addAll(urlsToCache);
    })
  );
});

// Activate and clear old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })
  );
});

// Fetch from cache first, then fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return (
        response ||
        fetch(event.request).then(res => {
          // Cache new files dynamically
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, res.clone());
            return res;
          });
        })
      );
    })
  );
});