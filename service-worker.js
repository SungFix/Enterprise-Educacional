const SHELL_CACHE = 'enterprise-educacional-shell-v47';
const RUNTIME_CACHE = 'enterprise-educacional-runtime-v47';
const SHELL = [
  './', './index.html', './styles.css?v=47', './content-data.js?v=47', './app.js?v=47', './platform-features.js?v=47', './bootstrap.js?v=47',
  './manifest.webmanifest?v=47',
  './assets/branding/enterprise-symbol.png', './assets/branding/enterprise-symbol-light.png',
  './assets/branding/favicon-16.png', './assets/branding/favicon-32.png', './assets/branding/favicon-light-16.png', './assets/branding/favicon-light-32.png',
  './assets/branding/apple-touch-icon.png', './assets/branding/apple-touch-icon-light.png',
  './assets/branding/pwa-192.png', './assets/branding/pwa-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL_CACHE);
    for (const url of SHELL) {
      const request = new Request(new URL(url, self.registration.scope), { cache:'reload' });
      const response = await fetch(request);
      if (!response.ok) throw new Error(`Falha ao pré-carregar ${url}: ${response.status}`);
      await cache.put(request, response);
    }
    await self.skipWaiting();
  })());
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
      const response = await fetch(request);
      if (response && (response.ok || response.type === 'opaque')) cache.put(request, response.clone()).catch(() => {});
      return response;
    }));
    return;
  }
  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response?.ok) caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone())).catch(() => {});
        return response;
      } catch {
        return (await caches.match(request)) || (await caches.match('./index.html')) || Response.error();
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response?.ok) caches.open(RUNTIME_CACHE).then(cache => cache.put(request, response.clone())).catch(() => {});
      return response;
    } catch {
      return Response.error();
    }
  })());
});
