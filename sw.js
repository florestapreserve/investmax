/* service worker: guarda o app pra abrir offline. Suba CACHE quando publicar versão nova. */
const CACHE = 'investmax-v4';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.open(CACHE).then(cache => cache.match(e.request).then(cached => {
    const network = fetch(e.request).then(resp => { cache.put(e.request, resp.clone()); return resp; }).catch(() => cached || cache.match('./index.html'));
    return cached || network;
  })));
});
