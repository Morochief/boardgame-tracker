const CACHE_NAME = 'bg-tracker-v1';

self.addEventListener('install', event => {
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', event => {
    // Only cache same-origin requests
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches.match(event.request).then(response => {
                return response || fetch(event.request).then(fetchResponse => {
                    // Don't cache API calls
                    if (!event.request.url.includes('supabase')) {
                        return caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    }
                    return fetchResponse;
                });
            }).catch(() => {
                // Return offline fallback if needed
            })
        );
    }
});
