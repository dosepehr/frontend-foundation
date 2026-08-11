# Turning a React App into a Good PWA

A practical guide for taking a plain **React SPA** (Vite, or Create React App)
and giving it the same PWA quality this Next.js app has: a real install
experience, offline support, disciplined **caching**, deliberate **versioning**,
and correct **revalidation / update flow**.

It ports the patterns from this repo — [`public/sw.js`](../public/sw.js),
[`src/app/manifest.ts`](../src/app/manifest.ts), and
[`ServiceWorkerRegister`](../src/components/Providers/ServiceWorkerRegister) —
into a framework-agnostic React setup. Where a client-only SPA has to do
something different from Next.js, it's called out.

> **Don't reach for a plugin first.** `vite-plugin-pwa` / Workbox are fine, but
> they hide the two things that actually bite you in production — cache
> versioning and the update flow. This guide writes the service worker by hand
> (~200 lines) so you own those. Once you understand it, adopting Workbox later
> is a mechanical swap.

---

## What "good" actually means

A good PWA is four separable concerns. Treat them independently:

| Concern | The question it answers | Where it lives |
|---|---|---|
| **Installability** | Can the user add it to their home screen? | Web app manifest + icons |
| **Caching** | What's served from disk vs. the network, and for how long? | Service worker fetch handler |
| **Revalidation** | How does fresh content reach a user who already has a cached copy? | Caching strategy per request type |
| **Versioning / updates** | How does a *new deploy* replace the *old service worker* safely? | SW lifecycle + registration code |

Most broken PWAs get installability right and the other three wrong — users get
stuck on a stale version with no way to update. The back half of this guide is
mostly about avoiding that.

---

## 0. Prerequisites

- **HTTPS.** Service workers require a secure context. `localhost` counts as
  secure, so you can develop locally without certs; production must be HTTPS.
- **A build that content-hashes assets.** Vite does this by default — JS/CSS land
  in `/assets/<name>-<hash>.js`. That hashing is what makes aggressive caching
  safe (a changed file gets a new URL). CRA hashes into `/static/` similarly.
- This guide assumes **Vite** and uses `/assets/` as the immutable-asset path.
  For CRA, substitute `/static/`.

---

## 1. Web app manifest

Next.js generates the manifest from [`src/app/manifest.ts`](../src/app/manifest.ts)
and serves it at `/manifest.webmanifest`. A plain React app has no route layer, so
ship a **static file** in `public/` and link it from `index.html`.

**`public/manifest.webmanifest`**

```json
{
  "id": "/",
  "name": "Your App",
  "short_name": "App",
  "description": "What your app does.",
  "lang": "en",
  "dir": "ltr",
  "start_url": "/?source=pwa",
  "scope": "/",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#155dfc",
  "icons": [
    { "src": "/pwa/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/pwa/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/pwa/icon-192-maskable.png", "sizes": "192x192", "type": "image/png", "purpose": "maskable" },
    { "src": "/pwa/icon-512-maskable.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

**`index.html`** `<head>`:

```html
<link rel="manifest" href="/manifest.webmanifest" />
<meta name="theme-color" content="#155dfc" />

