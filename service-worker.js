self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('attendance-cache-v1').then(cache => {
      return cache.addAll([
        './',
        './index.html',
        './student-dashboard.html',
        './teacher-dashboard.html',
        './student-login.html',
        './teacher-login.html',
        './whoami.html',
        './student-dashboard.css',
        './teacher-dashboard.css',
        './student-login.css',
        './teacher-login.css',
        './home.css',
        './student-dashboard.js',
        './teacher-dashboard.js',
        './student-login.js',
        './teacher-login.js'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});