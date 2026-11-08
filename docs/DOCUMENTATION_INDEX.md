---
title: Documentation Index
app: global
document_type: documentation-index
author: dosepehr
created_at: 2026-11-08
updated_at: 2026-11-08
reviewed_at: null
status: active
version: 1.0
---

# Documentation Index

Central entry point for all documentation in frontend-foundation. Every link
below points to a real file — if something you expect isn't here, it hasn't
been written yet (see **Known gaps** at the bottom).

## Project-wide

- [registry.md](registry.md) — the self-hosted shadcn registry: installing
  items into another project, where files land, rebuilding and publishing.
- [pwa.md](pwa.md) — service worker (caching, offline, updates, versioning)
  and notifications / Web Push.
- [react-pwa-guide.md](react-pwa-guide.md) — porting this repo's PWA setup
  to a plain React SPA (Vite / CRA).
- [zustand.md](zustand.md) — client state: the `createStore` factory,
  conventions for new stores, useful middlewares.

## Known gaps (flagged, not fabricated)

- **architecture.md** — no doc yet for the folder layout, data flow
  (axios client → React Query wrappers) or the providers tree.
- **API client & React Query wrappers** — `src/utils/api/` and the
  `useCustom*` hooks are only described in code comments.
- **Testing** — the Vitest / Storybook / Playwright split is summarized in
  the README only.
- **Review** — `pwa.md`, `react-pwa-guide.md` and `zustand.md` are marked
  `needs-review`: they predate this standard and haven't been re-checked
  against the current code.
