const SHELL_CACHE = 'enterprise-educacional-shell-v46';
const RUNTIME_CACHE = 'enterprise-educacional-runtime-v46';
const SHELL = [
  './', './index.html', './styles.css?v=46', './content-data.js?v=46', './app.js?v=46', './platform-features.js?v=46', './bootstrap.js?v=46',
  './manifest.webmanifest?v=46', './assets/branding/enterprise-symbol.png', './assets/branding/enterprise-symbol-light.png',
  './assets/branding/favicon-16.png', './assets/branding/favicon-32.png', './assets/branding/pwa-192.png', './assets/branding/pwa-512.png'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL_CACHE).then(cache => cache.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => ![SHELL_CACHE,RUNTIME_CACHE].includes(key)).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  const isPyodide = url.hostname === 'cdn.jsdelivr.net' && url.pathname.includes('/pyodide/');
  if (isPyodide) {
    event.respondWith(caches.open(RUNTIME_CACHE).then(async cache => {
      const cached = await cache.match(request);
      if (cached) return cached;
      try {
        const response = await fetch(request);
        if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()).catch(() => {});
        return response;
      } catch (error) {
        return cached || Promise.reject(error);
      }
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;
  event.respondWith(caches.match(request).then(cached => {
    if (cached) return cached;
    return fetch(request).then(response => {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy)).catch(() => {});
      return response;
    }).catch(() => caches.match('./index.html'));
  }));
});
