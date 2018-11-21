const version = 1;

const dataCacheName = `pwa-demo-v${version}`;
const cacheName = `pwa-demo-cache-v${version}`;
const filesToCache = [
    '/',
    '/index.html',
    '/scripts/push.js',
    '/scripts/notification.js',
    '/scripts/db.js',
    '/scripts/chart.js',
    '/scripts/app.js',
    '/styles/styles.css',
    '/node_modules/dexie/dist/dexie.js',
    '/node_modules/d3/dist/d3.min.js',
    '/node_modules/c3/c3.min.js',
    '/node_modules/c3/c3.min.css'
];

if (typeof idb === "undefined") {
    self.importScripts('/node_modules/dexie/dist/dexie.js');
}
self.importScripts('/scripts/db.js');

self.addEventListener('install', (e) => {
    console.log('Install started');
    e.waitUntil(self.initDB(version));
    e.waitUntil(
        caches.open(cacheName).then((cache) => {
            return cache.addAll(filesToCache).then(() => console.log('All files cached'));
        })
    );
});

self.addEventListener('activate', (e) => e.waitUntil(
    caches.keys().then((keyList) => {
        return Promise.all(keyList.map((key) => {
            if (key !== cacheName && key !== dataCacheName) {
                return caches.delete(key);
            }
        }));
    })
));

self.addEventListener('fetch', (e) => e.respondWith(
    caches.match(e.request).then((response) => {
        return response || fetch(e.request);
    })
));

self.addEventListener('notificationclick', function (e) {
    const notification = e.notification;
    const action = e.action;

    if (action === 'search') {
        clients.openWindow(`https://www.google.com/search?q=${e.notification.data.cryptoCurrency}`);
        notification.close();
    } else {
        clients.openWindow('http://localhost:8080/');
        notification.close();
    }
});

self.addEventListener('push', function(e) {
    const options = {
        body: 'Push notification arrived!',
        icon: 'images/icons/android-chrome-192x192.png'
    };
    e.waitUntil(
        self.registration.showNotification('Push notification', options)
    );
});