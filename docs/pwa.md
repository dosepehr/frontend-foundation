# PWA & Web Push

This app is an installable Progressive Web App: it ships a web app manifest, a
service worker with offline support and runtime caching, an install prompt, an
update prompt, and notification support.

This document covers the **service worker** (caching, offline, updates,
versioning) and **notifications / Web Push** — what exists today, how it works,
and what it takes to add _real_ remote push.

---

## Files at a glance

| Concern                                   | File                                                                                                                                                                                                    |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Web app manifest                          | [`src/app/manifest.ts`](../src/app/manifest.ts) → served at `/manifest.webmanifest`                                                                                                                     |
| Service worker (caching, offline, push)   | [`public/sw.js`](../public/sw.js)                                                                                                                                                                       |
| SW registration + update prompt           | [`src/components/Providers/ServiceWorkerRegister/`](../src/components/Providers/ServiceWorkerRegister)                                                                                                  |
| Offline mutation queue (persist + resume) | [`src/utils/api/provider/ReactQueryProvider.tsx`](../src/utils/api/provider/ReactQueryProvider.tsx), [`src/components/Providers/OfflineMutationSync/`](../src/components/Providers/OfflineMutationSync) |
| Local notifications + sound hook          | [`src/utils/hooks/useNotification/`](../src/utils/hooks/useNotification)                                                                                                                                |
| Notification demo form (Zod + RHF)        | [`src/app/notification/page.tsx`](../src/app/notification/page.tsx)                                                                                                                                     |
| Install prompt (Android/iOS)              | [`src/components/ui/PWAInstall/`](../src/components/ui/PWAInstall)                                                                                                                                      |
| iOS launch (splash) screens               | [`src/components/Providers/AppleSplashScreens/`](../src/components/Providers/AppleSplashScreens)                                                                                                        |
| Icons / screenshots / splash images       | `public/pwa/`                                                                                                                                                                                           |

> The service worker registers in **production only**. In development the app
> registers MSW's mock worker at the same `/` scope, and a second worker would
> clash with it. Test PWA behavior with `npm run build && npm run start`.
> `localhost` counts as a secure context, so HTTPS is not required locally.

---

## Service worker: caching, offline & updates

The service worker ([`public/sw.js`](../public/sw.js)) does three jobs: runtime
caching (with expiration), an offline fallback, and receiving push. Registration
and the update prompt live in
[`ServiceWorkerRegister`](../src/components/Providers/ServiceWorkerRegister).

### Caching strategies

| Request                                       | Strategy                               | Cache          |
| --------------------------------------------- | -------------------------------------- | -------------- |
| Navigations (HTML)                            | network-first → cache → `/offline`     | `ff-pages-*`   |
| `/_next/static`, `/fonts` (hashed, immutable) | cache-first                            | `ff-assets-*`  |
| Other same-origin GET (images, icons, RSC)    | stale-while-revalidate                 | `ff-runtime-*` |
| Cross-origin / non-GET                        | not handled — goes straight to network | —              |

The app shell (`/offline`, manifest, key icons) is precached on install into
`ff-precache-*`.

### Cache expiration

Each runtime cache is bounded by **max-entries** and **max-age**:

| Cache          | Max entries | Max age |
| -------------- | ----------- | ------- |
| `ff-assets-*`  | 100         | 30 days |
| `ff-runtime-*` | 64          | 7 days  |
| `ff-pages-*`   | 50          | 1 day   |

- **max-entries** — the cap on how many responses a cache may hold. On every
  write the oldest entries beyond the cap are deleted (FIFO), so a cache can
  never grow without bound.
- **max-age** — how long an entry stays valid. On read, an expired entry is
  treated as a miss and evicted (the offline fallback is exempt — a stale page
  beats no page).
- On **activate**, `purgeExpired()` sweeps every cache for expired/overflowing
  entries.

Tune the limits in the `EXPIRATION` map at the top of `sw.js`.

### Offline

Previously-visited pages are served from cache when offline; never-visited routes
fall back to the precached [`/offline`](../src/app/offline/page.tsx) page.

That covers **reads**. **Writes** (React Query mutations) are handled separately,
by React Query itself rather than the service worker — see below.

### Offline mutation queue (writes)