<!-- iOS doesn't read theme_color/icons from the manifest; it needs these: -->
<link rel="apple-touch-icon" href="/pwa/apple-touch-icon.png" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
```

Key fields, same as this app's manifest:

- **`start_url: "/?source=pwa"`** — the `?source=pwa` query lets you attribute
  traffic from the installed app in analytics.
- **`display: "standalone"`** — launches without browser chrome, so it feels
  native.
- **`purpose: "maskable"` icons** — Android crops icons to its own shape;
  maskable icons have safe padding so they aren't clipped. Ship **both** `any`
  and `maskable`.
- **`id: "/"`** — a stable app identity so the browser doesn't treat a
  `start_url` change as a different app.

### Icons you need

Put these in `public/pwa/`:

| File | Size | Purpose |
|---|---|---|
| `icon-192.png` | 192×192 | Android home screen |
| `icon-512.png` | 512×512 | Splash / install dialog |
| `icon-192-maskable.png` | 192×192 | Android adaptive (safe-zone padded) |
| `icon-512-maskable.png` | 512×512 | Android adaptive |
| `apple-touch-icon.png` | 180×180 | iOS home screen |

Test maskable padding at [maskable.app](https://maskable.app).

---

## 2. The service worker

This is the heart of it. Below is [`public/sw.js`](../public/sw.js) from this repo,
adapted for a Vite SPA. **Two SPA-specific changes** from the Next.js version:

1. The immutable-asset path is `/assets/` (Vite), not `/_next/static/`.
2. **Offline uses the app shell, not a separate `/offline` route.** A SPA is one
   `index.html` that boots React and client-routes everything. So when a
   navigation fails offline, you serve cached `index.html` — React then renders
   whatever route the user is on. (The Next.js app can precache a real `/offline`
   page because it has server-rendered routes; a SPA generally can't.)

Save this as **`public/sw.js`** so it's served from the origin root (`/sw.js`) —
scope matters, see §3.

```js
/// <reference lib="webworker" />

// Bump VERSION to invalidate ALL old caches on the next deploy. See "Versioning".
const VERSION = 'v1';
const PRECACHE = `app-precache-${VERSION}`;
const ASSETS_CACHE = `app-assets-${VERSION}`;
const RUNTIME_CACHE = `app-runtime-${VERSION}`;
const PAGES_CACHE = `app-pages-${VERSION}`;

// SPA app shell: the HTML that boots React. Doubles as the offline fallback.
const APP_SHELL = '/index.html';

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

// Precached on install so the app boots offline on the very first navigation.
const PRECACHE_URLS = [
    APP_SHELL,
    '/manifest.webmanifest',
    '/pwa/icon-192.png',
    '/pwa/icon-512.png',
    '/pwa/apple-touch-icon.png',
];

// --- Expiration helpers -----------------------------------------------------

// Re-stamp a response with the time it was cached.
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

// Cache-first: for content-hashed, immutable assets (/assets, fonts).
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

// Network-first for navigations: fresh HTML when online, app shell when offline.
async function networkFirst(request) {
    try {
        const response = await fetch(request);
        if (response.ok && response.type === 'basic') {
            await cachePut(PAGES_CACHE, request, response.clone());
        }
        return response;
    } catch (error) {
        // Offline: serve the cached app shell so React can boot and client-route.
        const shell = await caches.match(APP_SHELL);
        if (shell) return shell;
        throw error;
    }
}

// --- Lifecycle --------------------------------------------------------------

