// TeleRAD: this deployment uses no service worker.
//
// OHIF 3.8 registered /sw.js and precached app files with FIXED names (app.bundle.css,
// index.html, init-service-worker.js, app-config.js). After an upgrade those stale copies
// break the new viewer (wrong CSS: black screen, viewport with zero height).
//
// Browsers still controlled by an old worker re-check /sw.js (bypassing their cache), get this
// file, and it removes itself: drop every cache, unregister, reload the open pages once.
// OHIF's own init-service-worker.js (3.13) only unregisters, so nothing installs it again.
self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.map(key => caches.delete(key)));
      await self.registration.unregister();
      const windows = await self.clients.matchAll({ type: 'window' });
      windows.forEach(client => client.navigate(client.url));
    })()
  );
});
