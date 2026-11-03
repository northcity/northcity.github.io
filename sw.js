/* ===========================================================
 * sw.js — retired
 * ===========================================================
 * The old offline cache answered from cache before the network,
 * so returning visitors kept seeing the pre-redesign pages.
 * This version clears that cache, unregisters itself and reloads
 * any open tab once so it picks up the live site.
 * ========================================================== */

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(key => caches.delete(key)));
    await self.registration.unregister();
    const clients = await self.clients.matchAll({ type: 'window' });
    clients.forEach(client => client.navigate(client.url));
  })());
});