The service worker only caches `GET` requests (see [Caching strategies](#caching-strategies)
above) — a mutation made while offline has nothing to fall back to and would
normally just fail. `ReactQueryProvider` wraps the app in
[`PersistQueryClientProvider`](https://tanstack.com/query/latest/docs/framework/react/plugins/persistQueryClient)
instead of a plain `QueryClientProvider` to queue those mutations and replay
them once connectivity returns:

1. **Pausing.** React Query's default `networkMode: 'online'` already pauses a
   mutation (rather than firing it) while `navigator.onLine` is false, and
   resumes it automatically when the tab comes back online — no extra config
   needed for that part.
2. **Persisting.** That pause is normally in-memory only, so a reload or closed
   tab while offline would lose it. `ReactQueryProvider` persists the query
   client to `localStorage` via `@tanstack/query-async-storage-persister`, but
   `dehydrateOptions` is scoped so **only paused mutations** are written —
   `shouldDehydrateQuery: () => false` keeps the query cache itself out (reads
   are already handled by the service worker's HTTP cache; persisting them too
   would just duplicate storage).
3. **Resuming.** On restore, `PersistQueryClientProvider`'s `onSuccess` calls
   `queryClient.resumePausedMutations()` to replay whatever was queued before
   the last reload/close. This is a no-op if still offline — the mutations
   simply stay paused until the device reconnects.
4. **Finding the function again.** A `mutationFn` is a closure — it can't
   survive `JSON.stringify`. React Query works around this with mutation
   _defaults_: `queryClient.setMutationDefaults(mutationKey, { mutationFn })`
   registers a function under a key, and a restored mutation looks its
   function up by that key instead of using the (unserializable, now-missing)
   one it was created with. [`useCustomMutation`](../src/utils/hooks/useCustomMutation)
   does this registration automatically — it now requires a `mutationKey` and
   calls `setMutationDefaults` in an effect on every render. **Caveat:** that
   registration only happens once the component using a given `mutationKey`
   has mounted. If the app is reopened on a page that never mounts that
   component, a mutation queued under that key has no function to resume with.
   This is safe for mutation types triggered from a component that's mounted
   for most of the session (e.g. a persistent toolbar action); for a
   rarely-mounted one-off mutation, register its default eagerly (e.g. in
   `ReactQueryProvider` itself) instead of relying on the consuming component.
5. **UX.** [`OfflineMutationSync`](../src/components/Providers/OfflineMutationSync)
   subscribes to React Query's `onlineManager` and shows a persistent sonner
   toast while offline, then a "Back online — syncing N queued change(s)" toast
   once reconnecting finds paused mutations to replay.

### Update flow

The SW does **not** call `skipWaiting()` on install, so an updated worker waits
rather than taking over mid-session. `ServiceWorkerRegister`:

1. Detects a waiting/installed new worker and shows a sonner **"Update available
   → Reload"** toast.
2. On **Reload**, posts `SKIP_WAITING` to that worker.
3. When the new worker takes control (`controllerchange`), the page reloads once.

It also re-checks for updates when the tab regains focus and hourly, and calls
`navigator.storage.persist()` to reduce cache eviction under storage pressure.

---

## Versioning & when to bump

There are **two independent versions** — keep them straight.

### 1. `VERSION` in `sw.js` (the cache version)

Bumping `VERSION` renames every cache, so `activate` deletes all the old-named
caches — a **full cache reset** for every user. Bump it when:

- You **change caching logic or structure** — strategies, cache/bucket names,
  the `EXPIRATION` policy, or the precache list.
- You need to **force-evict stale cached content** for everyone (e.g. a broken
  asset was cached, or old cached data must be dropped).

You do **not** bump it for ordinary app deploys: Next.js content-hashes
`/_next/static`, so new builds get new URLs and old entries simply age out via
the expiration limits.

### 2. The `sw.js` file itself

The browser installs a new service worker whenever **`sw.js`'s bytes change**
(byte-for-byte comparison) — no constant required. So **any edit to `sw.js`**
triggers the "Update available" prompt on the next visit/focus. Bumping
`VERSION` is one such edit; so is changing a handler.

**Rule of thumb:** edit `sw.js` freely (it auto-updates); only bump `VERSION`
when you specifically want to **wipe existing caches**.

### The manifest has no version

Manifest changes (icons, colors, screenshots, `start_url`) are picked up on
reload with no bump. Caveat: if you **replace an icon at the same filename**, the
browser's HTTP cache may serve the old bytes for a while — change the filename
(or hard-refresh) to force it.

> All of this only runs in a **production** build — you won't see caching or
> update behavior under `npm run dev`.

---

## Two kinds of notifications

There is an important distinction:

### 1. Local notifications (built and working)

A local notification is one your **own JavaScript triggers while the app is
open**. That is what [`useNotification`](../src/utils/hooks/useNotification/index.ts)
does:

```ts
const { notify, permission, requestPermission } = useNotification();

// Requests permission if needed, plays /sounds/notification.mp3,
// then shows a system notification. Shows an error toast on failure.
const result = await notify('Hello world', { title: 'Frontend Foundation' });
if (result.ok) {
    // delivered
}
```

Under the hood `notify`:

1. Bails (and toasts) if the browser has no `Notification` API.
2. Requests permission if it is still `default`.
3. Plays the sound (on every attempt, even when blocked).
4. If permission is `granted`, shows the notification via the **service worker
   registration** (`registration.showNotification`) when available — which works
   on mobile / installed PWAs — falling back to `new Notification()` on desktop.
5. Returns `{ ok: boolean, reason?: 'unsupported' | 'denied' }`.

**Local notifications only fire while a tab is running your code.** They cannot
reach a user whose tab/app is closed. For that you need Web Push.

### 2. Remote push / Web Push (not built — needs a server)

Remote push delivers a notification **even when the app is closed**. The browser
keeps a background connection to a push service (Google FCM, Mozilla, Apple);
your server hands that service a message, and it wakes the service worker's
`push` event on the device.

The receiving half **already exists** in [`public/sw.js`](../public/sw.js):

```js
self.addEventListener('push', (event) => {
    const data = event.data ? event.data.json() : {};
    event.waitUntil(
        self.registration.showNotification(
            data.title || 'Frontend Foundation',
            {
                body: data.body || '',
                icon: data.icon || '/pwa/icon-192.png',
                badge: '/pwa/badge.png',
                data: { url: data.url || '/' },
            },
        ),
    );
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    // focuses an existing tab on data.url, or opens a new one
});
```

So the SW can **display** a push. What is missing is everything needed to
**send** one, because that fundamentally requires a server.

---

## What "real" Web Push requires

Remote push has four parts. Parts 3–4 cannot be done from the client — a server
must hold subscriptions and sign/send the messages.

1. **VAPID keys** — a public/private keypair identifying your server to the push
   service:

    ```bash
    npx web-push generate-vapid-keys
    ```

    ```bash
    # .env.local
    NEXT_PUBLIC_VAPID_PUBLIC_KEY=<public key>   # sent to the browser
    VAPID_PRIVATE_KEY=<private key>             # server-only, never exposed
    ```

2. **Subscribe (client)** — with permission granted, ask the push manager for a
   `PushSubscription` (an endpoint URL + encryption keys):

    ```ts
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
            process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        ),
    });
    ```

3. **Store it (server)** — POST the subscription to your backend and persist it
   (DB, KV, etc.) keyed to the user.

4. **Send (server)** — use the **private** VAPID key + a stored subscription to
   push a JSON payload through the [`web-push`](https://github.com/web-push-libs/web-push)
   library. The push service then wakes the SW `push` event above.

### Why it is not built here

This project was intentionally built **without server actions or a backend**, so
there is nowhere to store subscriptions or sign messages. There is no
client-only way to do remote push — steps 3 and 4 require a server.

---

## Adding real Web Push later (minimal path)

When you want it, the smallest end-to-end setup on top of what already exists:

**1. Install the library**

```bash
npm i web-push
```

**2. Base64 → Uint8Array helper (client)**

```ts
function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const raw = atob(base64);
    return Uint8Array.from(raw, (char) => char.charCodeAt(0));
}
```

**3. Subscribe button (client)** — get the subscription (step 2 above) and POST
it:

```ts
await fetch('/api/push/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subscription),
});
```

**4. Route handler to store subscriptions** — `src/app/api/push/subscribe/route.ts`:

```ts
export async function POST(request: Request) {
    const subscription = await request.json();
    // Persist `subscription` in your DB/KV, keyed to the user.
    return Response.json({ ok: true });
}
```

**5. Send a push** — a route handler or script that signs with the private key:

```ts
import webpush from 'web-push';

webpush.setVapidDetails(
    'mailto:you@example.com',
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!,
);

await webpush.sendNotification(
    storedSubscription,
    JSON.stringify({ title: 'Hello', body: 'From the server', url: '/' }),
);
```

The payload keys (`title`, `body`, `icon`, `url`) match what the SW `push`
handler in [`public/sw.js`](../public/sw.js) reads.

> **iOS:** Web Push only works when the app has been **installed to the Home
> Screen** (iOS 16.4+), not in a regular Safari tab.

---

## Testing notifications

### Local notifications

Run `npm run build && npm run start`, open `/notification`, type a message, and
submit. The first submit prompts for permission; allow it. The sound plays and a
system notification appears.

### The service worker's push handler (no server, no VAPID)

You can exercise the SW `push`/`notificationclick` handlers directly from
DevTools:

1. `npm run build && npm run start`, open the site.
2. Console: `await Notification.requestPermission()` → **Allow**.
3. DevTools → **Application → Service Workers** → confirm `sw.js` is activated.
4. In the **Push** box, paste a payload and click **Push**:

    ```json
    { "title": "Hello 👋", "body": "Test push", "url": "/" }
    ```

If nothing appears, check the OS allows notifications for your browser
(macOS: **System Settings → Notifications**).