self.addEventListener('install', (event) => {
    // No skipWaiting() — an updated worker waits until the user accepts the
    // in-app "update available" prompt (see the registration code).
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

    // Only handle same-origin GET; everything else hits the network directly.
    if (request.method !== 'GET') return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;

    // HTML navigations: network-first, fall back to the app shell.
    if (request.mode === 'navigate') {
        event.respondWith(networkFirst(request));
        return;
    }

    // Immutable, content-hashed build output + self-hosted fonts: cache forever.
    if (
        url.pathname.startsWith('/assets/') ||
        url.pathname.startsWith('/fonts/')
    ) {
        event.respondWith(cacheFirst(request));
        return;
    }

    // Everything else same-origin (images, icons, ...): fast from cache,
    // revalidate in the background.
    event.respondWith(staleWhileRevalidate(request));
});
```

### Caching strategies — the decision table

The whole design is: **match the strategy to how the content changes.**

| Request | Strategy | Why | Cache |
|---|---|---|---|
| Navigations (HTML) | network-first → app shell | HTML must be fresh; it references the current hashed assets | `app-pages-*` |
| `/assets/*`, `/fonts/*` (hashed, immutable) | cache-first | The hash *is* the version — the URL never serves different bytes | `app-assets-*` |
| Other same-origin GET (images, icons, API-ish) | stale-while-revalidate | Instant paint from cache, silent refresh for next time | `app-runtime-*` |
| Cross-origin / non-GET | not handled → network | Don't cache other people's origins or mutations | — |

Why network-first for HTML matters: `index.html` is the one file that is **not**
content-hashed (its URL is always `/`). It points at `/assets/app-<hash>.js`. If
you cached HTML aggressively, a user could load old HTML that references
`/assets/` files you already deleted → white screen. Network-first keeps the
entry point fresh; cache-first keeps the hashed assets it references cheap.

### Revalidation, concretely

"Revalidation" = how a **fresh** copy reaches a client that already holds a cached
one. It's per-strategy, not a separate feature:

- **cache-first** never revalidates by content — it relies on the URL changing
  (new hash). Old entries age out via `max-age` / `max-entries`.
- **stale-while-revalidate** revalidates on *every* request: it serves the cached
  copy instantly, then fetches in the background and overwrites the cache, so the
  *next* view is fresh. This is the right default for images and non-critical
  data — zero perceived latency, at most one view stale.
- **network-first** revalidates *now*: it always tries the network and only falls
  back to cache when offline. Right for HTML and anything that must be current.

If you add data fetching, don't cache authenticated/mutating API calls in the
SW — let a data layer (React Query, etc.) own freshness, and keep the SW for
static assets and shell.

### Cache expiration

Every runtime cache is bounded two ways so it can't grow forever or serve
ancient content:

| Cache | Max entries | Max age |
|---|---|---|
| `app-assets-*` | 100 | 30 days |
| `app-runtime-*` | 64 | 7 days |
| `app-pages-*` | 50 | 1 day |

- **max-entries** — cap on responses per cache. On every write, oldest entries
  beyond the cap are deleted (FIFO). Bounds disk usage.
- **max-age** — how long an entry is valid. On read, an expired entry is treated
  as a miss and evicted. (The offline shell is exempt — a stale shell beats a
  blank screen.)
- On **activate**, `purgeExpired()` sweeps every cache for expired/overflowing
  entries.

Tune these in the `EXPIRATION` map at the top of `sw.js`.

---

## 3. Registering the SW + the update flow

This is where most hand-rolled PWAs go wrong. The registration component below is
this repo's [`ServiceWorkerRegister`](../src/components/Providers/ServiceWorkerRegister/ServiceWorkerRegister.tsx),
adapted for a plain React app (drop the MSW/`NODE_ENV` production gate unless you
also run a mock worker in dev).

**`src/pwa/ServiceWorkerRegister.tsx`**

```tsx
import { useEffect } from 'react';
import { toast } from 'sonner'; // or any toast; see note below

/**
 * Registers the service worker and surfaces an in-app "update available"
 * prompt when a new version has installed and is waiting.
 */
