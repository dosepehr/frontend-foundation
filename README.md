# Frontend Foundation

A Next.js 16 component library and application foundation with a full-featured DX setup.

---

## Stack

| Layer | Tool |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Components | Radix UI + Base UI |
| Forms | React Hook Form + Zod |
| Server state | TanStack Query v5 |
| Tables | TanStack Table v8 |
| HTTP | Axios |
| Animations | Motion |
| Toasts | Sonner |
| Theming | next-themes |
| Icons | Lucide React |

---

## DX & Tooling

| Tool | Purpose |
|---|---|
| ESLint 9 (flat config) | Linting — next, react-refresh, tailwindcss, unicorn, typescript |
| Prettier | Formatting — with organize-imports and tailwindcss plugins |
| Vitest + happy-dom | Unit & component tests |
| Storybook 10 | Component development & documentation |
| Chromatic | Visual regression testing |
| MSW v2 | API mocking in tests and Storybook |
| Playwright | E2E (installed, not yet configured) |

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

---

## To do

### Must-have before production

- [ ] **Commit hygiene** — `husky` + `lint-staged` + `commitlint`
  - `lint-staged` runs ESLint + Prettier only on staged files (fast pre-commit)
  - `commitlint` enforces conventional commit format on every commit
  - Prevents broken or unformatted code from entering the repo

- [ ] **Environment variable validation** — `@t3-oss/env-nextjs` (already have `zod`)
  - Validates all `NEXT_PUBLIC_*` and server env vars at build time
  - App fails to start rather than silently sending `undefined` to the API

- [ ] **Error boundaries**
  - `error.tsx` in Next.js App Router for page-level crashes
  - Component-level `<ErrorBoundary>` wrappers (`react-error-boundary`) around async data sections
  - Without these, one runtime error kills the whole page

- [ ] **Client-side error tracking** — Sentry
  - Captures unhandled errors, promise rejections, and React render failures in production
  - Forward `QueryCache.onError` and `MutationCache.onError` to `Sentry.captureException`
  - Without it you're blind to production bugs unless users report them

- [ ] **Flip a11y to `"error"`** — already have `@storybook/addon-a11y`
  - Change `a11y: { test: "todo" }` to `a11y: { test: "error" }` in Storybook preview
  - Catches contrast, ARIA, keyboard, and focus issues at the component level

### Important

- [ ] **Playwright E2E** — installed, not configured
  - Vitest covers units, Chromatic covers visuals — neither covers full user flows
  - Write flows for: login, main navigation, critical paths
  - Run in CI against a staging environment with MSW or a test API

- [ ] **Bundle analysis** — `@next/bundle-analyzer`
  - Run occasionally to catch accidental large imports
  - One wrong barrel file or moment.js import can add 200kb

- [ ] **i18n** — `next-intl`
  - Storybook i18n addon is already wired; need the runtime counterpart
  - Set it up early — retrofitting touches every string in every component

- [ ] **OpenAPI type generation** — `openapi-typescript`
  - Auto-generates TypeScript types from the backend OpenAPI spec
  - Eliminates the entire class of "frontend type doesn't match actual API response"

- [ ] **Dependency update automation** — Renovate or Dependabot
  - Large apps accumulate dependency drift fast
  - Renovate is more configurable; Dependabot is zero-setup on GitHub

### Nice to have

- [ ] **Feature flags**
  - Even a simple env-var-based toggle avoids long-lived branches
  - `@vercel/flags` integrates cleanly with Next.js if on Vercel

- [ ] **PR size limits** — GitHub Action
  - Warn when a PR exceeds ~400 lines diff
  - Enforces small-PR habits before the codebase grows too large

- [ ] **Storybook interaction tests in CI**
  - `@storybook/addon-vitest` is installed — wire it into the CI pipeline
  - Story `play` functions already double as interaction tests; just needs a CI step

- [ ] **`react-scan` in CI**
  - Already have the Storybook addon for local dev
  - Running it in CI flags performance regressions before they ship


## zustand
Middlewares worth considering for createStore, depending on what you need:

persist — syncs state to localStorage/sessionStorage (or any custom storage). Useful for things like sidebar-open state, user preferences, draft form data surviving reloads.
immer — lets you write "mutating" update logic (state.items.push(x)) instead of manual spreads. Nice once state gets nested/complex.
subscribeWithSelector — enables subscribing to a slice of state without a full component re-render subscription; useful for imperative side effects outside React.
combine — merges initial state + actions with better type inference (minor DX sugar, not essential).