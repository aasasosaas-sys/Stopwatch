/* 勉強クエスト service worker: shows push notifications and opens the app when one is tapped. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));

self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (err) { d = {title: '勉強クエスト', body: e.data ? e.data.text() : ''}; }
  e.waitUntil(self.registration.showNotification(d.title || '勉強クエスト', {
    body: d.body || '',
    tag: d.tag || 'quest',
    renotify: true,
    icon: 'icons/icon-192.png',
    badge: 'icons/favicon-32.png',
    data: {url: './'}
  }));
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil((async () => {
    const list = await self.clients.matchAll({type: 'window', includeUncontrolled: true});
    for (const c of list) { if ('focus' in c) return c.focus(); }
    return self.clients.openWindow('./');
  })());
});
