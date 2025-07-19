// static/service-worker.js

self.addEventListener('install', (event) => {
  console.log('[SW] Установка Service Worker');
  self.skipWaiting(); // активируется сразу
});

self.addEventListener('activate', (event) => {
  console.log('[SW] Активирован Service Worker');
});

self.addEventListener('fetch', (event) => {
  // Пример: лог запросов
  console.log('[SW] Запрос:', event.request.url);
});
