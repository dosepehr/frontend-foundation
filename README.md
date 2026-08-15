# Frontend Foundation

A Next.js 16 component library and application foundation with a full-featured DX setup.

---

## Stack

| Layer        | Tool                       |
| ------------ | -------------------------- |
| Framework    | Next.js 16 (App Router)    |
| Language     | TypeScript 5               |
| Styling      | Tailwind CSS 4 + shadcn/ui |
| Components   | Radix UI + Base UI         |
| Forms        | React Hook Form + Zod      |
| Server state | TanStack Query v5          |
| Tables       | TanStack Table v8          |
| HTTP         | Axios                      |
| Animations   | Motion                     |
| Toasts       | Sonner                     |
| Theming      | next-themes                |
| Icons        | Lucide React               |

---

## DX & Tooling

| Tool                   | Purpose                                                          |
| ---------------------- | ---------------------------------------------------------------- |
| ESLint 9 (flat config) | Linting — next, react-refresh, tailwindcss, unicorn, typescript  |
| Prettier               | Formatting — with organize-imports and tailwindcss plugins       |
| Vitest + happy-dom     | Unit & component tests                                           |
| Storybook 10           | Component development & documentation                            |
| Chromatic              | Visual regression testing                                        |
| MSW v2                 | API mocking in tests and Storybook                               |
| Playwright             | E2E — offline fallback, notification permission, SW update flows |

---

## What is configured

