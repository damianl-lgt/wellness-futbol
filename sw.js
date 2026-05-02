const CACHE = 'wellness-v2';
const ASSETS = ['/', '/index.html', '/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  // No interceptar llamadas externas (Apps Script, APIs)
  if (!e.request.url.startsWith(self.location.origin)) return;
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).catch(() => caches.match('/index.html')))
  );
});

self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : { title: 'Wellness', body: 'Completá tu encuesta de hoy 💪' };
  e.waitUntil(
    self.registration.showNotification(data.title || 'Wellness Fútbol', {
      body: data.body || 'Completá tu encuesta de bienestar pre-entrenamiento',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'wellness-reminder',
      renotify: true,
      requireInteraction: false,
      actions: [{ action: 'open', title: 'Completar ahora' }],
      data: { url: self.registration.scope }
    })
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url.includes(self.registration.scope) && 'focus' in client) return client.focus();
      }
      return clients.openWindow(self.registration.scope);
    })
  );
});
