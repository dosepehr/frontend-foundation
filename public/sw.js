/// <reference lib="webworker" />

// Bump VERSION to invalidate old caches on the next deploy.
const VERSION = 'v1';
const PRECACHE = `ff-precache-${VERSION}`;
const ASSETS_CACHE = `ff-assets-${VERSION}`;
const RUNTIME_CACHE = `ff-runtime-${VERSION}`;
const PAGES_CACHE = `ff-pages-${VERSION}`;
const OFFLINE_URL = '/offline';

const DAY = 24 * 60 * 60;

// Per-cache expiration: entries are trimmed (oldest-first) on every write, and
// stale entries are dropped on read and purged on activate.
const EXPIRATION = {
    [ASSETS_CACHE]: { maxEntries: 100, maxAgeSeconds: 30 * DAY },
    [RUNTIME_CACHE]: { maxEntries: 64, maxAgeSeconds: 7 * DAY },
    [PAGES_CACHE]: { maxEntries: 50, maxAgeSeconds: DAY },
};
const MANAGED_CACHES = [PRECACHE, ASSETS_CACHE, RUNTIME_CACHE, PAGES_CACHE];
const TIMESTAMP_HEADER = 'sw-cache-timestamp';

// App shell precached on install so navigations have a fallback while offline.
const PRECACHE_URLS = [
    OFFLINE_URL,
    '/manifest.webmanifest',
    '/pwa/icon-192.png',
    '/pwa/icon-512.png',
    '/pwa/apple-touch-icon.png',
];

// --- Expiration helpers -----------------------------------------------------

// Re-stamp a response with the time it was cached. Content-Length/Encoding are
// dropped because the body has already been decoded by fetch().
async function withTimestamp(response) {
    const headers = new Headers(response.headers);
    headers.set(TIMESTAMP_HEADER, Date.now().toString());
    headers.delete('content-length');
    headers.delete('content-encoding');
    const body = await response.blob();
    return new Response(body, {
        status: response.status,
        statusText: response.statusText,
        headers,
    });
}

function isExpired(response, maxAgeSeconds) {
    if (!maxAgeSeconds) return false;
    const cachedAt = response.headers.get(TIMESTAMP_HEADER);
    if (!cachedAt) return false;
    return Date.now() - Number(cachedAt) > maxAgeSeconds * 1000;
}

// Enforce max-entries by deleting the oldest (insertion-ordered) keys.
async function trimCache(cache, maxEntries) {
    if (!maxEntries) return;
    const keys = await cache.keys();
    for (let i = 0; i < keys.length - maxEntries; i++) {
        await cache.delete(keys[i]);
    }
}

async function cachePut(cacheName, request, response) {
    const cache = await caches.open(cacheName);
    await cache.put(request, await withTimestamp(response));
    const policy = EXPIRATION[cacheName];
    if (policy) await trimCache(cache, policy.maxEntries);
}

// Match a cached response, treating expired entries as a miss (and evicting them).
async function cacheMatchFresh(cacheName, request) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (!cached) return;
    const policy = EXPIRATION[cacheName];
    if (policy && isExpired(cached, policy.maxAgeSeconds)) {
        await cache.delete(request);
        return;
    }
    return cached;
}

// Drop expired entries and enforce size limits across all managed caches.
async function purgeExpired() {
    for (const cacheName of Object.keys(EXPIRATION)) {
        const cache = await caches.open(cacheName);
        const policy = EXPIRATION[cacheName];
        for (const request of await cache.keys()) {
            const response = await cache.match(request);
            if (response && isExpired(response, policy.maxAgeSeconds)) {
                await cache.delete(request);
            }
        }
        await trimCache(cache, policy.maxEntries);
    }
}

// --- Strategies -------------------------------------------------------------

// Cache-first: for content-hashed, immutable assets (/_next/static, fonts).
async function cacheFirst(request) {
    const cached = await cacheMatchFresh(ASSETS_CACHE, request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok && response.type === 'basic') {
        await cachePut(ASSETS_CACHE, request, response.clone());
    }
    return response;
}

// Stale-while-revalidate: serve cache immediately, refresh it in the background.
async function staleWhileRevalidate(request) {
    const cached = await cacheMatchFresh(RUNTIME_CACHE, request);
    const network = fetch(request)
        .then(async (response) => {
            if (response.ok && response.type === 'basic') {
                await cachePut(RUNTIME_CACHE, request, response.clone());
            }
            return response;
        })
        .catch(() => cached);
    return cached || network;
}

// Network-first: prefer fresh HTML for navigations, fall back to cache/offline.
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
            await cachePut(PAGES_CACHE, request, response.clone());
        }
        return response;
    } catch (error) {
        // Offline: return any cached copy regardless of age — better than nothing.
        const cache = await caches.open(PAGES_CACHE);
        const cached = await cache.match(request);
        if (cached) return cached;
        if (request.mode === 'navigate') {
            const offline = await caches.match(OFFLINE_URL);
            if (offline) return offline;
        }
        throw error;
    }
}

// --- Lifecycle --------------------------------------------------------------

self.addEventListener('install', (event) => {
    // Note: no skipWaiting() here — an updated worker waits until the user
    // accepts the in-app "update available" prompt (see ServiceWorkerRegister).
    event.waitUntil(
        (async () => {
            const cache = await caches.open(PRECACHE);
            await cache.addAll(PRECACHE_URLS);
        })(),
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys
                    .filter((key) => !MANAGED_CACHES.includes(key))
                    .map((key) => caches.delete(key)),
            );
            await purgeExpired();
            await self.clients.claim();
        })(),
    );
});

// Allow the page to activate a waiting worker immediately.
self.addEventListener('message', (event) => {
    if (event.data === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
    const { request } = event;

    // Only handle same-origin GET requests; let everything else hit the network.
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // HTML navigations: always try the network first so content stays fresh.
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    // Immutable build output and self-hosted fonts: safe to cache forever.
    if (
        url.pathname.startsWith('/_next/static/') ||
        url.pathname.startsWith('/fonts/')
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Everything else same-origin (images, icons, RSC prefetch payloads, ...):
    // serve fast from cache but revalidate in the background.
    event.respondWith(staleWhileRevalidate(request));
});

// --- Push notifications -----------------------------------------------------
// The SW can receive and display pushes; sending them requires a push server
// with VAPID keys (out of scope here, per the no-server-actions setup).
self.addEventListener('push', (event) => {
    let data = {};
    try {
        data = event.data ? event.data.json() : {};
    } catch {
        data = { body: event.data ? event.data.text() : '' };
    }

    const title = data.title || 'Frontend Foundation';
    const options = {
        body: data.body || '',
        icon: data.icon || '/pwa/icon-192.png',
        badge: '/pwa/badge.png',
        vibrate: [100, 50, 100],
        data: {
            url: data.url || '/',
            dateOfArrival: Date.now(),
        },
    };

    event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const targetUrl = (event.notification.data && event.notification.data.url) || '/';

    event.waitUntil(
        (async () => {
            const clientList = await self.clients.matchAll({
                type: 'window',
                includeUncontrolled: true,
            });
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            if (self.clients.openWindow) {
                return self.clients.openWindow(targetUrl);
            }
        })(),
    );
});
