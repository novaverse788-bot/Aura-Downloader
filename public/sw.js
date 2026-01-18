// Minimal Service Worker to satisfy PWA requirements
self.addEventListener('fetch', (event) => {
    // Pass through all requests to the network
    event.respondWith(fetch(event.request));
});