- [x] ESLint flat config with strict TypeScript, Tailwind, Unicorn rules
- [x] Prettier with import organization and Tailwind class sorting
- [x] Vitest with v8 coverage, happy-dom, MSW server lifecycle
- [x] Storybook with MSW `beforeAll` hook, i18n, theme, strict mode, reduce motion, react-scan addons
- [x] MSW handlers for auth endpoints (`/auth/login`, `/auth/register`, `/auth/refresh`, `/auth/logout`)
- [x] `MockProvider` — starts MSW browser worker before client renders in dev
- [x] Axios instance with auth header injection, response unwrapping, token refresh interceptor, global error handler
- [x] React Query provider with global `QueryCache` / `MutationCache` error callbacks
- [x] Cookie-based auth token management
- [x] Error strategy layer — maps HTTP status codes to typed error shapes
- [x] `mapErrorToToast` — surfaces API errors as toasts via Sonner
- [x] `@storybook/addon-a11y` installed (currently set to `"todo"`, not enforcing)
- [x] Installable PWA — manifest, service worker (offline + runtime caching), install/update prompts, notifications — see [docs/pwa.md](docs/pwa.md)
- [x] Component scaffolding — `npm run gen:component <Name>` generates a `ui/<Name>/` folder with the standard `components`/`index`/`types`/`stories`/`test` file set (Plop)
- [x] Commit hygiene — `husky` pre-commit runs `lint-staged` (ESLint + Prettier on staged files), `commit-msg` runs `commitlint` (conventional commit format)
- [x] Environment variable validation — `src/utils/env/env.ts` validates `NEXT_PUBLIC_*` and server env vars with `zod`, imported from `next.config.ts` so an invalid/missing var fails the build immediately; server-only vars throw if accessed from client code
- [x] Error boundaries — `src/app/error.tsx` (route-segment crashes) and `src/app/global-error.tsx` (root layout crashes) for page-level errors; `<ErrorBoundary>` (`src/components/ui/ErrorBoundary`, wraps `react-error-boundary`) for isolating a single async section so the rest of the page stays interactive
- [x] `a11y: { test: "error" }` in Storybook preview — every component story fails CI on a real contrast/ARIA/label/keyboard violation instead of just flagging it
- [x] Client-side error tracking — `@sentry/nextjs`, initialized in `src/instrumentation-client.ts` (browser), `src/utils/sentry/sentry.server.config.ts` / `sentry.edge.config.ts` (via `src/instrumentation.ts`); `app/error.tsx`, `app/global-error.tsx`, `<ErrorBoundary>`, and the React Query `QueryCache`/`MutationCache` callbacks all forward to `Sentry.captureException`; no-ops until `NEXT_PUBLIC_SENTRY_DSN` is set
- [x] Bundle analysis — `@next/bundle-analyzer` wired into `next.config.ts`, run with `npm run analyze`
- [x] Playwright E2E — `playwright.config.ts` builds and serves a production build on a dedicated port (the service worker only registers in production, see [docs/pwa.md](docs/pwa.md)). Specs are co-located with what they test, next to `*.test.tsx` files: the offline fallback (`src/app/offline/offline.spec.ts`), the notification permission flow (`src/app/notification/notification.spec.ts`), and the service worker update prompt (`src/components/Providers/ServiceWorkerRegister/service-worker-update.spec.ts`) — real browser/SW flows Vitest can't reach. Shared wait helper in `src/test/e2e-helpers.ts`. Run with `npm run test:e2e`. Add more once real auth/checkout flows exist — Vitest + Chromatic already cover everything else
- [x] Dependency update automation — `.github/dependabot.yml`, weekly npm updates grouped into `dev-dependencies` / `production-dependencies` PRs
- [x] Sentry PII scrubbing — `beforeSend` hook (`src/utils/sentry/scrubPii.ts`) strips cookies, auth/session headers, and identifying user fields from every event before it leaves the browser/server; wired into all three `Sentry.init` calls (client, server, edge)
- [x] App-wide Content-Security-Policy — `src/proxy.ts` sets a per-request nonce-based CSP (`script-src` uses `'nonce-<value>' 'strict-dynamic'`) on every page route; `next-themes`' no-flash script picks up the nonce via `<ThemeProvider nonce>` in `src/app/layout.tsx`. `/sw.js` keeps its separate static CSP and `/stories` is excluded (Storybook's own inline scripts)
- [x] Web Vitals / performance monitoring — `tracesSampleRate` enabled on all three Sentry configs, surfacing Core Web Vitals and slow transactions alongside error tracking
- [x] Refresh-token failure UX — `refreshToken.ts`'s interceptor logic is covered by `refreshToken.test.ts`: non-401s and already-retried requests pass through, 401s from auth endpoints don't loop, a missing/invalid/failed refresh clears cookies and redirects to `/auth`, a successful refresh retries the original request with the new token, and concurrent 401s during an in-flight refresh queue instead of double-refreshing. The `/auth` route itself still doesn't exist, so the redirect 404s until that page is built
- [x] Route-level `loading.tsx` — `src/app/loading.tsx` is the default Suspense fallback for every route without its own `loading.tsx`; pairs with `useCustomSuspenseQuery` (`src/utils/hooks/useCustomSuspenseQuery`), the `useSuspenseQuery`-based sibling of `useCustomQuery`, so a first visit shows a skeleton while the query suspends and a revisit is instant from cache. No page uses it yet — add a route-local `loading.tsx` to override the default for a specific segment
- [x] Offline mutation queue — `ReactQueryProvider` wraps the app in `PersistQueryClientProvider` (`@tanstack/react-query-persist-client` + `@tanstack/query-async-storage-persister`), persisting only _paused_ mutations to `localStorage` and calling `resumePausedMutations()` once restored, so a mutation made offline is queued and replayed on reconnect even across a reload — not just for the lifetime of the tab. `OfflineMutationSync` (`src/components/Providers/OfflineMutationSync`) surfaces this as sonner toasts: "You're offline" while disconnected, "Back online — syncing N queued change(s)" on reconnect. Because a `mutationFn` can't be serialized, `useCustomMutation` now requires a `mutationKey` and registers the function via `queryClient.setMutationDefaults` so a restored mutation can find it again — this only works if the component using that `mutationKey` has mounted (and thus re-registered its default) before the queue is resumed, so long-lived mutation types are safest

---

## zustand

Middlewares worth considering for createStore, depending on what you need:

persist — syncs state to localStorage/sessionStorage (or any custom storage). Useful for things like sidebar-open state, user preferences, draft form data surviving reloads.
immer — lets you write "mutating" update logic (state.items.push(x)) instead of manual spreads. Nice once state gets nested/complex.
subscribeWithSelector — enables subscribing to a slice of state without a full component re-render subscription; useful for imperative side effects outside React.
combine — merges initial state + actions with better type inference (minor DX sugar, not essential).