export function ServiceWorkerRegister() {
    useEffect(() => {
        // Service workers need a build. Skip in `vite dev` unless you test it.
        if (import.meta.env.DEV) return;
        if (!('serviceWorker' in navigator)) return;

        // Reload once the freshly-activated worker takes control of the page.
        let refreshing = false;
        const onControllerChange = () => {
            if (refreshing) return;
            refreshing = true;
            window.location.reload();
        };
        navigator.serviceWorker.addEventListener(
            'controllerchange',
            onControllerChange,
        );

        const promptUpdate = (worker: ServiceWorker) => {
            toast('Update available', {
                description: 'A new version of the app is ready.',
                duration: Infinity,
                action: {
                    label: 'Reload',
                    onClick: () => worker.postMessage('SKIP_WAITING'),
                },
            });
        };

        let registration: ServiceWorkerRegistration | undefined;
        let updateInterval: ReturnType<typeof setInterval> | undefined;

        const checkForUpdate = () => void registration?.update();
        const onVisibility = () => {
            if (document.visibilityState === 'visible') checkForUpdate();
        };

        const register = async () => {
            try {
                registration = await navigator.serviceWorker.register('/sw.js', {
                    scope: '/',
                    updateViaCache: 'none', // always byte-check sw.js on update
                });

                // Ask the OS not to evict our caches under storage pressure.
                if (navigator.storage?.persist) {
                    void navigator.storage.persist();
                }

                // An update was already waiting before this page loaded.
                if (registration.waiting && navigator.serviceWorker.controller) {
                    promptUpdate(registration.waiting);
                }

                // An update is found while the page is open.
                registration.addEventListener('updatefound', () => {
                    const installing = registration?.installing;
                    if (!installing) return;
                    installing.addEventListener('statechange', () => {
                        if (
                            installing.state === 'installed' &&
                            navigator.serviceWorker.controller
                        ) {
                            promptUpdate(installing);
                        }
                    });
                });

                // Re-check for updates on focus and hourly.
                document.addEventListener('visibilitychange', onVisibility);
                updateInterval = setInterval(checkForUpdate, 60 * 60 * 1000);
            } catch (error) {
                console.error('Service worker registration failed:', error);
            }
        };

        if (document.readyState === 'complete') void register();
        else window.addEventListener('load', () => void register());

        return () => {
            document.removeEventListener('visibilitychange', onVisibility);
            if (updateInterval) clearInterval(updateInterval);
            navigator.serviceWorker.removeEventListener(
                'controllerchange',
                onControllerChange,
            );
        };
    }, []);

    return null;
}
```

Render it once near the app root:

```tsx
<ServiceWorkerRegister />
```

### Why this update flow is correct

The naïve mistake is calling `self.skipWaiting()` in the SW's `install` handler,
so a new worker takes over the instant it installs. That silently swaps the
assets **under a running session** — the open tab is now controlled by a worker
serving a new asset manifest while the page still holds old code. Result:
chunk-load errors, half-updated UIs.

This flow avoids that by making the update **user-initiated**:

1. New `sw.js` installs and **waits** (no `skipWaiting` in `install`).
2. The page detects the waiting worker and shows an **"Update available → Reload"**
   toast.
3. On click, the page posts `SKIP_WAITING`; the worker calls `skipWaiting()` and
   activates.
4. `controllerchange` fires; the page reloads **once** into a fully consistent
   new version.

Plus: it re-checks for updates when the tab regains focus and hourly (so a
long-lived tab still gets the prompt), and calls `navigator.storage.persist()` to
reduce cache eviction.

### Scope gotcha

`register('/sw.js', { scope: '/' })` only works if `sw.js` is served from the
origin root — which is why it goes in `public/`. A worker can only control pages
**at or below its own path**. Ship it at `/sw.js` to control the whole app.

### `updateViaCache: 'none'`

Forces the browser to byte-compare `sw.js` against the network on every update
check instead of trusting its HTTP cache. Without it, an HTTP-cached `sw.js`
can hide a new deploy for hours. Also make sure your host serves **`sw.js` with
`Cache-Control: no-cache`** (see §5).

---

## 4. Versioning — the two independent versions

Keep these straight; conflating them is the #1 source of "why won't it update"
confusion.

### A. `VERSION` in `sw.js` — the *cache* version

Bumping `VERSION` renames every cache (`app-assets-v1` → `app-assets-v2`), so
`activate` deletes all the old-named caches — a **full cache reset for every
user**. Bump it when:

- You **change caching logic**: strategies, cache names, the `EXPIRATION`
  policy, or the precache list.
- You need to **force-evict stale content** for everyone (a broken asset got
  cached, old cached data must be dropped).

You do **not** bump it for ordinary app deploys. Vite content-hashes `/assets`,
so new builds get new URLs and old entries age out via the expiration limits on
their own.

### B. The `sw.js` file itself — the *worker* version

The browser installs a new worker whenever **`sw.js`'s bytes change** — no
constant required, it's a byte-for-byte comparison. So **any edit to `sw.js`**
triggers the update prompt on the next visit/focus. Bumping `VERSION` is one such
edit; so is changing a handler.

**Rule of thumb:** edit `sw.js` freely (it auto-updates via byte comparison);
only bump `VERSION` when you specifically want to **wipe existing caches**.

> ⚠️ **SPA caveat the Next.js app doesn't have:** your app's JS is hashed, but
> `sw.js` is a *static file whose content only changes if you edit it*. If a
> deploy changes only your React code (new `/assets/app-<hash>.js`) and not
> `sw.js`, the SW file is byte-identical → **no new worker installs**. That's
> fine, because the SW serves `index.html` network-first, so the fresh HTML
> pulls the new hashed assets anyway. The SW only needs to update when *its own
> logic* changes. Don't try to force a SW reinstall on every deploy — you don't
> need it.

### The manifest has no version

Manifest changes (icons, colors, `start_url`) are picked up on reload with no
bump. Caveat: if you **replace an icon at the same filename**, the HTTP cache may
serve old bytes for a while — change the filename or hard-refresh.

---

## 5. Hosting / headers

Two `Cache-Control` rules make the whole scheme work. Set them on your host
(Netlify `_headers`, Vercel `headers`, nginx, etc.):

```
# Immutable, content-hashed build output — cache hard.
/assets/*
  Cache-Control: public, max-age=31536000, immutable

# The service worker and the app shell must always be re-checked.
/sw.js
  Cache-Control: no-cache
/index.html
  Cache-Control: no-cache
```

`immutable` on `/assets/*` tells the browser never to revalidate — safe because
the hash changes when content does. `no-cache` on `/sw.js` and `/index.html`
means "revalidate every time" (not "never store"), which is what lets updates
propagate promptly.

---

## 6. Testing

Service workers only run in a real build, so:

```bash
npm run build && npm run preview   # Vite; serves the production build
```

Then, in Chrome DevTools:

1. **Application → Service Workers** — confirm `sw.js` is *activated and running*.
   Tick **Update on reload** while developing the SW itself.
2. **Application → Manifest** — check icons resolve and there are no errors; use
   the **Install** button.
3. **Network → throttling → Offline**, then reload — you should get the app shell
   and previously-visited content, not the browser's dino page.
4. **Application → Cache Storage** — verify your `app-*-v1` caches fill up as
   expected.
5. **Lighthouse → PWA category** — aim for all checks green.

### Verifying the update flow (the important one)

1. Build, preview, load the app. Confirm the SW is active.
2. Edit `sw.js` (e.g. bump `VERSION` to `v2`), rebuild.
3. Reload the app **once**: DevTools shows a new worker **waiting**, and your
   **"Update available"** toast appears.
4. Click **Reload** → the page reloads once, and **Cache Storage** now shows
   `app-*-v2` with the `-v1` caches gone.

If step 3 shows the new worker jumping straight to *activated* without waiting,
you left a `skipWaiting()` in `install` — remove it.

---

## 7. Optional: Web Push

The service worker above doesn't include push handlers, but adding them is the
same as this repo's [`public/sw.js`](../public/sw.js) — a `push` listener that
calls `showNotification`, and a `notificationclick` listener that focuses/open a
tab. **Displaying** a push is client-side; **sending** one requires a server
(VAPID keys, stored subscriptions, the `web-push` library). The full recipe is in
[`docs/pwa.md`](./pwa.md) under *"What real Web Push requires"* — it's
framework-agnostic and applies unchanged to a React app.

> **iOS:** Web Push only works once the app is **installed to the Home Screen**
> (iOS 16.4+), never in a regular Safari tab.

---

## Checklist

- [ ] `public/manifest.webmanifest` + `<link rel="manifest">` and iOS meta tags
- [ ] Icons in `public/pwa/` (192, 512, both maskable, apple-touch)
- [ ] `public/sw.js` with per-type strategies + expiration + app-shell offline
- [ ] `ServiceWorkerRegister` mounted at the app root
- [ ] Update flow: **no** `skipWaiting()` in `install`; user-triggered reload
- [ ] `updateViaCache: 'none'` + host serves `sw.js`/`index.html` as `no-cache`
- [ ] `/assets/*` served `immutable`
- [ ] Understood: bump `VERSION` only to wipe caches; edits to `sw.js` auto-update
- [ ] Verified offline + the update prompt in a real build (not `dev`)
```
