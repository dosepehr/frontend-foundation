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

---

## zustand

Middlewares worth considering for createStore, depending on what you need:

persist — syncs state to localStorage/sessionStorage (or any custom storage). Useful for things like sidebar-open state, user preferences, draft form data surviving reloads.
immer — lets you write "mutating" update logic (state.items.push(x)) instead of manual spreads. Nice once state gets nested/complex.
subscribeWithSelector — enables subscribing to a slice of state without a full component re-render subscription; useful for imperative side effects outside React.
combine — merges initial state + actions with better type inference (minor DX sugar, not essential).
